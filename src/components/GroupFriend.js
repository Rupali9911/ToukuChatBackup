import React, { Component } from 'react';
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
import { Colors, Icons, Fonts } from '../constants';
import { globalStyles } from '../styles';
const { width, height } = Dimensions.get('window');
import { getAvatar } from '../utils';
import RoundedImage from './RoundedImage';
import Button from './Button';
export default class GroupFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdded: false,
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }
  onAddPress = () => {
    this.setState(
      (prevState) => ({
        isAdded: !prevState.isAdded,
      }),
      () => {
        this.props.onAddPress(this.state.isAdded);
      }
    );
  };

  onChecked = () => {
    this.setState(
      (prevState) => ({
        isCheck: !prevState.isCheck,
      }),
      () => {
        this.props.onCheckPress(this.state.isCheck);
      }
    );
  };

  render() {
    const { user, isRightButton, isCheckBox } = this.props;
    const { isAdded, onChecked } = this.state;
    return (
      <View style={[styles.container, isCheckBox && { paddingHorizontal: 0 }]}>
        {isCheckBox && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 5,
            }}
          >
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
              onPress={this.onChecked.bind(this)}
            >
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
        <View style={styles.subContainer}>
          <RoundedImage source={getAvatar(user.profile_picture)} size={50} />
          <Text
            style={[
              globalStyles.smallRegularText,
              { color: Colors.black, textAlign: 'left', marginStart: 15 },
            ]}
          >
            {user.username}
          </Text>
        </View>
        {isRightButton && (
          <View style={{ flex: 0.2 }}>
            <Button
              title={'Add'}
              type={isAdded ? 'primary' : 'translucent'}
              height={35}
              onPress={this.onAddPress.bind(this)}
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
