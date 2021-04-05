// Library imports
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import {Text, View} from 'react-native';
import {Divider} from 'react-native-paper';

// Local imports
import {Images} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';
import {globalStyles} from '../../../styles';

// Component imports
import RoundedImage from '../../RoundedImage';
import ActionButton from './components/ActionButton';

// StyleSheet import
import styles from './styles';

/**
 * Friend request list item component
 */
export default class FriendRequestListItem extends Component {
  render() {
    const {
      title,
      date,
      image,
      onAcceptPress,
      onRejectPress,
      isAcceptLoading,
      isRejectLoading,
    } = this.props;
    return (
      <Fragment>
        <View style={styles.container}>
          <View style={styles.firstView}>
            <RoundedImage source={image} size={50} />
            <View style={styles.secondView}>
              <View style={styles.titleContainer}>
                <Text
                  numberOfLines={1}
                  style={[
                    globalStyles.smallNunitoRegularText,
                    styles.titleText,
                  ]}>
                  {title}
                </Text>
                <View style={styles.actionButtonContainer}>
                  <ActionButton
                    title={translate('common.reject')}
                    onPress={onRejectPress}
                    type={'secondary'}
                    loadingStatus={isRejectLoading}
                  />
                  <ActionButton
                    title={translate('pages.xchat.accept')}
                    onPress={onAcceptPress}
                    type={'primary'}
                    loadingStatus={isAcceptLoading}
                  />
                </View>
              </View>
              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    globalStyles.smallNunitoRegularText,
                    styles.dateText,
                  ]}>
                  {getDate(date)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Divider />
      </Fragment>
    );
  }
}

// Format relative date
const getDate = (date) => {
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
  ) {
    return translate('common.yesterday');
  }
  return moment(date).format('MM/DD');
};

/**
 * Friend request list item prop types
 */
FriendRequestListItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.any,
  image: PropTypes.any,
  isOnline: PropTypes.bool,
  isTyping: PropTypes.bool,
  onPress: PropTypes.func,
  isRejectLoading: PropTypes.bool,
  isAcceptLoading: PropTypes.bool,
};

/**
 * Friend request list item default props
 */
FriendRequestListItem.defaultProps = {
  title: 'Friend Name',
  description: 'description',
  date: '21/05',
  image: Images.image_default_profile,
  isOnline: false,
  isTyping: false,
  onPress: null,
  isRejectLoading: false,
  isAcceptLoading: false,
};
