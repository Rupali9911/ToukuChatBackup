import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';

import {Colors, Fonts, Images, Icons} from '../../constants';
import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import Button from '../Button';
import {getImage, wait} from '../../utils';

import {uploadAvatar} from '../../redux/reducers/userReducer';
import Toast from '../Toast';
import {translate} from '../../redux/reducers/languageReducer';

class UploadUserImageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnDisabled: true,
      filePath: {},
    };
  }

  chooseFile = () => {
    var options = {
      title: 'Choose Option',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = {uri: 'data:image/jpeg;base64,' + response.data};
        this.setState({
          filePath: source,
          btnDisabled: false,
        });
      }
    });
  };

  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState({filePath: {}, btnDisabled: true});
    });
  };

  onUploadImage = () => {
    // let uploadData = {
    //   avatar_thumbnail: 'data:image/jpeg;base64,' + this.state.filePath.data,
    //   avatar: 'data:image/jpeg;base64,' + this.state.filePath.data,
    // };
    // this.props.uploadAvatar(uploadData);
    //   .then((res) => {
    //     Toast.show({
    //       title: 'Upload Avatar',
    //       text: translate('pages.xchat.userImageChanged'),
    //       type: 'positive',
    //     });
    //   })
  };

  render() {
    const {visible, onRequestClose} = this.props;
    const {btnDisabled, filePath} = this.state;
    return (
      <Modal
        isVisible={visible}
        animationIn="fadeIn"
        animationOut="fadeOut"
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
            <View style={{flex: 1}}>
              <Text style={[globalStyles.normalLightText, {textAlign: 'left'}]}>
                {'Select your file'}
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
            {filePath.data === undefined ||
            typeof filePath.data === undefined ? (
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={this.chooseFile.bind(this)}>
                <Image source={Icons.icon_upload} style={styles.iconUpload} />
                <Text
                  style={[
                    globalStyles.smallRegularText,
                    {color: Colors.black},
                  ]}>
                  {'Click Here to Upload'}
                  {/* {filePath.uri} */}
                </Text>
              </TouchableOpacity>
            ) : (
              <RoundedImage
                source={getImage(
                  'data:image/jpeg;base64,' + this.state.filePath.data,
                )}
                size={80}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingBottom: 10,
            }}>
            <View style={{flex: 1, marginEnd: 10}}>
              <Button
                disabled={btnDisabled}
                isRounded={false}
                title={'Upload'}
                onPress={this.onUploadImage.bind(this)}
                loading={this.props.loading}
              />
            </View>
            <View style={{flex: 1, marginStart: 10}}>
              <Button
                isRounded={false}
                type={'secondary'}
                title={'Cancel'}
                onPress={this.onRequestClose.bind(this)}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    display: 'flex',
  },
  Wrapper: {
    width: '80%',
    backgroundColor: Colors.white,
    display: 'flex',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    height: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: Platform.OS === 'ios' ? 10 : 0,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginVertical: 5,
  },
  iconUpload: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginEnd: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    loading: state.userReducer.loading,
  };
};

const mapDispatchToProps = {
  uploadAvatar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadUserImageModal);
