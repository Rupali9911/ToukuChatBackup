import React, {Component, Fragment} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Badge, Divider} from 'react-native-paper';

import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import {Colors, Images} from '../../constants';
import {translate} from '../../redux/reducers/languageReducer';
import {normalize} from '../../utils';
export default class FriendListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  checkTyping = (typing) => {
    if (typing) {
      this.typingTimeout && clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.props.callTypingStop &&
          this.props.callTypingStop(this.props.user_id);
        clearTimeout(this.typingTimeout);
      }, 5000);
      console.log('timer_set', this.typingTimeout);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isTyping !== this.props.isTyping) {
      this.checkTyping(nextProps.isTyping);
    } else {
      // this.typingTimeout && clearTimeout(this.typingTimeout);
    }
  }
  getDate = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const msgDate = new Date(date);
    if (
      today.getDate() === msgDate.getDate() &&
      today.getMonth() === msgDate.getMonth() &&
      today.getFullYear() === msgDate.getFullYear()
    ) {
      return moment(date).format('HH:mm');
    }
    if (
      yesterday.getDate() === msgDate.getDate() &&
      yesterday.getMonth() === msgDate.getMonth() &&
      yesterday.getFullYear() === msgDate.getFullYear()
    ) {
      return translate('common.yesterday');
    }

    if (today.getFullYear() === msgDate.getFullYear()) {
      return moment(date).format('MM/DD');
    } else {
      return moment(date).format('MM/DD/YY');
    }
  };

  render() {
    const {
      title,
      description,
      date,
      image,
      onPress,
      isOnline,
      isTyping,
      unreadCount,
      callTypingStop,
      onAvtarPress,
    } = this.props;
    return (
      <Fragment>
        <View activeOpacity={0.8} style={styles.container}>
          <View style={[styles.firstView]}>
            <TouchableOpacity onPress={onAvtarPress}>
              <RoundedImage
                source={image}
                size={50}
                isBadge={true}
                isOnline={isOnline}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondView} onPress={onPress}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text
                  numberOfLines={1}
                  style={[
                    globalStyles.smallNunitoRegular17Text,
                    {
                      color: Colors.black_light,
                      //fontSize: normalize(12),
                      fontWeight: '400',
                    },
                  ]}>
                  {title}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    globalStyles.smallNunitoRegularText,
                    {
                      color: Colors.message_gray,
                      textAlign: 'left',
                      //fontSize: normalize(11),
                      fontWeight: '400',
                    },
                  ]}>
                  {isTyping ? 'Typing...' : description}
                  {/* {description} */}
                </Text>
              </View>
              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    globalStyles.smallNunitoRegularText,
                    {
                      color: Colors.message_gray,
                      fontSize: 12,
                      fontWeight: '400',
                    },
                  ]}>
                  {this.getDate(date)}
                </Text>
                {unreadCount !== 0 && unreadCount != null && (
                  <Badge
                    style={[
                      globalStyles.smallLightText,
                      {
                        backgroundColor: Colors.green,
                        color: Colors.white,
                        fontSize: 12,
                      },
                    ]}>
                    {unreadCount}
                  </Badge>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Divider />
      </Fragment>
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
  isTyping: PropTypes.bool,
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
  isTyping: false,
  onPress: null,
};
