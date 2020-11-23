import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {Menu, Divider} from 'react-native-paper';
import {Colors, Fonts, Images, Icons} from '../../constants';
import Button from '../Button';
import Feather from 'react-native-vector-icons/Feather';
import {translate} from '../../redux/reducers/languageReducer';
import { normalize } from '../../utils';

export default class PasswordConfirmationModal extends Component {
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
      isLoading,
    } = this.props;
    return (
      <Modal isVisible={visible}>
        <View style={{}}>
          <View
            style={{
              // height: orientation === 'PORTRAIT' ? 250 : '80%',
              backgroundColor: Colors.white,
              borderRadius: 5,
              paddingVertical: '5%',
              paddingHorizontal: '5%'
            }}>
            <View
              style={{
                // flex: 0.5,
                alignItems: 'center',
                marginBottom: normalize(20)
              }}>
              <Image
                source={Icons.icon_info}
                style={{
                  height: normalize(60),
                  width: normalize(60),
                  tintColor: Colors.orange_light
                }}
                resizeMode={'contain'}
              />
            </View>
            <View
              style={{
                // flex: 0.5,
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  // flex: 0.5,
                  width: '100%',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 24,
                    marginBottom: 10,
                    textAlign: 'center'
                  }}>
                  {title}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.light,
                    fontSize: 16,
                    color: Colors.black,
                    textAlign: 'center'
                  }}>
                  {message ? message : ''}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: '20%',
                  alignItems: 'flex-end',
                  // flex: 0.5,
                  marginTop: 20,
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    // flex: 0.5,
                    marginHorizontal: 5,
                  }}>
                  <Button
                    title={translate('swal.cancel')}
                    type={'secondary'}
                    onPress={onCancel}
                    isRounded={false}
                  />
                </View>
                <View
                  style={{
                    // flex: 0.5,
                    marginHorizontal: 5,
                  }}>
                  <Button
                    title={translate('common.setPassword')}
                    type={'primary'}
                    onPress={isLoading ? null : onConfirm}
                    isRounded={false}
                    loading={isLoading}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
