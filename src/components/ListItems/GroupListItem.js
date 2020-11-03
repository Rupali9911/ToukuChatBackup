import React, {Component, Fragment} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Badge, Divider} from 'react-native-paper';
import {translate} from '../../redux/reducers/languageReducer';
import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import {Colors} from '../../constants';
import {getImage, normalize} from '../../utils';

export default class GroupListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
      //console.log('GroupListItem -> getDate -> date', date);
      return `${msgDate.getHours()}:${
        msgDate.getMinutes() < 10
          ? '0' + msgDate.getMinutes()
          : msgDate.getMinutes()
      }`;
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

  renderMessageWitMentions = (msg) => {
    const {mentions} = this.props;
    let splitNewMessageText = msg.split(' ');
    let newMessageMentions = [];
    const newMessageTextWithMention = splitNewMessageText
      .map((text) => {
        let mention = null;
        mentions &&
          mentions.length &&
          mentions.forEach((mentionUser) => {
            if (text === `~${mentionUser.id}~`) {
              mention = `@${mentionUser.desplay_name}`;
              newMessageMentions = [...newMessageMentions, mentionUser.id];
            }
          });
        if (mention) {
          return mention;
        } else {
          return text;
        }
      })
      .join(' ');
    return newMessageTextWithMention;
  };

  render() {
    const {title, description, date, image, onPress, unreadCount} = this.props;
    // var matches = title.match(/\b(\w)/g);
    // var firstChars = matches.join('');
    // var secondUpperCase = firstChars.charAt(1).toUpperCase();
    return (
      <Fragment>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={styles.container}>
          <View style={styles.firstView}>
            {image === null || image === '' || typeof image === undefined ? (
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
                <Text style={globalStyles.normalRegularText}>
                  {title.charAt(0).toUpperCase()}
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
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text
                  numberOfLines={1}
                  style={[
                    globalStyles.smallNunitoRegularText,
                    {
                      color: Colors.black_light,
                      fontSize: normalize(12),
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
                      fontSize: normalize(11),
                      fontWeight: '400',
                    },
                  ]}>
                  {this.renderMessageWitMentions(description)}
                </Text>
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
                {unreadCount !== 0 && unreadCount != null && (
                  <Badge
                    style={[
                      globalStyles.smallLightText,
                      {
                        backgroundColor: Colors.green,
                        color: Colors.white,
                        fontSize: 11,
                      },
                    ]}>
                    {unreadCount}
                  </Badge>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
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

GroupListItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.any,
  image: PropTypes.any,

  /**
   * Callbacks
   */
  onPress: PropTypes.func,
};

GroupListItem.defaultProps = {
  title: 'Title',
  description: 'description',
  date: '21/05',
  image: null,
  onPress: null,
};
