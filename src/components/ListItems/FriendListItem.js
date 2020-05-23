import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import {Colors, Images} from '../../constants';

export default class FriendListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {title, description, date, image, onPress, isOnline} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}>
        <View style={styles.firstView}>
          <RoundedImage
            source={image}
            size={50}
            isBadge={true}
            isOnline={isOnline}
          />
          <View style={styles.secondView}>
            <View style={{flex: 1, alignItems: 'flex-start'}}>
              <Text
                numberOfLines={1}
                style={[globalStyles.smallRegularText, {color: Colors.black}]}>
                {title}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  globalStyles.smallLightText,
                  {color: Colors.gray_dark, textAlign: 'left'},
                ]}>
                {description}
              </Text>
            </View>
            <View>
              <Text
                numberOfLines={1}
                style={[
                  globalStyles.smallLightText,
                  {color: Colors.gray_dark},
                ]}>
                {moment(date).format('DD/MM')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  firstView: {
    flexDirection: 'row',
  },
  secondView: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  squareImage: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

FriendListItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.any,
  image: PropTypes.any,
  isOnline: PropTypes.bool,

  /**
   * Callbacks
   */
  onPress: PropTypes.func,
};

FriendListItem.defaultProps = {
  title: 'Friend Name',
  description: 'description',
  date: '21/05',
  image: Images.image_default_profile,
  isOnline: false,
  onPress: null,
};
