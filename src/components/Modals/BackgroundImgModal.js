import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import {Images, Icons, Colors, Fonts} from '../../constants';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import Button from '../../components/Button';
import RoundedImage from '../../components/RoundedImage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class BackgroundImgModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderBackgroundImage(backgroudImages) {
    return (
      <FlatList
        numColumns={2}
        data={backgroudImages}
        extraData={this.props.extraData}
        keyExtractor={(item, index) => String(index)}
        renderItem={({item, index}) => (
          <View style={{flex: 0.5, height: 150}}>
            <View
              style={{
                height: '80%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <RoundedImage
                source={item.url}
                size={100}
                resizeMode={'cover'}
                borderSize={item.isSelected ? 2 : 0}
                borderColor={Colors.green}
              />
            </View>
            <View
              style={{
                height: '20%',
                alignItems: 'center',
                paddingRight: '30%',
              }}>
              <TouchableOpacity
                style={{
                  height: 20,
                  width: 20,
                  borderWidth: 2,
                  borderColor: Colors.green,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={this.onSelectBackground.bind(this, item, index)}>
                {item.isSelected ? (
                  <MaterialIcons name="check" color={Colors.green} size={16} />
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  }

  onSelectBackground = (item, index) => {
    this.props.onSelectBackground(item, index);
  };

  onSetBackground = () => {
    this.props.toggleBackgroundImgModal();
    this.props.onSetBackground();
  };

  render() {
    const {visible, backgroudImages, toggleBackgroundImgModal} = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={toggleBackgroundImgModal}
        onBackdropPress={toggleBackgroundImgModal}>
        <SafeAreaView
          style={{
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: Colors.gray,
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
            }}>
            <View style={{flex: 0.8, paddingHorizontal: 5}}>
              <Text>{translate('pages.xchat.wallpaper')}</Text>
            </View>
            <TouchableOpacity
              style={{
                flex: 0.2,
                paddingHorizontal: 5,
                alignItems: 'flex-end',
              }}
              onPress={toggleBackgroundImgModal}>
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
              padding: 20,
            }}>
            {/* {this.renderBackgroundImage(backgroudImages)} */}
            <FlatList
              numColumns={2}
              data={backgroudImages}
              extraData={this.props.extraData}
              keyExtractor={(item, index) => String(index)}
              renderItem={({item, index}) => (
                <View style={{flex: 0.5, height: 150}}>
                  <View
                    style={{
                      height: '80%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 100,
                        width: 100,
                        borderWidth: 1,
                        borderColor: item.isSelected
                          ? Colors.green
                          : Colors.gray,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <RoundedImage
                        source={item.url}
                        size={92}
                        resizeMode={'cover'}
                        borderSize={item.isSelected ? 2 : 0}
                        borderColor={Colors.green}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      height: '20%',
                      alignItems: 'center',
                      paddingRight: '30%',
                    }}>
                    <TouchableOpacity
                      style={{
                        height: 20,
                        width: 20,
                        borderWidth: 2,
                        borderColor: Colors.green,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={this.onSelectBackground.bind(this, item, index)}>
                      {item.isSelected ? (
                        <MaterialIcons
                          name="check"
                          color={Colors.green}
                          size={16}
                        />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <View>
              <Button
                type={'primary'}
                title={translate('pages.xchat.set')}
                onPress={this.onSetBackground.bind(this)}
                isRounded={false}
              />
              <Button
                type={'secondary'}
                title={translate('common.cancel')}
                onPress={toggleBackgroundImgModal}
                isRounded={false}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
