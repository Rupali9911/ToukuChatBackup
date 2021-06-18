// Library imports
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {Fragment, PureComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, Badge, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';

// Local imports
import {Colors, Images} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';
import {globalStyles} from '../../../styles';

// Component imports
import RoundedImage from '../../RoundedImage';
import {SwipeButtonsContainer, SwipeItem} from '../../Swipeable';

// Stylesheet import
import styles from './styles';

/**
 * Friend list item component
 */
export default class FriendListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      newItem: {...this.props.item, isCheck: false},
      isSwipeButtonVisible: false,
      isPinUnpinLoading: false,
      isDeleteLoading: false,
    };
    this.itemRef = null;
  }

  // Update state based on new old prop comparison
  componentDidUpdate(props) {
    if (props.isVisible !== this.props.isVisible) {
      this.setState({newItem: {...this.props.item, isCheck: false}});
    }
  }

  // Detect if the user is typing or not
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

  /**
   * Compare received props for detecting
   * wheather user is typing or not
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.isTyping !== this.props.isTyping) {
      this.checkTyping(nextProps.isTyping);
    } else {
      // this.typingTimeout && clearTimeout(this.typingTimeout);
    }
  }

  // Manages record
  manageRecord = (item, isCheck) => {
    if (isCheck === 'check') {
      this.setState({newItem: {...item, isCheck: true}});
    } else if (isCheck === 'unCheck') {
      this.setState({newItem: {...item, isCheck: false}});
    }
    this.props.onCheckChange('friend', isCheck, item);
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
      isVisible,
      item,
      onAvtarPress,
      isPined,
      onSwipeButtonShowed,
      onSwipeInitial,
      swipeable,
      onDeleteChat,
      onPinUnpinChat,
      acceptedRequest,
    } = this.props;
    const {
      newItem,
      isSwipeButtonVisible,
      isPinUnpinLoading,
      isDeleteLoading,
    } = this.state;

    return (
      <Fragment>
        <SwipeItem
          buttonTriggerPercent={0.4}
          style={styles.singleFlex}
          rightButtons={
            swipeable && (
              <View style={styles.swipeRightButtonContainer}>
                <SwipeButtonsContainer style={styles.swipeButtonContainer}>
                  <TouchableOpacity
                    style={styles.pinActionContainer}
                    disabled={isPinUnpinLoading}
                    onPress={() => {
                      this.setState({isPinUnpinLoading: true});
                      onPinUnpinChat(item, () => {
                        this.setState({isPinUnpinLoading: false});
                        this.itemRef && this.itemRef.close();
                      });
                    }}>
                    {isPinUnpinLoading ? (
                      <ActivityIndicator color={Colors.white} />
                    ) : (
                      <MaterialCommunityIcon
                        name={item.is_pined ? 'pin-off' : 'pin'}
                        size={20}
                        color={Colors.white}
                      />
                    )}
                  </TouchableOpacity>
                </SwipeButtonsContainer>
                <SwipeButtonsContainer style={styles.swipeButtonContainer}>
                  <TouchableOpacity
                    style={styles.deleteActionContainer}
                    onPress={() => onDeleteChat(item.friend)}>
                    {isDeleteLoading ? (
                      <ActivityIndicator color={Colors.white} />
                    ) : (
                      <Text style={{color: Colors.white}}>
                        {translate('common.delete')}
                      </Text>
                    )}
                  </TouchableOpacity>
                </SwipeButtonsContainer>
              </View>
            )
          }
          onSwipeInitial={(swipeItem) => onSwipeInitial(swipeItem)}
          onMovedToOrigin={() => this.setState({isSwipeButtonVisible: false})}
          onRightButtonsShowed={(swipeItem) => {
            this.itemRef = swipeItem;
            onSwipeButtonShowed(swipeItem);
            this.setState({isSwipeButtonVisible: true});
          }}
          disableSwipeIfNoButton>
          <View style={styles.swipeItemContainer}>
            <View activeOpacity={0.8} style={styles.container}>
              <View style={styles.firstView}>
                {isVisible && newItem.isCheck === false ? (
                  <TouchableOpacity
                    style={styles.checkBox}
                    onPress={() => {
                      // this.setState({isChecked: true});
                      this.manageRecord(item, 'check');
                    }}
                  />
                ) : (
                  isVisible &&
                  newItem.isCheck === true && (
                    <TouchableOpacity
                      style={styles.checkedActionContainer}
                      onPress={() => this.manageRecord(item, 'unCheck')}>
                      <LinearGradient
                        start={{x: 0.1, y: 0.7}}
                        end={{x: 0.5, y: 0.2}}
                        locations={[0.1, 0.6, 1]}
                        colors={[
                          Colors.gradient_1,
                          Colors.gradient_2,
                          Colors.gradient_3,
                        ]}
                        style={styles.checkBoxIscheck}>
                        <Icon
                          size={17}
                          name="check"
                          style={styles.checkIconColor}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  )
                )}
                <TouchableOpacity
                  onPress={
                    !isVisible
                      ? onAvtarPress
                      : () => {
                          this.manageRecord(
                            item,
                            !newItem.isCheck ? 'check' : 'unCheck',
                          );
                        }
                  }
                  // disabled={isVisible}
                >
                  <RoundedImage
                    source={image}
                    size={50}
                    isBadge={true}
                    isOnline={isOnline}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondView}
                  onPress={
                    isSwipeButtonVisible
                      ? () => {
                          this.itemRef && this.itemRef.close();
                        }
                      : !isVisible
                      ? onPress
                      : () => {
                          this.manageRecord(
                            item,
                            !newItem.isCheck ? 'check' : 'unCheck',
                          );
                        }
                  }
                  // disabled={isVisible}
                >
                  <View style={styles.titleContainer}>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallNunitoRegular17Text,
                        styles.titleText,
                      ]}>
                      {title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallNunitoRegularText,
                        styles.descriptionText,
                      ]}>
                      {isTyping ? 'Typing...' : description}
                    </Text>
                  </View>
                  {isPined ? (
                    <View style={styles.pinnedIconContainer}>
                      <Octicon
                        name={'pin'}
                        size={14}
                        color={Colors.gray_dark}
                      />
                    </View>
                  ) : null}
                  <View>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallNunitoRegularText,
                        styles.dateText,
                      ]}>
                      {getDate(date)}
                    </Text>
                    {((unreadCount !== 0 && unreadCount != null) ||
                      acceptedRequest > 0) && (
                      <Badge
                        style={[
                          // globalStyles.smallLightText,
                          styles.badgeStyle,
                        ]}>
                        {acceptedRequest
                          ? (unreadCount + acceptedRequest) > 99 ? '99+' : (unreadCount + acceptedRequest)
                          : unreadCount>99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SwipeItem>
        <Divider />
      </Fragment>
    );
  }
}

// Format relative date
const getDate = (date) => {
  if (!date) {
    return '';
  }

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
    return moment(date).format('YYYY/MM/DD');
  }
};

/**
 * Friend list item prop types
 */
FriendListItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.any,
  image: PropTypes.any,
  isOnline: PropTypes.bool,
  isTyping: PropTypes.bool,
  onPress: PropTypes.func,
};

/**
 * Friend list item default props
 */
FriendListItem.defaultProps = {
  title: 'Friend Name',
  description: 'description',
  date: '21/05',
  image: Images.image_default_profile,
  isOnline: false,
  isTyping: false,
  onPress: null,
};
