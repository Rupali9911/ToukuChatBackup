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

// import { createGroupStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import { Images, Icons, Colors, Fonts } from '../../constants';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';

import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getImage } from '../../utils';
import { red } from 'color-name';
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

  render() {
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.groupDetails')}
          />
          <KeyboardAwareScrollView
            contentContainerStyle={createGroupStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={100}
          >
            <View style={createGroupStyles.imageContainer}>
              <View style={createGroupStyles.imageView}>
                <Image
                  // source={{uri: this.state.filePath.uri}}
                  source={getImage(this.state.filePath.uri)}
                  resizeMode={'cover'}
                  style={createGroupStyles.profileImage}
                />
              </View>
              <TouchableOpacity style={{}}>
                <Image
                  source={Icons.icon_edit_pen}
                  resizeMode={'cover'}
                  style={createGroupStyles.editIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={createGroupStyles.tabBar}>
              <TouchableOpacity
                style={createGroupStyles.tabItem}
                // onPress={item.action}
              >
                <Text
                  style={[
                    createGroupStyles.tabTitle,
                    {
                      fontFamily: Fonts.regular,
                    },
                  ]}
                >
                  {translate(`pages.xchat.about`)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={createGroupStyles.tabItem}
                // onPress={item.action}
              >
                <Text
                  style={[
                    createGroupStyles.tabTitle,
                    {
                      fontFamily: Fonts.regular,
                    },
                  ]}
                >
                  {translate(`pages.xchat.manage`)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    color: Colors.gradient_2,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {translate(`pages.xchat.groupName`)}
                </Text>
                <TouchableOpacity style={{}}>
                  <Image
                    source={Icons.icon_edit_pen}
                    resizeMode={'cover'}
                    style={createGroupStyles.editIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 13, fontFamily: Fonts.light }}>
                name
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    color: Colors.gradient_2,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {translate(`pages.xchat.note`)}
                </Text>
                <TouchableOpacity style={{}}>
                  <Image
                    source={Icons.icon_edit_pen}
                    resizeMode={'cover'}
                    style={createGroupStyles.editIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 13, fontFamily: Fonts.light }}>
                Group note
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const createGroupStyles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
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
    marginLeft: 5,
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
    borderBottomWidth: 5,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomColor: Colors.gradient_2,
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_2,
  },
});

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

export default connect(mapStateToProps)(GroupDetails);
