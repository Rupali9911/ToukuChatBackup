import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import { Images, Icons, Colors, Fonts } from '../../constants';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import Button from '../Button';
import RoundedImage from '../RoundedImage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getImage } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';

export default class UploadSelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  send = () => {
    this.props.toggleBackgroundImgModal();
    this.props.onSetBackground();
  };

  render() {
    const { visible, toggleSelectModal, onSelect } = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={toggleSelectModal}
        onBackdropPress={toggleSelectModal}
      >
        <SafeAreaView
          style={{
            // flex: '10%',
            height: '20%',
            alignSelf: 'center',
            width: '40%',
          }}
        >
          <View
            style={{
              flex: this.state.orientation === 'LANDSCAPE' ? 0.9 : 0.95,
              backgroundColor: Colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LinearGradient
              start={{ x: 0.1, y: 0.7 }}
              end={{ x: 0.5, y: 0.8 }}
              locations={[0.1, 0.6, 1]}
              colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
              style={{
                flex: 0.3,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 18,
                  fontFamily: Fonts.extrabold,
                }}
              >
                Upload Type
              </Text>
            </LinearGradient>
            <View style={{ flex: 0.7 }}>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => onSelect('images')}
              >
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 14,
                    fontFamily: Fonts.medium,
                  }}
                >
                  Image
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => onSelect('video')}
              >
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 14,
                    fontFamily: Fonts.medium,
                  }}
                >
                  Video
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
