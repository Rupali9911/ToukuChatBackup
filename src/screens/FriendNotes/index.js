import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

import {friendDetailStyles} from './styles';
import {globalStyles} from '../../styles';
import {getImage, eventService, getAvatar, normalize} from '../../utils';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {Images, Icons, Colors, Fonts, SocketEvents} from '../../constants';
import CommonNotes from '../../components/CommonNotes';
import {ListLoader, ImageLoader} from '../../components/Loaders';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getUserFriends} from '../../redux/reducers/friendReducer';
import {
  getFriendNotes,
  postFriendNotes,
  editFriendNotes,
  deleteFriendNotes,
  likeUnlikeNote,
} from '../../redux/reducers/friendReducer';
import Toast from '../../components/Toast';
import {ChangeNameModal, ConfirmationModal} from '../../components/Modals';
import S3uploadService from '../../helpers/S3uploadService';
import moment from 'moment';
import RoundedImage from '../../components/RoundedImage';
import ImageView from 'react-native-image-viewing';
import ChangeFriendDisplayNameModal from '../../components/Modals/ChangeFriendDisplayNameModal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const {width, height} = Dimensions.get('window');

class FriendNotes extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      deleteIndex: null,
      deleteItem: null,
      editNoteIndex: null,
      data: null,
      showDeleteNoteConfirmationModal: false,
      isChangeNameModalVisible: false,
      showTextBox: this.props.navigation.state.params
        ? this.props.navigation.state.params.showAdd
        : false,
        deleteLoading: false,
        showImage: false
    };

    this.S3uploadService = new S3uploadService();

  }

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.props.getFriendNotes(this.props.currentFriend.friend).then((res) => {
      this.setState({
        data: res,
      });
    });
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});

    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });
  }

  componentWillUnmount() {
    this.events.unsubscribe();
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  checkEventTypes(message) {
    const {currentFriend} = this.props;
    switch (message.text.data.type) {
      case SocketEvents.FRIEND_NOTE_DATA: {
        this.hendleFriendNote(message.text.data.message_details.data);
        break;
      }
      case SocketEvents.FRIEND_NOTE_DATA_DELETED: {
        this.hendleDeleteNote(message.text.data.message_details);
        break;
      }
      case SocketEvents.LIKE_OR_UNLIKE_FRIEND_NOTE_DATA:
        this.handleLikeUnlikeNote(message);
        break;
      case SocketEvents.FRIEND_NOTE_COMMENT_DATA:
        this.handleCommentAdd(message);
        break;
      case SocketEvents.DELETE_FRIEND_NOTE_COMMENT:
        this.handleDeleteComment(message);
        break;
    }
  }

  onShowChangeNameModal() {
    this.setState({isChangeNameModalVisible: true});
  }

  hendleFriendNote = (detail) => {
    const {userData, currentFriend} = this.props;
    const {data} = this.state;

    if (detail.friend != currentFriend.friend) {
      return;
    }
    const noteIndex = data.results.findIndex(
      (item, index) => item.id === detail.id,
    );
    if (noteIndex > -1) {
      let updatedNote = data.results[noteIndex];
      updatedNote.text = detail.text;
      updatedNote.updated = moment().format();
      const updatedNotesData = [
        ...data.results.slice(0, noteIndex),
        updatedNote,
        ...data.results.slice(noteIndex + 1),
      ];

      this.setState({
        data: {
          ...data,
          results: updatedNotesData,
        },
      });
      return;
    }
    this.setState({
      data: {
        ...data,
        count: data ? data.count + 1 : 1,
        results:
          data && data.results.length ? [detail, ...data.results] : [detail],
      },
    });
  };

  hendleDeleteNote = (detail) => {
    const {data} = this.state;

    const deleteNoteIndex = data.results.findIndex(
      (item) => item.id == detail.note_id,
    );
    if (deleteNoteIndex === null || deleteNoteIndex === undefined) {
      return;
    }
    this.setState({
      data: {
        ...data,
        count: data.count - 1,
        results: data.results.filter((item, noteIndex) => {
          return deleteNoteIndex !== noteIndex;
        }),
      },
    });
  };

  hendleEditNote = (detail) => {
    const {userData, currentFriend} = this.props;
    const {data} = this.state;

    if (detail.friend != currentFriend.friend) {
      return;
    }
    const noteIndex = data.results.findIndex(
      (item, index) => item.id === detail.id,
    );
    if (noteIndex === null || noteIndex === 'undefined') {
      return;
    }

    let updatedNote = data.results[noteIndex];
    updatedNote.text = detail.text;
    updatedNote.updated = moment().format();
    const updatedNotesData = [
      ...data.results.slice(0, noteIndex),
      updatedNote,
      ...data.results.slice(noteIndex + 1),
    ];

    this.setState({
      data: {
        ...data,
        results: updatedNotesData,
      },
    });
  };

  handleLikeUnlikeNote = (message) => {
    let data = message.text.data.message_details.data;
    if (data) {
      console.log('data', data);
      let array = this.state.data.results;
      let item = array.find((e) => e.id === data.note_id);
      let index = array.indexOf(item);
      if(data.user_id === this.props.userData.id)
        item['is_liked'] = data.like.like;

      item['liked_by_count'] = data.like.like
        ? item.liked_by_count + 1
        : item.liked_by_count - 1;
      array.splice(index, 1, item);
      this.setState({data: {...this.state.data, results: array}});
    }
  };

  handleCommentAdd = (message) => {
    let data = message.text.data.message_details.data;
    if (data) {
      let array = this.state.data.results;
      let item = array.find((e) => e.id === data.friend_note);
      let index = array.indexOf(item);
      item['comment_count'] = item.comment_count + 1;
      array.splice(index, 1, item);
      this.setState({data: {...this.state.data, results: array}});
    }
  };

  handleDeleteComment = (message) => {
    let data = message.text.data.message_details.data;
    if (data) {
      let array = this.state.data.results;
      let item = array.find((e) => e.id === data.note_id);
      let index = array.indexOf(item);
      item['comment_count'] = item.comment_count - 1;
      array.splice(index, 1, item);
      this.setState({data: {...this.state.data, results: array}});
    }
  };

  onCancelDeleteNotePress = () => {
    this.setState({
      showDeleteNoteConfirmationModal: false,
    });
  };

  toggleDeleteNoteConfirmationModal = (index = null, item = null) => {
    this.setState((prevState) => ({
      showDeleteNoteConfirmationModal: !prevState.showDeleteNoteConfirmationModal,
      deleteIndex: index,
      deleteItem: item,
    }));
  };

  onConfirmDeleteNote = () => {
      if (this.state.deleteLoading) return
      this.setState({deleteLoading: true})
    this.onDeleteNote(this.state.deleteIndex, this.state.deleteItem);
  };

  onPostNote = (text) => {
    const {userData, currentFriend} = this.props;
    const {data, editNoteIndex} = this.state;
    if (editNoteIndex !== null) {
      const payload = {
        note_id: data.results[editNoteIndex].id,
        text: text,
      };
      this.props
        .editFriendNotes(payload)
        .then((res) => {
          data.results[editNoteIndex] = res;
          this.setState({
            editNoteIndex: null,
            showTextBox: false,
          });
          Toast.show({
            title: translate('pages.xchat.notes'),
            text: translate('pages.xchat.toastr.noteUpdated'),
            type: 'positive',
          });
          return;
        })
        .catch((err) => {
          Toast.show({
            title: 'Touku',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
      return;
    }
    const payload = {friend: currentFriend.friend, text: text};
    this.props
      .postFriendNotes(payload)
      .then((res) => {
        this.setState({
          data: {
            ...data,
            count: data ? data.count + 1 : 1,
            results:
              data && data.results.length ? [res, ...data.results] : [res],
          },
          showTextBox: false,
        });
        Toast.show({
          title: translate('pages.xchat.notes'),
          text: translate('pages.xchat.toastr.notePosted'),
          type: 'positive',
        });
      })
      .catch((err) => {
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
      });
  };
  onEditNote = (index) => {
    this.setState({
      editNoteIndex: index,
    });
  };
  onDeleteNote = (index, item) => {
    const {data} = this.state;
      if (item && item.id) {
          this.props
              .deleteFriendNotes(item.id)
              .then((res) => {
                  this.setState({
                      data: {
                          ...data,
                          count: data.count - 1,
                          results: data.results.filter((item, noteIndex) => {
                              return noteIndex != index;
                          }),
                      },
                      deleteIndex: null,
                      deleteItem: null,
                      deleteLoading: false
                  });
                  this.toggleDeleteNoteConfirmationModal();
                  Toast.show({
                      title: translate('pages.xchat.notes'),
                      text: translate('pages.xchat.toastr.noteDeleted'),
                      type: 'positive',
                  });
              })
              .catch((err) => {
                  this.setState({deleteLoading: false});
                  Toast.show({
                      title: 'Touku',
                      text: translate('common.somethingWentWrong'),
                      type: 'primary',
                  });
              });
      } else{this.setState({deleteLoading: false});}
  };

  likeUnlike = (note_id, index) => {
    let data = {note_id: note_id};
    this.props
      .likeUnlikeNote(data)
      .then((res) => {
        if (res) {
          // let array = this.state.data.results;
          // let item = array[index];
          // item['is_liked'] = res.like;
          // item['liked_by_count'] = res.like?(item.liked_by_count+1):(item.liked_by_count-1);
          // array.splice(index,1,item);
          // this.setState({data: {...this.state.data, results: array}});
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  onExpand = (id, item) => {
    const {data} = this.state;
    if (data && data.results && data.results.length > 0) {
      let newdata = [];
      data.results.map((item) => {
        if (item.id === id) {
          if (!item.showComment) {
            newdata.push({...item, showComment: true});
          } else if (item.showComment == true) {
            newdata.push({...item, showComment: false});
          }
        } else {
          if (item.showComment === true) {
            newdata.push({...item, showComment: true});
          } else {
            newdata.push({...item, showComment: false});
          }
        }
      });
      if (newdata.length > 0) {
        this.setState({
          data: {
            ...data,
            count: data.count,
            results: newdata,
          },
        });
      }
    }
  };

  hideImage() {
    this.setState({ showImage: false });
  }

  render() {
    const {
      orientation,
      showDeleteNoteConfirmationModal,
      isChangeNameModalVisible,
        deleteLoading,
        showImage
    } = this.state;
    const {currentFriend} = this.props;
    console.log('currentFriend.avatar', currentFriend.avatar);
    return (
      <View
        style={[
          globalStyles.container,
          {
            backgroundColor: Colors.light_pink,
          },
        ]}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.viewProfileDetail')}
          />
          <KeyboardAwareScrollView
            contentContainerStyle={[
              friendDetailStyles.mainContainer,
              {paddingHorizontal: 0},
            ]}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={100}>
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.8, y: 0.3}}
              locations={[0.3, 0.5, 0.8, 1, 1]}
              colors={['#9440a3', '#c13468', '#ee2e3b', '#fa573a', '#fca150']}
              style={{height: 180}}>
              <View style={{flex: 1}}>
                {currentFriend.background_image != '' ? (
                  <ImageLoader
                    style={styles.firstView}
                    source={getImage(
                      currentFriend.background_image,
                    )}></ImageLoader>
                ) : null}
              </View>
            </LinearGradient>

            <View style={{alignSelf: 'center', marginTop: -70}}>
              <RoundedImage
                size={140}
                source={getAvatar(
                  currentFriend.avatar
                    ? currentFriend.avatar
                    : currentFriend.profile_picture,
                )}
                clickable={true}
                onClick={()=>this.setState({showImage: true})}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={[
                  globalStyles.normalSemiBoldText,
                  {
                    color: Colors.black,
                    marginHorizontal: 10,
                    fontSize: normalize(15),
                  },
                ]}>
                {/* {userData.first_name + ' '}
              {userData.last_name} */}
                {currentFriend.display_name}
              </Text>
              <TouchableOpacity>
                <FontAwesome5
                  name={'pencil-alt'}
                  size={20}
                  color={Colors.black}
                  // style={{marginRight: 5}}
                  onPress={() => this.onShowChangeNameModal()}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  globalStyles.smallRegularText,
                  {
                    color: Colors.black,
                    marginBottom: 10,
                    fontSize: normalize(12),
                    fontFamily: Fonts.light,
                  },
                ]}>
                {currentFriend.username}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingTop: 10,
                borderTopColor: Colors.light_gray,
                borderTopWidth: 0.3,
              }}>
              <CommonNotes
                ref={(common_note)=>{this.commonNote = common_note}}
                isFriend={true}
                data={this.state.data}
                onPost={this.onPostNote}
                onEdit={this.onEditNote}
                onDelete={this.toggleDeleteNoteConfirmationModal}
                onAdd={() =>
                  this.setState({
                    showTextBox: true,
                  })
                }
                onCancel={() =>
                  this.setState({
                    showTextBox: false,
                    editNoteIndex: null,
                  })
                }
                onLikeUnlike={this.likeUnlike}
                editNoteIndex={this.state.editNoteIndex}
                showTextBox={this.state.showTextBox}
                userData={this.props.userData}
                onExpand={this.onExpand}
              />
            </View>
          </KeyboardAwareScrollView>
          <ConfirmationModal
            orientation={orientation}
            visible={showDeleteNoteConfirmationModal}
            onCancel={this.onCancelDeleteNotePress.bind(this)}
            onConfirm={this.onConfirmDeleteNote.bind(this)}
            title={translate('pages.xchat.deleteNote')}
            message={translate('pages.xchat.deleteNoteText')}
            isLoading={deleteLoading}
          />
          <ChangeFriendDisplayNameModal
            visible={isChangeNameModalVisible}
            onRequestClose={() =>
              this.setState({isChangeNameModalVisible: false})
            }
          />
          <ImageView
            images={[getAvatar(
              currentFriend.avatar
                ? currentFriend.avatar
                : currentFriend.profile_picture,
            )]}
            imageIndex={0}
            visible={showImage}
            onRequestClose={() => this.hideImage(false)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    display: 'flex',
  },
  Wrapper: {
    width: '80%',
    backgroundColor: 'transparent',
    display: 'flex',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  firstView: {
    height: '100%',
    width: '100%',
  },
  firstBottomView: {
    bottom: 0,
    right: 0,
    position: 'absolute',
    padding: 10,
  },
  centerBottomView: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  iconClose: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.white,
    top: 10,
    right: 10,
    position: 'absolute',
  },
  textNormal: {
    textAlign: 'left',
    color: Colors.black,
  },
  inputTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    currentFriend: state.friendReducer.currentFriend,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  getUserFriends,
  getFriendNotes,
  postFriendNotes,
  editFriendNotes,
  deleteFriendNotes,
  likeUnlikeNote,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendNotes);
