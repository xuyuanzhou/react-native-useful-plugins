import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  StatusBar,
  Platform,
  CameraRoll,
  Alert
} from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import {getStatusBarHeight} from '../../../SizeController';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ImageViewer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      index: 0,
      show: false,
      showImageViewerHead: false,
    };
  }

  _toggleModel(index = 0) {
    let {hidePress} = this.props;
    this.setState({
      show: false,
    });
    hidePress && hidePress();
  }

  _saveImage(url){
    if (!url) {
      return;
    }
    if (Platform.OS === 'ios') {
      CameraRoll.saveToCameraRoll(url, 'photo')
        .then(() => Alert.alert('', '保存成功'))
        .catch(err => console.log(err));
    } else {
      if(url.indexOf('http') === 0){
        const name = url.substring(url.lastIndexOf('/') + 1);
        const path = RNFS.CachesDirectoryPath + '/' + name;
        RNFS.downloadFile({
          fromUrl: url,
          toFile: path,
        }).promise.then(() => {
          CameraRoll.saveToCameraRoll(path, 'photo')
            .then(() => Alert.alert('', '保存成功'))
            .catch(err => console.log(err));
        }).catch(error => console.log(error));
      }else{
        CameraRoll.saveToCameraRoll(url, 'photo')
          .then(() => Alert.alert('', '保存成功'))
          .catch(err => console.log(err));
      }
    }
  }

  componentDidMount(){
    let { index, show } = this.props;
    if(show !== undefined && show != null){
      this.setState({
        index: index || 0,
        show: show
      });
    }
  }

  componentWillReceiveProps(nextProps){
    //let currentZoomImgIndex = this.state.index;
    let currentShowImageViewer = this.state.show;
    let { index, show } = nextProps;
    if(show !== undefined && show != null && show !== currentShowImageViewer){
      if(index !== undefined && index != null){
        this.setState({
          index: index,
          show: show
        });
      }else{
        this.setState({
          show: show
        });
      }
    }
  }

  renderZoomHeader() {
    let { index } = this.state;
    let {imageUrls} = this.props;
    let maxSize = 0;
    if (imageUrls && imageUrls.length) {
      maxSize = imageUrls.length;
    }
    index = index + 1;
    let statusBar = getStatusBarHeight();
    let height = 40 + statusBar;
    return (
      <View style={{ zIndex: 5, position: 'absolute', width: deviceWidth, height: height }}>
        <View style={{ height: statusBar, backgroundColor: '#101010' }} />
        <View
          style={{
            backgroundColor: '#202020',
            height: 50,
            flexDirection: 'row',
            //justifyContent: 'space-between',
          }}>
          <TouchableOpacity style={styles.btn} onPress={this._toggleModel.bind(this)}>
            <Icon name="md-arrow-back" color="#ffffff" size={30} />
          </TouchableOpacity>
          {maxSize > 1 && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                color: '#ffffff',
                fontWeight: '600',
                fontSize: 20,
                backgroundColor: 'rgba(0,0,0,0)',
              }}>
              {index + '/' + maxSize}
            </Text>
          </View>
          }
        </View>
      </View>
    );
  }

  render(){
    let {imageUrls} = this.props;
    let { index, show } = this.state;
    return(
      <Modal
        visible={show}
        onRequestClose={this._toggleModel.bind(this)}
        animationType="fade"
        transparent={true}>
        <View style={{height:Platform.OS === 'ios' ? getStatusBarHeight() : 0}}></View>
          <ImageZoomViewer
            onSave={(url)=>this._saveImage(url)}
            index={index}
            imageUrls={imageUrls}
            enableImageZoom={true}
            onClick={this._toggleModel.bind(this)}
            saveToLocalByLongPress={true}
            //renderHeader={this.renderZoomHeader.bind(this)}
            onChange={index => {
                this.setState({ index: index });
              }}
          />
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
});


export default  ImageViewer;