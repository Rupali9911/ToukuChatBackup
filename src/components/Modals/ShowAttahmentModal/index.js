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
import {Colors, Icons} from '../../../constants';
import {
  setI18nConfig,
  translate,
} from '../../../redux/reducers/languageReducer';

// Component imports
import Button from '../../Button';

// StyleSheet imports
import styles from './styles';

/**
 * Show attachmenmt modal comoponent
 */
class ShowAttahmentModal extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
  }

  // Passing type to parent comnpoennt
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
      onAttachmentPress,
    } = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={onCancel}
        onBackdropPress={onCancel}>
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.uploadLabelContainer}>
                <View style={styles.uploadButtonContainer}>
                  <Text style={styles.uploadLabel}>
                    {translate('common.upload')}
                  </Text>
                </View>
              </View>
              <View style={styles.closeIconContainer}>
                <TouchableOpacity
                  style={styles.closeActionContainer}
                  onPress={onCancel}>
                  <Image source={Icons.icon_close} style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.selectionContainer}>
              <View style={styles.singleFlex}>
                {data.length ? (
                  <ScrollView>
                    {data.map((item, index) => {
                      return (
                        <View style={styles.itemContainer}>
                          <View style={styles.itemSubContainer}>
                            <View style={styles.fileIconContainer}>
                              <FontAwesome
                                name={'file'}
                                size={30}
                                color={Colors.gray_dark}
                                style={styles.fileIcon}
                              />
                            </View>
                            <View style={styles.fileTitleContainer}>
                              <Text style={styles.fileName} numberOfLines={1}>
                                {item.name}
                              </Text>
                              <TouchableOpacity
                                style={styles.removeActionContainer}
                                disabled={isLoading}
                                onPress={() => removeUploadData(index)}>
                                <FontAwesome
                                  name={'trash'}
                                  size={15}
                                  style={styles.removeIcon}
                                />
                                <Text style={styles.removeLabel}>
                                  {translate('pages.xchat.remove')}
                                </Text>
                              </TouchableOpacity>
                            </View>
                            {index === 0 && (
                              <View style={styles.attachmentButtonContainer}>
                                <TouchableOpacity
                                  disabled={isLoading}
                                  onPress={() => onAttachmentPress()}>
                                  <Image
                                    source={Icons.icon_upload}
                                    style={styles.uploadIcon}
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
                  <View style={styles.uploadContainer}>
                    {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
                    <View style={styles.uploadSubContainer}>
                      <Button
                        title={translate('common.upload')}
                        type={'custom'}
                        // onPress={() => onGalleryPress()} @todo: function now found
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
              <View style={styles.bottomButtonSubContainer}>
                <Button
                  title={translate('common.upload')}
                  type={'primary'}
                  onPress={onUpload}
                  isRounded={false}
                  loading={isLoading}
                />
              </View>
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
        </SafeAreaView>
      </Modal>
    );
  }
}

/**
 * @Redux - Map following state to props
 * @param {object} state - current state in storeed in redux
 * @returns object
 */
const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ShowAttahmentModal);
