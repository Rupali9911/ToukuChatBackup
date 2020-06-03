import React, {Component, Fragment} from 'react';
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
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Switch} from 'react-native-switch';
import {Menu, Divider} from 'react-native-paper';
import {createFilter} from 'react-native-search-filter';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';

import {createChannelStyles} from './styles';
import {globalStyles} from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import {
  ChannelCategoryModal,
  BackgroundImgModal,
} from '../../components/Modals';
import GroupFriend from '../../components/GroupFriend';
import {Images, Icons, Colors, Fonts} from '../../constants';
import Button from '../../components/Button';
import {ListLoader} from '../../components/Loaders';
import {getImage} from '../../utils';
import NoData from '../../components/NoData';
import Toast from '../../components/Toast';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getUserProfile} from '../../redux/reducers/userReducer';
import {
  getUserChannels,
  createNewChannel,
} from '../../redux/reducers/channelReducer';
import {getUserGroups} from '../../redux/reducers/groupReducer';
import {getUserFriends} from '../../redux/reducers/friendReducer';
import RoundedImage from '../../components/RoundedImage';

class CreateChannel extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isManage: false,
      channelName: '',
      about: '',
      about_vip: '',
      searchText: '',
      addedFriends: [],
      isVIP: false,
      channelImagePath: {},
      showCategoryModal: false,
      updateBackgroundMenu: false,
      channelBusinessMenuVisible: false,
      showBackgroundImgModal: false,
      selectedBgItem: {},
      setSelectedBgItem: {},
      selectedChannelCategory: {
        id: 1,
        label: 'onlineSaloon',
        value: 'onlineSaloon',
        isSelected: false,
      },
      channelCategory: [
        {
          id: 1,
          label: 'onlineSaloon',
          value: 'onlineSaloon',
          isSelected: false,
        },
        {
          id: 2,
          label: 'professional',
          value: 'professional',
          isSelected: false,
        },
        {
          id: 3,
          label: 'localBusinesses',
          value: 'localBusinesses',
          isSelected: false,
        },
        {
          id: 4,
          label: 'businesses',
          value: 'businesses',
          isSelected: true,
        },
        {
          id: 5,
          label: 'brands',
          value: 'brands',
          isSelected: false,
        },
        {
          id: 6,
          label: 'book',
          value: 'book',
          isSelected: false,
        },
        {
          id: 7,
          label: 'movies',
          value: 'movies',
          isSelected: false,
        },
        {
          id: 8,
          label: 'music',
          value: 'music',
          isSelected: false,
        },
        {
          id: 9,
          label: 'sports',
          value: 'sports',
          isSelected: false,
        },
        {
          id: 10,
          label: 'television',
          value: 'television',
          isSelected: false,
        },
        {
          id: 11,
          label: 'websites',
          value: 'websites',
          isSelected: false,
        },
      ],
      bgImageList: [
        {id: 1, url: Images.image_cover_1, isSelected: false},
        {id: 2, url: Images.image_cover_2, isSelected: false},
        {id: 3, url: Images.image_cover_3, isSelected: false},
        {id: 4, url: Images.image_cover_4, isSelected: false},
        {id: 5, url: Images.image_cover_5, isSelected: false},
      ],
    };
  }

  toggleModal = () => {
    this.setState({showCategoryModal: !this.state.showCategoryModal});
  };

  toggleChannelBusinessMenu = () => {
    this.setState((prevState) => ({
      channelBusinessMenuVisible: !prevState.channelBusinessMenuVisible,
    }));
  };

  toggleBackgroundImgModal = () => {
    this.setState({
      showBackgroundImgModal: !this.state.showBackgroundImgModal,
    });
    this._closeMenu();
  };

  _openMenu = () => this.setState({updateBackgroundMenu: true});

  _closeMenu = () =>
    this.setState({
      updateBackgroundMenu: false,
      channelBusinessMenuVisible: false,
    });

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  chooseChannelImage = () => {
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
      } else if (response.customButton) {
      } else {
        // let source = response;
        // You can also display the image using data:
        let source = {uri: 'data:image/jpeg;base64,' + response.data};
        this.setState({
          channelImagePath: source,
        });
      }
    });
  };

  chooseChannelBgImage = () => {
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
      } else if (response.customButton) {
      } else {
        // let source = response;
        // You can also display the image using data:
        let source = {uri: 'data:image/jpeg;base64,' + response.data};
        this.setState({
          setSelectedBgItem: {url: source},
        });
      }
    });
  };

  onAdd = (isAdded, data) => {
    if (isAdded) {
      this.state.addedFriends.push(data.user_id);
    } else {
      const index = this.state.addedFriends.indexOf(data.user_id);
      if (index > -1) {
        this.state.addedFriends.splice(index, 1);
      }
    }
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

  onCreateChannel() {
    const {channelName, about, about_vip, isVIP, addedFriends} = this.state;
    if (channelName.trim() === '') {
      Toast.show({
        title: 'Touku',
        text: translate('pages.xchat.toastr.channelNameIsRequired'),
        type: 'primary',
      });
    } else if (about.trim() === '') {
      Toast.show({
        title: 'Touku',
        text: 'About channel is required',
        type: 'primary',
      });
    } else if (addedFriends.length === 0) {
      Toast.show({
        title: 'Touku',
        text: translate('pages.xchat.toastr.channelMemberIsRequired'),
        type: 'primary',
      });
    } else if (isVIP) {
      if (about_vip.trim() === '') {
        Toast.show({
          title: 'Touku',
          text: 'About VIP is required',
          type: 'primary',
        });
      }
    } else {
      let Members = addedFriends.toString();
      let normalChannelData = {
        name: channelName,
        channel_name: 'create_new_channel',
        description: about,
        genre: 2,
        members: Members,
        cover_image:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/image_1588933130327_1.jpg',
        cover_image_thumb:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/thumb_image_1588933130327_1.jpg',
        channel_picture:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/image_1588933136633_1.jpg',
        channel_picture_thumb:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/thumb_image_1588933136633_1.jpg',
        is_vip: false,
        affiliate_follower_amount: 0,
      };

      let vipChannelData = {
        name: channelName,
        channel_name: 'create_new_channel',
        description: about,
        genre: 2,
        members: Members,
        cover_image:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/image_1588933130327_1.jpg',
        cover_image_thumb:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/thumb_image_1588933130327_1.jpg',
        channel_picture:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/image_1588933136633_1.jpg',
        channel_picture_thumb:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/thumb_image_1588933136633_1.jpg',
        is_vip: true,
        monthly_vip_fee: 12,
        vip_description: about_vip,
        affiliate_percent_vip: 1,
        affiliate_follower_amount: 0,
      };

      this.props
        .createNewChannel(isVIP ? vipChannelData : normalChannelData)
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: 'Touku',
              text: translate('pages.xchat.toastr.channelCreatedSuccessfully'),
              type: 'positive',
            });
            this.props.getUserChannels();
            this.props.navigation.goBack();
          }
        })
        .catch((err) => {
          Toast.show({
            title: 'Touku',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
          this.props.navigation.goBack();
        });
    }
  }

  renderUserFriends() {
    const {userFriends, friendLoading} = this.props;
    const filteredFriends = userFriends.filter(
      createFilter(this.state.searchText, ['username']),
    );

    if (filteredFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          data={filteredFriends}
          renderItem={({item, index}) => (
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
    } else {
      return <NoData title={translate('pages.xchat.noFriendFound')} />;
    }
  }

  selectCategory = (id) => {
    this.setState({showCategoryModal: false});
  };

  onSelectBackground = (data, index) => {
    let backgrounds = this.state.bgImageList;
    backgrounds.map((item) => {
      item.isSelected = false;
    });

    backgrounds[index].isSelected = true;

    this.setState({bgImageList: this.state.bgImageList}, () => {
      this.setState({selectedBgItem: this.state.bgImageList[index]});
    });
  };

  onSetBackground() {
    this.setState({setSelectedBgItem: this.state.selectedBgItem});
  }

  onSelectBusiness(data, index) {
    this.toggleChannelBusinessMenu();
    let categories = this.state.channelCategory;
    categories.map((item) => {
      item.isSelected = false;
    });

    categories[index].isSelected = true;

    this.setState({
      channelCategory: this.state.channelCategory,
      selectedChannelCategory: data,
    });
  }

  render() {
    const {
      channelName,
      about,
      about_vip,
      isManage,
      isVIP,
      updateBackgroundMenu,
      channelBusinessMenuVisible,
      setSelectedBgItem,
      channelCategory,
      selectedChannelCategory,
    } = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title="Create New Channel"
          />
          <KeyboardAwareScrollView
            contentContainerStyle={createChannelStyles.mainContainer}
            showsVerticalScrollIndicator={false}>
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.8, y: 0.3}}
              locations={[0.1, 0.5, 1]}
              colors={['#c13468', '#ee2e3b', '#fa573a']}
              style={createChannelStyles.channelImageContainer}>
              <ImageBackground
                style={createChannelStyles.channelCoverContainer}
                source={setSelectedBgItem.url}>
                <View style={createChannelStyles.updateBackgroundContainer}>
                  <Menu
                    visible={updateBackgroundMenu}
                    onDismiss={this._closeMenu}
                    anchor={
                      <TouchableOpacity
                        style={createChannelStyles.updateBackground}
                        onPress={this._openMenu}>
                        <Image
                          source={Icons.icon_edit_pen}
                          style={createChannelStyles.updateBackgroundIcon}
                        />
                      </TouchableOpacity>
                    }>
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
                        this.chooseChannelBgImage();
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
                        source={getImage(this.state.channelImagePath.uri)}
                        resizeMode={'cover'}
                        style={createChannelStyles.profileImage}
                      />
                      <TouchableOpacity
                        onPress={this.chooseChannelImage.bind(this)}
                        style={createChannelStyles.uploadImageButton}>
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
                      onChangeText={(channelName) =>
                        this.setState({channelName})
                      }
                      value={channelName}
                    />
                    <Menu
                      visible={channelBusinessMenuVisible}
                      onDismiss={this._closeMenu}
                      style={{marginVertical: 40}}
                      anchor={
                        <TouchableOpacity
                          style={createChannelStyles.changeChannelContainer}
                          onPress={() => this.toggleChannelBusinessMenu()}>
                          <Text
                            style={createChannelStyles.channelNameText}
                            numberOfLines={1}>
                            {translate(
                              'pages.xchat.' + selectedChannelCategory.label,
                            )}
                          </Text>
                          <Image
                            source={Icons.icon_arrow_down}
                            style={createChannelStyles.channelIcon}
                          />
                        </TouchableOpacity>
                      }>
                      {channelCategory.map((item, key) => {
                        return (
                          <TouchableOpacity
                            onPress={() => this.onSelectBusiness(item, key)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 10,
                            }}>
                            <RoundedImage
                              isRounded={false}
                              source={
                                item.isSelected ? Icons.icon_tick_circle : null
                              }
                              size={24}
                            />
                            <Text
                              style={[
                                globalStyles.normalRegularText,
                                {color: Colors.black, marginStart: 10},
                              ]}>
                              {translate('pages.xchat.' + item.label)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </Menu>
                  </View>
                </View>
              </ImageBackground>
            </LinearGradient>
            <View style={createChannelStyles.tabBar}>
              <TouchableOpacity
                style={[
                  createChannelStyles.tabItem,
                  !isManage && createChannelStyles.tabBarBorder,
                ]}
                onPress={this.onAboutPress}>
                <Text style={createChannelStyles.tabBarTitle}>
                  {translate('pages.xchat.about')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  createChannelStyles.tabItem,
                  isManage && createChannelStyles.tabBarBorder,
                ]}
                onPress={this.onManagePress}>
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
                    onChangeText={(searchText) => this.setState({searchText})}
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
                    rightTitle={about.length + '/4000'}
                    value={about}
                    onChangeText={(about) => this.setState({about})}
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
                    onValueChange={(value) => this.setState({isVIP: value})}
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
                      rightTitle={about_vip.length + '/4000'}
                      value={about_vip}
                      onChangeText={(about_vip) => this.setState({about_vip})}
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
                  <Text style={{fontFamily: Fonts.extralight}}>
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
                onPress={() => this.onCreateChannel()}
                loading={this.props.channelLoading}
              />
              <Button
                type={'translucent'}
                title={translate('common.cancel')}
                onPress={() => this.props.navigation.goBack()}
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
          extraData={this.state}
          toggleBackgroundImgModal={this.toggleBackgroundImgModal}
          backgroudImages={this.state.bgImageList}
          onSelectBackground={(item, index) =>
            this.onSelectBackground(item, index)
          }
          onSetBackground={() => this.onSetBackground()}
        />
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    channelLoading: state.channelReducer.loading,
    userFriends: state.friendReducer.userFriends,
    friendLoading: state.friendReducer.loading,
  };
};

const mapDispatchToProps = {
  getUserProfile,
  getUserChannels,
  getUserGroups,
  getUserFriends,
  createNewChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateChannel);
