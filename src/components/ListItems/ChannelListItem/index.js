// Library imports
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, Badge, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';

// Local imports
import {Colors} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';
import {globalStyles} from '../../../styles';
import {getImage} from '../../../utils';

// Component imports
import RoundedImage from '../../RoundedImage';
import {SwipeButtonsContainer, SwipeItem} from '../../Swipeable';

// Stylesheet import
import styles from './styles';

/**
 * Channel list item component
 */
export default class ChannelListItem extends PureComponent {
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

  // Manages record
  manageRecord = (item, isCheck) => {
    if (isCheck === 'check') {
      this.setState({newItem: {...item, isCheck: true}});
    } else if (isCheck === 'unCheck') {
      this.setState({newItem: {...item, isCheck: false}});
    }
    this.props.onCheckChange('channel', isCheck, item);
  };

  render() {
    const {
      title,
      description,
      date,
      image,
      onPress,
      unreadCount,
      isVisible,
      item,
      isPined,
      onSwipeButtonShowed,
      onSwipeInitial,
      swipeable,
      onDeleteChat,
      onPinUnpinChat,
    } = this.props;

    const {
      newItem,
      isSwipeButtonVisible,
      isPinUnpinLoading,
      isDeleteLoading,
    } = this.state;

    return (
      <>
        <SwipeItem
          buttonTriggerPercent={0.4}
          style={styles.singleFlex}
          rightButtons={
            swipeable && (
              <View style={styles.subContainer}>
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
                    onPress={() => {
                      this.itemRef && this.itemRef.close();
                      onDeleteChat(item.id);
                    }}>
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
          onMovedToOrigin={() => {
            this.setState({isSwipeButtonVisible: false});
          }}
          onRightButtonsShowed={(swipeItem) => {
            this.itemRef = swipeItem;
            onSwipeButtonShowed(swipeItem);
            this.setState({isSwipeButtonVisible: true});
          }}
          disableSwipeIfNoButton>
          <View style={styles.swipeItemContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
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
              style={styles.container}
              // disabled={isVisible}
            >
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
                  newItem.isCheck && (
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
                {!image ? (
                  <LinearGradient
                    start={{x: 0.1, y: 0.7}}
                    end={{x: 0.5, y: 0.2}}
                    locations={[0.1, 0.6, 1]}
                    colors={[
                      Colors.gradient_1,
                      Colors.gradient_2,
                      Colors.gradient_3,
                    ]}
                    style={styles.squareImage}>
                    <Text style={globalStyles.smallNunitoRegularText}>
                      {title &&
                        title.charAt(0) &&
                        title.charAt(0).toUpperCase()}
                      {/* {secondUpperCase} */}
                    </Text>
                  </LinearGradient>
                ) : (
                  <RoundedImage
                    source={getImage(image)}
                    isRounded={false}
                    size={50}
                  />
                )}
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
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallNunitoRegularText,
                        styles.descriptionText,
                      ]}>
                      {description}
                    </Text>
                  </View>
                  {isPined && (
                    <View style={styles.pinnedIconContainer}>
                      <Octicon
                        name={'pin'}
                        size={14}
                        color={Colors.gray_dark}
                      />
                    </View>
                  )}
                  <View>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallNunitoRegularText,
                        styles.dateText,
                      ]}>
                      {getDate(date)}
                    </Text>
                    {unreadCount !== 0 && unreadCount != null && (
                      <Badge
                        style={[
                          // globalStyles.smallLightText,
                          styles.badgeStyle,
                        ]}>
                        {unreadCount>99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </SwipeItem>
        <Divider />
      </>
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
 * Channel list item prop types
 */
ChannelListItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.any,
  image: PropTypes.any,
  onPress: PropTypes.func,
};

/**
 * Channel list item default props
 */
ChannelListItem.defaultProps = {
  title: 'Title',
  description: 'description',
  date: '21/05',
  image: null,
  onPress: null,
};
