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
import PropTypes from 'prop-types';
import {Icons, Colors} from '../../constants';

export default class BackHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {isIconLeft, title, onBackPress} = this.props;
    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          source={Images.header_bg_small}
          style={{flex: 1}}
          resizeMode="cover">
          <View style={styles.container}>
            {isIconLeft ? (
              <TouchableOpacity onPress={onBackPress}>
                <Image source={Icons.icon_back} style={styles.backIcon} />
              </TouchableOpacity>
            ) : (
              <View style={styles.backIcon} />
            )}
            <View>
              <Text style={styles.titleTxt}>{title}</Text>
            </View>
            <View></View>
          </View>
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
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: Platform.OS === 'ios' ? 0 : 30,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  titleTxt: {
    color: Colors.black,
    fontSize: 20,
  },
});

BackHeader.propTypes = {
  isIconLeft: PropTypes.bool,
  title: PropTypes.string,

  /**
   * Callbacks
   */
  onBackPress: PropTypes.func,
};

BackHeader.defaultProps = {
  title: '',
  isIconLeft: true,
  onBackPress: null,
};
