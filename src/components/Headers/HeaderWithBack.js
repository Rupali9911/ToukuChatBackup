import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
} from 'react-native';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';

import {Icons, Colors, Images} from '../../constants';
import {isIphoneX} from '../../utils';
import {globalStyles} from '../../styles';
import {SearchInput} from '../TextInputs';

export default class HeaderWithBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  render() {
    const {
      isBack,
      title,
      onBackPress,
      isCentered,
      isSearchBar,
      onChangeText,
      navigation,
      onIconRightClick,
    } = this.props;
    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          source={isSearchBar ? Images.header_bg : Images.header_bg_small}
          style={{flex: 1}}
          resizeMode="cover">
          <View
            style={[
              styles.container,
              {
                paddingTop:
                  this.state.orientation === 'PORTRAIT'
                    ? Platform.OS === 'ios'
                      ? isIphoneX()
                        ? 50
                        : 30
                      : 50
                    : Platform.OS === 'ios'
                    ? 20
                    : 40,
              },
            ]}>
            <View
              style={{
                flex: 0.1,
                height: 30,
                justifyContent: 'center',
              }}>
              {isBack ? (
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
                  onPress={onBackPress}
                  style={{
                    flex: 1,
                    paddingBottom: Platform.OS === 'android' && 4,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={Icons.icon_back}
                    style={styles.backIcon}
                    resizeMode={'center'}
                  />
                </TouchableOpacity>
              ) : (
                <View style={globalStyles.iconStyle} />
              )}
            </View>
            <View
              style={{
                flex: 0.8,
                height: 30,
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  globalStyles.normalRegularText15,
                  {textAlign: isCentered ? 'center' : 'left'},
                ]}>
                {title}
              </Text>
            </View>
            <View
              style={{
                flex: 0.1,
                height: 30,
                justifyContent: 'center',
              }}
            />
          </View>
          {isSearchBar && (
            <SearchInput
              onChangeText={onChangeText}
              navigation={navigation}
              isIconRight
            />
          )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: Colors.home_header,
  },
  backIcon: {
    height: 15,
  },
});

HeaderWithBack.propTypes = {
  isBack: PropTypes.bool,
  title: PropTypes.string,
  onBackPress: PropTypes.func,
};

HeaderWithBack.defaultProps = {
  title: '',
  isBack: true,
  onBackPress: null,
};
