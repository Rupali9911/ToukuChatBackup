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
import {Menu, Divider} from 'react-native-paper';
import {createFilter} from 'react-native-search-filter';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';

import styles from './styles';
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
import SwitchCustom from '../../components/SwitchCustom';

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
      isPastPost: false,
      channelImagePath: {},
      showCategoryModal: false,
      updateBackgroundMenu: false,
      channelBusinessMenuVisible: false,
      showBackgroundImgModal: false,
      selectedBgItem: {},
      setSelectedBgItem: {},
      vipPerMonth: 0,
      affiliateReward: 0,
      status: '',
      showStatusCount: false,
      selectedChannelCategory: {
        id: 1,
        label: 'onlineSaloon',
        value: 'onlineSaloon',
        isSelected: true,
      },
      channelCategory: [
        {
          id: 1,
          label: 'onlineSaloon',
          value: 'onlineSaloon',
          isSelected: true,
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
          isSelected: false,
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
        {
          id: 1,
          uri: 'https://touku.angelium.net/assets/images/cover/1.jpg',
          isSelected: false,
        },
        {
          id: 2,
          uri: 'https://touku.angelium.net/assets/images/cover/2.jpg',
          isSelected: false,
        },
        {
          id: 3,
          uri: 'https://touku.angelium.net/assets/images/cover/3.jpg',
          isSelected: false,
        },
        {
          id: 4,
          uri: 'https://touku.angelium.net/assets/images/cover/4.jpg',
          isSelected: false,
        },
        {
          id: 5,
          uri: 'https://touku.angelium.net/assets/images/cover/5.jpg',
          isSelected: false,
        },
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
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
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
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        // let source = response;
        // You can also display the image using data:
        let source = {uri: 'data:image/jpeg;base64,' + response.data};
        this.setState({
          setSelectedBgItem: source,
        });
      }
    });
  };

  onAdd = (isAdded, data) => {
    const {addedFriends} = this.state;
    if (isAdded) {
      if (!addedFriends.includes(data.user_id)) {
        this.setState({
          addedFriends: [...addedFriends, data.user_id],
        });
      }
    } else {
      const index = this.state.addedFriends.indexOf(data.user_id);

      const newList = addedFriends
        .slice(0, index)
        .concat(addedFriends.slice(index + 1, addedFriends.length));
      this.setState({
        addedFriends: newList,
      });
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

  getNormalChannelData() {
    const {channelName, about, status, addedFriends, isVIP} = this.state;
    let Members = addedFriends.toString();

    let normalChannelData = {
      name: channelName,
      channel_name: 'create_new_channel',
      is_vip: isVIP,
    };
    if (about.trim() !== '') {
      normalChannelData.discription = about;
    }
    if (status.trim() !== '') {
      normalChannelData.channel_status = status;
    }
    if (addedFriends.length > 0) {
      normalChannelData.members = Members;
    }
    return normalChannelData;
  }

  getVipChannelData() {
    const {
      channelName,
      about,
      about_vip,
      status,
      addedFriends,
      isVIP,
      vipPerMonth,
      affiliateReward,
    } = this.state;
    let Members = addedFriends.toString();

    let vipChannelData = {
      name: channelName,
      channel_name: 'create_new_channel',
      is_vip: isVIP,
    };
    if (about.trim() !== '') {
      vipChannelData.discription = about;
    }
    if (status.trim() !== '') {
      vipChannelData.channel_status = status;
    }
    if (addedFriends.length > 0) {
      vipChannelData.members = Members;
    }
    if (isVIP) {
      vipChannelData.monthly_vip_fee = vipPerMonth;
      vipChannelData.affiliate_percent_vip = affiliateReward;
      vipChannelData.affiliate_follower_amount = 0;
    }
    if (isVIP && about_vip !== '') {
      vipChannelData.vip_description = about_vip;
    }
    return vipChannelData;
  }

  onCreateChannel() {
    const {channelName, isVIP} = this.state;
    if (channelName.trim() === '') {
      Toast.show({
        title: 'TOUKU',
        text: translate('pages.xchat.toastr.channelNameIsRequired'),
        type: 'primary',
      });
    } else {
      this.props
        .createNewChannel(
          isVIP ? this.getVipChannelData() : this.getNormalChannelData(),
        )
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.xchat.toastr.channelCreatedSuccessfully'),
              type: 'positive',
            });
            this.props.getUserChannels();
            this.props.navigation.goBack();
          }
        })
        .catch((err) => {
          console.log('CreateChannel -> onCreateChannel -> err', err);
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
          this.props.navigation.goBack();
        });
    }
  }

  renderUserFriends() {
    const {userFriends, friendLoading} = this.props;
    const {addedFriends} = this.state;
    const filteredFriends = userFriends.filter(
      createFilter(this.state.searchText, ['display_name']),
    );

    if (filteredFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps={'handled'}
          behavior={'position'}
          data={filteredFriends}
          renderItem={({item, index}) => (
            <GroupFriend
              user={item}
              onAddPress={(isAdded) => this.onAdd(isAdded, item)}
              isRightButton
              isSelected={addedFriends.includes(item.user_id)}
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

  focusedInput = (input) => {
    if (input === 'channelName') {
      this.channelNameTextInput.setNativeProps({
        style: {
          borderWidth: 1,
          borderColor: Colors.white,
        },
      });
      return;
    }
    this.statusTextInput.setNativeProps({
      style: {
        borderWidth: 1,
        borderColor: Colors.white,
      },
    });
    this.setState({showStatusCount: true});
  };

  blurredInput = (input) => {
    if (input === 'channelName') {
      this.channelNameTextInput.setNativeProps({
        style: {borderWidth: 0},
      });
      return;
    }
    this.statusTextInput.setNativeProps({
      style: {borderWidth: 0},
    });
    this.setState({showStatusCount: false});
  };

  render() {
    const {
      channelName,
      status,
      showStatusCount,
      about,
      about_vip,
      isManage,
      isVIP,
      updateBackgroundMenu,
      setSelectedBgItem,
      affiliateReward,
      vipPerMonth,
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
            scrollEnabled
            // enableOnAndroid={true}
            keyboardShouldPersistTaps={'handled'}
            // extraScrollHeight={100}
            extraHeight={100}
            behavior={'position'}
            contentContainerStyle={styles.mainContainer}
            showsVerticalScrollIndicator={false}>
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.8, y: 0.3}}
              locations={[0.1, 0.5, 1]}
              colors={['#c13468', '#ee2e3b', '#fa573a']}
              style={styles.channelImageContainer}>
              <ImageBackground
                style={styles.channelCoverContainer}
                source={{uri: setSelectedBgItem.uri}}>
                <View style={styles.updateBackgroundContainer}>
                  <Menu
                    visible={updateBackgroundMenu}
                    onDismiss={this._closeMenu}
                    anchor={
                      <TouchableOpacity
                        style={styles.updateBackground}
                        onPress={this._openMenu}>
                        <Image
                          source={Icons.icon_edit_pen}
                          style={styles.updateBackgroundIcon}
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
                <View style={styles.channelInfoContainer}>
                  <View style={styles.imageContainer}>
                    <View style={styles.imageView}>
                      <Image
                        source={getImage(this.state.channelImagePath.uri)}
                        resizeMode={'cover'}
                        style={styles.profileImage}
                      />
                      <TouchableOpacity
                        onPress={this.chooseChannelImage.bind(this)}
                        style={styles.uploadImageButton}>
                        <Image
                          source={Icons.icon_edit_pen}
                          resizeMode={'cover'}
                          style={styles.uploadImageIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.detailView}>
                    <TextInput
                      style={styles.channelNameInput}
                      placeholder={translate('pages.xchat.channelName')}
                      placeholderTextColor={Colors.white}
                      onChangeText={(cName) => this.setState({cName})}
                      ref={(refInput) => {
                        this.channelNameTextInput = refInput;
                      }}
                      onFocus={() => this.focusedInput('channelName')}
                      onBlur={() => this.blurredInput('channelName')}
                      value={channelName}
                    />

                    {/* <View> */}
                    {showStatusCount && (
                      <Text style={styles.statusCount}>{status.length}/20</Text>
                    )}
                    <TextInput
                      style={styles.channelNameInput}
                      placeholder={translate('pages.xchat.status')}
                      placeholderTextColor={Colors.white}
                      maxLength={20}
                      onChangeText={(name) => this.setState({status: name})}
                      ref={(nameRef) => {
                        this.statusTextInput = nameRef;
                      }}
                      onFocus={() => this.focusedInput('status')}
                      onBlur={() => this.blurredInput('status')}
                      value={status}
                    />
                    {/* </View> */}
                    {/* <Menu
                      visible={channelBusinessMenuVisible}
                      onDismiss={this._closeMenu}
                      style={{ marginVertical: 40 }}
                      anchor={
                        <TouchableOpacity
                          style={createChannelStyles.changeChannelContainer}
                          onPress={() => this.toggleChannelBusinessMenu()}
                        >
                          <Text
                            style={createChannelStyles.channelNameText}
                            numberOfLines={1}
                          >
                            {translate(
                              'pages.xchat.' + selectedChannelCategory.label
                            )}
                          </Text>
                          <Image
                            source={Icons.icon_triangle_down}
                            style={createChannelStyles.channelIcon}
                          />
                        </TouchableOpacity>
                      }
                    >
                      {channelCategory.map((item, key) => {
                        return (
                          <TouchableOpacity
                            onPress={() => this.onSelectBusiness(item, key)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 10,
                            }}
                          >
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
                                { color: Colors.black, marginStart: 10 },
                              ]}
                            >
                              {translate('pages.xchat.' + item.label)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </Menu> */}
                  </View>
                </View>
              </ImageBackground>
            </LinearGradient>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, !isManage && styles.tabBarBorder]}
                onPress={this.onAboutPress}>
                <Text
                  style={[
                    styles.tabBarTitle,
                    isManage && {fontFamily: Fonts.regular},
                  ]}>
                  {translate('pages.xchat.about')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabItem, isManage && styles.tabBarBorder]}
                onPress={this.onManagePress}>
                <Text
                  style={[
                    styles.tabBarTitle,
                    !isManage && {fontFamily: Fonts.regular},
                  ]}>
                  {translate('pages.xchat.manage')}
                </Text>
              </TouchableOpacity>
            </View>
            {isManage ? (
              <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                  <Image source={Icons.icon_search} style={styles.iconSearch} />
                  <TextInput
                    style={[styles.inputStyle]}
                    placeholder={translate('pages.xchat.search')}
                    onChangeText={(searchText) => this.setState({searchText})}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    underlineColorAndroid={'transparent'}
                  />
                </View>
                <View style={styles.frindListContainer}>
                  {this.renderUserFriends()}
                </View>
              </View>
            ) : (
              <View style={styles.headerContainer}>
                <View style={styles.inputesContainer}>
                  {/* TextAreaWithTitle */}
                  <TextAreaWithTitle
                    title={translate('pages.xchat.about')}
                    rightTitle={about.length + '/4000'}
                    value={about}
                    onChangeText={(text) => this.setState({about: text})}
                    maxLength={4000}
                    extraHeight={200}
                    titleFontColor={Colors.gradient_2}
                    titleFontSize={20}
                  />
                </View>
                <View style={styles.swithContainer}>
                  <Text style={styles.VIPText}>
                    {translate('pages.xchat.showPastHistory')}
                  </Text>
                  <SwitchCustom
                    value={this.state.isPastPost}
                    onValueChange={(value) =>
                      this.setState({
                        isPastPost: value,
                      })
                    }
                  />
                </View>
                <View style={styles.swithContainer}>
                  <Text style={styles.VIPText}>
                    {translate('pages.xchat.vip')}
                  </Text>
                  <SwitchCustom
                    value={this.state.isVIP}
                    onValueChange={(value) =>
                      this.setState({
                        isVIP: value,
                        vipPerMonth: 0,
                        affiliateReward: 0,
                      })
                    }
                  />
                </View>

                {isVIP && (
                  <Fragment>
                    <TextAreaWithTitle
                      title={translate('pages.xchat.vipFeature')}
                      rightTitle={about_vip.length + '/4000'}
                      value={about_vip}
                      onChangeText={(text) => this.setState({about_vip: text})}
                      maxLength={4000}
                      extraHeight={150}
                      titleFontColor={Colors.orange}
                      titleFontSize={20}
                      isBorder
                    />

                    <View style={styles.vipDetails}>
                      <Text style={styles.detailHeadingText}>
                        {translate('pages.xchat.vipMonth')}
                      </Text>
                      <View style={styles.detailContainer}>
                        <TextInput
                          style={styles.detailTextInput}
                          placeholder={vipPerMonth.toString()}
                          placeholderTextColor={Colors.orange}
                          onChangeText={(text) =>
                            this.setState({
                              vipPerMonth: text.length ? vipPerMonth : 0,
                            })
                          }
                          value={vipPerMonth}
                          keyboardType={'number-pad'}
                        />
                        <Text style={styles.detailText}>TP</Text>
                      </View>
                    </View>
                  </Fragment>
                )}

                <View style={styles.followerDetails}>
                  <Text style={{fontFamily: Fonts.regular}}>
                    {translate('pages.xchat.affiliateFollower')}
                  </Text>
                  <View style={styles.detailContainer}>
                    <TextInput
                      style={styles.detailTextInput}
                      placeholder={affiliateReward.toString()}
                      placeholderTextColor={Colors.orange}
                      onChangeText={(text) =>
                        this.setState({
                          affiliateReward: text.length ? text : 0,
                        })
                      }
                      value={affiliateReward}
                      keyboardType={'number-pad'}
                    />
                    <Text style={styles.detailText}>{!isVIP ? 'TP' : '%'}</Text>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.buttonContainer}>
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
