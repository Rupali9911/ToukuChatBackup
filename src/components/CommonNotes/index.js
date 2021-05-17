import moment from 'moment';
import React, {Component} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {Icons, SocketEvents, Colors} from '../../constants';
import {translate} from '../../redux/reducers/languageReducer';
import {eventService} from '../../utils';
import Button from '../Button';
import NoData from '../NoData';
import NoteItem from '../NoteItem';
import TextAreaWithTitle from '../TextInputs/TextAreaWithTitle';
import styles from './styles';

export default class CommonNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      commentText: '',
      showCommentBoxIndex: -1,
      addOption: false
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
                this['note_item_' + id] &&
                  this['note_item_' + id].checkEventTypes(message);
              }
            } else {
              let id = data.note_id || data.group_note;
              if (data && id) {
                this['note_item_' + id] &&
                  this['note_item_' + id].checkEventTypes(message);
              }
            }
          }
          break;
        default:
      }
    });
  }

  componentWillMount() {
    this.events && this.events.unsubscribe();
  }

  getDate = (date) => {
    return moment(date).format('MM/DD/YYYY HH:mm');
  };

  render() {
    const {text,addOption} = this.state;
    const {
      data,
      onPost,
      onEdit,
      onDelete,
      showTextBox,
      onAdd,
      onCancel,
      editNoteIndex,
      onLikeUnlike,
      isFriend,
      groupMembers,
      onExpand,
    } = this.props;
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.notes}>
            {translate('pages.xchat.notes')}{' '}
            <Text style={styles.count}>{data ? data.count : 0}</Text>
          </Text>

          {/* Uncomment below code until not available on production */}
          {/* <TouchableOpacity
            style={styles.addIconActionContainer}
            onPress={() => onAdd()}>
            <Image
              source={Icons.plus_icon_select}
              resizeMode={'cover'}
              style={styles.addIcon}
            />
          </TouchableOpacity> */}
        </View>
        <View>
          {showTextBox && (
            <>
              <TextAreaWithTitle
                onChangeText={(note) => this.setState({text: note})}
                value={text}
                rightTitle={`${text.length}/300`}
                maxLength={300}
                placeholder={translate('pages.xchat.addNewNote')}
              />
              <View style={styles.textBoxContainer}>
                <View style={styles.buttonContainer}>
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
                <View style={styles.buttonContainer}>
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
              keyExtractor={(item, index) => `${item.id}`}
              data={data.results}
              nestedScrollEnabled={true}
              style={styles.notesList}
              keyboardShouldPersistTaps={'always'}
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
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              // ListFooterComponent={() => (
              //   <View>{loading ? <ListLoader /> : null}</View>
              // )}
            />
          ) : (
            !showTextBox && (
              <View>
                <NoData
                  title={translate('pages.xchat.noNotesFound')}
                  style={styles.emptyNotesLabel}
                />
                <NoData
                  title={translate('pages.xchat.notesFoundText')}
                  style={styles.emptyNotesFoundText}
                  textStyle={styles.emptyNotesFoundTextStyle}
                />
              </View>
            )
          )}
        </View>
      </>
    );
  }
}
