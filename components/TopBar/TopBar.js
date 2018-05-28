/**
 * 顶部标签栏
 * Created by yuanzhou on 16/12.
 */
import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import * as SizeController from './SizeController';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
import { rgbTranform } from './ColorHandle';
let topHeight = SizeController.getTopHeight();
let statusBarHeight = SizeController.getStatusBarHeight();
let changeRatio = SizeController.getTopBarRatio();
let isIphoneX = SizeController.isIphoneX();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

/**
 * 使用说明：
 *
 * 标题使用说明：
 * middleStyle  标题样式
 * tittle  标题
 * tittleStyle 标题样式
 * bottomTitle  底部标题
 * bottomTitleStyle 底部标题样式
 * middleComponent  React组件,自定义标题
 *
 * 左边栏使用说明
 * leftStyle 左边栏样式
 * showLeft 是否显示左边,默认为true,默认显示返回图标
 * onLeftPress  左边栏点击函数
 * leftText 用文字代替返回图标
 * leftTextStyle 左边栏文字样式
 * leftImage 自定义返回图标
 * leftImageStyle 左边图标样式
 * leftComponent  React组件,自定义返回组件
 *
 * 右边栏使用说明
 * rightStyle 右边栏样式
 * showRight 是否显示右边,默认为false
 * onRightPress 右边栏点击函数
 * rightBtnCanPress 右边是否可点击,默认为可点击
 * rightText 右边显示文字
 * rightTextStyle 右边文字样式
 * rightImage 右边显示图标
 * rightImageStyle 右边图标样式
 * rightComponent React组件,自定义右边栏
 *
 */

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftHandleStyle: {},
      middleHandleStyle: {},
      rightHandleStyle: {},
    };
    this.colorObject = {};
    this.leftLayout = null;
    this.middleLayout = null;
    this.rightLayout = null;
  }

  static defaultProps = {
    showRight: false,
    showLeft: true,
    rightComponent: null,
    leftComponent: null,
    style: {},
    useAnimated: false,
    AnimatedView: null,
    showStatusBarOpacity: false,
    showLinearGradient: false,
    rightBtnCanPress: true,
    lineStartColor: '#61c3fd',
    lineEndColor: '#1da9fc',
  };

  handleColor = () => {
    let { startColor, endColor, locationArray, colorArray } = this.colorObject;
    if (startColor && endColor && locationArray && colorArray) {
      return this.colorObject;
    } else {
      let { lineStartColor, lineEndColor } = this.props;
      let startColor1 = lineStartColor;
      let endColor1 = lineEndColor;
      let linerObj1 = rgbTranform(startColor1, endColor1, 5);
      let locationArray1 = linerObj1.locations;
      let colorArray1 = linerObj1.colors;
      this.colorObject = {
        startColor: startColor1,
        endColor: endColor1,
        locationArray: locationArray1,
        colorArray: colorArray1,
      };
      return this.colorObject;
    }
  };

  leftOnLayout = e => {
    this.leftLayout = e.nativeEvent.layout;
    if (this.leftLayout) {
      this.handleMiddleStyle();
    }
  };

  middleOnLayout = e => {
    this.middleLayout = e.nativeEvent.layout;
    if (this.middleLayout) {
      this.handleMiddleStyle();
    }
  };

  rightOnLayout = e => {
    this.rightLayout = e.nativeEvent.layout;
    if (this.rightLayout) {
      this.handleMiddleStyle();
    }
  };

  handleMiddleStyle = () => {
    let leftWidth = 0,
      middleWidth = 0,
      rightWidth = 0;
    if (this.leftLayout && this.middleLayout && this.rightLayout) {
      leftWidth = this.leftLayout.width;
      middleWidth = this.middleLayout.width;
      rightWidth = this.rightLayout.width;
      let diff = leftWidth - rightWidth;
      let total = leftWidth + rightWidth;
      if (middleWidth > 0 && total > 0) {
        if (total > deviceWidth / 2) {
        } else {
          /*this.setState({
            leftHandleStyle: {width: deviceWidth/4},
            middleHandleStyle: {flexGrow: 0, width: deviceWidth/2},
            rightHandleStyle: {width:deviceWidth/4},
          });*/
          /*let changeWidth = leftWidth;
          if (diff < 0) {
            changeWidth = rightWidth;
          }
          if (changeWidth < deviceWidth / 5) {
            changeWidth = deviceWidth / 5;
          }
          this.leftLayout = null;
          this.middleLayout = null;
          this.rightLayout = null;
          this.setState({
            leftHandleStyle: {width: changeWidth},
            middleHandleStyle: {flexGrow: 0, width: deviceWidth - 2 * changeWidth},
            rightHandleStyle: {flex:1},
          });*/
        }
      }
    }
  };

  renderLeft = () => {
    let {
      showLeft,
      onLeftPress,
      leftComponent,
      leftStyle,
      leftText,
      leftTextStyle,
      leftImage,
      leftImageStyle,
    } = this.props;
    let { leftHandleStyle } = this.state;
    if (!showLeft) {
      return (
        <View
          onLayout={this.leftOnLayout}
          style={[styles.leftStyle, leftHandleStyle, leftStyle]}
        />
      );
    }
    let component = (
      <TouchableOpacity onPress={onLeftPress}>
        <View style={styles.btn}>
          <Image style={[styles.img, leftImageStyle]} source={require('./common_return.png')} />
        </View>
      </TouchableOpacity>
    );
    if (leftText) {
      component = (
        <TouchableOpacity onPress={onLeftPress}>
          <View style={styles.btn}>
            <Text allowFontScaling={false} style={[styles.topBarTextFormal, leftTextStyle]}>
              {leftText}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (leftImage) {
      component = (
        <TouchableOpacity onPress={onLeftPress}>
          <View style={styles.btn}>
            <Image style={[styles.img, leftImageStyle]} source={leftImage} />
          </View>
        </TouchableOpacity>
      );
    }
    if (leftComponent) {
      component = leftComponent;
    }
    return (
      <View onLayout={this.leftOnLayout} style={[styles.leftStyle, leftHandleStyle, leftStyle]}>
        {component}
      </View>
    );
  };

  renderMiddle = () => {
    let { middleHandleStyle } = this.state;
    let {
      title,
      titleStyle,
      bottomTitle,
      bottomTitleStyle,
      middleComponent,
      middleStyle,
    } = this.props;
    let showBottomText = false;
    let titleStyleInner = styles.topBarTextFormal;
    if (bottomTitle) {
      showBottomText = true;
      titleStyleInner = styles.topBarTextMiddle;
    }
    let component = (
      <View style={{ alignItems: 'center' }}>
        <Text allowFontScaling={false} numberOfLines={2} style={[titleStyleInner, titleStyle]}>
          {title}
        </Text>
        {showBottomText && (
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={[styles.topBarTextSmall, bottomTitleStyle]}>
            {bottomTitle}
          </Text>
        )}
      </View>
    );
    if (middleComponent) {
      component = middleComponent;
    }
    return (
      <View
        onLayout={this.middleOnLayout}
        style={[styles.middleStyle, middleHandleStyle, middleStyle]}>
        {component}
      </View>
    );
  };

  renderRight = () => {
    let {
      showRight,
      rightText,
      rightTextStyle,
      rightImage,
      rightImageStyle,
      rightComponent,
      onRightPress,
      rightBtnCanPress,
      rightStyle,
    } = this.props;
    let { rightHandleStyle } = this.state;
    if (!showRight) {
      return (
        <View onLayout={this.rightOnLayout} style={[styles.rightStyle, rightHandleStyle]} />
      );
    }
    let component = null;
    if (rightText) {
      component = (
        <Text
          numberOfLines={2}
          allowFontScaling={false}
          style={[styles.topBarTextFormal, rightTextStyle]}>
          {rightText}
        </Text>
      );
    }
    if (rightImage) {
      component = <Image style={[styles.img, rightImageStyle]} source={rightImage} />;
    }
    let BtnView = (
      <TouchableOpacity onPress={onRightPress}>
        <View style={[styles.btnRight]}>{component}</View>
      </TouchableOpacity>
    );
    if (!rightBtnCanPress) {
      BtnView = <View style={[styles.btnRight]}>{component}</View>;
    }
    return (
      <View
        onLayout={this.rightOnLayout}
        style={[styles.rightStyle, rightHandleStyle, rightStyle]}>
        {rightComponent}
        {!rightComponent && BtnView}
      </View>
    );
  };

  renderBody = () => {
    let { showStatusBarOpacity, showLinearGradient } = this.props;
    let colorObject = this.handleColor();
    let { locationArray, colorArray } = colorObject;
    return (
      <View style={[styles.container2, this.props.style]}>
        {this.renderLeft()}
        {this.renderMiddle()}
        {this.renderRight()}
      </View>
    );
  };

  render() {
    let { useAnimated, AnimatedView, showShadow } = this.props;
    let { showStatusBarOpacity, showLinearGradient } = this.props;
    let colorObject = this.handleColor();
    let { locationArray, colorArray } = colorObject;
    if (!useAnimated) {
      return (
        <SafeAreaView
          style={showStatusBarOpacity ? styles.container : styles.containerNoPaddingTop}>
          {showStatusBarOpacity && (
            <StatusBar translucent={true} animated={false} backgroundColor={'rgba(0,0,0,0)'} />
          )}
          {showLinearGradient && (
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              locations={locationArray}
              colors={colorArray}
              style={styles.linearGradientStyle}
            />
          )}
          {this.renderBody()}
        </SafeAreaView>
      );
    } else {
      return (
        <AnimatedView>
          {showStatusBarOpacity && (
            <StatusBar translucent={true} animated={false} backgroundColor={'rgba(0,0,0,0)'} />
          )}
          {showLinearGradient && (
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              locations={locationArray}
              colors={colorArray}
              style={styles.linearGradientStyle}
            />
          )}
          {this.renderBody()}
        </AnimatedView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    //height:topHeight,
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 0,
    //backgroundColor: 'rgba(48,173,245,1)',
    backgroundColor: '#fff',
    /*elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    paddingBottom: Platform.OS === 'ios' ? 2 : 0,*/
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(251,251,251)',
  },
  containerNoPaddingTop: {
    alignItems: 'center',
    //height:topHeight,
    paddingTop: 0,
    //backgroundColor: 'rgba(48,173,245,1)',
    backgroundColor: '#fff',
    /* elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    paddingBottom: Platform.OS === 'ios' ? 2 : 0,*/
    borderBottomWidth: 1,
    borderBottomColor: '#c3c3c3',
  },
  container2: {
    //width: deviceWidth,
    height: topHeight - statusBarHeight,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    //backgroundColor: '#fff',
  },
  linearGradientStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: deviceWidth,
    height: topHeight,
  },
  topBarTextFormal: {
    fontSize: 15 * changeRatio,
    color: 'rgb(51,51,51)',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  topBarTextMiddle: {
    fontSize: 14 * changeRatio,
    color: 'rgb(51,51,51)',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  topBarTextSmall: {
    fontSize: 13 * changeRatio,
    color: 'rgb(51,51,51)',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  leftStyle: {
    height: '100%',
    alignItems: 'flex-start',
    width: deviceWidth / 4,
    //backgroundColor: 'red',
    justifyContent: 'center',
  },
  middleStyle: {
    flexGrow: 1,
    height: '100%',
    //backgroundColor:'yellow',
    width: deviceWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightStyle: {
    width: deviceWidth / 4,
    height: '100%',
    alignItems: 'flex-end',
    //backgroundColor:'green',
  },
  img: {
    //width: 20,
    //height: 20,
  },
  btn: {
    minWidth: 50 * changeRatio,
    //paddingLeft: 10,
    //paddingRight: 10,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  btnRight: {
    minWidth: 50 * changeRatio,
    //paddingRight: 10,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  shadow: {
    height: 0,
    width: '100%',
    backgroundColor: 'red',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
  },
});

export { topHeight, statusBarHeight };
export default TopBar;
