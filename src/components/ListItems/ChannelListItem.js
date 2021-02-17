import React, { Component, Fragment, PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Badge, Divider } from 'react-native-paper';
import RoundedImage from '../RoundedImage';
import { globalStyles } from '../../styles';
import { Colors } from '../../constants';
import { getImage, normalize, wait } from '../../utils';
import { translate } from '../../redux/reducers/languageReducer';
import Icon from 'react-native-vector-icons/Feather';
import Octicon from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SwipeItem, SwipeButtonsContainer } from '../Swipeable';

export default class ChannelListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      newItem: { ...this.props.item, isCheck: false },
      isSwipeButtonVisible: false,
    };
    this.itemRef = null;
  }

  componentDidUpdate(props) {
    if (props.isVisible != this.props.isVisible) {
      this.setState({ newItem: { ...this.props.item, isCheck: false } });
    }
  }

  getDate = (date) => {
    if (date === null || date === '' || date === undefined) {
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

  manageRecord = (item, isCheck) => {
    if (isCheck === 'check') {
      this.setState({ newItem: { ...item, isCheck: true } });
    } else if (isCheck === 'unCheck') {
      this.setState({ newItem: { ...item, isCheck: false } });
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
      onPinUnpinChat
    } = this.props;

    const { newItem, isSwipeButtonVisible } = this.state;

    // var matches = title.match(/\b(\w)/g);
    // var firstChars = matches.join('');
    // var secondUpperCase = firstChars.charAt(1).toUpperCase();
    return (
      <Fragment>
        <SwipeItem
          style={{ flex: 1 }}
          rightButtons={swipeable &&
            <View style={{ flexDirection: 'row', height: '100%' }}>
              <SwipeButtonsContainer
                style={{
                  alignSelf: 'center',
                  aspectRatio: 1,
                  height: '100%',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity style={{
                  padding: 10,
                  backgroundColor: '#99B1F9',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1
                }} onPress={() => {
                  console.log('pin chat');
                  this.itemRef && this.itemRef.close()
                  wait(200).then(() => {
                    onPinUnpinChat(item);
                  });
                }}>
                  <MaterialCommunityIcon
                    name={item.is_pined ? 'pin-off' : 'pin'}
                    size={20}
                    color={Colors.white}
                  />
                  {/* <Octicon name={'pin'} color={Colors.white} size={20}/> */}
                </TouchableOpacity>
              </SwipeButtonsContainer>
              <SwipeButtonsContainer
                style={{
                  alignSelf: 'center',
                  aspectRatio: 1,
                  height: '100%',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity style={{
                  padding: 10,
                  backgroundColor: '#F9354B',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1
                }} onPress={() => {
                  console.log('delete chat')
                  this.itemRef && this.itemRef.close();
                  onDeleteChat(item.id);
                }}>
                  <Text style={{ color: Colors.white }}>{translate('common.delete')}</Text>
                </TouchableOpacity>
              </SwipeButtonsContainer>
            </View>
          }
          onSwipeInitial={(item) => onSwipeInitial(item)}
          onMovedToOrigin={() => {
            // console.log('button hide');
            this.setState({ isSwipeButtonVisible: false });
          }}
          onRightButtonsShowed={(item) => {
            this.itemRef = item;
            onSwipeButtonShowed(item)
            this.setState({ isSwipeButtonVisible: true });
          }}
          disableSwipeIfNoButton>
          <View style={{ backgroundColor: '#f2f2f2' }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={isSwipeButtonVisible ? () => { this.itemRef && this.itemRef.close() } :
                !isVisible
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
                    newItem.isCheck === true && (
                      <TouchableOpacity
                        style={{ alignSelf: 'center', justifyContent: 'center' }}
                        onPress={() => {
                          // this.setState({isChecked: false});
                          this.manageRecord(item, 'unCheck');
                        }}>
                        <LinearGradient
                          start={{ x: 0.1, y: 0.7 }}
                          end={{ x: 0.5, y: 0.2 }}
                          locations={[0.1, 0.6, 1]}
                          colors={[
                            Colors.gradient_1,
                            Colors.gradient_2,
                            Colors.gradient_3,
                          ]}
                          style={styles.checkBoxIscheck}>
                          <Icon size={17} name="check" style={{ color: '#fff' }} />
                        </LinearGradient>
                      </TouchableOpacity>
                    )
                  )}
                {image === null || image === '' || typeof image === undefined ? (
                  <LinearGradient
                    start={{ x: 0.1, y: 0.7 }}
                    end={{ x: 0.5, y: 0.2 }}
                    locations={[0.1, 0.6, 1]}
                    colors={[
                      Colors.gradient_1,
                      Colors.gradient_2,
                      Colors.gradient_3,
                    ]}
                    style={styles.squareImage}>
                    <Text style={globalStyles.smallNunitoRegularText}>
                      {title && title.charAt(0) && title.charAt(0).toUpperCase()}
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
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: 5,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallNunitoRegularText,
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
                          fontSize: Platform.isPad ? normalize(7) : normalize(11.5),
                          fontWeight: '400',
                        },
                      ]}>
                      {description}
                    </Text>
                  </View>
                  {isPined ? (
                    <View style={{ marginTop: 2, marginRight: 5 }}>
                      <Octicon name={'pin'} size={14} color={Colors.gray_dark} />
                    </View>
                  ) : null}
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
                            marginTop: 5,
                          },
                        ]}>
                        {unreadCount}
                      </Badge>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </SwipeItem>
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
    // paddingLeft: 20,
  },
  squareImage: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBox: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    borderColor: '#ff62a5',
    borderWidth: 1,
    alignSelf: 'center',
    margin: 5,
    marginRight: 15,
  },
  checkBoxIscheck: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 5,
    marginRight: 15,
  },
});

ChannelListItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.any,
  image: PropTypes.any,
  /**
   * Callbacks
   */
  onPress: PropTypes.func,
};

ChannelListItem.defaultProps = {
  title: 'Title',
  description: 'description',
  date: '21/05',
  image: null,
  onPress: null,
};
