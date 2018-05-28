import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity
} from 'react-native';
import  * as SizeController from '../../../SizeController';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const changeRatio = SizeController.getChangeRatio();

/**
 * @author yuanzhou.xu
 * loading图标
 */
class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingTime: 0,
      showCloseWindow: false,
    };
    this.handleLoadingTime = this.handleLoadingTime.bind(this);
    this._showMessage = this._showMessage.bind(this);
    this._alertEnsure = this._alertEnsure.bind(this);
    this._alertCancel = this._alertCancel.bind(this);
    this.loadingTimeInteval = null;
  }

  static  defaultProps = {
    showLoading: false,
    maxLoadingTime: 90,
    showWindowTime: 20,
  };


  componentWillReceiveProps(nextProps) {
    let {showLoading} = nextProps;
    let preShowLoading = this.props.showLoading;

    if (preShowLoading !== showLoading) {
      if (showLoading) {
        //this.loadingTimeInteval = setInterval(this.handleLoadingTime, 1000);
      } else {
        clearInterval(this.loadingTimeInteval);
        this.loadingTimeInteval = null;
        this.setState({
          loadingTime: 0,
          showCloseWindow: false,
        });
      }
    }
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    if (this.loadingTimeInteval) {
      clearInterval(this.loadingTimeInteval);
    }
  }

  /**
   * 显示消息
   * @param title
   * @param message
   * @private
   */
  _showMessage(title = '提示', message = '') {
    Alert.alert(title, message,
      [{text: '确认', style: 'destructive', onPress: () => this._alertEnsure(message)},
        {text: '取消', style: 'cancel', onPress: () => this._alertCancel(message)},
      ]);
  }

  /**
   * 确认操作
   * @private
   */
  _alertEnsure() {
    let {dispatch} = this.props;
    this.setState({
      loadingTime: 0,
      showCloseWindow: false,
    });
    dispatch({type: 'pageState/showLoading', payload: {}});
  }

  /**
   * 取消操作
   */
  _alertCancel() {
    let {dispatch} = this.props;
    this.setState({
      loadingTime: 0
    });
    dispatch({type: 'pageState/hideLoading', payload: {}});
  }

  /**
   * 处理loading时间
   */
  handleLoadingTime() {
    let {loadingTime} = this.state;
    let {maxLoadingTime, pageData, showWindowTime, dispatch} = this.props;
    let newLoadingTime = loadingTime + 1;
    if (newLoadingTime < maxLoadingTime) {
      if (newLoadingTime > showWindowTime) {
        if (pageData.isLogin) {
          this.setState({
            loadingTime: newLoadingTime,
            showCloseWindow: true,
          });
        }
      } else {
        this.setState({
          loadingTime: newLoadingTime
        });
      }
    } else {
      if (pageData.hadLogin) {
        clearInterval(this.loadingTimeInteval);
        this.loadingTimeInteval = null;
        this.setState({
          loadingTime: 0,
          showCloseWindow: false,
        });
        dispatch({type: ActionTypes.HIDE_LOADING, payload: {}});
        //this._showMessage('温馨提示', `已等待${timeStr}，本次操作将切换后台运行，您可继续进行其他操作`);
      }
    }
  }

  getTimeStr(time) {
    /*let minute = Math.floor(time / 60);
     let second = time % 60;
     let timeStr = "";
     if (minute > 0) {
     timeStr += minute + "分钟";
     if (second > 0) {
     timeStr += second + "秒";
     }
     } else {
     timeStr += second + "秒";
     }*/
    let timeStr = '';
    timeStr += time + '秒';
    return timeStr;
  }

  render() {
    let {showLoading, pageData, maxLoadingTime} = this.props;
    let {loadingTime, showCloseWindow} = this.state;
    let maxTimeStr = this.getTimeStr(maxLoadingTime);
    let timeStr = this.getTimeStr(loadingTime);
    if (false && showLoading && !this.loadingTimeInteval && pageData.isLogin) {
      this.loadingTimeInteval = setInterval(this.handleLoadingTime, 1000);
    }
    return (
      <View style={
                [styles.loading, showLoading ? styles.showLoading : styles.hideLoading]}>
        <View style={styles.mask}>
          <ActivityIndicator
            animating={true}
            color={'rgb(255,255,255)'}
            size="small"
          />
        </View>
        {showCloseWindow &&
        <View style={{backgroundColor: '#ffffff',borderRadius: 8 * changeRatio, marginTop: 10 * changeRatio,}}>
          <View style={styles.closeWindowView}>
            <Text style={styles.closeWindowNowTimeText}>{`已等待:${timeStr}`}</Text>
            <Text style={styles.closeWindowMaxTimeText}>{`等待时间大于${maxTimeStr}将自动切换后台运行`}</Text>
            <Text style={styles.closeWindowPlaceholderText}>{'若需要切换后台运行，请点击下方按钮'}</Text>
            <TouchableOpacity onPress={this._alertEnsure} style={styles.closeWindowBtn}>
              <Text style={styles.closeWindowBtnText}>切换后台运行</Text>
            </TouchableOpacity>
          </View>
        </View>
        }
      </View>
    );
  }

}


const
  styles = StyleSheet.create({
    showLoading: {
      zIndex: 9999
    },
    hideLoading: {
      position: 'relative',
      height: 0,
      width: 0,
      flex: 0,
      zIndex: 0,
      left: -2 * deviceWidth
    },
    loading: {
      width: deviceWidth,
      height: deviceHeight,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,0)'
    },
    mask: {
      width: 60 * changeRatio,
      height: 60 * changeRatio,
      borderRadius: 5 * changeRatio,
      flex: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    closeWindowView: {
      padding: 10 * changeRatio,
      alignItems: 'center',
      //borderRadius: 8,
      justifyContent: 'center',
      width: deviceWidth / 2,
      backgroundColor: 'rgba(48,50,68,0.1)'
    },
    closeWindowNowTimeText: {
      color: 'rgb(254,67,101)',
      fontSize: 14
    },
    closeWindowMaxTimeText: {
      color: 'rgb(29,169,252)',
      paddingTop: 8,
      textAlign: 'center',
      fontSize: 13
    },
    closeWindowPlaceholderText: {
      color: 'rgb(254,67,101)',
      fontSize: 13,
      paddingTop: 8,
      textAlign: 'center'
    },
    closeWindowBtn: {
      backgroundColor: 'rgb(29,169,252)',
      padding: 10,
      borderRadius: 8,
      marginTop: 10
    },
    closeWindowBtnText: {
      color: '#ffffff',
      fontSize: 13,
      textAlign: 'center'
    },

  });

export default Loading;
