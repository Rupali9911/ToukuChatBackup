import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {Fonts, Icons, Images} from '../../constants';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
// import { createGroupStyles } from './styles';
import {globalStyles} from '../../styles';
import {getImage} from '../../utils';
import styles from './styles';

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
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  render() {
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.groupDetails')}
          />
          <KeyboardAwareScrollView
            contentContainerStyle={styles.mainContainer}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={100}>
            <View style={styles.imageContainer}>
              <View style={styles.imageView}>
                <Image
                  // source={{uri: this.state.filePath.uri}}
                  source={getImage(this.state.filePath.uri)}
                  resizeMode={'cover'}
                  style={styles.profileImage}
                />
              </View>
              <TouchableOpacity style={{}}>
                <Image
                  source={Icons.icon_edit_pen}
                  resizeMode={'cover'}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={styles.tabItem}
                // onPress={item.action}
              >
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
                style={styles.tabItem}
                // onPress={item.action}
              >
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
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.contentSubContainer}>
                <Text style={styles.contentText}>
                  {translate('pages.xchat.groupName')}
                </Text>
                <TouchableOpacity style={{}}>
                  <Image
                    source={Icons.icon_edit_pen}
                    resizeMode={'cover'}
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.contentLabel}>name</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.contentSubContainer}>
                <Text style={styles.contentText}>
                  {translate('pages.xchat.note')}
                </Text>
                <TouchableOpacity style={{}}>
                  <Image
                    source={Icons.icon_edit_pen}
                    resizeMode={'cover'}
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.contentLabel}>Group note</Text>
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
  };
};

export default connect(mapStateToProps)(GroupDetails);
