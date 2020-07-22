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
            height: orientation === 'PORTRAIT' ? '35%' : '80%',
            backgroundColor: Colors.white,
            borderRadius: 5,
            paddingVertical: '5%',
          }}
        >
          <View
            style={{
              flex: 0.5,
              alignItems: 'center',
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
              flex: 0.5,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-end',
                flex: 0.5,
                width: '100%',
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 24,
                  marginBottom: 10,
                }}
              >
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
                flexDirection: 'row',
                paddingHorizontal: '20%',
                alignItems: 'flex-end',
                flex: 0.5,
              }}
            >
              <View
                style={{
                  flex: 0.5,
                  marginHorizontal: 5,
                }}
              >
                <Button
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
                  title={'Sure'}
                  type={'primary'}
                  onPress={onConfirm}
                  isRounded={false}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
