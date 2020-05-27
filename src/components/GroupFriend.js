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
      },
    );
  };
  render() {
    const {user} = this.props;
    const {isAdded} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <RoundedImage source={getAvatar(user.profile_picture)} size={50} />
          <Text
            style={[
              globalStyles.smallRegularText,
              {color: Colors.black, textAlign: 'left', marginStart: 15},
            ]}>
            {user.username}
          </Text>
        </View>
        <View style={{flex: 0.2}}>
          <Button
            title={'Add'}
            type={isAdded ? 'primary' : 'translucent'}
            height={35}
            onPress={this.onAddPress.bind(this)}
          />
        </View>
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
