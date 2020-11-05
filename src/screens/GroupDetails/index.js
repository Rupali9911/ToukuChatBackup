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
import {createFilter} from 'react-native-search-filter';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import {red} from 'color-name';

import {groupDetailStyles} from './styles';
import {globalStyles} from '../../styles';
import {getImage, eventService} from '../../utils';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {Images, Icons, Colors, Fonts, SocketEvents} from '../../constants';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import Button from '../../components/Button';
import GroupFriend from '../../components/GroupFriend';
import NoData from '../../components/NoData';
import CommonNotes from '../../components/CommonNotes';
import {ListLoader, ImageLoader} from '../../components/Loaders';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getUserFriends} from '../../redux/reducers/friendReducer';
import {
  editGroup,
  deleteGroup,
  getUserGroups,
  leaveGroup,
  updateGroupMembers,
  getGroupDetail,
  setCurrentGroupMembers,
  setCurrentGroupDetail,
  getGroupMembers,
  getGroupNotes,
  postGroupNotes,
  editGroupNotes,
  deleteGroupNotes,
} from '../../redux/reducers/groupReducer';
import Toast from '../../components/Toast';
import {ConfirmationModal} from '../../components/Modals';
import S3uploadService from '../../helpers/S3uploadService';
import {ActivityIndicator} from 'react-native-paper';
import moment from 'moment';
const {width, height} = Dimensions.get('window');

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
      data: null,
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
      dropDownData: null,
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
    const {currentGroupDetail} = this.props;
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
        this.props.getUserFriends().then(() => {
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
          this.props.setCurrentGroupMembers(arrTemp1);
          this.setState({loading: false});
        });
      })
      .catch((err) => {
        this.setState({loading: false});
      });
  };

  onAddFriend(isAdded, item) {

  }

  onLeaveGroup = () => {
    this.toggleLeaveGroupConfirmationModal();
  };

  toggleLeaveGroupConfirmationModal = () => {
    this.setState((prevState) => ({
      showLeaveGroupConfirmationModal: !prevState.showLeaveGroupConfirmationModal,
    }));
  };

  onConfirmLeaveGroup = () => {
    const payload = {
      group_id: this.props.currentGroup.group_id,
    };
    this.props
      .leaveGroup(payload)
      .then((res) => {
        if (res.status === true) {
          // Toast.show({
          //   title: 'Touku',
          //   text: translate('common.success'),
          //   type: 'positive',
          // });
          this.props.getUserGroups();
          this.props.navigation.popToTop();
        }
        this.toggleLeaveGroupConfirmationModal();
      })
      .catch((err) => {
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
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
      editData['group_picture'] = group_picture;
      editData['group_picture_thumb'] = group_picture_thumb;
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
          backgroundImagePath: source,
        });

        let file = source.uri;
        let files = [file];
        const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
          files,
        );

        let bgData = {
          // background_image: uploadedImages.image[0].image,
          background_image: uploadedImages.image[0].thumbnail,
        };

        image = uploadedImages.image[0].image;
        thumbnail = uploadedImages.image[0].thumbnail;

        this.onUpdateGroup(image, thumbnail);
        this.setState({filePath: source});
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

  onConfirmDeleteGroup = () => {
    this.toggleDeleteGroupConfirmationModal();
    this.props
      .deleteGroup(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: 'Touku',
            text: translate('pages.xchat.toastr.groupIsRemoved'),
            type: 'positive',
          });
          this.props.getUserGroups();
          this.props.navigation.popToTop();
        }
      })
      .catch((err) => {
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
      });
  };

  renderUserFriends() {
    const {userFriends, friendLoading, currentGroupMembers} = this.props;
    const {memberOption, adminOption, addOption, loading} = this.state;
    let filteredFriends = [];
    if (currentGroupMembers && currentGroupMembers.length > 0) {
      filteredFriends = currentGroupMembers.filter(
        createFilter(this.state.searchText, ['display_name']),
      );
    }

    //console.log('filteredFriends & userFriends', filteredFriends, currentGroupMembers)
    if ((filteredFriends.length && filteredFriends.length === 0) || loading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={filteredFriends}
          renderItem={({item, index}) => (
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
              isRightDropDown={this.state.isMyGroup}
              dropDownData={
                this.isMemberCheck(item.id ? item.id : item.user_Id)
                  ? this.isMemberCheck(item.id ? item.id : item.user_Id)
                      .member_type == 'member'
                    ? memberOption
                    : adminOption
                  : addOption
              }
              memberType={
                this.isMemberCheck(item.id ? item.id : item.user_Id)
                  ? this.isMemberCheck(item.id ? item.id : item.user_Id)
                      .member_type
                  : 'add'
              }
            />
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

  hendleNewNote = (detail) => {
    const {userData, currentGroup} = this.props;
    const {data} = this.state;

    if (detail.group != currentGroup.group_id) {
      return;
    }
    const isNote = data.results.filter((item, index) => {
      return item.id === detail.id;
    });
    if (isNote.length) {
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
    const {userData, currentGroup} = this.props;
    const {data} = this.state;

    if (detail.group_id != currentGroup.group_id) {
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
    this.onDeleteNote(this.state.deleteIndex, this.state.deleteItem);
  };

  onPostNote = (text) => {
    const {userData, currentGroup} = this.props;
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
          Toast.show({
            title: 'Touku',
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
              data && data.results.length ? [res, ...data.results] : [res],
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

    this.props
      .deleteGroupNotes(item.id)
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
        });
        this.toggleDeleteNoteConfirmationModal();
        Toast.show({
          title: translate('pages.xchat.groupDetails'),
          text: translate('pages.xchat.toastr.noteDeleted'),
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

  render() {
    const {
      isManage,
      isAbout,
      isNotes,
      isMyGroup,
      isEdit,
      groupName,
      note,
      filePath,
      orientation,
      showDeleteGroupConfirmationModal,
      showLeaveGroupConfirmationModal,
      showDeleteNoteConfirmationModal,
    } = this.state;
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
            contentContainerStyle={groupDetailStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={100}>
            <View style={groupDetailStyles.imageContainer}>
              <View style={groupDetailStyles.imageView}>
                {filePath.uri === null ||
                filePath.uri === '' ||
                typeof filePath.uri === undefined ? (
                  <LinearGradient
                    start={{x: 0.1, y: 0.7}}
                    end={{x: 0.5, y: 0.2}}
                    locations={[0.1, 0.6, 1]}
                    colors={[
                      Colors.gradient_1,
                      Colors.gradient_2,
                      Colors.gradient_3,
                    ]}
                    style={[
                      groupDetailStyles.profileImage,
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}>
                    <Text style={globalStyles.bigSemiBoldText}>
                      {groupName.charAt(0).toUpperCase()}
                      {/* {secondUpperCase} */}
                    </Text>
                  </LinearGradient>
                ) : (
                  <ImageLoader
                    source={getImage(this.state.filePath.uri)}
                    resizeMode={'cover'}
                    style={groupDetailStyles.profileImage}
                    placeholderStyle={groupDetailStyles.profileImage}
                  />
                )}
              </View>
              {isMyGroup && (
                <TouchableOpacity onPress={this.chooseFile.bind(this)}>
                  <Image
                    source={Icons.icon_edit_pen}
                    resizeMode={'cover'}
                    style={groupDetailStyles.editIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={groupDetailStyles.tabBar}>
              <TouchableOpacity
                style={[
                  groupDetailStyles.tabItem,
                  isAbout && {
                    borderBottomWidth: 5,
                    borderBottomColor: Colors.gradient_2,
                  },
                ]}
                onPress={() => {
                  this.setState({
                    isAbout: true,
                    isManage: false,
                    isNotes: false,
                  });
                }}>
                <Text
                  style={[
                    groupDetailStyles.tabTitle,
                    {
                      fontFamily: Fonts.regular,
                    },
                  ]}>
                  {translate(`pages.xchat.about`)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  groupDetailStyles.tabItem,
                  isManage && {
                    borderBottomWidth: 5,
                    borderBottomColor: Colors.gradient_2,
                  },
                ]}
                onPress={() => {
                  this.setState({
                    isAbout: false,
                    isManage: true,
                    isNotes: false,
                  });
                }}>
                <Text
                  style={[
                    groupDetailStyles.tabTitle,
                    {
                      fontFamily: Fonts.regular,
                    },
                  ]}>
                  {translate(`pages.xchat.manage`)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  groupDetailStyles.tabItem,
                  isNotes && {
                    borderBottomWidth: 5,
                    borderBottomColor: Colors.gradient_2,
                  },
                ]}
                onPress={() => {
                  this.setState({
                    isAbout: false,
                    isManage: false,
                    isNotes: true,
                  });
                }}>
                <Text
                  style={[
                    groupDetailStyles.tabTitle,
                    {
                      fontFamily: Fonts.regular,
                    },
                  ]}>
                  {translate(`pages.xchat.notes`)}
                </Text>
              </TouchableOpacity>
            </View>
            {isManage ? (
              <React.Fragment>
                <View
                  style={{
                    backgroundColor: Colors.gradient_3,
                    justifyContent: 'center',
                  }}>
                  <View style={groupDetailStyles.searchContainer}>
                    <Image
                      source={Icons.icon_search}
                      style={groupDetailStyles.iconSearch}
                    />
                    <TextInput
                      style={[groupDetailStyles.inputStyle]}
                      placeholder={translate('pages.xchat.search')}
                      onChangeText={(searchText) => this.setState({searchText})}
                      returnKeyType={'done'}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      underlineColorAndroid={'transparent'}
                    />
                  </View>
                </View>
                <View style={groupDetailStyles.frindListContainer}>
                  {this.renderUserFriends()}
                </View>
              </React.Fragment>
            ) : isAbout ? (
              <React.Fragment>
                {isEdit ? (
                  isMyGroup && (
                    <View style={{marginBottom: 10}}>
                      <InputWithTitle
                        onChangeText={(text) =>
                          this.setState({groupName: text})
                        }
                        title={translate(`pages.xchat.groupName`)}
                        value={groupName}
                      />

                      <TextAreaWithTitle
                        onChangeText={(text) => this.setState({note: text})}
                        title={translate(`pages.xchat.note`)}
                        value={note}
                        rightTitle={`${note.length}/3000`}
                        maxLength={3000}
                      />
                    </View>
                  )
                ) : (
                  <React.Fragment>
                    <View style={{marginBottom: 10}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            color: Colors.gradient_2,
                            fontSize: 16,
                            fontFamily: Fonts.regular,
                          }}>
                          {translate(`pages.xchat.groupName`)}
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
                              style={groupDetailStyles.editIcon}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={{fontSize: 13, fontFamily: Fonts.light}}>
                        {groupName}
                      </Text>
                    </View>
                    <View style={{marginBottom: 10}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            color: Colors.gradient_2,
                            fontSize: 16,
                            fontFamily: Fonts.regular,
                          }}>
                          {translate(`pages.xchat.note`)}
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
                              style={groupDetailStyles.editIcon}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={{fontSize: 13, fontFamily: Fonts.light}}>
                        {note}
                      </Text>
                    </View>
                  </React.Fragment>
                )}
                {isMyGroup ? (
                  isEdit && (
                    <React.Fragment>
                      <Button
                        title={translate(`pages.xchat.update`)}
                        onPress={this.onUpdateGroup.bind(this)}
                        isRounded={false}
                        fontType={'smallRegularText'}
                        height={40}
                      />
                      <Button
                        title={translate(`pages.xchat.deleteGroup`)}
                        onPress={this.toggleDeleteGroupConfirmationModal.bind(
                          this,
                        )}
                        isRounded={false}
                        type={'secondary'}
                        fontType={'smallRegularText'}
                        height={40}
                      />
                        <Button
                            title={translate(`pages.xchat.deleteGroup`)}
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
                    title={translate(`pages.xchat.leave`)}
                    onPress={() => this.onLeaveGroup()}
                    isRounded={false}
                  />
                )}
              </React.Fragment>
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
                editNoteIndex={this.state.editNoteIndex}
                showTextBox={this.state.showTextBox}
                userData={this.props.userData}
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
          />
          <ConfirmationModal
            orientation={orientation}
            visible={showLeaveGroupConfirmationModal}
            onCancel={this.onCancelPress.bind(this)}
            onConfirm={this.onConfirmLeaveGroup.bind(this)}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.wantToLeaveText')}
          />
          <ConfirmationModal
            orientation={orientation}
            visible={showDeleteNoteConfirmationModal}
            onCancel={this.onCancelDeleteNotePress.bind(this)}
            onConfirm={this.onConfirmDeleteNote.bind(this)}
            title={translate('pages.xchat.deleteNote')}
            message={translate('pages.xchat.deleteNoteText')}
          />
        </View>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails);
