import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import {Colors} from '../../constants';

export default class ChannelListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {title, description, date, onPress} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}>
        <View style={styles.firstView}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.5, y: 0.2}}
            locations={[0.1, 0.6, 1]}
            colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
            style={styles.squareImage}>
            <Text style={globalStyles.normalRegularText}>
              {title.charAt(0)}
            </Text>
          </LinearGradient>
          <View style={styles.secondView}>
            <View style={{alignItems: 'flex-start'}}>
              <Text
                style={[globalStyles.smallRegularText, {color: Colors.black}]}>
                {title}
              </Text>
              <Text
                style={[
                  globalStyles.smallLightText,
                  {color: Colors.gray_dark},
                ]}>
                {description}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  globalStyles.smallLightText,
                  {color: Colors.gray_dark},
                ]}>
                {date}
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
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  squareImage: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ChannelListItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.any,

  /**
   * Callbacks
   */
  onPress: PropTypes.func,
};

ChannelListItem.defaultProps = {
  title: 'Title',
  description: 'description',
  date: '21/05',
  onPress: null,
};
