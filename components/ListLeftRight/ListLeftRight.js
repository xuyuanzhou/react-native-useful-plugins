/**
 * Created by yuanzhou  on 2017/08/25.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  DatePickerIOS,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';

import Touchable from '../Touchable';
import * as SizeController from '../TopBar/SizeController';
let changeRatio = SizeController.getChangeRatio();

class ItemText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { leftText, rightText, leftTextStyle, rightTextStyle, row, style } = this.props;
    return (
      <View style={styles.itemView}>
        <View style={[styles.itemText, style]}>
          <View style={styles.itemLeft}>
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={[styles.leftText, leftTextStyle]}>
              {leftText}
            </Text>
          </View>
          <View style={styles.itemRight}>
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={[styles.itemTextRightText, rightTextStyle]}>
              {rightText}
            </Text>
          </View>
        </View>
        {row}
      </View>
    );
  }
}

class ItemBtn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      leftText,
      rightText,
      leftTextStyle,
      rightTextStyle,
      row,
      arrow,
      onPress,
      style,
    } = this.props;
    return (
      <Touchable onPress={onPress}>
        <View style={styles.itemView}>
          <View style={[styles.itemBtn, style]}>
            <View style={styles.itemLeft}>
              <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={[styles.leftText, leftTextStyle]}>
                {leftText}
              </Text>
            </View>
            <View style={[styles.itemRight]}>
              <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={[styles.itemBtnRightText, rightTextStyle]}>
                {rightText}
              </Text>
            </View>
            {arrow}
          </View>
          {row}
        </View>
      </Touchable>
    );
  }
}

class ListLeftRight extends Component {
  static ItemText = ItemText;
  static ItemBtn = ItemBtn;

  constructor(props) {
    super(props);
    this._renderChildren = this._renderChildren.bind(this);
  }

  _renderChildren() {
    const { children } = this.props;
    if (!children) {
      return null;
    }
    // 过滤不渲染的元素
    let elements = [];
    React.Children.map(children, child => {
      if (child) {
        elements.push(child);
      }
    });
    return React.Children.map(elements, (element, index) => {
      return React.cloneElement(element, {});
    });
  }

  render() {
    return <View style={this.props.style}>{this._renderChildren()}</View>;
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    marginLeft: 9 * changeRatio,
    height: 14 * changeRatio,
    width: 14 * changeRatio,
  },
  viewStyle: {
    flex: 0,
    height: 50 * changeRatio,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 10 * changeRatio,
  },
  hrView: {
    backgroundColor: 'rgb(197,205,215)',
    height: 1,
  },
  btnView: {
    flex: 0,
    height: 50 * changeRatio,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10 * changeRatio,
    marginTop: 15 * changeRatio,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'rgb(197,205,215)',
  },
  itemView: {
    paddingRight: 15 * changeRatio,
    paddingLeft: 14 * changeRatio,
    backgroundColor: '#ffffff',
  },
  itemText: {
    height: 40 * changeRatio,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBtn: {
    height: 50 * changeRatio,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftText: {
    color: 'rgb(51,51,51)',
    fontSize: 12 * changeRatio,
  },
  rightText: {
    color: 'rgb(196,196,196)',
    fontSize: 12 * changeRatio,
  },
  itemTextRightText: {
    color: 'rgb(51,51,51)',
    fontSize: 12 * changeRatio,
  },
  itemBtnRightText: {
    color: 'rgb(196,196,196)',
    fontSize: 12 * changeRatio,
  },
  itemLeft: {
    alignItems: 'flex-start',
    flex: 0,
    minWidth: '20%',
    justifyContent: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
});
export default ListLeftRight;
