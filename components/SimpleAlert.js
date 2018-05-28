/**
 *
 *  这是一个简单alert
 * Created by yuanzhou.xu on 2017/10/31.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import  * as SizeController from '../../../SizeController';
let changeRatio = SizeController.getChangeRatio();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class SimpleAlert extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    showEnsure: PropTypes.bool,
    showCancel: PropTypes.bool,
    onCancel: PropTypes.func,
    onEnsure: PropTypes.func,
  };

  static defaultProps = {
    title: '提示',
    showEnsure: true,
    showCancel: true,
  };

  render() {
    let {title, value, onCancel, onEnsure, showCancel, showEnsure} = this.props;
    return (
      <View style={styles.container_position}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.header_text}>{title}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.body_text}>{value}</Text>
          </View>
          <View style={styles.hr_row}/>
          <View activeOpacity={1} style={styles.footer}>
            {showCancel &&
            <TouchableOpacity onPress={()=>onCancel && onCancel()} style={styles.footer_cancelBtn}>
              <Text allowFontScaling={false} style={styles.footer_cancelText}>取消</Text>
            </TouchableOpacity>
            }
            {showCancel && showEnsure &&
            <View style={styles.hr_column}/>
            }
            {showEnsure &&
            <TouchableOpacity onPress={()=>onEnsure && onEnsure()} style={styles.footer_ensureBtn}>
              <Text allowFontScaling={false} style={styles.footer_ensureText}>确定</Text>
            </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container_position: {
    position: 'absolute',
    width: deviceWidth,
    height: deviceHeight,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: '#ffffff',
    width: 280,
    borderRadius: 8
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  header_text: {
    fontSize: 16 * changeRatio,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  body_text: {
    fontSize: 14,
    color: '#4d4d4d',
  },
  footer: {
    height: 45 * changeRatio,
    flexDirection: 'row',
  },
  footer_cancelBtn: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footer_cancelText: {
    fontSize: 14 * changeRatio,
    color: '#4d4d4d',
  },
  footer_ensureBtn: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footer_ensureText: {
    fontSize: 14 * changeRatio,
    color: 'rgb(29,169,252)'
  },
  hr_column: {
    backgroundColor: '#f0f0f0',
    width: 1,
  },
  hr_row: {
    backgroundColor: '#f0f0f0',
    height: 1,
  },
});
