import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors, Icons, Fonts } from '../../constants';
import { globalStyles } from '../../styles';
import { Menu } from 'react-native-paper';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

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
      onIconRightClick,
      onSubmitEditing,
      navigation,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Image source={Icons.icon_search} style={styles.iconSearch} />
          <TextInput
            style={styles.inputStyle}
            placeholder={placeholder || 'Search'}
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
        {!isIconRight ? (
          // <TouchableOpacity
          //   activeOpacity={0.8}
          //   style={styles.iconRightContainer}
          //   onPress={onIconRightClick}>
          //   <Image source={Icons.icon_edit_pen} style={styles.iconRight} />
          <Menu
            style={{ marginTop: 40 }}
            contentStyle={{}}
            visible={this.state.visible}
            onDismiss={this._closeMenu}
            anchor={
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.iconRightContainer}
                onPress={this._openMenu}
              >
                <Image source={Icons.icon_edit_pen} style={styles.iconRight} />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              icon={() => <Image source={Icons.icon_create_group_chat} />}
              titleStyle={{ marginLeft: -25 }}
              onPress={() => {
                navigation.navigate('CreateGroupChat');
                this._closeMenu();
              }}
              title={translate('pages.xchat.createNewGroup')}
            />
            <Menu.Item
              icon={() => <Image source={Icons.icon_create_new_channel} />}
              onPress={() => {
                navigation.navigate('CreateChannel');
                this._closeMenu();
              }}
              titleStyle={{ marginLeft: -25 }}
              title={translate('pages.xchat.createChannel')}
            />
          </Menu>
        ) : null}
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
    backgroundColor: Colors.home_header,
  },
  searchContainer: {
    height: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 10,
    // paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
  },
  inputStyle: {
    flex: 1,
    // width: '100%',
    color: Colors.black,
    fontSize: 15,
    // fontFamily: Fonts.black,
    marginStart: 10,
    alignSelf: 'center',
  },
  iconRight: {
    width: 30,
    height: 30,
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
  },
});
