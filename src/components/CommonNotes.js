import React, {Component} from 'react';
import {View, Image, TouchableOpacity, Text, FlatList} from 'react-native';

import {getImage, eventService, normalize} from '../utils';
import {Images, Icons, Colors, Fonts, SocketEvents} from '../constants';
import Button from '../components/Button';
import NoData from '../components/NoData';
import {ListLoader, ImageLoader} from '../components/Loaders';
import TextAreaWithTitle from '../components/TextInputs/TextAreaWithTitle';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {translate, setI18nConfig} from '../redux/reducers/languageReducer';
import moment from 'moment';
import NoteItem from './NoteItem';

export default class CommonNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      commentText: '',
      showCommentBoxIndex: -1,
    };
  }

  UNSAFE_componentWillMount() {
    this.events = eventService.getMessage().subscribe((message) => {
      switch (message.text.data.type) {
        case SocketEvents.LIKE_OR_UNLIKE_GROUP_NOTE_COMMENT_DATA:
        case SocketEvents.DELETE_GROUP_NOTE_COMMENT:
        case SocketEvents.GROUP_NOTE_COMMENT_DATA:
        case SocketEvents.LIKE_OR_UNLIKE_FRIEND_NOTE_COMMENT_DATA:
        case SocketEvents.FRIEND_NOTE_COMMENT_DATA:
        case SocketEvents.DELETE_FRIEND_NOTE_COMMENT:
          if (message) {
            let data = this.props.isFriend
              ? message.text.data.message_details.data
              : message.text.data.message_details;

            if (this.props.isFriend) {
              let id = data.note_id || data.friend_note;
              if (data && id) {
                this[`note_item_` + id] &&
                  this[`note_item_` + id].checkEventTypes(message);
              }
            } else {
              let id = data.note_id || data.group_note;
              if (data && id) {
                this[`note_item_` + id] &&
                  this[`note_item_` + id].checkEventTypes(message);
              }
            }
          }
          break;
        default:
      }
    });
  }

  componentDidMount() {}

  componentWillMount() {
    this.events && this.events.unsubscribe();
  }

  getDate = (date) => {
    return moment(date).format('MM/DD/YYYY HH:mm');
  };

  render() {
    const {text, commentText, showCommentBoxIndex} = this.state;
    const {
      data,
      onPost,
      onEdit,
      onDelete,
      showTextBox,
      onAdd,
      onCancel,
      editNoteIndex,
      userData,
      onLikeUnlike,
      isFriend,
      groupMembers,
      onExpand,
    } = this.props;

    return (
      <React.Fragment>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: Colors.black,
              fontFamily: Fonts.regular,
              fontWeight: '400',
              fontSize: normalize(12),
            }}>
            {translate(`pages.xchat.notes`)}{' '}
            <Text
              style={{
                color: '#e26161',
                fontFamily: Fonts.regular,
                fontWeight: '400',
                fontSize: normalize(12),
              }}>
              {data ? data.count : 0}
            </Text>
          </Text>

          <TouchableOpacity
            style={{alignSelf: 'flex-end'}}
            onPress={() => onAdd()}>
            <Image
              source={Icons.plus_icon_select}
              resizeMode={'cover'}
              style={[{height: 20, width: 20}]}
            />
          </TouchableOpacity>
        </View>
        <View>
          {showTextBox && (
            <>
              <TextAreaWithTitle
                onChangeText={(text) => this.setState({text})}
                value={text}
                rightTitle={`${text.length}/300`}
                maxLength={300}
                placeholder={translate('pages.xchat.addNewNote')}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  // flex: 0.5,
                  marginTop: 10,
                  height: 30,
                  width: '100%',
                }}>
                <View
                  style={{
                    marginHorizontal: 5,
                    // width: 60,
                  }}>
                  <Button
                    title={translate('common.cancel')}
                    type={'secondary'}
                    onPress={() => {
                      onCancel();
                      this.setState({text: ''});
                    }}
                    height={30}
                    isRounded={false}
                  />
                </View>
                <View
                  style={{
                    // width: 60,
                    marginHorizontal: 5,
                  }}>
                  <Button
                    title={translate('pages.xchat.post')}
                    type={'primary'}
                    onPress={() => {
                      console.log('post pressed');
                      onPost(text);
                      this.setState({text: ''});
                    }}
                    height={30}
                    isRounded={false}
                    disabled={!text}
                    // loading={isLoading}
                  />
                </View>
              </View>
            </>
          )}
          {data && data.results && data.results.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={data.results}
              renderItem={({item, index}) => (
                <NoteItem
                  onRef={(note) => {
                    this['note_item_' + item.id] = note;
                  }}
                  key={item.id + ''}
                  isFriend={isFriend}
                  index={index}
                  editNote={editNoteIndex === index}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCancel={onCancel}
                  onPost={onPost}
                  onLikeUnlike={onLikeUnlike}
                  groupMembers={groupMembers}
                  onExpand={onExpand}
                />
              )}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
              // ListFooterComponent={() => (
              //   <View>{loading ? <ListLoader /> : null}</View>
              // )}
            />
          ) : (
            !showTextBox && (
              <View>
                <NoData
                  title={translate('pages.xchat.noNotesFound')}
                  style={{paddingBottom: 0}}
                />
                <NoData
                  title={translate('pages.xchat.notesFoundText')}
                  style={{paddingTop: 0}}
                  textStyle={{marginTop: 0}}
                />
              </View>
            )
          )}
        </View>
      </React.Fragment>
    );
  }
}
