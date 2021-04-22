import moment from 'moment';
import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../../constants';
import {translate} from '../../redux/reducers/languageReducer';
import {getAvatar, getUserName, normalize} from '../../utils';
import styles from './styles';

class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      commentText: '',
      showComment: false,
      showCommentBox: false,
      commentData: {},
    };
  }

  getDate = (date) => {
    return moment(date).format('MM/DD/YYYY HH:mm');
  };

  render() {
    const {index, item, onDelete, onLikeUnlike, userData} = this.props;
    return (
      <View style={styles.container}>
        <Image
          source={getAvatar(item.created_by_avatar)}
          style={styles.avatar}
        />
        <View style={styles.singleFlex}>
          <View style={styles.subContainer}>
            <View style={styles.row}>
              <View>
                <View style={styles.headerContainers}>
                  <Text style={styles.username}>
                    {userData.id === item.created_by
                      ? translate('pages.xchat.you')
                      : getUserName(item.created_by) ||
                        item.created_by_username}
                  </Text>
                  <Text style={styles.date}>{this.getDate(item.updated)}</Text>
                </View>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </View>
            {userData.id === item.created_by && (
              <View style={styles.row}>
                <FontAwesome5
                  name={'trash'}
                  size={14}
                  color={Colors.black}
                  style={styles.trashIconStyle}
                  onPress={() => {
                    onDelete(index, item);
                  }}
                />
              </View>
            )}
          </View>
          <View style={styles.footerContainer}>
            <View style={styles.footerSubContainer}>
              <FontAwesome
                name={item.is_liked ? 'thumbs-up' : 'thumbs-o-up'}
                size={normalize(12)}
                color={Colors.black}
                style={styles.likeIcon}
              />

              <Text style={styles.likeByCountLabel}>{item.liked_by_count}</Text>

              <Text
                style={styles.likeUnlikeLabel}
                onPress={() => {
                  onLikeUnlike(item, index);
                }}>
                {item.is_liked
                  ? translate('pages.xchat.unlike')
                  : translate('pages.xchat.like')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default CommentItem;
