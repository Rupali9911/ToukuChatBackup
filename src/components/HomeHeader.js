import React, {Component} from 'react';
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

import {Icons, Colors} from '../constants';
import HamburgerIcon from './HamburgerIcon';
import {isIphoneX} from '../utils';
import {globalStyles} from '../styles';

export default class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

  componentWillMount() {
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
    const {isDrawer, title} = this.props;
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
        ]}>
        <View style={{flex: 1}}>
          {isDrawer ? (
            <HamburgerIcon />
          ) : (
            <View style={globalStyles.iconStyle} />
          )}
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={globalStyles.normalRegularText}>{title}</Text>
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.gradient_2,
  },
});

HomeHeader.propTypes = {
  isDrawer: PropTypes.bool,
  title: PropTypes.string,
};

HomeHeader.defaultProps = {
  title: '',
  isDrawer: true,
  onBackPress: null,
};
