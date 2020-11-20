import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import {Colors, Icons, Fonts} from '../constants';
import {globalStyles} from '../styles';
const {width, height} = Dimensions.get('window');
import {getAvatar} from '../utils';
import RoundedImage from './RoundedImage';
import Button from './Button';
import ButtonWithArrow from './ButtonWithArrow';
import {translate, setI18nConfig} from '../redux/reducers/languageReducer';
import {createFilter} from 'react-native-search-filter';

export default class GroupFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdded: false,
    };
  }

  componentDidMount() {
    //  const {addedUser, user} =  this.props
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }

    // if (addedUser && addedUser.length > 0 && user){
    //     let filteredUser = addedUser.filter((user1) => {
    //         return user1.user_id === user.user_id
    //     });
    //     if (filteredUser.length > 0 ){
    //       this.setState({isAdded: true})
    //     }else{
    //         this.setState({isAdded: false})
    //     }
    // }
  }
  onAddPress = () => {
    this.props.onAddPress(!this.props.isSelected);
  };

  onChecked = () => {
    this.setState(
      (prevState) => ({
        isCheck: !prevState.isCheck,
      }),
      () => {
        this.props.onCheckPress(this.state.isCheck);
      },
    );
  };

  render() {
    const {
      user,
      isRightButton,
      isCheckBox,
      isRightDropDown,
      isMember,
      memberTitle,
      dropDownData,
      isSelected,
      memberType,
      isSmall,
    } = this.props;
    const {isAdded, onChecked} = this.state;

    return (
      <View style={[styles.container, isCheckBox && {paddingHorizontal: 0}]}>
        {isCheckBox && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 5,
            }}>
            <TouchableOpacity
              style={[
                {
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // borderWidth: 1,
                  // borderColor: Colors.green,
                },
                user.isChecked
                  ? {
                      backgroundColor: Colors.green,
                    }
                  : {
                      borderWidth: 1,
                      borderColor: Colors.green,
                    },
              ]}
              onPress={this.onChecked.bind(this)}>
              {user.isChecked && (
                <Image
                  style={{
                    height: '100%',
                    width: '100%',
                    tintColor: Colors.white,
                  }}
                  source={Icons.icon_tick_circle}
                  resizeMode={'cover'}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
        <View style={[styles.subContainer, isRightDropDown && {flex: 0.7}]}>
          <RoundedImage
            source={getAvatar(
              user.profile_picture ? user.profile_picture : user.avatar,
            )}
            size={isSmall ? 38 : 50}
          />
          <Text
            style={[
              globalStyles.smallLightText,
              {
                color: Colors.black,
                textAlign: 'left',
                marginStart: 15,
                flexWrap: 'wrap',
                flex: 1,
              },
            ]}>
            {user.display_name}
          </Text>
        </View>
        {isRightButton && (
          <View style={{flex: 0.2}}>
            <Button
              title={translate('pages.xchat.add')}
              type={isSelected ? 'primary' : 'translucent'}
              height={30}
              onPress={this.onAddPress.bind(this)}
            />
          </View>
        )}
        {isRightDropDown && (
          <View style={{flex: 0.3}}>
            <ButtonWithArrow
              user={user}
              title={
                memberTitle === 'member'
                  ? translate('pages.xchat.member')
                  : memberTitle === 'admin'
                  ? translate('pages.xchat.admin')
                  : translate('pages.xchat.add')
              }
              type={isMember ? 'primary' : 'translucent'}
              memberType={memberType}
              height={30}
              onPress={this.onAddPress.bind(this)}
              dropDownData={dropDownData}
            />
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
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  subContainer: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
