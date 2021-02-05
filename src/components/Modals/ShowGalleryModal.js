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
import VideoThumbnailPlayer from '../VideoThumbnailPlayer';
import UploadByUrlModal from './UploadByUrlModal';
class ShowGalleryModal extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      uploadByUrlModalVisible: false,
    };
  }

  send = async (type) => {
    this.props.onSelect(type);
  };

  render() {
    const {
      visible,
      toggleGalleryModal,
      data,
      onCancel,
      onUpload,
      isLoading,
      removeUploadData,
      onGalleryPress,
      onUrlDone,
    } = this.props;
    const {uploadByUrlModalVisible} = this.state;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={onCancel}
        onBackdropPress={onCancel}>
        <SafeAreaView
          style={{
            // flex: '10%',
            // height: '90%',
            // alignSelf: 'center',
            // width: '90%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              // flex: this.state.orientation === 'LANDSCAPE' ? 0.9 : 0.95,
              flex: 1,
              width: '100%',
              backgroundColor: Colors.white,
              justifyContent: 'center',
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
                    alignItems: 'center',
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
                flex: 1,
                padding: 10,
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
                            }}>
                            {item.mime && item.mime.includes('image') ? (
                              <Image
                                source={{
                                  uri: item.path,
                                }}
                                style={{
                                  height: 50,
                                  width: 50,
                                  marginRight: 10,
                                }}
                                resizeMode={'cover'}
                              />
                            ) : (
                              <View
                                style={{
                                  width: 50,
                                  height: 50,
                                  marginRight: 10,
                                }}>
                                <VideoThumbnailPlayer
                                  url={item.path}
                                  showPlayButton
                                />
                              </View>
                            )}
                            <View style={{flex: 0.8}}>
                              <Text numberOfLines={1} style={{marginBottom: 5}}>
                                {item.filename}
                              </Text>
                              <TouchableOpacity
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                                disabled={isLoading}
                                onPress={() => removeUploadData(index)}>
                                <FontAwesome
                                  name="trash"
                                  size={15}
                                  style={{marginRight: 5}}
                                />
                                <Text>{translate('pages.xchat.remove')}</Text>
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
                                  disabled={isLoading}
                                  onPress={() => onGalleryPress()}>
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
                          <Divider />
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
                    {/* <TouchableOpacity
                      onPress={() => onGalleryPress()}
                      style={{alignItems: 'center',justifyContent:'center'}}>
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
                        {translate('pages.xchat.SelecImage')}
                      </Text>
                    </TouchableOpacity> */}
                      <View
                        style={{
                          // flex: 0.5,
                          width: '90%',
                          marginHorizontal: 5,
                        }}>
                        <Button
                          title={translate('pages.xchat.SelecImage')}
                          type={'custom'}
                          onPress={() => onGalleryPress()}
                          isRounded={false}
                          colors={['#5cc0de', '#5cc0de', '#5cc0de']}
                        />
                      </View>
                  </View>
                )}
              </View>
              <Divider />
            </View>
            <View
              style={{
                // paddingHorizontal: '20%',
                alignItems: 'center',
                justifyContent: 'center',
                // marginTop: 20,
              }}>
              <View
                style={{
                  // flex: 0.5,
                  width: '90%',
                  marginHorizontal: 5,
                }}>
                <Button
                  title={translate('common.uploadImage')}
                  type={'primary'}
                  onPress={onUpload}
                  isRounded={false}
                  loading={isLoading}
                />
              </View>
              {isLoading ? null : (
                <View
                  style={{
                    // flex: 0.5,
                    width: '90%',
                    marginHorizontal: 5,
                  }}>
                  <Button
                    title={translate('pages.xchat.toastr.uploadByUrl')}
                    type={'primary'}
                    onPress={() => {
                      this.setState({uploadByUrlModalVisible: true});
                    }}
                    isRounded={false}
                  />
                </View>
              )}
              {isLoading ? null : (
                <View
                  style={{
                    // flex: 0.5,
                    marginHorizontal: 5,
                    width: '90%',
                  }}>
                  <Button
                    title={translate('common.cancel')}
                    type={'secondary'}
                    onPress={onCancel}
                    isRounded={false}
                  />
                </View>
              )}
            </View>
          </View>
          <UploadByUrlModal
            visible={uploadByUrlModalVisible}
            onRequestClose={() =>
              this.setState({uploadByUrlModalVisible: false})
            }
            onUrlDone={onUrlDone}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowGalleryModal);
