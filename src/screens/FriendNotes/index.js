import React, { Component } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions, ActivityIndicator, ImageBackground,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { globalStyles } from '../../styles';
import { getImage, eventService, getAvatar, normalize } from '../../utils';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import { Images, Icons, Colors, Fonts, SocketEvents } from '../../constants';
import CommonNotes from '../../components/CommonNotes';
import { ListLoader, ImageLoader, OpenLoader } from '../../components/Loaders';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getAnyUserProfile } from '../../redux/reducers/userReducer';
import {
  deleteFriendNotes,
  editFriendNotes,
  getFriendNotes,
  getUserFriends,
  likeUnlikeNote,
  postFriendNotes,
} from '../../redux/reducers/friendReducer';
import Toast from '../../components/Toast';
import { ChangeNameModal, ConfirmationModal } from '../../components/Modals';
import S3uploadService from '../../helpers/S3uploadService';
import moment from 'moment';
import RoundedImage from '../../components/RoundedImage';
import ImageView from 'react-native-image-viewing';
import ChangeFriendDisplayNameModal from '../../components/Modals/ChangeFriendDisplayNameModal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationService from '../../navigation/NavigationService';
import {FloatingAction} from 'react-native-floating-action';

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
      showImage: false,
      otherUserId: this.props.navigation.state.params
        ? this.props.navigation.state.params.id
          ? this.props.navigation.state.params.id
          : null
        : null,
      otherUserData: null,
      isLoading: true,
      activeIndex: 1,
      uploadedFiles: [],
      notesLoading: false,
      mediaSelectionLoading: false,
      tabBarItem: [
        {
          id: 1,
          title: 'chat',
          icon: Icons.icon_chat,
          action: () => this.OnBackAction(),
        },
        {
          id: 2,
          title: 'note',
          icon: Icons.icon_notes,
          action: () => {
            this.setState({ isNotes: true, activeIndex: 1 });
          },
        }
      ],
    };
    this.actions = [
      {
        text: "",
        icon: Icons.icon_camera,
        name: "bt_camera",
        position: 1,
        color: '#e26161',
      },
      {
        text: "",
        icon: Icons.gallery_icon_select,
        name: "bt_gallery",
        position: 2,
        color: '#e26161',
      },
      {
        text: "",
        icon: Icons.icon_edit_pen,
        name: "bt_write",
        position: 3,
        color: '#e26161',
      }
    ];
    this.S3uploadService = new S3uploadService();
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    const { otherUserId } = this.state;
    if (otherUserId) {
      this.props
        .getAnyUserProfile(otherUserId)
        .then((res) => {
          console.log('getAnyUserProfile response', res);
          this.setState({
            otherUserData: res,
            isLoading: false,
          });
        })
        .catch((err) => {
          console.log({ err });
          this.setState({ isLoading: false });
        });
    } else {
      this.setState({ isLoading: false, notesLoading: true });
      this.props
        .getFriendNotes(this.props.currentFriend.friend)
        .then((res) => {
          this.setState({
            data: res,
            notesLoading: false
          });
        })
        .catch((err) => {
          console.log({ err })
          this.setState({notesLoading: false});
        });
    }
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });

    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });
  }

  componentWillUnmount() {
    this.events.unsubscribe();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  checkEventTypes(message) {
    // const {currentFriend} = this.props;
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

  async OnBackAction() {
    this.props.navigation.goBack();
    NavigationService.navigate('FriendChats');
    // if (this.props.navigation.state.params && this.props.navigation.state.params.channelItem.channel_id) {
    //   let channelObj = getChannelsById(this.props.navigation.state.params.channelItem.channel_id);
    //   if (channelObj.length > 0) {
    //     store.dispatch(setCurrentChannel(channelObj[0]));
    //     NavigationService.navigate('ChannelChats');
    //   }
    // } else {
    //   this.props.navigation.goBack();
    // }
  }

  onShowChangeNameModal() {
    this.setState({ isChangeNameModalVisible: true });
  }

  hendleFriendNote = (detail) => {
    const { currentFriend } = this.props;
    const { data } = this.state;

    if (detail.friend !== currentFriend.friend) {
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
    const { data } = this.state;

    const deleteNoteIndex = data.results.findIndex(
      (item) => item.id === detail.note_id,
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
    const { currentFriend } = this.props;
    const { data } = this.state;

    if (detail.friend !== currentFriend.friend) {
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
      if (data.user_id === this.props.userData.id)
        item['is_liked'] = data.like.like;

      item.liked_by_count = data.like.like
        ? item.liked_by_count + 1
        : item.liked_by_count - 1;
      array.splice(index, 1, item);
      this.setState({ data: { ...this.state.data, results: array } });
    }
  };

  handleCommentAdd = (message) => {
    let data = message.text.data.message_details.data;
    if (data) {
      let array = this.state.data.results;
      let item = array.find((e) => e.id === data.friend_note);
      let index = array.indexOf(item);
      item.comment_count = item.comment_count + 1;
      array.splice(index, 1, item);
      this.setState({ data: { ...this.state.data, results: array } });
    }
  };

  handleDeleteComment = (message) => {
    let data = message.text.data.message_details.data;
    if (data) {
      let array = this.state.data.results;
      let item = array.find((e) => e.id === data.note_id);
      let index = array.indexOf(item);
      item.comment_count = item.comment_count - 1;
      array.splice(index, 1, item);
      this.setState({ data: { ...this.state.data, results: array } });
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
    if (this.state.deleteLoading) {
      return;
    }
    this.setState({ deleteLoading: true });
    this.onDeleteNote(this.state.deleteIndex, this.state.deleteItem);
  };

  onPostNote = (text) => {
    const { currentFriend } = this.props;
    const { data, editNoteIndex } = this.state;
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
          console.error(err);
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
      return;
    }
    console.log('currentFriend', currentFriend);
    const payload = { friend: currentFriend.friend, text: text };
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
        console.error(err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
      });
  };
  onEditNote = (index, item) => {
    this.setState({
      editNoteIndex: index,
    });
    // this.props.navigation.navigate('CreateEditNote',{note: Object.assign({},item)});
  };
  onDeleteNote = (index, item) => {
    const { data } = this.state;
    if (item && item.id) {
      this.props
        .deleteFriendNotes(item.id)
        .then((res) => {
          this.setState({
            data: {
              ...data,
              count: data.count - 1,
              results: data.results.filter((_, noteIndex) => {
                return noteIndex !== index;
              }),
            },
            deleteIndex: null,
            deleteItem: null,
            deleteLoading: false,
          });
          this.toggleDeleteNoteConfirmationModal();
          Toast.show({
            title: translate('pages.xchat.notes'),
            text: translate('pages.xchat.toastr.noteDeleted'),
            type: 'positive',
          });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ deleteLoading: false });
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    } else {
      this.setState({ deleteLoading: false });
    }
  };

  likeUnlike = (note_id, index) => {
    let data = { note_id: note_id };
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

  onExpand = (id) => {
    const { data } = this.state;
    if (data && data.results && data.results.length > 0) {
      let newdata = [];
      data.results.map((item) => {
        if (item.id === id) {
          if (!item.showComment) {
            newdata.push({ ...item, showComment: true });
          } else if (item.showComment === true) {
            newdata.push({ ...item, showComment: false });
          }
        } else {
          if (item.showComment === true) {
            newdata.push({ ...item, showComment: true });
          } else {
            newdata.push({ ...item, showComment: false });
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

  onCameraPress = () => {
    this.setState({mediaSelectionLoading: true});
    ImagePicker.openCamera({
      includeBase64: true,
      mediaType: 'photo',
    }).then((image) => {
      let source = {uri: 'data:image/jpeg;base64,' + image.data};
      this.setState({
        uploadFile: source,
        sentMessageType: 'image',
        sendingMedia: true,
        mediaSelectionLoading: false
      });
      this.props.navigation.navigate('CreateEditNote',{uploadedFiles: [image]});
      // this.onMessageSend();
    }).catch((err)=>{
      this.setState({mediaSelectionLoading: false});
    });
  };

  onGalleryPress = async () => {
    this.setState({mediaSelectionLoading: true});
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 30,
      mediaType: 'any',
      includeBase64: true,
    }).then(async (images) => {
      console.log('Images', images)
      this.setState({
        uploadedFiles: [...this.state.uploadedFiles, ...images],
        mediaSelectionLoading: false
      });
      this.props.navigation.navigate('CreateEditNote',{uploadedFiles: [...images]});
      // this.toggleSelectModal(false);
      // this.toggleGalleryModal(true);
    }).catch((err)=>{
      this.setState({mediaSelectionLoading: false});
    });
  };

  returnBgImage(data) {
    return (
      <ImageLoader
        style={styles.firstView}
        source={getImage(data.background_image)}
      />
    );
  }

  render() {
    const {
      orientation,
      showDeleteNoteConfirmationModal,
      isChangeNameModalVisible,
      deleteLoading,
      showImage,
      otherUserData,
      isLoading,
      tabBarItem,
      activeIndex,
      notesLoading,
      mediaSelectionLoading
    } = this.state;
    const { currentFriend } = this.props;
    console.log('currentFriend.avatar', currentFriend.background_image);
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
          {isLoading && (
            <ActivityIndicator
              size={'large'}
              color={Colors.primary}
              style={styles.loader}
            />
          )}
          {!isLoading && (
            <KeyboardAwareScrollView
              contentContainerStyle={[styles.mainContainer, styles.container]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'always'}
              extraScrollHeight={100}>
              <View>
                <LinearGradient
                  start={{ x: 0.1, y: 0.7 }}
                  end={{ x: 0.8, y: 0.3 }}
                  locations={[0.3, 0.5, 0.8, 1, 1]}
                  colors={[
                    '#9440a3',
                    '#c13468',
                    '#ee2e3b',
                    '#fa573a',
                    '#fca150',
                  ]}
                  style={styles.gradientContainer}>
                  <View style={styles.singleFlex}>
                    {otherUserData
                      ? otherUserData.background_image !== ''
                        ? this.returnBgImage(otherUserData)
                        : null
                      : currentFriend.background_image !== ''
                        ? this.returnBgImage(currentFriend)
                        : null}
                  </View>
                </LinearGradient>

                <View style={styles.avatarContainer}>
                  <RoundedImage
                    size={140}
                    source={getAvatar(
                      otherUserData
                        ? otherUserData.avatar
                          ? otherUserData.avatar
                          : otherUserData.profile_picture
                        : currentFriend.avatar
                          ? currentFriend.avatar
                          : currentFriend.profile_picture,
                    )}
                    clickable={true}
                    onClick={() => this.setState({ showImage: true })}
                  />
                </View>
                <View style={styles.displayNameContainer}>
                  <Text
                    style={[
                      globalStyles.normalSemiBoldText,
                      styles.displayNameText,
                    ]}>
                    {otherUserData
                      ? otherUserData.display_name
                      : currentFriend.display_name}
                  </Text>
                  {otherUserData === null && (
                    <TouchableOpacity>
                      <FontAwesome5
                        name={'pencil-alt'}
                        size={20}
                        color={Colors.black}
                        // style={{marginRight: 5}}
                        onPress={() => this.onShowChangeNameModal()}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.usernameContainer}>
                  <Text
                    style={[
                      globalStyles.smallRegularText,
                      styles.usernameText,
                    ]}>
                    {otherUserData
                      ? otherUserData.username
                      : currentFriend.username}
                  </Text>
                </View>
                <View style={styles.tabBar}>
                  {tabBarItem.map((item, index) => {
                    if (item.title === 'chat' && currentFriend.friend_status !== 'ACCEPTED') { return null } else {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.tabItem}
                          onPress={item.action}
                          activeOpacity={activeIndex == index ? 1 : 0.5}>
                          <Image
                            source={item.icon}
                            style={[
                              styles.tabImage,
                              {
                                opacity: activeIndex == index ? 1 : 0.5,
                              },
                            ]}
                            resizeMode={'center'}
                          />
                          <Text
                            style={[
                              styles.tabTitle,
                              {
                                fontFamily: Fonts.regular,
                                opacity: activeIndex == index ? 1 : 0.5
                              },
                            ]}>
                            {translate(`pages.xchat.${item.title}`)}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  })}
                </View>
                {otherUserData === null && (
                  <View style={styles.interactionContainer}>
                    {notesLoading ? 
                      <ListLoader />
                    : <CommonNotes
                      ref={(common_note) => {
                        this.commonNote = common_note;
                      }}
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
                    />}
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView>
          )}
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
              this.setState({ isChangeNameModalVisible: false })
            }
          />
          <ImageView
            images={[
              getAvatar(
                currentFriend.avatar
                  ? currentFriend.avatar
                  : currentFriend.profile_picture,
              ),
            ]}
            imageIndex={0}
            visible={showImage}
            onRequestClose={() => this.hideImage(false)}
          />
        </View>

        {/* Comment below code until not available on production */}
        {/* <FloatingAction
          actions={this.actions}
          onPressItem={name => {
            if (name === 'bt_write') {
              this.props.navigation.navigate('CreateEditNote',{});
            } else if (name === 'bt_gallery') {
              this.onGalleryPress();
              // this.toggleGalleryModal(true);
            } else if (name === 'bt_camera') {
              this.onCameraPress();
            }
          }}
          color={'#e26161'} /> */}
          {mediaSelectionLoading && <OpenLoader hideText={true}/>}
      </View>
    );
  }
}

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
  getAnyUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendNotes);
