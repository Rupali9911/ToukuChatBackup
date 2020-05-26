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
export default class GroupFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  render() {
    const { user, onAddPress } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.profileAvtarContainer}>
          <Image source={getAvatar(user.avatar)} style={styles.profileAvatar} />
        </View>
        <View style={styles.profileNameContainer}>
          <Text style={styles.profileNameText}>{user.name}</Text>
        </View>
        <View style={styles.profileAddButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
            <Text style={styles.addBottonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: height * 0.06,
  },
  profileAvtarContainer: {
    flex: 0.15,
    justifyContent: 'center',
  },
  profileAvatar: {
    height: height * 0.06 * 0.8,
    width: height * 0.06 * 0.8,
  },
  profileNameContainer: {
    flex: 0.65,
    justifyContent: 'center',
  },
  profileNameText: {},
  profileAddButtonContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  addButton: {
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: Colors.orange,
    borderRadius: 100,
  },
  addBottonText: {
    color: Colors.orange,
  },
});
