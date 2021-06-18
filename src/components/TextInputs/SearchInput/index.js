// Library imports
import React, {Component} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Menu} from 'react-native-paper';

// Local imports
import {Colors, Icons} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';

// StyleSheet imports
import styles from './styles';

/**
 * Search input component
 */
export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isVisibleLeft: props.isVisibleButton,
    };
  }

  // Update visibility for left button
  componentDidUpdate(props) {
    if (props.isVisibleButton !== this.props.isVisibleButton) {
      if (props.isVisibleButton === true) {
        this.setState({isVisibleLeft: false});
      } else {
      }
    }
  }

  // Set menu visiblity to true
  _openMenu = () => this.setState({visible: true});

  // Set menu visiblity to false
  _closeMenu = () => this.setState({visible: false});

  // Update references
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  // onSubmitEditing() {
  //     this.props.onSubmitEditing();
  // }

  // Focus on text input
  focus = () => {
    this.textInput.focus();
  }

  render() {
    const {
      placeholder,
      onChangeText,
      isIconRight,
      onSubmitEditing,
      navigation,
      onDeletePress,
      onCanclePress,
      onDeleteConfrimPress,
      isDeleteVisible,
      countObject,
      currentRouteName,
    } = this.props;

    const {isVisibleLeft} = this.state;
    return (
      <View style={styles.container}>
        {currentRouteName === 'ChatTab' && !isVisibleLeft && isDeleteVisible && (
          <Menu
            style={styles.menuStyle}
            visible={this.state.isVisibleLeft}
            // onDismiss={() => {
            //   this.setState({isVisibleLeft: false});
            // }}
            anchor={
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.iconRightContainer,
                  styles.removeActionContainer,
                ]}
                onPress={() =>
                  this.setState({isVisibleLeft: true}, () => onDeletePress())
                }
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Image source={Icons.icon_bin} style={styles.deleteIcon} />
              </TouchableOpacity>
            }
          />
        )}

        {!isVisibleLeft && (
          <View style={styles.searchContainer}>
            <Image source={Icons.icon_search} style={styles.iconSearch} />
            <View style={styles.singleFlex}>
              <TextInput
                style={styles.inputStyle}
                placeholder={placeholder || translate('pages.xchat.search')}
                placeholderTextColor={Colors.gray}
                onChangeText={onChangeText}
                ref={(input) => (this.textInput = input)}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={'done'}
                autoCorrect={false}
                onFocus={this.focus}
                // onBlur={() => this.onBlur()}
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
            style={styles.menu}
            visible={this.state.visible}
            onDismiss={this._closeMenu}
            anchor={
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.iconRightContainer}
                onPress={this._openMenu}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Image source={Icons.man_plus_icon} style={styles.iconRight} resizeMode={'contain'}/>
              </TouchableOpacity>
            }>
            <Menu.Item
              icon={() => <Image source={Icons.icon_create_group_chat} />}
              titleStyle={styles.menuItemTitle}
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
              titleStyle={styles.menuItemTitle}
              title={translate('pages.xchat.createChannel')}
            /> */}
            <Menu.Item
              icon={() => <Image source={Icons.add_friend} />}
              onPress={() => {
                navigation.navigate('AddFriendScreen');
                this._closeMenu();
              }}
              titleStyle={styles.menuItemTitle}
              title={translate('pages.xchat.addFriendId')}
            />
            <Menu.Item
              icon={() => <Image source={Icons.icon_scan} />}
              onPress={() => {
                navigation.navigate('AddFriendByQr');
                this._closeMenu();
              }}
              titleStyle={styles.menuItemTitle}
              title={translate('pages.xchat.scanQr')}
            />
          </Menu>
        )}

        {isVisibleLeft && (
          <View style={styles.actionContainer}>
            <View style={styles.actionSubContainer}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.setState({}, () => onDeleteConfrimPress());
                }}>
                <Text style={styles.buttonTextStyle}>
                  {countObject === 0
                    ? translate('common.delete')
                    : translate('common.delete') +
                      ' ' +
                      '(' +
                      countObject +
                      ')'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.setState({isVisibleLeft: false}, () => onCanclePress());
                }}>
                <Text style={styles.buttonTextStyle}>
                  {translate('pages.xchat.cancelChooseOption')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}
