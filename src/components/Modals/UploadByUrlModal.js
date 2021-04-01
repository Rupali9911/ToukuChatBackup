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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {Colors, Fonts, Images, Icons} from '../../constants';
import {globalStyles} from '../../styles';
import Button from '../Button';
import Toast from '../ToastModal';
import {translate} from '../../redux/reducers/languageReducer';
import {
  changeEmailSendOtp,
  changeEmail,
  getUserProfile,
} from '../../redux/reducers/userReducer';
import {ClickableImage} from '../ImageComponents';
import {Divider} from 'react-native-paper';
import {isValidUrl} from '../../utils';
import {getUrlcontent} from '../../redux/reducers/groupReducer';

class UploadByUrlModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      url: '',
      loading: false,
    };
  }

  checkUrl = (url) => {
    if (isValidUrl(url)) {
      this.setState({loading: true});
      this.props
        .getUrlcontent(url)
        .then((res) => {
          this.setState(this.initialState);
          if (res.content_type.includes('video')) {
            let video_url = url;

            if (url.includes('youtube.com')) {
              if (url.includes('watch?v=')) {
                video_url = url.replace('watch?v=', 'embed/');
              }
            } else if (url.includes('youtu.be')) {
              video_url = `https://www.youtube.com/embed${url.substring(
                url.lastIndexOf('/'),
              )}`;
            }

            let data = {
              mime: res.content_type,
              path: video_url,
              filename: video_url,
              isUrl: true,
            };
            this.props.onUrlDone(data);
            this.onRequestClose();
          } else {
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.xchat.toastr.pleaseSelectValidUrl'),
              type: 'primary',
            });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      Toast.show({
        title: 'TOUKU',
        text: translate('pages.xchat.toastr.pleaseSelectValidUrl'),
        type: 'primary',
      });
    }
  };

  onRequestClose = () => {
    this.props.onRequestClose();
    this.setState(this.initialState);
  };

  render() {
    const {visible, userData, onUrlDone} = this.props;
    const {url, loading} = this.state;
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
                {translate('pages.xchat.toastr.uploadByUrl')}
              </Text>
            </View>
            <ClickableImage
              size={14}
              source={Icons.icon_close}
              onPress={this.onRequestClose.bind(this)}
            />
          </LinearGradient>
          <KeyboardAwareScrollView
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}>
            <View style={{padding: 15}}>
              <View style={styles.inputContainer}>
                <TextInput
                    color={Colors.black}
                  placeholder={translate('pages.xchat.enterUrl')}
                    placeholderTextColor={'grey'}
                  value={url}
                  onChangeText={(text) => {
                    this.setState({url: text});
                  }}
                  onSubmitEditing={() => {
                    this.checkUrl(url);
                  }}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                />
              </View>
              <View style={{paddingVertical: 10}}>
                <Divider />
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <View style={{flex: 1}}>
                  <Button
                    isRounded={false}
                    type={'secondary'}
                    title={translate('common.cancel')}
                    onPress={this.onRequestClose.bind(this)}
                  />
                </View>
                <View style={{padding: 10}} />
                <View style={{flex: 1}}>
                  <Button
                    isRounded={false}
                    title={translate('common.confirm')}
                    onPress={() => {
                      this.checkUrl(url);
                    }}
                    loading={loading}
                  />
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <View style={{position: 'absolute', width: '100%', top: 0}}>
          <Toast
            ref={(c) => {
              if (c) Toast.toastInstance = c;
            }}
          />
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
  inputContainer: {
    padding: Platform.OS === 'ios' ? 10 : 0,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginVertical: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    loading: state.userReducer.loading,
  };
};

const mapDispatchToProps = {
  changeEmailSendOtp,
  changeEmail,
  getUserProfile,
  getUrlcontent,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadByUrlModal);
