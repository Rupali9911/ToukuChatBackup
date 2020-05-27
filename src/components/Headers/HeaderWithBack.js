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
    const { isBack, title, onBackPress } = this.props;
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
                  : 40
                : Platform.OS === 'ios'
                ? 20
                : 40,
          },
        ]}
      >
        <View style={{ flex: 0.1 }}>
          {isBack ? (
            <TouchableOpacity onPress={onBackPress}>
              <Image source={Icons.icon_back} style={styles.backIcon} />
            </TouchableOpacity>
          ) : (
            <View style={globalStyles.iconStyle} />
          )}
        </View>
        <View style={{ flex: 0.8 }}>
          <Text style={[globalStyles.normalRegularText, { textAlign: 'left' }]}>
            {title}
          </Text>
        </View>
        <View style={{ flex: 0.1 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.home_header,
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
