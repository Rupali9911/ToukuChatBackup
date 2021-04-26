import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Icons} from '../../constants';
import {translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import {getAvatar, getUserName, normalize} from '../../utils';
import Button from '../Button';
import ButtonWithArrow from '../ButtonWithArrow';
import RoundedImage from '../RoundedImage';
import styles from './styles';

export default class GroupFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdded: false,
    };
  }
  s;
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
      disableEdit,
    } = this.props;

    const container = [
      styles.container,
      {paddingHorizontal: isCheckBox ? 15 : 0},
    ];

    return (
      <View style={container}>
        {isCheckBox && (
          <View style={styles.ifCheckboxContainer}>
            <TouchableOpacity
              style={[
                styles.tickCircleActionContainer,
                isSelected
                  ? {
                      backgroundColor: Colors.green,
                    }
                  : styles.tickCircleSelectedContainer,
              ]}
              onPress={this.onAddPress.bind(this)}>
              {isSelected && (
                <Image
                  style={styles.tickCircleIcon}
                  source={Icons.icon_tick_circle}
                  resizeMode={'cover'}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
        <View
          style={[
            styles.subContainer,
            isRightDropDown && styles.subContainerFlex,
          ]}>
          <RoundedImage
            source={getAvatar(
              user.profile_picture ? user.profile_picture : user.avatar,
            )}
            size={isSmall ? 38 : 50}
          />
          <Text style={[globalStyles.smallLightText, styles.nameText]}>
            {getUserName(user.id || user.user_id) ||
              user.display_name ||
              user.username}
          </Text>
        </View>
        {isRightButton && (
          <View style={styles.addButttonContainer}>
            <Button
              title={translate('pages.xchat.add')}
              type={isSelected ? 'primary' : 'translucent'}
              height={30}
              onPress={this.onAddPress.bind(this)}
            />
          </View>
        )}
        {isRightDropDown && (
          <View style={styles.personButtonText}>
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
              height={normalize(24)}
              disabled={disableEdit}
              onPress={this.onAddPress.bind(this)}
              dropDownData={dropDownData}
            />
          </View>
        )}
      </View>
    );
  }
}
