import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';
import {Colors, Icons, Fonts, Images} from '../../constants';
import {globalStyles} from '../../styles';
import {Menu} from 'react-native-paper';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import Icon from 'react-native-vector-icons/EvilIcons';
export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isVisibleLeft: false,
    };
  }

  _openMenu = () => this.setState({visible: true});

  _closeMenu = () => this.setState({visible: false});

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  // onSubmitEditing() {
  //     this.props.onSubmitEditing();
  // }

  focus() {
    this.textInput.focus();
  }

  onFocus() {}

  onBlur() {}

  render() {
    const {
      placeholder,
      onChangeText,
      isIconRight,
      isIconLeft,
      onIconLeftClick,
      onIconRightClick,
      onSubmitEditing,
      navigation,
      isIconDelete,
      title,
      onDeletePress,
      onCanclePress,
      onDeleteConfrimPress,
      isDeleteVisible,
    } = this.props;

    const {isVisibleLeft} = this.state;

    return (
      <View style={styles.container}>
        {title === 'Chat' && !isVisibleLeft && isDeleteVisible && (
          <Menu
            style={{marginTop: 40}}
            contentStyle={{}}
            visible={this.state.isVisibleLeft}
            // onDismiss={() => {
            //   this.setState({isVisibleLeft: false});
            // }}
            anchor={
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.iconRightContainer,
                  {marginStart: -5, marginEnd: 5},
                ]}
                onPress={() =>
                  this.setState({isVisibleLeft: true}, () => onDeletePress())
                }
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Image source={Icons.icon_bin} style={styles.deleteIcon} />
              </TouchableOpacity>
            }></Menu>
        )}

        {!isVisibleLeft && (
          <View style={styles.searchContainer}>
            <Image source={Icons.icon_search} style={styles.iconSearch} />
            <View style={{flex: 1}}>
              <TextInput
                style={styles.inputStyle}
                placeholder={placeholder || translate('pages.xchat.search')}
                // placeholderTextColor={Colors.gray}
                onChangeText={onChangeText}
                ref={(input) => (this.textInput = input)}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={'done'}
                autoCorrect={false}
                onFocus={() => this.onFocus()}
                onBlur={() => this.onBlur()}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
              />
            </View>
          </View>
        )}
        {!isIconRight && !isVisibleLeft && (
          // <TouchableOpacity
          //   activeOpacity={0.8}
          //   style={styles.iconRightContainer}
          //   onPress={onIconRightClick}>
          //   <Image source={Icons.icon_edit_pen} style={styles.iconRight} />
          <Menu
            style={{marginTop: 40}}
            contentStyle={{}}
            visible={this.state.visible}
            onDismiss={this._closeMenu}
            anchor={
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.iconRightContainer}
                onPress={this._openMenu}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Image source={Icons.man_plus_icon} style={styles.iconRight} />
              </TouchableOpacity>
            }>
            <Menu.Item
              icon={() => <Image source={Icons.icon_create_group_chat} />}
              titleStyle={{marginLeft: -25}}
              onPress={() => {
                navigation.navigate('CreateGroupChat');
                this._closeMenu();
              }}
              title={translate('pages.xchat.createNewGroup')}
            />
            {/* <Menu.Item
              icon={() => <Image source={Icons.icon_create_new_channel} />}
              onPress={() => {
                navigation.navigate('CreateChannel');
                this._closeMenu();
              }}
              titleStyle={{marginLeft: -25}}
              title={translate('pages.xchat.createChannel')}
            /> */}
            <Menu.Item
              icon={() => <Image source={Icons.add_friend} />}
              onPress={() => {
                navigation.navigate('AddFriendScreen');
                this._closeMenu();
              }}
              titleStyle={{marginLeft: -25}}
              title={translate('pages.xchat.addFriend')}
            />
          </Menu>
        )}

        {isVisibleLeft && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.setState({isVisibleLeft: false}, () =>
                    onDeleteConfrimPress(),
                  );
                }}>
                <Text style={styles.buttonTextStyle}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.setState({isVisibleLeft: false}, () => onCanclePress());
                }}>
                <Text style={styles.buttonTextStyle}>Cancle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginLeft: 10,
    // backgroundColor: Colors.home_header,
  },
  searchContainer: {
    height: Platform.OS === 'ios' ? 'auto' : 45,
    // height: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
  },
  inputStyle: {
    flex: 1,
    // width: '100%',
    color: Colors.black,
    fontSize: 16,
    fontFamily: Fonts.nunitoSansRegular,
    marginStart: 10,
    //alignSelf: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    // fontWeight: '300',
  },
  iconRight: {
    height: 25,
    width: 25,
    resizeMode: 'center',
  },
  iconSearch: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  iconRightContainer: {
    marginStart: 15,
    alignSelf: 'center',
    width: 35,
  },

  buttonStyle: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderColor: '#fff',
  },
  buttonTextStyle: {
    fontFamily: Fonts.light,
    fontSize: 14,
    color: '#fff',
    fontWeight: '300',
  },
  deleteIcon: {height: 28, width: 28, tintColor: 'white'},
});
