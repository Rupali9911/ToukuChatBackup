import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {Colors, Fonts, Icons} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {connect} from 'react-redux';
import Button from '../Button';
import {Divider} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
class ShowAttahmentModal extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {};
  }

  send = async (type) => {
    this.props.onSelect(type);
  };

  render() {
    const {
      visible,
      toggleAttachmentModal,
      data,
      onCancel,
      onUpload,
      isLoading,
      removeUploadData,
      onAttachmentPress,
    } = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={onCancel}
        onBackdropPress={onCancel}>
        <SafeAreaView
          style={{
            // flex: '10%',
            height: '90%',
            alignSelf: 'center',
            width: '90%',
          }}>
          <View
            style={{
              flex: this.state.orientation === 'LANDSCAPE' ? 0.9 : 0.95,
              backgroundColor: Colors.white,
            }}>
            <View
              style={{
                flex: 0.05,
                alignItems: 'center',
                width: '100%',
                backgroundColor: Colors.light_gray,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 0.8,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                    }}>
                    {translate('common.upload')}
                  </Text>
                </View>
              </View>
              <View style={{flex: 0.2}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingHorizontal: 5,
                    justifyContent: 'center',
                    paddingRight: 10,
                    alignItems: 'flex-end',
                  }}
                  onPress={onCancel}>
                  <Image
                    source={Icons.icon_close}
                    style={{
                      tintColor: Colors.white,
                      height: 10,
                      width: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 0.85,
                paddingVertical: 10,
              }}>
              <View style={{flex: 1}}>
                {data.length ? (
                  <ScrollView>
                    {data.map((item, index) => {
                      return (
                        <View style={{marginBottom: 5}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 5,
                              paddingRight: 10,
                              height: 50,
                            }}>
                            <View
                              style={{
                                flex: 0.2,
                                borderWidth: 0.4,
                                borderColor: '#eaeaea',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 5,
                              }}>
                              <FontAwesome
                                name="file"
                                size={30}
                                color={Colors.gray_dark}
                                style={{
                                  marginRight: 10,
                                }}
                              />
                            </View>
                            <View style={{flex: 0.8}}>
                              <Text
                                style={{
                                  marginBottom: 5,
                                  color: Colors.black_light,
                                }}
                                numberOfLines={1}>
                                {item.name}
                              </Text>
                              <TouchableOpacity
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                                onPress={() => removeUploadData(index)}>
                                <FontAwesome
                                  name="trash"
                                  size={15}
                                  style={{marginRight: 5}}
                                />
                                <Text
                                  style={{
                                    color: Colors.gray_dark,
                                  }}>
                                  {translate('pages.xchat.remove')}
                                </Text>
                              </TouchableOpacity>
                            </View>
                            {index === 0 && (
                              <View
                                style={{
                                  flex: 0.2,
                                  justifyContent: 'center',
                                  alignItems: 'flex-end',
                                }}>
                                <TouchableOpacity
                                  onPress={() => onAttachmentPress()}>
                                  <Image
                                    source={Icons.icon_upload}
                                    style={{
                                      tintColor: '#80a9d2',
                                      height: 25,
                                      width: 25,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <TouchableOpacity
                      onPress={() => onAttachmentPress()}
                      style={{alignItems: 'center'}}>
                      <Image
                        source={Icons.icon_upload}
                        style={{
                          tintColor: '#80a9d2',
                          height: 40,
                          width: 40,
                          marginBottom: 10,
                        }}
                      />
                      <Text style={{color: '#80a9d2'}}>
                        {translate('common.upload')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Divider />
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: '20%',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 0.1,
                // marginTop: 20,
              }}>
              <View
                style={{
                  // flex: 0.5,
                  width: '70%',
                  marginHorizontal: 5,
                }}>
                <Button
                  title={translate('common.upload')}
                  type={'primary'}
                  onPress={onUpload}
                  isRounded={false}
                  loading={isLoading}
                />
              </View>
              <View
                style={{
                  // flex: 0.5,
                  marginHorizontal: 5,
                  width: '70%',
                }}>
                <Button
                  title={translate('common.cancel')}
                  type={'secondary'}
                  onPress={onCancel}
                  isRounded={false}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ShowAttahmentModal);
