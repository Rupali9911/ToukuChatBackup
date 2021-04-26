/* eslint-disable react/no-did-mount-set-state */
import moment from 'moment';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HyperLink from 'react-native-hyperlink';
import ImagePicker from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import {createFilter} from 'react-native-search-filter';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import CommonNotes from '../../components/CommonNotes';
import GroupFriend from '../../components/GroupFriend';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {ImageLoader, ListLoader} from '../../components/Loaders';
import {ConfirmationModal} from '../../components/Modals';
import NoData from '../../components/NoData';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import Toast from '../../components/Toast';
import {Colors, Fonts, Icons, SocketEvents} from '../../constants';
import S3uploadService from '../../helpers/S3uploadService';
import {setCommonChatConversation} from '../../redux/reducers/commonReducer';
import {getUserFriends} from '../../redux/reducers/friendReducer';
import {
  deleteGroup,
  deleteGroupNotes,
  editGroup,
  editGroupNotes,
  getGroupDetail,
  getGroupMembers,
  getGroupNotes,
  getLocalUserGroups,
  getUserGroups,
  leaveGroup,
  likeUnlikeGroupNote,
  postGroupNotes,
  setCurrentGroup,
  setCurrentGroupDetail,
  setCurrentGroupMembers,
  setGroupConversation,
  updateGroupMembers,
} from '../../redux/reducers/groupReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {
  deleteAllGroupMessageByGroupId,
  deleteGroupById,
} from '../../storage/Service';
import {globalStyles} from '../../styles';
import {eventService, getImage, onPressHyperlink} from '../../utils';
import styles from './styles';

class GroupDetails extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      groupName: this.props.currentGroupDetail.name,
      note: this.props.currentGroupDetail.description,
      searchText: '',
      addedFriends: [],
      isMyGroup: false,
      isManage: false,
      isNotes: false,
      isAbout: true,
      deleteIndex: null,
      deleteItem: null,
      isEdit: false,
      editNoteIndex: null,
      showDeleteGroupConfirmationModal: false,
      showLeaveGroupConfirmationModal: false,
      showDeleteNoteConfirmationModal: false,
      loading: false,
      filePath: {uri: this.props.currentGroupDetail.group_picture}, //For Image Picker
      showTextBox: false,
      isLoading: false,
      data: [],
      uploadLoading: false,
      memberOption: [
        {
          title: translate('pages.xchat.admin'),
          onPress: (id, type) => {
            this.setAdmin(id, type);
          },
        },
        {
          title: translate('pages.xchat.remove'),
          onPress: (id, type) => {
            this.removeMember(id, type);
          },
        },
      ],
      adminOption: [
        {
          title: translate('pages.xchat.member'),
          onPress: (id, type) => {
            this.setMember(id, type);
          },
        },
        {
          title: translate('pages.xchat.remove'),
          onPress: (id, type) => {
            this.removeMember(id, type);
          },
        },
      ],
      addOption: [
        {
          title: translate('pages.xchat.admin'),
          onPress: (id, type) => {
            this.setAdmin(id, type);
          },
        },
        {
          title: translate('pages.xchat.member'),
          onPress: (id, type) => {
            this.setMember(id, type);
          },
        },
      ],
      NonAdminAddOption: [
        {
          title: translate('pages.xchat.member'),
          onPress: (id, type) => {
            this.setMember(id, type);
          },
        },
      ],
      dropDownData: null,
      manageUsers: [],
      deleteLoading: false,
    };

    this.S3uploadService = new S3uploadService();
    this.isLeaveLoading = false;
  }

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getGroupMembers(this.props.currentGroupDetail.id);
    this.props.getGroupNotes(this.props.currentGroupDetail.id).then((res) => {
      this.setState({
        data: res,
      });
    });
    for (let admin of this.props.currentGroupDetail.admin_details) {
      if (admin.id === this.props.userData.id) {
        //this.props.getUserFriends();
        //this.props;
        this.setState({isMyGroup: true});
      }
    }

    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.isInvite
    ) {
      this.setState({isManage: true, isAbout: false, isNotes: false});
    } else if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.isNotes
    ) {
      this.setState({isManage: false, isAbout: false, isNotes: true});
    }
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
    // const {currentGroupDetail} = this.props;
    switch (message.text.data.type) {
      case SocketEvents.ADD_GROUP_MEMBER: {
        this.getGroupMembers(message.text.data.message_details.group_id);
        break;
      }
      case SocketEvents.REMOVE_GROUP_MEMBER: {
        this.getGroupMembers(message.text.data.message_details.group_id);
        break;
      }
      case SocketEvents.GROUP_MEMBER_TO_ADMIN: {
        this.getGroupMembers(message.text.data.message_details.group_id);
        break;
      }
      case SocketEvents.GROUP_NOTE_DATA: {
        if (message.text.data.message_details.created) {
          console.log(
            'GroupDetails -> checkEventTypes -> message.text.data.message_details.created',
            message.text.data.message_details.created,
          );
          this.hendleNewNote(message.text.data.message_details);
          break;
        } else if (message.text.data.message_details.note_id) {
          console.log(
            'GroupDetails -> checkEventTypes -> message.text.data.message_details.note_id',
            message.text.data.message_details.note_id,
          );
          this.hendleDeleteNote(message.text.data.message_details);
          break;
        }
        this.hendleEditNote(message.text.data.message_details);
        break;
      }
      case SocketEvents.LIKE_OR_UNLIKE_GROUP_NOTE_DATA:
        this.handleLikeUnlikeNote(message);
        break;
      case SocketEvents.GROUP_NOTE_COMMENT_DATA:
        this.handleCommentAdd(message);
        break;
      case SocketEvents.DELETE_GROUP_NOTE_COMMENT:
        this.handleDeleteComment(message);
        break;
    }
  }
  setAdmin = (id, type) => {
    const {currentGroupDetail} = this.props;
    let addAdminData;
    if (type === 'add') {
      addAdminData = {
        group_id: currentGroupDetail.id,
        members: [id],
        update_type: 1,
        user_type: 1,
      };
    } else {
      addAdminData = {
        group_id: currentGroupDetail.id,
        members: [id],
        update_type: 3,
      };
    }
    this.udateGroup(addAdminData);
  };

  setMember = (id, type) => {
    const {currentGroupDetail} = this.props;
    let addMemberData = {
      group_id: currentGroupDetail.id,
      members: [id],
      update_type: 1,
      user_type: 2,
    };
    this.udateGroup(addMemberData);
  };

  removeMember = (id, type) => {
    const {currentGroupDetail} = this.props;
    console.log('currentGroupDetail', currentGroupDetail);
    let removeData;
    if (type === 'admin') {
      removeData = {
        group_id: currentGroupDetail.id,
        members: [id],
        update_type: 2,
        user_type: 1,
      };
    } else {
      removeData = {
        group_id: currentGroupDetail.id,
        members: [id],
        update_type: 2,
        user_type: 2,
      };
    }
    this.udateGroup(removeData);
  };

  udateGroup = (data) => {
    this.props.updateGroupMembers(data).then((res) => {
      //this.getGroupMembers(this.props.currentGroupDetail.id)
      console.log('udateGroup res', res);
      Toast.show({
        title: translate('pages.xchat.groupDetails'),
        text: translate('pages.xchat.toastr.groupUpdatedSuccessfully'),
        type: 'positive',
      });
    });
  };

  getGroupMembers = (id) => {
    this.setState({loading: true});
    this.props
      .getGroupMembers(id)
      .then((responseArray) => {
        // this.props.getUserFriends().then(() => {
        //let arrTemp = [...responseArray, ...this.props.userFriends]

        let arrTemp2 = this.props.userFriends;

        let arrTemp = [...arrTemp2];

        console.log('arrTemp2', arrTemp2, responseArray);
        console.log('responseArray', responseArray);

        responseArray.map((itemRes) => {
          arrTemp2.map((itemUserFriends) => {
            if (itemRes.id === itemUserFriends.user_id) {
              let index = arrTemp.indexOf(itemUserFriends);
              if (index !== -1) {
                console.log('index ', index);
                arrTemp.splice(index, 1);
              }
            }
          });
        });

        let members = responseArray.filter(
          (item) => item.id !== this.props.userData.id,
        );

        let arrTemp1 = [...members, ...arrTemp];
        //console.log('arrTemp1', arrTemp1)
        this.props.setCurrentGroupMembers(responseArray);
        this.setState({loading: false, manageUsers: arrTemp1});
        // })
      })
      .catch((err) => {
        console.error(err);
        this.setState({loading: false});
      });
  };

  onAddFriend(isAdded, item) {}

  onLeaveGroup = () => {
    this.toggleLeaveGroupConfirmationModal();
  };

  toggleLeaveGroupConfirmationModal = () => {
    this.setState((prevState) => ({
      showLeaveGroupConfirmationModal: !prevState.showLeaveGroupConfirmationModal,
    }));
  };

  deleteLocalGroup = (id) => {
    this.props.setCurrentGroup(null);
    this.props.setGroupConversation([]);
    deleteGroupById(id);
    deleteAllGroupMessageByGroupId(id);
    this.props.getLocalUserGroups().then((res) => {
      this.props.setCommonChatConversation();
    });
  };

  onConfirmLeaveGroup = async () => {
    if (this.isLeaveLoading) {
      return;
    }
    this.isLeaveLoading = true;
    await this.setState({isLeaveLoading: true});

    const payload = {
      group_id: this.props.currentGroup.group_id,
    };
    this.props
      .leaveGroup(payload)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: 'TOUKU',
            text: translate(res.message),
            type: 'positive',
          });
          this.deleteLocalGroup(this.props.currentGroup.group_id);
          this.props.getUserGroups();
          this.props.navigation.popToTop();
        }
        this.isLeaveLoading = false;
        this.setState({isLeaveLoading: false});
        this.toggleLeaveGroupConfirmationModal();
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.isLeaveLoading = false;
        this.setState({isLeaveLoading: false});
        this.toggleLeaveGroupConfirmationModal();
      });
  };

  onUpdateGroup = (group_picture, group_picture_thumb) => {
    let editData = {
      group_id: 310,
      name: this.state.groupName,
      company_name: '',
      email: '',
      description: this.state.note,
      genre: '',
      sub_genre: '',
      greeting_text: '',
    };

    console.log('editData', group_picture_thumb);

    if (group_picture_thumb) {
      editData.group_picture = group_picture;
      editData.group_picture_thumb = group_picture_thumb;
    }

    this.props
      .editGroup(this.props.currentGroupDetail.id, editData)
      .then((res) => {
        Toast.show({
          title: translate('pages.xchat.groupDetails'),
          text: translate('pages.xchat.toastr.groupUpdatedSuccessfully'),
          type: 'positive',
        });
        this.setState({isEdit: false});
      });
  };

  chooseFile = () => {
    var options = {
      title: translate('pages.xchat.chooseOption'),
      takePhotoButtonTitle: translate('pages.xchat.takePhoto'),
      chooseFromLibraryButtonTitle: translate('pages.xchat.chooseFromLibrary'),
      // chooseWhichLibraryTitle: translate('pages.xchat.chooseOption'),
      cancelButtonTitle: translate('pages.xchat.cancelChooseOption'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        // let source = response;
        // You can also display the image using data:

        let source = {uri: 'data:image/jpeg;base64,' + response.data};
        this.setState({
          uploadLoading: true,
          // filePath: source,
        });

        let file = source;
        let files = [file];
        const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
          files,
        );

        // let bgData = {
        //   // background_image: uploadedImages.image[0].image,
        //   background_image: uploadedImages.image[0].thumbnail,
        // };

        let image = uploadedImages.image[0].image;
        let thumbnail = uploadedImages.image[0].thumbnail;

        this.onUpdateGroup(image, thumbnail);
        this.setState({filePath: source, uploadLoading: false});
      }
    });
  };

  //Delete Group
  toggleDeleteGroupConfirmationModal = () => {
    this.setState((prevState) => ({
      showDeleteGroupConfirmationModal: !prevState.showDeleteGroupConfirmationModal,
    }));
  };

  onCancelDeteleGroup = () => {
    this.toggleDeleteGroupConfirmationModal();
  };

  onCancelPress = () => {
    this.setState({
      showLeaveGroupConfirmationModal: false,
    });
  };

  onConfirmDeleteGroup = async () => {
    if (this.isLeaveLoading) {
      return;
    }
    this.isLeaveLoading = true;
    await this.setState({isLeaveLoading: true});
    this.props
      .deleteGroup(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: 'TOUKU',
            text: translate('pages.xchat.toastr.groupIsRemoved'),
            type: 'positive',
          });
          this.props.getUserGroups();
          this.props.navigation.popToTop();
        }
        this.isLeaveLoading = false;
        this.setState({isLeaveLoading: false});
        this.toggleDeleteGroupConfirmationModal();
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.isLeaveLoading = false;
        this.setState({isLeaveLoading: false});
        this.toggleDeleteGroupConfirmationModal();
      });
  };

  renderUserFriends() {
    // const {userFriends, friendLoading, currentGroupMembers} = this.props;
    const {
      memberOption,
      adminOption,
      addOption,
      NonAdminAddOption,
      loading,
      manageUsers,
    } = this.state;
    let filteredFriends = [];
    if (manageUsers && manageUsers.length > 0) {
      filteredFriends = manageUsers.filter(
        createFilter(this.state.searchText, ['display_name']),
      );
    }

    //console.log('filteredFriends & userFriends', filteredFriends, currentGroupMembers)
    if (filteredFriends.length && filteredFriends.length === 0 && loading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={filteredFriends}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <GroupFriend
                user={item}
                onAddPress={(isAdded) => this.onAddFriend(isAdded, item)}
                isMember={this.isMemberCheck(item.id ? item.id : item.user_Id)}
                memberTitle={
                  this.isMemberCheck(item.id ? item.id : item.user_Id)
                    ? this.isMemberCheck(item.id ? item.id : item.user_Id)
                        .member_type
                    : translate('pages.xchat.add')
                }
                isRightDropDown={true}
                disableEdit={
                  this.isFounderCheck(item.id ? item.id : item.user_Id) ||
                  (this.isMemberCheck(item.id ? item.id : item.user_Id) &&
                    !this.state.isMyGroup)
                }
                dropDownData={
                  this.isMemberCheck(item.id ? item.id : item.user_Id)
                    ? this.isMemberCheck(item.id ? item.id : item.user_Id)
                        .member_type === 'member'
                      ? this.state.isMyGroup
                        ? memberOption
                        : []
                      : this.state.isMyGroup
                      ? adminOption
                      : []
                    : this.state.isMyGroup
                    ? addOption
                    : NonAdminAddOption
                }
                memberType={
                  this.isMemberCheck(item.id ? item.id : item.user_Id)
                    ? this.isMemberCheck(item.id ? item.id : item.user_Id)
                        .member_type
                    : 'add'
                }
                isSmall={true}
              />
            </View>
          )}
          ListFooterComponent={() => (
            <View>{loading ? <ListLoader /> : null}</View>
          )}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noFriendFound')} />;
    }
  }

  isMemberCheck = (userId) => {
    const {currentGroupMembers} = this.props;
    if (currentGroupMembers && currentGroupMembers.length > 0) {
      let memeber = currentGroupMembers.find((member) => {
        if (member.id && member.id === userId) {
          return true;
        } else if (member.user_id && member.user_id === userId) {
          return true;
        } else {
          return false;
        }
      });
      return memeber;
    }
    return [];
  };

  isFounderCheck = (userId) => {
    const {currentGroupMembers} = this.props;
    if (currentGroupMembers && currentGroupMembers.length > 0) {
      let founderMember = currentGroupMembers.filter(
        (member) => member.id && member.id === userId,
      );
      return founderMember.length > 0 && founderMember[0].is_group_creator;
    }
    return false;
  };

  hendleNewNote = (detail) => {
    const {currentGroup} = this.props;
    const {data} = this.state;

    if (detail.group !== currentGroup.group_id) {
      return;
    }
    const isNote = data.results.filter((item, index) => {
      return item.id === detail.id;
    });
    if (isNote.length) {
      return;
    }

    let detailObj = {...detail, showComment: false};

    this.setState({
      data: {
        ...data,
        count: data ? data.count + 1 : 1,
        results:
          data && data.results && data.results.length
            ? [detailObj, ...data.results]
            : [detailObj],
      },
    });
  };

  hendleDeleteNote = (detail) => {
    const {data} = this.state;

    const deleteNoteIndex = data.results.findIndex(
      (item, index) => item.id === detail.note_id,
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
    const {currentGroup} = this.props;
    const {data} = this.state;

    if (detail.group_id !== currentGroup.group_id) {
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
    let data = message.text.data.message_details;
    if (data) {
      let array = this.state.data.results;
      let item = array.find((e) => e.id === data.note_id);
      let index = array.indexOf(item);
      if (data.user_id === this.props.userData.id) {
        item.is_liked = data.like.like;
      }

      item.liked_by_count = data.like.like
        ? item.liked_by_count + 1
        : item.liked_by_count - 1;
      array.splice(index, 1, item);
      this.setState({data: {...this.state.data, results: array}});
    }
  };

  handleCommentAdd = (message) => {
    let data = message.text.data.message_details;
    if (data) {
      let array = this.state.data.results;
      let item = array.find((e) => e.id === data.group_note);
      let index = array.indexOf(item);
      item.comment_count = item.comment_count + 1;
      array.splice(index, 1, item);
      this.setState({data: {...this.state.data, results: array}});
    }
  };

  handleDeleteComment = (message) => {
    let data = message.text.data.message_details;
    if (data) {
      let array = this.state.data.results;
      let item = array.find((e) => e.id === data.note_id);
      let index = array.indexOf(item);
      item.comment_count = item.comment_count - 1;
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
    if (this.state.deleteLoading) {
      return;
    }
    this.setState({deleteLoading: true});
    this.onDeleteNote(this.state.deleteIndex, this.state.deleteItem);
  };

  onPostNote = (text) => {
    const {currentGroup} = this.props;
    const {data, editNoteIndex} = this.state;
    if (editNoteIndex !== null) {
      const payload = {
        group_id: currentGroup.group_id,
        text: text,
        created_by: data.results[editNoteIndex].created_by,
        id: data.results[editNoteIndex].id,
      };
      this.props
        .editGroupNotes(payload)
        .then((res) => {
          console.log('onPostNote -> edit notes res', res);
          data.results[editNoteIndex] = res;
          // data.results[
          //   editNoteIndex
          // ].updated = moment().format();
          this.setState({
            editNoteIndex: null,
            showTextBox: false,
          });
          Toast.show({
            title: translate('pages.xchat.groupDetails'),
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

    const payload = {group: currentGroup.group_id, text: text};

    this.props
      .postGroupNotes(payload)
      .then((res) => {
        this.setState({
          data: {
            ...data,
            count: data ? data.count + 1 : 1,
            results:
              data && data.results && data.results.length
                ? [res, ...data.results]
                : [res],
          },
          showTextBox: false,
        });
        Toast.show({
          title: translate('pages.xchat.groupDetails'),
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
  onEditNote = (index) => {
    this.setState({
      editNoteIndex: index,
    });
  };
  onDeleteNote = (index, item) => {
    const {data} = this.state;
    if (item && item.id) {
      this.props
        .deleteGroupNotes(item.id)
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
          setTimeout(() => {
            Toast.show({
              title: translate('pages.xchat.groupDetails'),
              text: translate('pages.xchat.toastr.noteDeleted'),
              type: 'positive',
            });
          }, 100);
        })
        .catch((err) => {
          console.error(err);
          this.setState({deleteLoading: false});
          this.toggleDeleteNoteConfirmationModal();
          setTimeout(() => {
            Toast.show({
              title: 'TOUKU',
              text: translate('common.somethingWentWrong'),
              type: 'primary',
            });
          }, 100);
        });
    } else {
      this.setState({deleteLoading: false});
    }
  };

  likeUnlike = (note_id, index) => {
    let data = {note_id: note_id};
    this.props
      .likeUnlikeGroupNote(data)
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
    const {data} = this.state;
    if (data && data.results && data.results.length > 0) {
      let newdata = [];
      data.results.map((item) => {
        if (item.id === id) {
          if (!item.showComment) {
            newdata.push({...item, showComment: true});
          } else if (item.showComment === true) {
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

  render() {
    const {
      isManage,
      isAbout,
      isNotes,
      isMyGroup,
      isEdit,
      groupName,
      note,
      orientation,
      showDeleteGroupConfirmationModal,
      showLeaveGroupConfirmationModal,
      showDeleteNoteConfirmationModal,
      uploadLoading,
      deleteLoading,
    } = this.state;

    let filePath = {uri: this.props.currentGroupDetail.group_picture};

    return (
      <View
        style={[globalStyles.container, {backgroundColor: Colors.light_pink}]}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.groupDetails')}
            isCentered
          />
          <KeyboardAwareScrollView
            contentContainerStyle={styles.mainContainer}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            extraScrollHeight={100}>
            <View style={styles.imageContainer}>
              <View style={styles.imageView}>
                {uploadLoading ? (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator color={Colors.primary} size={'small'} />
                  </View>
                ) : filePath.uri === null ||
                  filePath.uri === '' ||
                  typeof filePath.uri === undefined ? (
                  <LinearGradient
                    start={{x: 0.1, y: 0.7}}
                    end={{x: 0.5, y: 0.2}}
                    locations={[0.1, 0.2, 1]}
                    useAngle={true}
                    angle={222.28}
                    colors={[
                      Colors.header_gradient_1,
                      Colors.header_gradient_2,
                      Colors.header_gradient_3,
                    ]}
                    style={[styles.profileImage, styles.gradientContainer]}>
                    <Text style={globalStyles.bigSemiBoldText}>
                      {groupName.charAt(0).toUpperCase()}
                      {/* {secondUpperCase} */}
                    </Text>
                  </LinearGradient>
                ) : (
                  <ImageLoader
                    source={getImage(filePath.uri)}
                    resizeMode={'cover'}
                    style={styles.profileImage}
                    placeholderStyle={styles.profileImage}
                  />
                )}
              </View>
              {isMyGroup && (
                <TouchableOpacity onPress={this.chooseFile.bind(this)}>
                  <Image
                    source={Icons.icon_edit_pen}
                    resizeMode={'cover'}
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, isAbout && styles.actionContainer]}
                onPress={() => {
                  this.setState({
                    isAbout: true,
                    isManage: false,
                    isNotes: false,
                  });
                }}>
                <Text
                  style={[
                    styles.tabTitle,
                    {
                      fontFamily: Fonts.regular,
                    },
                  ]}>
                  {translate('pages.xchat.aboutGroup')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabItem, isManage && styles.actionContainer]}
                onPress={() => {
                  this.setState({
                    isAbout: false,
                    isManage: true,
                    isNotes: false,
                  });
                }}>
                <Text
                  style={[
                    styles.tabTitle,
                    {
                      fontFamily: Fonts.regular,
                    },
                  ]}>
                  {translate('pages.xchat.manage')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabItem, isNotes && styles.actionContainer]}
                onPress={() => {
                  this.setState({
                    isAbout: false,
                    isManage: false,
                    isNotes: true,
                  });
                }}>
                <Text
                  style={[
                    styles.tabTitle,
                    {
                      fontFamily: Fonts.regular,
                    },
                  ]}>
                  {translate('pages.xchat.notes')}
                </Text>
              </TouchableOpacity>
            </View>
            {isManage ? (
              <React.Fragment>
                <View style={styles.searchWrapper}>
                  <View style={styles.searchContainer}>
                    <Image
                      source={Icons.icon_search}
                      style={styles.iconSearch}
                    />
                    <TextInput
                      style={[styles.inputStyle]}
                      placeholder={translate('pages.xchat.search')}
                      placeholderTextColor={'gray'}
                      onChangeText={(searchText) => this.setState({searchText})}
                      returnKeyType={'done'}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      underlineColorAndroid={'transparent'}
                    />
                  </View>
                </View>
                <View style={styles.friendListContainer}>
                  {this.renderUserFriends()}
                </View>
              </React.Fragment>
            ) : isAbout ? (
              <View style={styles.aboutContainer}>
                {isEdit ? (
                  isMyGroup && (
                    <View style={styles.groupContainer}>
                      <InputWithTitle
                        onChangeText={(text) =>
                          this.setState({groupName: text})
                        }
                        title={translate('pages.xchat.groupName')}
                        value={groupName}
                      />

                      <TextAreaWithTitle
                        onChangeText={(text) => this.setState({note: text})}
                        title={translate('pages.xchat.description')}
                        value={note}
                        rightTitle={`${note.length}/3000`}
                        titleFontColor={Colors.gradient_2}
                        maxLength={3000}
                      />
                    </View>
                  )
                ) : (
                  <React.Fragment>
                    <View style={styles.groupContainer}>
                      <View style={styles.editContainer}>
                        <Text style={styles.nameStyle}>
                          {translate('pages.xchat.groupName')}
                        </Text>
                        {isMyGroup && (
                          <TouchableOpacity
                            style={{}}
                            onPress={() => {
                              this.setState({isEdit: true});
                            }}>
                            <Image
                              source={Icons.icon_edit_pen}
                              resizeMode={'cover'}
                              style={styles.editIcon}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={styles.textStyle}>{groupName}</Text>
                    </View>
                    <View style={styles.groupContainer}>
                      <View style={styles.editContainer}>
                        <HyperLink
                          onPress={(url) => {
                            onPressHyperlink(url);
                          }}
                          linkStyle={styles.hyperlinkStyle}>
                          <Text style={styles.nameStyle}>
                            {translate('pages.xchat.description')}
                          </Text>
                        </HyperLink>
                        {isMyGroup && (
                          <TouchableOpacity
                            style={{}}
                            onPress={() => {
                              this.setState({isEdit: true});
                            }}>
                            <Image
                              source={Icons.icon_edit_pen}
                              resizeMode={'cover'}
                              style={styles.editIcon}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={styles.textStyle}>{note}</Text>
                    </View>
                  </React.Fragment>
                )}
                {isMyGroup ? (
                  isEdit && (
                    <React.Fragment>
                      <Button
                        title={translate('pages.xchat.update')}
                        onPress={this.onUpdateGroup.bind(this)}
                        isRounded={false}
                        fontType={'smallRegularText'}
                        height={40}
                      />
                      <Button
                        title={translate('pages.xchat.deleteGroup')}
                        onPress={this.toggleDeleteGroupConfirmationModal.bind(
                          this,
                        )}
                        isRounded={false}
                        type={'secondary'}
                        fontType={'smallRegularText'}
                        height={40}
                      />
                    </React.Fragment>
                  )
                ) : (
                  <Button
                    title={translate('pages.xchat.leave')}
                    onPress={() => this.onLeaveGroup()}
                    isRounded={false}
                  />
                )}
              </View>
            ) : (
              <CommonNotes
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
                groupMembers={this.props.currentGroupMembers}
                onExpand={this.onExpand}
              />
            )}
          </KeyboardAwareScrollView>
          <ConfirmationModal
            orientation={orientation}
            visible={showDeleteGroupConfirmationModal}
            onCancel={this.onCancelDeteleGroup.bind(this)}
            onConfirm={this.onConfirmDeleteGroup.bind(this)}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.toastr.groupWillBeDeleted')}
            isLoading={this.state.isLeaveLoading}
          />
          <ConfirmationModal
            orientation={orientation}
            visible={showLeaveGroupConfirmationModal}
            onCancel={this.onCancelPress.bind(this)}
            onConfirm={this.onConfirmLeaveGroup.bind(this)}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.wantToLeaveText')}
            isLoading={this.state.isLeaveLoading}
          />
          <ConfirmationModal
            orientation={orientation}
            visible={showDeleteNoteConfirmationModal}
            onCancel={this.onCancelDeleteNotePress.bind(this)}
            onConfirm={this.onConfirmDeleteNote.bind(this)}
            title={translate('pages.xchat.deleteNote')}
            message={translate('pages.xchat.deleteNoteText')}
            isLoading={deleteLoading}
          />
        </View>
        <SafeAreaView />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    friendLoading: state.friendReducer.loading,
    userFriends: state.friendReducer.userFriends,
    userData: state.userReducer.userData,
    currentGroupDetail: state.groupReducer.currentGroupDetail,
    currentGroup: state.groupReducer.currentGroup,
    currentGroupMembers: state.groupReducer.currentGroupMembers,
  };
};

const mapDispatchToProps = {
  getUserFriends,
  editGroup,
  deleteGroup,
  getUserGroups,
  leaveGroup,
  updateGroupMembers,
  getGroupMembers,
  getGroupDetail,
  setCurrentGroupDetail,
  setCurrentGroupMembers,
  getGroupNotes,
  postGroupNotes,
  editGroupNotes,
  deleteGroupNotes,
  setCurrentGroup,
  setGroupConversation,
  getLocalUserGroups,
  setCommonChatConversation,
  likeUnlikeGroupNote,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails);
