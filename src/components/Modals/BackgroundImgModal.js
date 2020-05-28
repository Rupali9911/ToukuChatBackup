import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { Images, Icons, Colors, Fonts } from '../../constants';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import Button from '../../components/Button';
import RoundedImage from '../../components/RoundedImage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class BackgroundImgModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderBackgroundImage(backgroudImages) {
    // console.log('renderBackgroundImage -> renderBackgroundImage');

    // const data = [
    //   { id: 1, url: Images.image_touku_bg, isSelected: true },
    //   { id: 2, url: Images.image_touku_bg, isSelected: false },
    //   { id: 3, url: Images.image_touku_bg, isSelected: false },
    //   { id: 4, url: Images.image_touku_bg, isSelected: false },
    //   { id: 5, url: Images.image_touku_bg, isSelected: false },
    // ];
    // console.log('renderBackgroundImage -> data', data);
    return (
      <FlatList
        numColumns={2}
        data={backgroudImages}
        renderItem={({ item, index }) => (
          <View style={{ flex: 0.5, height: 150 }}>
            <View
              style={{
                height: '80%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <RoundedImage source={item.url} size={100} resizeMode={'cover'} />
            </View>
            <View
              style={{
                height: '20%',
                alignItems: 'center',
                paddingRight: '30%',
              }}
            >
              <TouchableOpacity
                style={{
                  height: 20,
                  width: 20,
                  borderWidth: 2,
                  borderColor: Colors.green,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {item.isSelected && (
                  <MaterialIcons name="check" color={Colors.green} size={16} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  }

  render() {
    const { visible, backgroudImages, toggleBackgroundImgModal } = this.props;
    return (
      <Modal isVisible={visible} onBackdropPress={toggleBackgroundImgModal}>
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flex: this.state.orientation === 'LANDSCAPE' ? 0.1 : 0.05,
              backgroundColor: Colors.gray,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 0.8, paddingHorizontal: 5 }}>
              <Text>Wallpaper</Text>
            </View>
            <TouchableOpacity
              style={{
                flex: 0.2,
                paddingHorizontal: 5,
                alignItems: 'flex-end',
              }}
              onPress={toggleBackgroundImgModal}
            >
              <Image
                source={Icons.icon_close}
                style={{
                  tintColor: Colors.black,
                  height: '30%',
                  width: '30%',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: this.state.orientation === 'LANDSCAPE' ? 0.9 : 0.95,
              backgroundColor: Colors.white,
              paddingTop: 10,
            }}
          >
            {this.renderBackgroundImage(backgroudImages)}
            <View>
              <Button
                type={'primary'}
                title={translate('pages.xchat.create')}
                onPress={toggleBackgroundImgModal}
              />
              <Button
                type={'transparent'}
                title={translate('common.cancel')}
                onPress={toggleBackgroundImgModal}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
