import React, {Component, Fragment} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Badge, Divider} from 'react-native-paper';

import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import {Colors, Images} from '../../constants';
import Button from '../Button';
import {translate} from '../../redux/reducers/languageReducer';

export default class FriendRequestListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getDate = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const msgDate = new Date(date);
    if (today.getDate() === msgDate.getDate()) {
      return moment(date).format('H:mm');
    }
    if (
      yesterday.getDate() === msgDate.getDate() &&
      yesterday.getMonth() === msgDate.getMonth()
    )
      return translate('common.yesterday');
    return moment(date).format('MM/DD');
  };

  render() {
    const {title, date, image, onAcceptPress, onRejectPress, isAcceptLoading, isRejectLoading} = this.props;
    return (
      <Fragment>
        <View style={styles.container}>
          <View style={styles.firstView}>
            <RoundedImage
              source={image}
              size={50}
              // isBadge={true}
              // isOnline={isOnline}
            />
            <View style={styles.secondView}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text
                  numberOfLines={1}
                  style={[
                    globalStyles.smallNunitoRegularText,
                    {
                      color: Colors.black_light,
                      //fontSize: 13,
                      fontWeight: '400',
                    },
                  ]}>
                  {title}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={{marginRight: 10, width: 100}}>
                    <Button
                      title={translate('common.reject')}
                      onPress={onRejectPress}
                      isRounded={false}
                      type={'secondary'}
                      height={Platform.isPad ? 40 : 30}
                      loading={isRejectLoading}
                    />
                  </View>
                  <View style={{marginRight: 10, width: 100}}>
                    <Button
                      title={translate('pages.xchat.accept')}
                      onPress={onAcceptPress}
                      isRounded={false}
                      type={'primary'}
                      height={Platform.isPad ? 40 : 30}
                      loading={isAcceptLoading}
                    />
                  </View>
                </View>
              </View>
              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    globalStyles.smallNunitoRegularText,
                    {
                      color: Colors.message_gray,
                      fontSize: 11,
                      fontWeight: '400',
                    },
                  ]}>
                  {this.getDate(date)}
                </Text>
                {/* {unreadCount !== 0 && unreadCount != null && (
                  <Badge
                    style={[
                      globalStyles.smallLightText,
                      {
                        backgroundColor: Colors.green,
                        color: Colors.white,
                        fontSize: 11,
                      },
                    ]}
                  >
                    {unreadCount}
                  </Badge>
                )} */}
              </View>
            </View>
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
      backgroundColor: 'white'
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

FriendRequestListItem.propTypes = {
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
    isRejectLoading: PropTypes.bool,
    isAcceptLoading: PropTypes.bool
};

FriendRequestListItem.defaultProps = {
  title: 'Friend Name',
  description: 'description',
  date: '21/05',
  image: Images.image_default_profile,
  isOnline: false,
  isTyping: false,
  onPress: null,
    isRejectLoading: false,
    isAcceptLoading: false
};
