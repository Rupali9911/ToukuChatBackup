import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';

import { Icons, Colors } from '../../constants';
import { isIphoneX } from '../../utils';
import { globalStyles } from '../../styles';

export default class HeaderWithBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  render() {
    const { isBack, title, onBackPress, isCentered } = this.props;
    return (
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
        ]}
      >
        <View
          style={{
            flex: 0.1,
            height: 30,
            justifyContent: 'center',
          }}
        >
          {isBack ? (
            <TouchableOpacity
              onPress={onBackPress}
              style={{
                flex: 1,
                paddingBottom: Platform.OS === 'android' && 4,
                justifyContent: 'center',
              }}
            >
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
          }}
        >
          <Text
            style={[
              globalStyles.normalLightText,
              { textAlign: isCentered ? 'center' : 'left' },
            ]}
          >
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.orange_light,
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
