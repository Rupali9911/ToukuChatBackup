// Library imports
import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {Divider} from 'react-native-paper';
import {connect} from 'react-redux';

// Local imports
import {Colors, Icons} from '../../../constants';
import {getUrlcontent} from '../../../redux/reducers/groupReducer';
import {translate} from '../../../redux/reducers/languageReducer';
import {globalStyles} from '../../../styles';
import {isValidUrl} from '../../../utils';

// Component imports
import Button from '../../Button';
import ClickableImage from '../../ClickableImage';
import Toast from '../../ToastModal';

// StyleSheet import
import styles from './styles';

/**
 * Upload by url modal component
 */
class UploadByUrlModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  // Get initial state
  get initialState() {
    return {
      url: '',
      loading: false,
    };
  }

  // Verify the given URL
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

  // When modal closes
  onRequestClose = () => {
    this.props.onRequestClose();
    this.setState(this.initialState);
  };

  render() {
    const {visible} = this.props;
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
            <View style={styles.singleFlex}>
              <Text
                style={[globalStyles.normalLightText, styles.uploadByUrlText]}>
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
            <View style={styles.urlInputContainer}>
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
              <View style={styles.dividerContainer}>
                <Divider />
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.singleFlex}>
                  <Button
                    isRounded={false}
                    type={'secondary'}
                    title={translate('common.cancel')}
                    onPress={this.onRequestClose.bind(this)}
                  />
                </View>
                <View style={styles.dividerSpacing} />
                <View style={styles.singleFlex}>
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
        <View style={styles.toastContainer}>
          <Toast
            ref={(c) => {
              if (c) {
                Toast.toastInstance = c;
              }
            }}
          />
        </View>
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
    userData: state.userReducer.userData,
    loading: state.userReducer.loading,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {
  getUrlcontent,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadByUrlModal);
