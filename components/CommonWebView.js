/**
 * Created by aolc on 2017/11/8.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  WebView,
} from 'react-native';
let deviceWidth = Dimensions.get('window').width;
import Icon from 'react-native-vector-icons/Entypo';

class ProgressItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };
    this.interval = null;
  }

  static defaultProps = {
    width: deviceWidth,
    height: 5,
    color: 'green',
  };

  componentDidMount() {
    this.interval = setInterval(() => this.handleProgress(), 20);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  handleProgress() {
    let {progress} = this.state;
    let {closeProgress, onClose} = this.props;
    let newProgress = progress;
    if (closeProgress) {
      newProgress += 0.03;
    } else {
      newProgress += 0.005;
    }

    if (newProgress < 0.8) {
      this.setState({
        progress: newProgress,
      });
    } else {
      if (closeProgress) {
        if (newProgress >= 1) {
          clearInterval(this.interval);
          this.interval = null;
          onClose && onClose();
        } else {
          this.setState({
            progress: newProgress,
          });
        }
      }
    }
  }

  render() {
    let {width, color, height, style} = this.props;
    let {progress} = this.state;
    return (
      <View style={[{ width: width, position: 'absolute', top: 0, height: height }, style]}>
        <View style={{ width: width * progress, backgroundColor: color, height: height }}/>
      </View>
    );
  }
}

class CommonWebView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errorInfo: {},
      closeProgress: false,
      showProgress: false,
      applyRecordId: null,
    };
    this.webViewRef = null;
    this.loadSuccess = null;
  }

  static defaultProps = {
    showProgressView: true,
    width:deviceWidth,
  }

  _onError(e) {
    this.setState({
      errorInfo: e.nativeEvent,
    });
  }

  _onLoad() {
    this.loadSuccess = true;
    this.setState({
      errorInfo: {},
    });
  }

  _onLoadStart() {
    this.setState({showProgress: true});
  }

  _onLoadEnd(e) {
    if (this.loadSuccess === true) {
    }
    this.setState({closeProgress: true});
  }

  _onClose() {
    this.setState({
      showProgress: false,
      closeProgress: false,
    });
  }


  _renderLoading() {
    return <View />;
  }

  _renderError(e) {
    let {errorInfo} = this.state;
    let {domain, description, code} = errorInfo;
    return (
      <TouchableOpacity
        onPress={this.reload.bind(this)}
        activeOpacity={1}
        style={{ flex: 1, justifyContent: 'center', padding: 10, backgroundColor: '#ffffff' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Icon name="emoji-sad" size={80} color="#838f9f"/>
        </View>
        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#838f9f', fontSize: 20 }}>{'轻触屏幕重新加载'}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  reload() {
    this.webViewRef && this.webViewRef.reload();
    this.loadSuccess = null;
  }



  render() {
    let realSource = null;
    let {source, navigation, style, showProgressView, width, onMessage} = this.props;
    let {showProgress, closeProgress, applyRecordId} = this.state;
    let showWebView = false;
    if (applyRecordId) {
      showWebView = true;
    }
    if (source) {
      realSource = source;
    }
    if (
      navigation &&
      navigation.state &&
      navigation.state.params &&
      navigation.state.params.source
    ) {
      realSource = navigation.state.params.source;
    }
    return (
      <View
        style={[{
          flex: 1,
          backgroundColor: '#efefef',
        },style]}>
        {showProgressView &&
        <View style={{
          position:'absolute',
          width:width,
          backgroundColor:'rgba(0,0,0,0)',
          top:0,
          left:0,
          height:5,
          zIndex:2,
        }}>
          {showProgress && (
            <ProgressItem
              height={3}
              width={width}
              closeProgress={closeProgress}
              onClose={this._onClose.bind(this)}
            />
          )}
        </View>
        }
        <WebView
          ref={ref => (this.webViewRef = ref)}
          //style={{ height:300 }}
          onError={this._onError.bind(this)}
          onLoad={this._onLoad.bind(this)}
          onLoadStart={this._onLoadStart.bind(this)}
          onLoadError={this._onError.bind(this)}
          onLoadEnd={this._onLoadEnd.bind(this)}
          renderError={this._renderError.bind(this)}
          //onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          scrollEnabled={true}
          javaScriptEnabled={true}
          renderLoading={this._renderLoading.bind(this)}
          mixedContentMode={'always'}
          //domStorageEnabled={true}
          source={realSource}
          bounces={false}
          dataDetectorTypes="none"
          onMessage={(event)=>{
            let data = event.nativeEvent.data;
            onMessage && onMessage(data);
          }}
          //source={{ uri: 'http://192.16fff8.30.222:8080/smartx/v2/template/announcement.html' }}
          //source={{ uri: 'http://192.168.30.222:8080/smartx/v2/template/announcement.html' }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CommonWebView;
