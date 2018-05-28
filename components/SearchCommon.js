/**
 * Created by yuanzhou.xu on 2018/3/26.
 */
import React from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, Platform } from 'react-native';
export class SearchBtn extends React.Component {
  constructor(props) {
    super(props);
  }

  _onPress = () => {
    const { onPress } = this.props;
    onPress && onPress();
  };

  render() {
    const { text, style } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.btnContainer, style]}
        onPress={this._onPress}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={require('../../assets/ios/tab1_search.png')} />
          <Text style={styles.btnText}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export class SearchTopBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  static defaultProps = {
    rightText: '搜索',
    showLeft: true,
  };

  _onPress = () => {
    const { onPress } = this.props;
    onPress && onPress();
  };

  _onLeftPress = () => {
    const { onLeftPress } = this.props;
    onLeftPress && onLeftPress();
  };

  render() {
    const { style, text, showLeft } = this.props;
    return (
      <View style={[styles.searchTop, style]}>
        {showLeft && (
          <TouchableOpacity onPress={this._onLeftPress} style={styles.searchTopLeftBtn}>
            <Image source={require('../../assets/ios/common_return.png')} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.btnContainer, style]}
          onPress={this._onPress}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../../assets/ios/tab1_search.png')} />
            <Text style={styles.btnText}>{text}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export class SearchTopInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  static defaultProps = {
    rightText: '搜索',
    showLeft: true,
  };

  _onRightPress = () => {
    const { onRightPress } = this.props;
    this.searchInput && this.searchInput.blur();
    onRightPress && onRightPress();
  };

  _onLeftPress = () => {
    const { onLeftPress } = this.props;
    this.searchInput && this.searchInput.blur();
    onLeftPress && onLeftPress();
  };

  _changeText = text => {
    const { onChangeText } = this.props;
    this.setState({
      searchText: text,
    });
    onChangeText && onChangeText(text);
  };

  _removeText = () => {
    const { onChangeText } = this.props;
    this.setState({
      searchText: '',
    });
    onChangeText && onChangeText('');
  };

  render() {
    const {
      style,
      placeholder,
      placeholderTextColor,
      showRight,
      rightText,
      showLeft,
    } = this.props;
    let canSearch = false;
    if (this.state.searchText.length > 0) {
      canSearch = true;
    }
    return (
      <View style={[styles.searchTop, style]}>
        {showLeft && (
          <TouchableOpacity onPress={this._onLeftPress} style={styles.searchTopLeftBtn}>
            <Image source={require('../../assets/ios/common_return.png')} />
          </TouchableOpacity>
        )}
        <View style={styles.searchInputView}>
          <Image source={require('../../assets/ios/tab1_search.png')} />
          <View style={styles.searchView}>
            <TextInput
              ref={ref => {
                this.searchInput = ref;
              }}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoFocus={true}
              autoCorrect={false}
              iconStyle={styles.iconStyle}
              onChangeText={this._changeText}
              value={this.state.searchText}
              secureTextEntry={false}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor || 'rgba(183,188,205,1)'}
              style={styles.searchInput}
            />
          </View>
          {canSearch && (
            <TouchableOpacity onPress={this._removeText} style={styles.searchInputDelBtn}>
              <Image source={require('../../assets/ios/login_del.png')} />
            </TouchableOpacity>
          )}
        </View>
        {showRight && (
          <TouchableOpacity
            onPress={this._onRightPress}
            activeOpacity={1}
            style={styles.searchTopRightBtn}>
            <Text
              style={[
                styles.searchTopRightText,
                { color: canSearch ? 'rgb(66,215,140)' : 'rgb(153,153,153)' },
              ]}>
              {rightText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = {
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(242,244,247)',
    height: 25,
    padding: 0,
    margin: 0,
    borderRadius: 12,
    paddingLeft: 12,
    borderWidth: 0,
  },
  btnText: {
    marginLeft: 8.5,
    fontSize: 11,
    color: 'rgb(171,178,196)',
  },

  searchTop: {
    backgroundColor: '#fff',
    height: 50,
    paddingLeft: 0,
    paddingRight: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#c3c3c3',
    /*elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,*/
    marginBottom: Platform.os === 'ios' ? 2 : 0,
  },
  searchInputView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(242,244,247)',
    height: 25,
    padding: 0,
    margin: 0,
    borderRadius: 12,
    paddingLeft: 15,
    borderWidth: 0,
    marginRight: 5.5,
  },
  searchView: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 0,
    marginRight: 10,
  },
  searchInput: {
    padding: 0,
    margin: 0,
    marginRight: 10,
    fontSize: 12,
    color: 'rgba(183,188,205,1)',
  },
  searchTopLeftBtn: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInputDelBtn: {
    position: 'absolute',
    right: 0,
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTopRightBtn: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTopRightText: {
    color: 'rgb(153,153,153)',
    fontSize: 12,
  },
};
