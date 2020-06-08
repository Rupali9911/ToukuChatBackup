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

// import { groupDetailStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import { Images, Icons, Colors, Fonts } from '../../constants';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import { getUserFriends } from '../../redux/reducers/friendReducer';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getImage } from '../../utils';
import { red } from 'color-name';
import Button from '../../components/Button';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';

import { createFilter } from 'react-native-search-filter';

import GroupFriend from '../../components/GroupFriend';
import NoData from '../../components/NoData';

import { ListLoader } from '../../components/Loaders';
const { width, height } = Dimensions.get('window');

class GroupDetails extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      groupName: '',
      note: '',
      searchText: '',
      addedFriends: [],
      groupNameErr: null,
      isMyGroup: false,
      isManage: false,
      isEdit: false,
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

    if (this.state.isMyGroup) {
      this.props.getUserFriends();
    }
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  onLeaveGroup = () => {};
  onDeleteGroup = () => {};
  onUpdateeGroup = () => {};

  renderUserFriends() {
    const { userFriends, friendLoading } = this.props;
    console.log(
      'GroupDetails -> renderUserFriends -> userFriends',
      userFriends
    );

    const filteredFriends = userFriends.filter(
      createFilter(this.state.searchText, ['username'])
    );

    if (filteredFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          data={filteredFriends}
          renderItem={({ item, index }) => (
            <GroupFriend
              user={item}
              onAddPress={(isAdded) => this.onAdd(isAdded, item)}
              isRightButton
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

  render() {
    const { isManage, isMyGroup, isEdit, groupName, note } = this.state;
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
                <Image
                  // source={{uri: this.state.filePath.uri}}
                  source={getImage(this.state.filePath.uri)}
                  resizeMode={'cover'}
                  style={groupDetailStyles.profileImage}
                />
              </View>
              {isMyGroup && (
                <TouchableOpacity style={{}}>
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
                        name
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
                        Group note
                      </Text>
                    </View>
                  </React.Fragment>
                )}
                {isMyGroup ? (
                  isEdit && (
                    <React.Fragment>
                      <Button
                        title={translate(`pages.xchat.deleteGroup`)}
                        onPress={() => this.onLeaveGroup()}
                        isRounded={false}
                        type={'secondary'}
                      />
                      <Button
                        title={translate(`pages.xchat.update`)}
                        onPress={() => this.onLeaveGroup()}
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
        </View>
      </ImageBackground>
    );
  }
}

const groupDetailStyles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    paddingBottom: 50,
  },
  imageContainer: {
    height: height * 0.18,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageView: {
    height: height * 0.13,
    width: height * 0.13,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderColor: '#fff',
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  editIcon: {
    height: 15,
    width: 15,
    tintColor: Colors.gradient_2,
    marginLeft: 7,
  },
  tabBar: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-evenly',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray,
    // paddingBottom: 10,
  },
  tabItem: {
    marginHorizontal: 10,
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_2,
  },
  searchContainer: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
    borderRadius: 20,
    margin: 10,
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    borderColor: Colors.gray_dark,
  },
  inputStyle: {
    flex: 1,
    color: Colors.black,
    fontSize: 13,
    marginStart: 10,
    alignSelf: 'center',
    fontFamily: Fonts.light,
    paddingVertical: 0,
  },
  iconSearch: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    friendLoading: state.friendReducer.loading,
    userFriends: state.friendReducer.userFriends,
  };
};

const mapDispatchToProps = {
  getUserFriends,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails);
