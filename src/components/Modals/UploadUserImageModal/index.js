// Library imports
import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';

// Local imports
import {Colors, Icons} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';
import {uploadAvatar} from '../../../redux/reducers/userReducer';
import {globalStyles} from '../../../styles';
import {getImage, wait} from '../../../utils';

// Component imports
import Button from '../../Button';
import RoundedImage from '../../RoundedImage';

// StyleSheet imports
import styles from './styles';

/**
 * Upload user image modal component
 */
class UploadUserImageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnDisabled: true,
      filePath: {},
    };
  }

  // Displays image picker for choosing image
  chooseFile = () => {
    let options = {
      title: translate('pages.xchat.chooseOption'),
      takePhotoButtonTitle: translate('pages.xchat.takePhoto'),
      chooseFromLibraryButtonTitle: translate('pages.xchat.chooseFromLibrary'),
      // chooseWhichLibraryTitle: translate('pages.xchat.chooseOption'),
      cancelButtonTitle: translate('pages.xchat.cancelChooseOption'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        console.log('response.error', response.error);
      } else {
        // You can also display the image using data:
        let source = {uri: 'data:image/jpeg;base64,' + response.data};
        console.log('source from library');
        this.setState({
          filePath: source,
          btnDisabled: false,
        });
      }
    });
  };

  // When modal closes
  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState({filePath: {}, btnDisabled: true});
    });
  };

  // Uploading selected image
  onUploadImage = () => {

  };

  render() {
    const {visible} = this.props;
    const {btnDisabled, filePath} = this.state;
    return (
      <Modal
        isVisible={visible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        backdropOpacity={0.4}
        onBackButtonPress={this.onRequestClose.bind(this)}
        onBackdropPress={this.onRequestClose.bind(this)}
        style={styles.modalBackground}>
        <View style={styles.Wrapper}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.8, y: 0.3}}
            locations={[0.1, 0.5, 0.8]}
            colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
            style={styles.header}>
            <View style={styles.singleFlex}>
              <Text style={[globalStyles.normalLightText, styles.titleStyle]}>
                {translate('pages.xchat.selectOrDropYouFile')}
              </Text>
            </View>
            <RoundedImage
              source={Icons.icon_close}
              color={Colors.white}
              size={14}
              isRounded={false}
              clickable={true}
              onClick={this.onRequestClose.bind(this)}
            />
          </LinearGradient>
          <View style={styles.container}>
            {filePath.uri === undefined ||
            typeof filePath.uri === undefined ||
            filePath.uri === '' ||
            filePath.uri === null ? (
              <TouchableOpacity
                style={styles.uploadActionContainer}
                onPress={this.chooseFile.bind(this)}>
                <Image source={Icons.icon_upload} style={styles.iconUpload} />
                <Text
                  style={[
                    globalStyles.smallRegularText,
                    {color: Colors.black},
                  ]}>
                  {translate('pages.xchat.clickHere')}
                </Text>
              </TouchableOpacity>
            ) : (
              <RoundedImage
                source={getImage(this.state.filePath.uri)}
                size={80}
              />
            )}
          </View>
          <View style={styles.bottomButtonContainer}>
            <View style={styles.uploadButtonContainer}>
              <Button
                disabled={btnDisabled}
                isRounded={false}
                title={translate('common.upload')}
                onPress={this.onUploadImage.bind(this)}
                loading={this.props.loading}
              />
            </View>
            <View style={styles.cancelButtonContainer}>
              <Button
                isRounded={false}
                type={'secondary'}
                title={translate('common.cancel')}
                onPress={this.onRequestClose.bind(this)}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.userReducer.loading,
  };
};

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadUserImageModal);
