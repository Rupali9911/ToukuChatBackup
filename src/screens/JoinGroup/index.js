import React, {Component} from 'react';
import {
  ActivityIndicator,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
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
import {getImage, eventService, onPressHyperlink, normalize, realmToPlainObject} from '../../utils';
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
import {setCommonChatConversation} from '../../redux/reducers/commonReducer';
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
  setCurrentGroup,
  setGroupConversation,
  getLocalUserGroups,
  likeUnlikeGroupNote,
  getGroupDetailData,
} from '../../redux/reducers/groupReducer';
import Toast from '../../components/Toast';
import {ConfirmationModal} from '../../components/Modals';
import S3uploadService from '../../helpers/S3uploadService';
import HyperLink from 'react-native-hyperlink';
import {
  deleteGroupById,
  deleteAllGroupMessageByGroupId,
  getGroupsById
} from '../../storage/Service';

import moment from 'moment';
import NavigationService from '../../navigation/NavigationService';
const {width, height} = Dimensions.get('window');
class JoinGroup extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      showDeleteGroupConfirmationModal: false,
      showLeaveGroupConfirmationModal: false,
      showDeleteNoteConfirmationModal: false,
      loading: false,
      showTextBox: false,
      isLoading: false,
      data: [],
      joinLoading: false,
      groupDetail: null
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
    this.getGroupDetail();
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
        this.navigateToGroup(message.text.data.message_details.group_id);
        break;
      }
      case SocketEvents.REMOVE_GROUP_MEMBER: {
        this.getGroupMembers(message.text.data.message_details.group_id);
        break;
      }
    }
  }

  getGroupDetail() {
    let group_id = this.props.navigation.state.params && this.props.navigation.state.params.group_id
    this.setState({loading: true});
    this.props.getGroupDetail(group_id)
      .then((res) => {
        this.setState({loading: false});
        if(res){
          if(res.is_group_member){
            Toast.show({
              title: res.name,
              text: translate('pages.xchat.toastr.alreadyAGroupMember'),
              type: 'warning',
            });
            this.navigateToGroup(res.id);
          }else{
            this.setState({groupDetail: res});
          }
        }
      }).catch((err) => {
        this.setState({loading: false});
        console.log('err_getGroupDetail', err);
        let response_error_data = err.response.data;
        if(response_error_data && !response_error_data.status){
          Toast.show({
            title: 'Touku',
            text: translate(response_error_data.message),
            type: 'primary',
          });
        }else{
          Toast.show({
            title: 'Touku',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        }
        this.props.navigation.goBack();
      });
  }

  setMember = (id, type) => {
    const {groupDetail} = this.state;
    let addMemberData = {
      group_id: groupDetail.id,
      members: [id],
      update_type: 1,
      user_type: 2,
    };
    this.setState({joinLoading:true});
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
      console.log('udateGroup res',res);
      Toast.show({
        title: this.state.groupDetail.name,
        text: translate('pages.xchat.toastr.youAreAMemberNow',{groupName: this.state.groupDetail.name}),
        type: 'positive',
      });
      this.setState({joinLoading:false});
    });
  };

  navigateToGroup = (group_id) => {
    if(group_id){
      let groups = realmToPlainObject(getGroupsById(group_id));
      if(groups.length>0){
        let group = groups[0];
        this.props.setCurrentGroup(group);
        NavigationService.pop();
        NavigationService.navigate('GroupChats');
      }
    }
  }

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
        this.setState({loading: false});
      });
  };

  render() {
    const {
      note,
      orientation,
      showDeleteGroupConfirmationModal,
      showLeaveGroupConfirmationModal,
      showDeleteNoteConfirmationModal,
      joinLoading,
      groupDetail,
      loading
    } = this.state;

    return (
      <View
        style={[globalStyles.container, {backgroundColor: Colors.light_pink}]}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.joinGroup')}
            isCentered
          />
          <KeyboardAwareScrollView
            contentContainerStyle={groupDetailStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            extraScrollHeight={100}>
            {loading || groupDetail == null?
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <ActivityIndicator color={Colors.primary} size={'small'} />
              </View>
              :
              groupDetail && <View>
                <View style={groupDetailStyles.imageContainer}>
                  <View style={groupDetailStyles.imageView}>
                    {groupDetail.group_picture === null ||
                      groupDetail.group_picture === '' ||
                      typeof groupDetail.group_picture === undefined ? (
                        <LinearGradient
                          start={{ x: 0.1, y: 0.7 }}
                          end={{ x: 0.5, y: 0.2 }}
                          locations={[0.1, 0.2, 1]}
                          useAngle={true}
                          angle={222.28}
                          colors={[
                            Colors.header_gradient_1,
                            Colors.header_gradient_2,
                            Colors.header_gradient_3,
                          ]}
                          style={[
                            groupDetailStyles.profileImage,
                            {
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <Text style={globalStyles.bigSemiBoldText}>
                            {groupDetail.name.charAt(0).toUpperCase()}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <ImageLoader
                          source={getImage(groupDetail.group_picture)}
                          resizeMode={'cover'}
                          style={groupDetailStyles.profileImage}
                          placeholderStyle={groupDetailStyles.profileImage}
                        />
                      )}
                  </View>
                </View>
                <View style={{  }}>
                  <View style={{ marginBottom: 10, alignSelf:'center' }}>
                    <Text style={{ fontSize: normalize(12), fontFamily: Fonts.light }}>
                      {groupDetail.name}
                    </Text>
                  </View>
                  <View style={{ marginVertical: 10, }}>
                    <Text style={{ fontSize: normalize(11), fontFamily: Fonts.light }}>
                      <Text style={{ color: '#697794' }}>
                        {translate('pages.xchat.totalMembers')}
                      </Text>
                      {' : '+groupDetail.total_members} 
                    </Text>
                  </View>
                  <View style={{width: '70%', alignSelf:'center',marginVertical:10}}>
                    <Button
                      title={translate(`pages.xchat.joinGroup`)}
                      onPress={()=>{this.setMember(this.props.userData.id)}}
                      isRounded={false}
                      fontType={'smallRegularText'}
                      height={40}
                      loading={joinLoading}
                    />
                    <Button
                      title={translate(`common.cancel`)}
                      onPress={()=>{this.props.navigation.goBack();}}
                      isRounded={false}
                      type={'secondary'}
                      fontType={'smallRegularText'}
                      height={40}
                    />
                  </View>
                </View>
              </View>
            }
          </KeyboardAwareScrollView>
          {/* <ConfirmationModal
            orientation={orientation}
            visible={showDeleteGroupConfirmationModal}
            onCancel={this.onCancelDeteleGroup.bind(this)}
            onConfirm={this.onConfirmDeleteGroup.bind(this)}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.toastr.groupWillBeDeleted')}
            isLoading={this.state.isLeaveLoading}
          /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(JoinGroup);
