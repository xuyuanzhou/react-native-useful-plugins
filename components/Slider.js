/**
 * slider 滑动条
 * 源于react-native-slider的修改
 * Created by yuanzhou on 16/12.
 */
'use strict';

import React, {
  Component,
} from "react";
import  PropTypes from 'prop-types'
import {
  Animated,
  StyleSheet,
  PanResponder,
  View,
  Easing,
  ViewPropTypes
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
const shallowCompare = require('react-addons-shallow-compare'),
  styleEqual = require('style-equal');

let TRACK_SIZE = 4;
let THUMB_SIZE = 20;

function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Rect.prototype.containsPoint = function (x, y) {
  return (x >= this.x
  && y >= this.y
  && x <= this.x + this.width
  && y <= this.y + this.height);
};

let DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100
  },
  timing: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
    delay: 0
  },
  // decay : { // This has a serious bug
  //   velocity     : 1,
  //   deceleration : 0.997
  // }
};

class Slider extends Component {
  static propTypes = {
    /**
     * Initial value of the slider. The value should be between minimumValue
     * and maximumValue, which default to 0 and 1 respectively.
     * Default value is 0.
     *
     * *This is not a controlled component*, e.g. if you don't update
     * the value, the component won't be reset to its inital value.
     */
    value: PropTypes.number,

    /**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
    disabled: PropTypes.bool,

    /**
     * Initial minimum value of the slider. Default value is 0.
     */
    minimumValue: PropTypes.number,

    /**
     * Initial maximum value of the slider. Default value is 1.
     */
    maximumValue: PropTypes.number,

    /**
     * Step value of the slider. The value should be between 0 and
     * (maximumValue - minimumValue). Default value is 0.
     */
    step: PropTypes.number,

    /**
     * The color used for the track to the left of the button. Overrides the
     * default blue gradient image.
     */
    minimumTrackTintColor: PropTypes.string,

    /**
     * The color used for the track to the right of the button. Overrides the
     * default blue gradient image.
     */
    maximumTrackTintColor: PropTypes.string,

    /**
     * The color used for the thumb.
     */
    thumbTintColor: PropTypes.string,

    /**
     * The size of the touch area that allows moving the thumb.
     * The touch area has the same center has the visible thumb.
     * This allows to have a visually small thumb while still allowing the user
     * to move it easily.
     * The default is {width: 40, height: 40}.
     */
    thumbTouchSize: PropTypes.shape(
      {width: PropTypes.number, height: PropTypes.number}
    ),

    /**
     * Callback continuously called while the user is dragging the slider.
     */
    onValueChange: PropTypes.func,

    /**
     * Callback called when the user starts changing the value (e.g. when
     * the slider is pressed).
     */
    onSlidingStart: PropTypes.func,

    /**
     * Callback called when the user finishes changing the value (e.g. when
     * the slider is released).
     */
    onSlidingComplete: PropTypes.func,

    /**
     * The style applied to the slider container.
     */
    style: ViewPropTypes.style,

    /**
     * The style applied to the track.
     */
    trackStyle: ViewPropTypes.style,

    /**
     * The style applied to the thumb.
     */
    thumbStyle: ViewPropTypes.style,

    /**
     * Set this to true to visually see the thumb touch rect in green.
     */
    debugTouchArea: PropTypes.bool,

    /**
     * Set to true to animate values with default 'timing' animation type
     */
    animateTransitions: PropTypes.bool,

    /**
     * Custom Animation type. 'spring' or 'timing'.
     */
    animationType: PropTypes.oneOf(['spring', 'timing']),

    /**
     * Used to configure the animation parameters.  These are the same parameters in the Animated library.
     */
    animationConfig: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      containerSize: {width: 0, height: 0},
      trackSize: {width: 0, height: 0},
      thumbSize: {width: 0, height: 0},
      allMeasured: false,
      value: new Animated.Value(this.props.value),
    };
    this._getPropsForComponentUpdate = this._getPropsForComponentUpdate.bind(this);
    this._handleStartShouldSetPanResponder = this._handleStartShouldSetPanResponder.bind(this);
    this._handleMoveShouldSetPanResponder = this._handleMoveShouldSetPanResponder.bind(this);
    this._handlePanResponderGrant = this._handlePanResponderGrant.bind(this);
    this._handlePanResponderMove = this._handlePanResponderMove.bind(this);
    this._handlePanResponderRequestEnd = this._handlePanResponderRequestEnd.bind(this);
    this._handlePanResponderEnd = this._handlePanResponderEnd.bind(this);
    this._measureContainer = this._measureContainer.bind(this);
    this._measureTrack = this._measureTrack.bind(this);
    this._measureThumb = this._measureThumb.bind(this);
    this._handleMeasure = this._handleMeasure.bind(this);
    this._getRatio = this._getRatio.bind(this);
    this._getThumbLeft = this._getThumbLeft.bind(this);
    this._getValue = this._getValue.bind(this);
    this._getCurrentValue = this._getCurrentValue.bind(this);
    this._setCurrentValue = this._setCurrentValue.bind(this);
    this._setCurrentValueAnimated = this._setCurrentValueAnimated.bind(this);
    this._fireChangeEvent = this._fireChangeEvent.bind(this);
    this._getTouchOverflowSize = this._getTouchOverflowSize.bind(this);
    this._getTouchOverflowStyle = this._getTouchOverflowStyle.bind(this);
    this._thumbHitTest = this._thumbHitTest.bind(this);
    this._getThumbTouchRect = this._getThumbTouchRect.bind(this);
    this._renderDebugThumbTouchRect = this._renderDebugThumbTouchRect.bind(this);
  }


  static defaultProps = {
    value: 0,
    minimumValue: 0,
    maximumValue: 1,
    step: 0,
    minimumTrackTintColor: '#3f3f3f',
    maximumTrackTintColor: '#b3b3b3',
    thumbTintColor: '#343434',
    thumbTouchSize: {width: 40, height: 40},
    debugTouchArea: false,
    animationType: 'timing',
    locations: [],
    colors: []
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  componentWillReceiveProps(nextProps) {
    let newValue = nextProps.value;

    if (this.props.value !== newValue) {
      if (this.props.animateTransitions) {
        this._setCurrentValueAnimated(newValue);
      }
      else {
        this._setCurrentValue(newValue);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // We don't want to re-render in the following cases:
    // - when only the 'value' prop changes as it's already handled with the Animated.Value
    // - when the event handlers change (rendering doesn't depend on them)
    // - when the style props haven't actually change

    return shallowCompare(
        {props: this._getPropsForComponentUpdate(this.props), state: this.state},
        this._getPropsForComponentUpdate(nextProps),
        nextState
      ) || !styleEqual(this.props.style, nextProps.style)
      || !styleEqual(this.props.trackStyle, nextProps.trackStyle)
      || !styleEqual(this.props.thumbStyle, nextProps.thumbStyle);
  }

  render() {
    let {
      minimumValue,
      maximumValue,
      minimumTrackTintColor,
      maximumTrackTintColor,
      thumbTintColor,
      styles,
      style,
      trackStyle,
      thumbStyle,
      debugTouchArea,
      locations,
      colors,
      ...other
    } = this.props;
    let {value, containerSize, trackSize, thumbSize, allMeasured} = this.state;
    let mainStyles = styles || defaultStyles;
    let thumbLeft = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, containerSize.width - thumbSize.width],
      //extrapolate: 'clamp',
    });
    let valueVisibleStyle = {};
    if (!allMeasured) {
      valueVisibleStyle.opacity = 0;
    }

    let minimumTrackStyle = {
      position: 'absolute',
      width: Animated.add(thumbLeft, thumbSize.width / 2),
      //marginTop: -trackSize.height,
      backgroundColor: minimumTrackTintColor,
      ...valueVisibleStyle
    };

    let touchOverflowStyle = this._getTouchOverflowStyle();
    return (
      <View {...other} style={[mainStyles.container, style]} onLayout={this._measureContainer}>
        <View
          style={[{backgroundColor: maximumTrackTintColor,}, mainStyles.track, trackStyle]}
          onLayout={this._measureTrack}/>
        <Animated.View style={[mainStyles.track, trackStyle, minimumTrackStyle]}>
          <LinearGradient start={{x: 1, y: 1}} end={{x: 0, y: 1}} locations={locations} colors={colors}
                          style={[{flex: 1, borderRadius: 8}]}>
          </LinearGradient>
        </Animated.View>
        <Animated.View
          onLayout={this._measureThumb}
          style={
                        [
                            {backgroundColor: thumbTintColor},
                            mainStyles.thumb,
                            thumbStyle,
                            {
                                transform: [
                                    {translateX: thumbLeft},
                                    {translateY: (-(thumbSize.height - trackSize.height * 2) / 2)}
                                ],
                                ...valueVisibleStyle
                            }
                        ]
                    }
        >
          <View style={{flex: 0, backgroundColor: "#ffffff", height: 10, width: 10, borderRadius: 5}}>
          </View>
        </Animated.View>
        <View
          style={[defaultStyles.touchArea, touchOverflowStyle]}
          {...this._panResponder.panHandlers}>
          {debugTouchArea === true && this._renderDebugThumbTouchRect(thumbLeft)}
        </View>
      </View>)
  }


  _getPropsForComponentUpdate(props) {
    let {
      value,
      onValueChange,
      onSlidingStart,
      onSlidingComplete,
      style,
      trackStyle,
      thumbStyle,
      ...otherProps,
    } = props;

    return otherProps;
  }

  _handleStartShouldSetPanResponder(e, /*gestureState: Object*/) {
    // Should we become active when the user presses down on the thumb?
    return this._thumbHitTest(e);
  }

  _handleMoveShouldSetPanResponder(/*e: Object, gestureState: Object*/) {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  }

  _handlePanResponderGrant(/*e: Object, gestureState: Object*/) {
    this._previousLeft = this._getThumbLeft(this._getCurrentValue());
    this._fireChangeEvent('onSlidingStart');
  }

  _handlePanResponderMove(e, gestureState) {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onValueChange');
  }

  _handlePanResponderRequestEnd(e, gestureState) {
    // Should we allow another component to take over this pan?
    return false;
  }

  _handlePanResponderEnd(e, gestureState) {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onSlidingComplete');
  }

  _measureContainer(x) {
    this._handleMeasure('containerSize', x);
  }

  _measureTrack(x) {
    this._handleMeasure('trackSize', x);
  }

  _measureThumb(x) {
    this._handleMeasure('thumbSize', x);
  }

  _handleMeasure(name, x) {
    let {width, height} = x.nativeEvent.layout;
    let size = {width: width, height: height};

    let storeName = `_${name}`;
    let currentSize = this[storeName];
    if (currentSize && width === currentSize.width && height === currentSize.height) {
      return;
    }
    this[storeName] = size;

    if (this._containerSize && this._trackSize && this._thumbSize) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._thumbSize,
        allMeasured: true,
      })
    }
  }

  _getRatio(value) {
    return (value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue);
  }

  _getThumbLeft(value) {
    let ratio = this._getRatio(value);
    return ratio * (this.state.containerSize.width - this.state.thumbSize.width);
  }

  _getValue(gestureState) {
    let length = this.state.containerSize.width - this.state.thumbSize.width;
    let thumbLeft = this._previousLeft + gestureState.dx;

    let ratio = thumbLeft / length;

    if (this.props.step) {
      return Math.max(this.props.minimumValue,
        Math.min(this.props.maximumValue,
          this.props.minimumValue + Math.round(ratio * (this.props.maximumValue - this.props.minimumValue) / this.props.step) * this.props.step
        )
      );
    } else {
      return Math.max(this.props.minimumValue,
        Math.min(this.props.maximumValue,
          ratio * (this.props.maximumValue - this.props.minimumValue) + this.props.minimumValue
        )
      );
    }
  }

  _getCurrentValue() {
    return this.state.value.__getValue();
  }

  _setCurrentValue(value) {
    this.state.value.setValue(value);
  }

  _setCurrentValueAnimated(value) {
    let animationType = this.props.animationType;
    let animationConfig = Object.assign(
      {},
      DEFAULT_ANIMATION_CONFIGS[animationType],
      this.props.animationConfig,
      {toValue: value}
    );

    Animated[animationType](this.state.value, animationConfig).start();
  }

  _fireChangeEvent(event) {
    if (this.props[event]) {
      this.props[event](this._getCurrentValue());
    }
  }

  _getTouchOverflowSize() {
    let state = this.state;
    let props = this.props;

    let size = {};
    if (state.allMeasured === true) {
      size.width = Math.max(0, props.thumbTouchSize.width - state.thumbSize.width);
      size.height = Math.max(0, props.thumbTouchSize.height - state.containerSize.height);
    }

    return size;
  }

  _getTouchOverflowStyle() {
    let {width, height} = this._getTouchOverflowSize();

    let touchOverflowStyle = {};
    if (width !== undefined && height !== undefined) {
      let verticalMargin = -height / 2;
      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;

      let horizontalMargin = -width / 2;
      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (this.props.debugTouchArea === true) {
      touchOverflowStyle.backgroundColor = 'orange';
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  }

  _thumbHitTest(e) {
    let nativeEvent = e.nativeEvent;
    let thumbTouchRect = this._getThumbTouchRect();
    return thumbTouchRect.containsPoint(nativeEvent.locationX, nativeEvent.locationY);
  }

  _getThumbTouchRect() {
    let state = this.state;
    let props = this.props;
    let touchOverflowSize = this._getTouchOverflowSize();

    return new Rect(
      touchOverflowSize.width / 2 + this._getThumbLeft(this._getCurrentValue()) + (state.thumbSize.width - props.thumbTouchSize.width) / 2,
      touchOverflowSize.height / 2 + (state.containerSize.height - props.thumbTouchSize.height) / 2,
      props.thumbTouchSize.width,
      props.thumbTouchSize.height
    );
  }

  _renderDebugThumbTouchRect(thumbLeft) {
    let thumbTouchRect = this._getThumbTouchRect();
    let positionStyle = {
      left: thumbLeft,
      top: thumbTouchRect.y,
      width: thumbTouchRect.width,
      height: thumbTouchRect.height,
    };

    return (
      <Animated.View
        style={[defaultStyles.debugThumbTouchArea, positionStyle]}
        pointerEvents='none'
      />
    );
  }
}


const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor:"red",
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: "center",
    alignItems: "center"
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  debugThumbTouchArea: {
    position: 'absolute',
    backgroundColor: 'green',
    opacity: 0.5,
  }
});

module.exports = Slider;
