// Library imports
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ImageBackground, Platform, Text, View} from 'react-native';
import Orientation from 'react-native-orientation';

// Component imports
import BackIcon from './components/BackIcon';

// Local imports
import {Images} from '../../../constants';
import {globalStyles} from '../../../styles';
import {isIphoneX} from '../../../utils';
import {SearchInput} from '../../TextInputs';

// Stylesheet import
import styles from './styles';

/**
 * Header componenet with back icon and search
 */
export default class HeaderWithBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

  /**
   * --- DEPRECATED USE ---
   * Set intial orientation in state
   */
  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  // Add orientation listener
  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  // Sets orientation in state
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
    } = this.props;

    const textStyle = [
      globalStyles.normalRegularText15,
      {textAlign: isCentered ? 'center' : 'left'},
    ];

    const container = [
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
    ];

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          source={isSearchBar ? Images.header_bg : Images.header_bg_small}
          style={styles.singleFlex}
          resizeMode={'cover'}>
          <View style={container}>
            <View style={styles.backIconContainer}>
              {isBack ? (
                <BackIcon onBackPress={onBackPress} />
              ) : (
                <View style={globalStyles.iconStyle} />
              )}
            </View>
            <View style={styles.titleContainer}>
              <Text style={textStyle}>{title}</Text>
            </View>
            <View style={styles.backIconContainer} />
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

/**
 * Header prop types
 */
HeaderWithBack.propTypes = {
  isBack: PropTypes.bool,
  title: PropTypes.string,
  onBackPress: PropTypes.func,
};

/**
 * Header default props
 */
HeaderWithBack.defaultProps = {
  title: '',
  isBack: true,
  onBackPress: null,
};
