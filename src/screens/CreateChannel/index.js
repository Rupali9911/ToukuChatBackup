import React, { Component, Fragment } from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Switch } from 'react-native-switch';
import { Menu, Divider } from 'react-native-paper';

import { createChannelStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import {
  ChannelCategoryModal,
  BackgroundImgModal,
} from '../../components/Modals';
import GroupFriend from '../../components/GroupFriend';
import { Images, Icons, Colors, Fonts } from '../../constants';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getUserProfile } from '../../redux/reducers/userReducer';
import { getUserChannels } from '../../redux/reducers/channelReducer';
import { getUserGroups } from '../../redux/reducers/groupReducer';
import { getUserFriends } from '../../redux/reducers/friendReducer';
import Button from '../../components/Button';
import { ListLoader } from '../../components/Loaders';
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
      filePath: {},
      showCategoryModal: false,
      updateBackgroundMenu: false,
      showBackgroundImgModal: false,
      channelCategory: [
        {
          id: 1,
          name: 'Professional',
          isSelected: false,
        },
        {
          id: 2,
          name: 'Movies',
          isSelected: false,
        },
        {
          id: 3,
          name: 'Music',
          isSelected: false,
        },
        {
          id: 4,
          name: 'Sports',
          isSelected: true,
        },
        {
          id: 5,
          name: 'Television',
          isSelected: false,
        },
        {
          id: 6,
          name: 'Website',
          isSelected: false,
        },
        {
          id: 7,
          name: 'Website',
          isSelected: false,
        },
        {
          id: 8,
          name: 'Website',
          isSelected: false,
        },
        {
          id: 9,
          name: 'Website',
          isSelected: false,
        },
        {
          id: 10,
          name: 'Website',
          isSelected: false,
        },
      ],
      bgImageList: [
        { id: 1, url: Images.image_touku_bg, isSelected: true },
        { id: 2, url: Images.image_touku_bg, isSelected: false },
        { id: 3, url: Images.image_touku_bg, isSelected: false },
        { id: 4, url: Images.image_touku_bg, isSelected: false },
        { id: 5, url: Images.image_touku_bg, isSelected: false },
      ],
    };
  }

  toggleModal = () => {
    this.setState({ showCategoryModal: !this.state.showCategoryModal });
  };

  toggleBackgroundImgModal = () => {
    this.setState({
      showBackgroundImgModal: !this.state.showBackgroundImgModal,
    });
    this._closeMenu();
  };

  _openMenu = () => this.setState({ updateBackgroundMenu: true });

  _closeMenu = () => this.setState({ updateBackgroundMenu: false });

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
    this.setState({
      isManage: false,
    });
  };
  onManagePress = () => {
    this.setState({
      isManage: true,
    });
  };

  renderUserFriends() {
    const { friendLoading } = this.props;
    let friends = [
      {
        id: 1,
        username: 'Jhon Doe',
      },
      {
        id: 2,
        username: 'Jhon Doe',
      },
      {
        id: 3,
        username: 'Jhon Doe',
      },
      {
        id: 4,
        username: 'Jhon Doe',
      },
      {
        id: 5,
        username: 'Jhon Doe',
      },
      {
        id: 6,
        username: 'Jhon Doe',
      },
      {
        id: 7,
        username: 'Jhon Doe',
      },
      {
        id: 8,
        username: 'Jhon Doe',
      },
      {
        id: 9,
        username: 'Jhon Doe',
      },
      {
        id: 10,
        username: 'Jhon Doe',
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

  selectCategory = (id) => {
    console.log('selectCategory -> id', id);
    this.setState({ showCategoryModal: false });
  };

  render() {
    const { userData, userChannels, userGroups, userFriends } = this.props;
    const { about, isManage, isVIP, updateBackgroundMenu } = this.state;
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
            <View style={createChannelStyles.channelImageContainer}>
              <ImageBackground
                style={createChannelStyles.channelCoverContainer}
                source={Images.image_touku_bg}
              >
                <View style={createChannelStyles.updateBackgroundContainer}>
                  <Menu
                    visible={updateBackgroundMenu}
                    onDismiss={this._closeMenu}
                    anchor={
                      <TouchableOpacity
                        style={createChannelStyles.updateBackground}
                        onPress={this._openMenu}
                      >
                        <Image
                          source={Icons.icon_edit_pen}
                          style={createChannelStyles.updateBackgroundIcon}
                        />
                      </TouchableOpacity>
                    }
                  >
                    <Divider />
                    <Menu.Item
                      icon={Icons.icon_camera}
                      onPress={this.toggleBackgroundImgModal}
                      title={translate('pages.xchat.selectDefault')}
                    />
                    <Divider />
                    <Menu.Item
                      icon="desktop-mac"
                      onPress={() => {
                        this._closeMenu();
                      }}
                      title={translate('pages.xchat.yourComputer')}
                    />
                    <Divider />
                  </Menu>
                </View>
                <View style={createChannelStyles.channelInfoContainer}>
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
                      style={createChannelStyles.channelNameInput}
                      placeholder={translate('pages.xchat.channelName')}
                      placeholderTextColor={Colors.white}
                    />
                    <TouchableOpacity
                      style={createChannelStyles.changeChannelContainer}
                      onPress={this.toggleModal}
                    >
                      <Text
                        style={createChannelStyles.channelNameText}
                        numberOfLines={1}
                      >
                        Channel Business
                      </Text>
                      <Image
                        source={Icons.icon_triangle_down}
                        style={createChannelStyles.channelIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
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
                <Text style={createChannelStyles.tabBarTitle}>
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
                <Text style={createChannelStyles.tabBarTitle}>
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
                </View>
                <View style={createChannelStyles.swithContainer}>
                  <Text style={createChannelStyles.VIPText}>
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

                    <View style={createChannelStyles.vipDetails}>
                      <Text style={createChannelStyles.detailHeadingText}>
                        {translate('pages.xchat.vipMonth')}
                      </Text>
                      <Text style={createChannelStyles.detailText}>0 TP</Text>
                    </View>
                  </Fragment>
                )}

                <View style={createChannelStyles.followerDetails}>
                  <Text style={{ fontFamily: Fonts.extralight }}>
                    {translate('pages.xchat.affiliateFollower')}
                  </Text>
                  <Text style={createChannelStyles.detailText}>
                    0 {!isVIP ? 'TP' : '%'}
                  </Text>
                </View>
              </Fragment>
            )}
            <View style={createChannelStyles.buttonContainer}>
              <Button
                type={'primary'}
                title={translate('pages.xchat.create')}
                onPress={() => {}}
              />
              <Button
                type={'transparent'}
                title={translate('common.cancel')}
                onPress={() => {}}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>

        {/* Channel Categoy Modal */}
        <ChannelCategoryModal
          visible={this.state.showCategoryModal}
          category={this.state.channelCategory}
          selectCategory={this.selectCategory}
        />
        {/* Select Background Modal */}
        <BackgroundImgModal
          visible={this.state.showBackgroundImgModal}
          toggleBackgroundImgModal={this.toggleBackgroundImgModal}
          backgroudImages={this.state.bgImageList}
        />
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
