import React, { Component } from 'react';
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
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createFilter } from 'react-native-search-filter';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import { red } from 'color-name';

import { groupDetailStyles } from './styles';
import { globalStyles } from '../../styles';
import { getImage } from '../../utils';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import { Images, Icons, Colors, Fonts } from '../../constants';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import Button from '../../components/Button';
import GroupFriend from '../../components/GroupFriend';
import NoData from '../../components/NoData';
import { ListLoader, ImageLoader } from '../../components/Loaders';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';

import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getUserFriends } from '../../redux/reducers/friendReducer';
import {
  editGroup,
  deleteGroup,
  getUserGroups,
  leaveGroup,
} from '../../redux/reducers/groupReducer';
import Toast from '../../components/Toast';
import { ConfirmationModal } from '../../components/Modals';

const { width, height } = Dimensions.get('window');

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
      isEdit: false,
      showDeleteGroupConfirmationModal: false,
      showLeaveGroupConfirmationModal: false,
      filePath: { uri: this.props.currentGroupDetail.group_picture }, //For Image Picker
      memberOption: [
        {
          title: translate('pages.xchat.admin'),
          onPress: () => {
            this.setAdmin();
          },
        },
        {
          title: translate('pages.xchat.remove'),
          onPress: () => {
            this.removeMember();
          },
        },
      ],
      adminOption: [
        {
          title: translate('pages.xchat.remove'),
          onPress: () => {
            this.removeMember();
          },
        },
      ],
      addOption: [
        {
          title: translate('pages.xchat.admin'),
          onPress: () => {
            this.setAdmin();
          },
        },
        {
          title: translate('pages.xchat.member'),
          onPress: () => {
            this.setMember();
          },
        },
      ],
      dropDownData: null,
    };
  }

  setAdmin = () => {
    console.log('GroupDetails -> setAdmin -> setAdmin');
  };

  setMember = () => {
    console.log('GroupDetails -> setMember -> setMember');
  };

  removeMember = () => {
    console.log('GroupDetails -> removeMember -> removeMember');
  };
  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    for (let admin of this.props.currentGroupDetail.admin_details) {
      if (admin.id === this.props.userData.id) {
        this.props.getUserFriends();
        this.props;
        this.setState({ isMyGroup: true });
      }
    }
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  onAddFriend(isAdded, item) {
    if (isAdded) {
      this.state.addedFriends.push(item.user_id);
    } else {
      const index = this.state.addedFriends.indexOf(item.user_id);
      if (index > -1) {
        this.state.addedFriends.splice(index, 1);
      }
    }
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
          Toast.show({
            title: 'Touku',
            text: translate('common.success'),
            type: 'positive',
          });
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

  onUpdateGroup = () => {
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

    this.props
      .editGroup(this.props.currentGroupDetail.id, editData)
      .then((res) => {
        Toast.show({
          title: translate('pages.xchat.groupDetails'),
          text: translate('pages.xchat.toastr.groupUpdatedSuccessfully'),
          type: 'positive',
        });
        this.setState({ isEdit: false });
      });
  };

  chooseFile = () => {
    var options = {
      title: 'Choose Option',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        // let source = response;
        // You can also display the image using data:
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
        });
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
    const { userFriends, friendLoading } = this.props;
    const { memberOption, adminOption, addOption } = this.state;
    const filteredFriends = userFriends.filter(
      createFilter(this.state.searchText, ['username'])
    );

    if (
      filteredFriends.length &&
      filteredFriends.length === 0 &&
      friendLoading
    ) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          data={filteredFriends}
          renderItem={({ item, index }) => (
            <GroupFriend
              user={item}
              onAddPress={(isAdded) => this.onAddFriend(isAdded, item)}
              isMember={this.isMemberCheck(item.user_id)}
              memberTitle={
                this.isMemberCheck(item.user_id)
                  ? this.isMemberCheck(item.user_id).member_type
                  : translate('pages.xchat.add')
              }
              isRightDropDown
              dropDownData={
                this.isMemberCheck(item.user_id)
                  ? this.isMemberCheck(item.user_id).member_type == 'member'
                    ? memberOption
                    : adminOption
                  : adminOption
              }
            />
          )}
          ListFooterComponent={() => (
            <View>{friendLoading ? <ListLoader /> : null}</View>
          )}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noFriendFound')} />;
    }
  }

  isMemberCheck = (userId) => {
    const { currentGroupMembers } = this.props;
    let memeber = currentGroupMembers.find((member) => member.id === userId);
    // if (memeber) {
    //   this.setState({
    //     dropDownData:
    //       memeber.member_type == 'member'
    //         ? this.state.memberOption
    //         : this.state.addOption,
    //   });
    // } else {
    //   this.setState({
    //     dropDownData: this.state.addOption,
    //   });
    // }
    return memeber;
  };

  render() {
    const {
      isManage,
      isMyGroup,
      isEdit,
      groupName,
      note,
      filePath,
      orientation,
      showDeleteGroupConfirmationModal,
      showLeaveGroupConfirmationModal,
    } = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.groupDetails')}
            isCentered
          />
          <KeyboardAwareScrollView
            contentContainerStyle={groupDetailStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={100}
          >
            <View style={groupDetailStyles.imageContainer}>
              <View style={groupDetailStyles.imageView}>
                {filePath.uri === null ||
                filePath.uri === '' ||
                typeof filePath.uri === undefined ? (
                  <LinearGradient
                    start={{ x: 0.1, y: 0.7 }}
                    end={{ x: 0.5, y: 0.2 }}
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
                    ]}
                  >
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
            {isMyGroup ? (
              <View style={groupDetailStyles.tabBar}>
                <TouchableOpacity
                  style={[
                    groupDetailStyles.tabItem,
                    !isManage && {
                      borderBottomWidth: 5,
                      borderBottomColor: Colors.gradient_2,
                    },
                  ]}
                  onPress={() => {
                    this.setState({ isManage: false });
                  }}
                >
                  <Text
                    style={[
                      groupDetailStyles.tabTitle,
                      {
                        fontFamily: Fonts.regular,
                      },
                    ]}
                  >
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
                    this.setState({ isManage: true });
                  }}
                >
                  <Text
                    style={[
                      groupDetailStyles.tabTitle,
                      {
                        fontFamily: Fonts.regular,
                      },
                    ]}
                  >
                    {translate(`pages.xchat.manage`)}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ height: 20 }} />
            )}
            {isManage ? (
              <React.Fragment>
                <View
                  style={{
                    backgroundColor: Colors.gradient_3,
                    justifyContent: 'center',
                  }}
                >
                  <View style={groupDetailStyles.searchContainer}>
                    <Image
                      source={Icons.icon_search}
                      style={groupDetailStyles.iconSearch}
                    />
                    <TextInput
                      style={[groupDetailStyles.inputStyle]}
                      placeholder={translate('pages.xchat.search')}
                      onChangeText={(searchText) =>
                        this.setState({ searchText })
                      }
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
            ) : (
              <React.Fragment>
                {isEdit ? (
                  isMyGroup && (
                    <View style={{ marginBottom: 10 }}>
                      <InputWithTitle
                        onChangeText={(text) =>
                          this.setState({ groupName: text })
                        }
                        title={translate(`pages.xchat.groupName`)}
                        value={groupName}
                      />

                      <TextAreaWithTitle
                        onChangeText={(text) => this.setState({ note: text })}
                        title={translate(`pages.xchat.note`)}
                        value={note}
                        rightTitle={`${note.length}/3000`}
                        maxLength={3000}
                      />
                    </View>
                  )
                ) : (
                  <React.Fragment>
                    <View style={{ marginBottom: 10 }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text
                          style={{
                            color: Colors.gradient_2,
                            fontSize: 16,
                            fontFamily: Fonts.regular,
                          }}
                        >
                          {translate(`pages.xchat.groupName`)}
                        </Text>
                        {isMyGroup && (
                          <TouchableOpacity
                            style={{}}
                            onPress={() => {
                              this.setState({ isEdit: true });
                            }}
                          >
                            <Image
                              source={Icons.icon_edit_pen}
                              resizeMode={'cover'}
                              style={groupDetailStyles.editIcon}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={{ fontSize: 13, fontFamily: Fonts.light }}>
                        {groupName}
                      </Text>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text
                          style={{
                            color: Colors.gradient_2,
                            fontSize: 16,
                            fontFamily: Fonts.regular,
                          }}
                        >
                          {translate(`pages.xchat.note`)}
                        </Text>
                        {isMyGroup && (
                          <TouchableOpacity
                            style={{}}
                            onPress={() => {
                              this.setState({ isEdit: true });
                            }}
                          >
                            <Image
                              source={Icons.icon_edit_pen}
                              resizeMode={'cover'}
                              style={groupDetailStyles.editIcon}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={{ fontSize: 13, fontFamily: Fonts.light }}>
                        {note}
                      </Text>
                    </View>
                  </React.Fragment>
                )}
                {isMyGroup ? (
                  isEdit && (
                    <React.Fragment>
                      <Button
                        title={translate(`pages.xchat.deleteGroup`)}
                        onPress={this.toggleDeleteGroupConfirmationModal.bind(
                          this
                        )}
                        isRounded={false}
                        type={'secondary'}
                      />
                      <Button
                        title={translate(`pages.xchat.update`)}
                        onPress={this.onUpdateGroup.bind(this)}
                        isRounded={false}
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
        </View>
      </ImageBackground>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails);
