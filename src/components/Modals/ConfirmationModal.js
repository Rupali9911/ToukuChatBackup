import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { Menu, Divider } from 'react-native-paper';
import { Colors, Fonts, Images, Icons } from '../../constants';
import Button from '../Button';
import Feather from 'react-native-vector-icons/Feather';

export default class ConfirmationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visible,
      onCancel,
      onConfirm,
      title,
      message,
      orientation,
    } = this.props;
    return (
      <Modal isVisible={visible}>
        <View
          style={{
            minHeight: orientation === 'PORTRAIT' ? '35%' : '80%',
            backgroundColor: Colors.white,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              flex: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={Icons.icon_info}
              style={{
                height: '50%',
                width: '20%',
                tintColor: Colors.orange_light,
              }}
              resizeMode={'contain'}
            />
          </View>
          <View
            style={{
              flex: 0.3,
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontFamily: Fonts.medium, fontSize: 24 }}>
              {title}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.light,
                fontSize: 16,
                color: Colors.black,
              }}
            >
              {message ? message : ''}
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              paddingHorizontal: '20%',
            }}
          >
            <View style={{ flex: 0.5, marginHorizontal: 5 }}>
              <Button
                height={'80%'}
                title={'Cancel'}
                type={'secondary'}
                onPress={onCancel}
                isRounded={false}
              />
            </View>
            <View
              style={{
                flex: 0.5,
                marginHorizontal: 5,
              }}
            >
              <Button
                height={'80%'}
                title={'Sure'}
                type={'primary'}
                onPress={onConfirm}
                isRounded={false}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
