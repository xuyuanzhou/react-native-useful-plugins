/**
 * 微信分享
 * Created by yuanzhou on 2017／10／21.
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';

import * as WeChat from 'react-native-wechat';
import Roots from 'react-native-roots';
import SimpleAlert from '../SimpleAlert';
import ImageViewer from '../ImageViewer';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const ROOT_VIEW_KEY = '_WX_SHARE';

/**
 * 网页分享示例
 */
const newsExample = {
  type: 'news',
  thumbImage: 'http://test.kpi365.com/smartx/wxShare.png',
  description: '招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆',
  uri: 'https://www.kpi365.com/',
};

/**
 * 文本分享示例
 * @type {{type: string, thumbImage: string, description: string, uri: string}}
 */
const textExample = {
  type: 'text',
  thumbImage: 'http://test.kpi365.com/smartx/wxShare.png',
  description: '招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆招贤馆',
};


class WxShare extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showImageViewer: false,
    };
    this._shareToSession = this._shareToSession.bind(this);
    this._shareToTimeline = this._shareToTimeline.bind(this);
    this._handleType = this._handleType.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    Roots.remove(ROOT_VIEW_KEY);
  }


  _handleType() {
    let {type, uri, thumbImage, title, description, mediaTagName, extInfo} = this.props;
    let resultObj = {
      title: title || '招贤馆分享',
      type: type,
      thumbImage: thumbImage || undefined,
      description: description || '',
      mediaTagName: mediaTagName || (type + '_signature'),
      messageAction: undefined,
      messageExt: undefined,
    };
    switch (type) {
      case 'imageResource':
        resultObj.imageUrl = uri;
        break;
      case 'imageFile':
        resultObj.imageUrl = uri;
        break;
      case 'video':
        resultObj.videoUrl = uri;
        break;
      case 'audio':
        resultObj.musicUrl = uri;
        break;
      case 'file':
        resultObj.filePath = uri;
        break;
      case 'news':
        resultObj.webpageUrl = uri;
        resultObj.extInfo = extInfo;
        break;
      case 'text':
        resultObj.description = description;
        break;
    }
    return resultObj;
  }


  async _shareToSession() {
    let resultObj = this._handleType();
    try {
      let result = await WeChat.shareToSession({...resultObj});
      if (result && result.errCode === 0) {
        console.log('share resource image to time line successful', result);
        this.setState({
          showResponse: true,
          shareType: 'session',
          shareResponse: 1,
        });
      }
    } catch (e) {
      if (e instanceof WeChat.WechatError) {
        if (e.message !== -2 && e.message !== '-2') {
          console.log(e);
          this.setState({
            showResponse: true,
            shareType: 'session',
            shareResponse: 0,
            errMsg: e.message,
          });
        } else {
          console.log(e);
        }

      } else {
        this.setState({
          showResponse: true,
          shareType: 'session',
          shareResponse: 0,
          errMsg: e + '',
        });
      }
    }
  }

  async _shareToTimeline() {
    let resultObj = this._handleType();
    try {
      let result = await WeChat.shareToTimeline({...resultObj});
      if (result && result.errCode === 0) {
        console.log('share resource image to time line successful', result);
        this.setState({
          showResponse: true,
          shareType: 'timeline',
          shareResponse: 1,
        });
      }

    } catch (e) {
      if (e instanceof WeChat.WechatError) {
        if (e.message !== -2 && e.message !== '-2') {
          console.log(e);
          this.setState({
            showResponse: true,
            shareType: 'timeline',
            shareResponse: 0,
            errMsg: e.message,
          });
        } else {
          console.log(e);
        }
      } else {
        this.setState({
          showResponse: true,
          shareType: 'timeline',
          shareResponse: 0,
          errMsg: e + '',
        });
      }
    }
  }

  _shareWxFriend() {
    WeChat.isWXAppInstalled()
      .then((isInstalled) => {
        if (isInstalled) {
          try {
            this._shareToSession();
          } catch (e) {
            Alert.alert('提示', e + '');
          }
        } else {
          Alert.alert('提示', '没有安装微信软件，请您安装微信之后再试');
        }
      });
  }

  _shareWxFriendCircle() {
    WeChat.isWXAppInstalled()
      .then((isInstalled) => {
        if (isInstalled) {
          try {
            this._shareToTimeline();
          } catch (e) {
            Alert.alert('提示', e + '');
          }
        } else {
          Alert.alert('提示', '没有安装微信软件，请您安装微信之后再试');
        }
      });
  }


  _hide() {
    Roots.remove(ROOT_VIEW_KEY);
  }

  _showImageViewer() {
    this.setState({
      showImageViewer: true,
    });
  }

  _hideImageViewer() {
    this.setState({
      showImageViewer: false,
    });
  }

  render() {
    let {type, preUri} = this.props;
    let {showImageViewer} = this.state;
    let ShowImg = null;
    let ShowImgViewer = null;
    if ((type === 'imageResource' || type === 'imageFile') && preUri) {
      ShowImg = (
        <TouchableOpacity activeOpacity={0.8} style={styles.imgView} onPress={()=>this._showImageViewer()}>
          <Text style={styles.textDescribe}>分享预览(点击查看大图)</Text>
          <Image resizeMode="contain" style={styles.img} source={{uri:preUri}}/>
        </TouchableOpacity>
      );
      ShowImgViewer = (<ImageViewer
        index={0}
        show={showImageViewer}
        hidePress={()=>this._hideImageViewer()}
        imageUrls={[{url:preUri}]}
      />);
    }

    let {showResponse, shareType, shareResponse, errMsg} = this.state;
    let msg = '';
    if (showResponse) {
      if (shareType === 'timeline') {
        msg += '分享微信朋友圈';
      } else {
        msg += '分享微信好友';
      }
      if (shareResponse) {
        msg += '成功';
      } else {
        msg += '失败,';
        if (errMsg) {
          msg += '原因【' + errMsg + '】,';
        }
        msg += '请重新尝试';
      }
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} style={styles.spaceBtn} onPress={()=>this._hide()}/>
        {showResponse &&
        <SimpleAlert
          value={msg}
          showCancel={false}
          showEnsure={true}
          onCancel={()=>{ this.setState({showResponse: false})} }
          onEnsure={()=>{
                 this.setState({
                    showResponse: false,
                  });
                 Roots.remove(ROOT_VIEW_KEY);
             }}
        />
        }
        {ShowImg}
        {ShowImgViewer}
        <View style={styles.btnView}>
          <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={()=>this._shareWxFriend()}>
            <Image style={styles.iconImg} source={require('./wechat.png')}/>
            <Text style={styles.btnText}>微信好友</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={()=>this._shareWxFriendCircle()}>
            <Image style={styles.iconImg} source={require('./pquan.png')}/>
            <Text style={styles.btnText}>微信朋友圈</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeBtn} activeOpacity={0.8} onPress={()=>this._hide()}>
          <Text style={styles.closeBtnText}>取消</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  spaceBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  btnView: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff'
  },
  imgView: {
    padding: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(248,248,248,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textDescribe: {
    fontSize: 15,
    color: 'red',
    margin: 5,
    marginBottom: 10,
    //lineHeight: 30,
  },
  img: {
    width: 200,
    height: 200,
  },
  btn: {
    width: 65,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6d6d6d',
  },
  iconImg: {
    width: 40,
    height: 40,
  },
  closeBtn: {
    borderTopWidth: 1,
    borderColor: 'rgb(211,211,211)',
    height: 45,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    color: '#dd7171',
  },
});

export default {
  show(data) {
    Roots.add(ROOT_VIEW_KEY, <WxShare {...data}/>);
  },
  hide() {
    Roots.remove(ROOT_VIEW_KEY);
  },
  shareExample: {
    shareNews(){
      Roots.add(ROOT_VIEW_KEY, <WxShare {...newsExample}/>);
    },
    shareText(){
      Roots.add(ROOT_VIEW_KEY, <WxShare {...textExample}/>);
    }
  }
};

