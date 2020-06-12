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
import LinearGradient from 'react-native-linear-gradient';

export default class AffilicateModal extends Component {
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
      orientation,
      url,
      buttonText,
    } = this.props;
    return (
      <Modal isVisible={visible}>
        <View
          style={{
            height: orientation === 'PORTRAIT' ? '25%' : '80%',
            backgroundColor: Colors.white,
          }}
        >
          <LinearGradient
            start={{ x: 0.1, y: 0.7 }}
            end={{ x: 0.5, y: 0.8 }}
            locations={[0.1, 0.6, 1]}
            colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
            style={{
              flex: 0.2,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: '5%',
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.light,
                fontWeight: '400',
                flex: 0.9,
              }}
            >
              {title}
            </Text>
            <View
              style={{
                flex: 0.1,
                alignItems: 'flex-end',
              }}
            >
              <TouchableOpacity onPress={onCancel}>
                <Image
                  source={Icons.icon_close}
                  style={{ tintColor: Colors.white, height: 10 }}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <View
            style={{
              flex: 0.5,
              marginHorizontal: '5%',
              justifyContent: 'center',
            }}
          >
            <Text
              numberOfLines={1}
              style={{ textAlign: 'center', fontFamily: Fonts.light }}
            >
              {url}
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              marginHorizontal: '5%',
            }}
          >
            <Button
              height="75%"
              title={buttonText}
              type={'primary'}
              onPress={() => onConfirm(url)}
              isRounded={false}
            />
          </View>
          {/* <View
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
                onPress={() => onConfirm(url)}
                isRounded={false}
              />
            </View>
          </View> */}
        </View>
      </Modal>
    );
  }
}
