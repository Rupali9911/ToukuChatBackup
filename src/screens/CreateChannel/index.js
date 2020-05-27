import React, { Component, Fragment } from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  // Switch,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Switch } from 'react-native-switch';
import { createFilter } from 'react-native-search-filter';

import { createChannelStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import GroupFriend from '../../components/GroupFriend';
import { Images, Icons, Colors, Fonts } from '../../constants';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getUserProfile } from '../../redux/reducers/userReducer';
import { getUserChannels } from '../../redux/reducers/channelReducer';
import { getUserGroups } from '../../redux/reducers/groupReducer';
import { getUserFriends } from '../../redux/reducers/friendReducer';
import Button from '../../components/Button';
import { ListLoader } from '../../components/Loaders';
import NoData from '../../components/NoData';
import { getImage } from '../../utils';

class CreateChannel extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isManage: false,
      channelName: '',
      note: '',
      isVIP: false,
      filePath: {}, //For Image Picker
    };
  }

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
  }
  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  onAdd = (id) => {
    console.log('CreateGroupChat -> onAdd -> id', id);
  };

  onAboutPress = () => {
    console.log(
      'CreateChannel -> onAboutPress -> onAboutPress',
      this.state.isManage
    );
    this.setState({
      isManage: false,
    });
  };
  onManagePress = () => {
    console.log(
      'CreateChannel -> onManagePress -> onManagePress',
      this.state.isManage
    );
    this.setState({
      isManage: true,
    });
  };

  renderUserFriends() {
    const { userFriends, friendLoading } = this.props;
    let friends = [
      {
        id: 1,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
      {
        id: 2,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
      {
        id: 3,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
      {
        id: 4,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
      {
        id: 5,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
      {
        id: 6,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
      {
        id: 7,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
      {
        id: 8,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
      {
        id: 9,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
      {
        id: 10,
        username: 'Jhon Doe',
        // profile_picture: Images.image_default_profile,
      },
    ];
    return (
      <FlatList
        data={friends}
        renderItem={({ item, index }) => (
          <GroupFriend
            user={item}
            onAddPress={(isAdded) => this.onAdd(isAdded, item)}
          />
        )}
        ListFooterComponent={() => (
          <View>{friendLoading ? <ListLoader /> : null}</View>
        )}
      />
    );
  }

  render() {
    const { userData, userChannels, userGroups, userFriends } = this.props;
    const { about, channelName, isManage, isVIP } = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title="Create New Channel"
          />
          <KeyboardAwareScrollView
            contentContainerStyle={createChannelStyles.mainContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={createChannelStyles.createContainer}>
              <ImageBackground
                style={{ flex: 1, justifyContent: 'flex-end' }}
                source={Images.image_touku_bg}
              >
                <View
                  style={{
                    flex: 0.6,
                    flexDirection: 'row',
                  }}
                >
                  <View style={createChannelStyles.imageContainer}>
                    <View style={createChannelStyles.imageView}>
                      <Image
                        source={getImage(this.state.filePath.uri)}
                        resizeMode={'cover'}
                        style={createChannelStyles.profileImage}
                      />
                      <TouchableOpacity
                        style={createChannelStyles.uploadImageButton}
                      >
                        <Image
                          source={Icons.icon_edit_pen}
                          resizeMode={'cover'}
                          style={createChannelStyles.uploadImageIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={createChannelStyles.detailView}>
                    <TextInput
                      style={{
                        height: 60,
                        width: '95%',
                        fontSize: 25,
                        marginBottom: '5%',
                        color: Colors.white,
                      }}
                      placeholder={translate('pages.xchat.channelName')}
                      placeholderTextColor={Colors.white}
                    />
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          maxWidth: '80%',
                          marginRight: 5,
                          color: Colors.white,
                        }}
                        numberOfLines={1}
                      >
                        Channel Business
                      </Text>
                      <Image
                        source={Icons.icon_triangle_down}
                        style={{ hight: '1%', width: '3%' }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={createChannelStyles.updateBackground}>
                  <Image
                    source={Icons.icon_edit_pen}
                    resizeMode={'cover'}
                    style={createChannelStyles.updateBackgroundIcon}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View style={createChannelStyles.tabBar}>
              <TouchableOpacity
                style={[
                  createChannelStyles.tabItem,
                  !isManage && createChannelStyles.tabBarBorder,
                ]}
                onPress={this.onAboutPress}
              >
                <Text style={{ fontSize: 16, color: Colors.orange }}>
                  {translate('pages.xchat.about')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  createChannelStyles.tabItem,
                  isManage && createChannelStyles.tabBarBorder,
                ]}
                onPress={this.onManagePress}
              >
                <Text style={{ fontSize: 16, color: Colors.orange }}>
                  {translate('pages.xchat.manage')}
                </Text>
              </TouchableOpacity>
            </View>
            {isManage ? (
              <Fragment>
                <View style={createChannelStyles.searchContainer}>
                  <Image
                    source={Icons.icon_search}
                    style={createChannelStyles.iconSearch}
                  />
                  <TextInput
                    style={[createChannelStyles.inputStyle]}
                    placeholder={translate('pages.xchat.search')}
                    onChangeText={(searchText) => this.setState({ searchText })}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    underlineColorAndroid={'transparent'}
                  />
                </View>
                <View style={createChannelStyles.frindListContainer}>
                  {this.renderUserFriends()}
                </View>
              </Fragment>
            ) : (
              <Fragment>
                <View style={createChannelStyles.inputesContainer}>
                  {/* TextAreaWithTitle */}
                  <TextAreaWithTitle
                    title={translate('pages.xchat.about')}
                    rightTitle={
                      about && about.length > 0 ? about.length : 0 + '/4000'
                    }
                    value={about}
                    onChangeText={(about) => this.setState({ about })}
                    maxLength={4000}
                    extraHeight={200}
                    titleFontColor={Colors.orange}
                    titleFontSize={20}
                  />
                  {/* Search Bar */}
                  {/* <View style={createChannelStyles.searchContainer}>
                <Image
                  source={Icons.icon_search}
                  style={createChannelStyles.iconSearch}
                />
                <TextInput
                  style={[createChannelStyles.inputStyle]}
                  placeholder="Search"
                  onChangeText={this.onChangeText}
                  returnKeyType={'done'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  underlineColorAndroid={'transparent'}
                />
              </View> */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.orange,
                      marginRight: 2,
                      fontSize: 12,
                    }}
                  >
                    {translate('pages.xchat.vip')}
                  </Text>
                  <Switch
                    value={this.state.isVIP}
                    onValueChange={(value) => this.setState({ isVIP: value })}
                    circleSize={18}
                    barHeight={20}
                    innerCircleStyle={{
                      borderColor: Colors.gradient_1,
                    }}
                    circleBorderWidth={0}
                    backgroundActive={Colors.gradient_2}
                    backgroundInactive={Colors.white}
                    circleActiveColor={Colors.gradient_1}
                    circleInActiveColor={Colors.gradient_1}
                    switchLeftPx={2.2}
                    switchRightPx={2.2}
                    switchWidthMultiplier={2.1}
                  />
                </View>

                {isVIP && (
                  <Fragment>
                    <TextAreaWithTitle
                      title={translate('pages.xchat.vipFeature')}
                      rightTitle={
                        about && about.length > 0 ? about.length : 0 + '/4000'
                      }
                      value={about}
                      onChangeText={(about) => this.setState({ about })}
                      maxLength={4000}
                      extraHeight={150}
                      titleFontColor={Colors.orange}
                      titleFontSize={20}
                      isBorder
                    />

                    <View
                      style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginVertical: 10,
                      }}
                    >
                      <Text style={{ fontFamily: Fonts.extralight }}>
                        {translate('pages.xchat.vipMonth')}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.medium,
                          color: Colors.orange,
                        }}
                      >
                        0 TP
                      </Text>
                    </View>
                  </Fragment>
                )}

                <View
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    marginVertical: 20,
                  }}
                >
                  <Text style={{ fontFamily: Fonts.extralight }}>
                    {translate('pages.xchat.affiliateFollower')}
                  </Text>
                  <Text
                    style={{ fontFamily: Fonts.medium, color: Colors.orange }}
                  >
                    0 {!isVIP ? 'TP' : '%'}
                  </Text>
                </View>
              </Fragment>
            )}
            {/* friendList */}
            {/* <View style={createChannelStyles.frindListContainer}>
              <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                <GroupFriend
                  user={{ name: 'Jhon Doe', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(1)}
                />
                <GroupFriend
                  user={{ name: 'Will Parker', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(2)}
                />
                <GroupFriend
                  user={{ name: 'Patrik Shaw', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(3)}
                />
                <GroupFriend
                  user={{ name: 'Jhon Doe', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(4)}
                />
                <GroupFriend
                  user={{ name: 'Will Parker', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(5)}
                />
                <GroupFriend
                  user={{ name: 'Patrik Shaw', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(6)}
                />
                <GroupFriend
                  user={{ name: 'Jhon Doe', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(7)}
                />
                <GroupFriend
                  user={{ name: 'Will Parker', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(8)}
                />
                <GroupFriend
                  user={{ name: 'Patrik Shaw', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(9)}
                />
              </ScrollView>
            </View> */}
            <View style={createChannelStyles.buttonContainer}>
              <Button
                type={'primary'}
                title={translate('pages.xchat.create')}
                onPress={() => this.onSignUpPress()}
              />
              <Button
                type={'transparent'}
                title={translate('common.cancel')}
                onPress={() => this.onLoginPress()}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    userChannels: state.channelReducer.userChannels,
    channelLoading: state.channelReducer.loading,
    userGroups: state.groupReducer.userGroups,
    groupLoading: state.groupReducer.loading,
    userFriends: state.friendReducer.userFriends,
    friendLoading: state.friendReducer.loading,
  };
};

const mapDispatchToProps = {
  getUserProfile,
  getUserChannels,
  getUserGroups,
  getUserFriends,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateChannel);
