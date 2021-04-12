import moment from 'moment';
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../components/Button';
import NoData from '../components/NoData';
import TextAreaWithTitle from '../components/TextInputs/TextAreaWithTitle';
import {Colors, Fonts, Icons, SocketEvents} from '../constants';
import {translate} from '../redux/reducers/languageReducer';
import {eventService, normalize} from '../utils';
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
    const {text} = this.state;
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

          <TouchableOpacity
            style={styles.addIconActionContainer}
            onPress={() => onAdd()}>
            <Image
              source={Icons.plus_icon_select}
              resizeMode={'cover'}
              style={styles.addIcon}
            />
          </TouchableOpacity>
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
              keyExtractor={(item, index) => index.toString()}
              data={data.results}
              nestedScrollEnabled={true}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  notes: {
    color: Colors.black,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(12),
  },
  count: {
    color: '#e26161',
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(12),
  },
  addIconActionContainer: {
    alignSelf: 'flex-end',
  },
  addIcon: {
    height: 20,
    width: 20,
  },
  textBoxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // flex: 0.5,
    marginTop: 10,
    height: 30,
    width: '100%',
  },
  buttonContainer: {
    marginHorizontal: 5,
    // width: 60,
  },
  emptyNotesLabel: {
    paddingBottom: 0,
  },
  emptyNotesFoundText: {
    paddingTop: 0,
  },
  emptyNotesFoundTextStyle: {
    marginTop: 0,
  },
  divider: {
    height: 10,
  },
});
