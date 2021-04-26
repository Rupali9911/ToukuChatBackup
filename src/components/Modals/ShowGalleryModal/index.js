// Library imports
import React, {Component} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {Divider} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

// Local imports
import {Icons} from '../../../constants';
import {
  setI18nConfig,
  translate,
} from '../../../redux/reducers/languageReducer';

// Component imports
import Button from '../../Button';
import VideoThumbnailPlayer from '../../VideoThumbnailPlayer';
import UploadByUrlModal from '../UploadByUrlModal';

// StyleSheet import
import styles from './styles';

/**
 * Show gallery modal component
 */
class ShowGalleryModal extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      uploadByUrlModalVisible: false,
    };
  }

  // Pass type from props to parent component
  send = async (type) => {
    this.props.onSelect(type);
  };

  render() {
    const {
      visible,
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
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.headerTitleContainer}>
                <View style={styles.headerTitleSubContainer}>
                  <Text style={styles.headerTitleText}>
                    {translate('common.upload')}
                  </Text>
                </View>
              </View>
              <View style={styles.closeIconContainer}>
                <TouchableOpacity
                  style={styles.closeIconActionContainer}
                  onPress={onCancel}>
                  <Image source={Icons.icon_close} style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.listContainer}>
              <View style={styles.singleFlex}>
                {data.length ? (
                  <ScrollView>
                    {data.map((item, index) => {
                      return (
                        <View style={styles.itemContainer}>
                          <View style={styles.itemContentContainer}>
                            {item.mime && item.mime.includes('image') ? (
                              <Image
                                source={{
                                  uri: item.path,
                                }}
                                style={styles.mediaStyle}
                                resizeMode={'cover'}
                              />
                            ) : (
                              <View style={styles.mediaStyle}>
                                <VideoThumbnailPlayer
                                  url={item.path}
                                  showPlayButton
                                />
                              </View>
                            )}
                            <View style={styles.contentActionContainer}>
                              <Text numberOfLines={1} style={styles.fileName}>
                                {item.filename}
                              </Text>
                              <TouchableOpacity
                                style={styles.removeActionContainer}
                                disabled={isLoading}
                                onPress={() => removeUploadData(index)}>
                                <FontAwesome
                                  name={'trash'}
                                  size={15}
                                  style={styles.trashIcon}
                                />
                                <Text>{translate('pages.xchat.remove')}</Text>
                              </TouchableOpacity>
                            </View>
                            {index === 0 && (
                              <View style={styles.galleryActionContainers}>
                                <TouchableOpacity
                                  disabled={isLoading}
                                  onPress={() => onGalleryPress()}>
                                  <Image
                                    source={Icons.icon_upload}
                                    style={styles.uploadIcon}
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
                  <View style={styles.selectFileContainer}>
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
                    <View style={styles.selectFileButtonContainer}>
                      <Button
                        title={translate('pages.xchat.selectFile')}
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
            <View style={styles.bottomButtonContainer}>
              <View style={styles.uploadImageContainer}>
                <Button
                  title={translate('common.uploadImage')}
                  type={'primary'}
                  onPress={onUpload}
                  isRounded={false}
                  loading={isLoading}
                />
              </View>
              {isLoading ? null : (
                <View style={styles.uploadByUrlContainer}>
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
                <View style={styles.cancelContainer}>
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

/**
 * @Redux - Map following state to props
 * @param {object} state - current state in stored in redux
 * @returns object
 */
const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ShowGalleryModal);
