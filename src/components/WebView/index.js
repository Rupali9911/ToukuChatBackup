import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Images} from '../../constants';
import {translate} from '../../redux/reducers/languageReducer';
import styles from './styles';

export default class WebViewClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      webViewLoaded: false,
    };
  }

  closeModal() {
    console.log('closeModal');
    this.props.closeModal();
  }

  setWebViewVisibleState() {
    if (!this.state.webViewLoaded) {
      console.log('Webview loaded');
      // setTimeout( () => {
      this.setState({webViewLoaded: true});
      // },1500);
    }
  }

  render() {
    const {modalVisible, url} = this.props;
    const {webViewLoaded} = this.state;
    return (
      <Modal animationType={'slide'} transparent={false} visible={modalVisible}>
        <SafeAreaView style={styles.singleFlex}>
          <TouchableOpacity
            style={styles.closeActionContainer}
            onPress={() => this.closeModal()}>
            <Text>{translate('common.close')}</Text>
          </TouchableOpacity>
          <ImageBackground
            source={Images.image_touku_bg_phone}
            style={styles.singleFlex}
            resizeMode={'cover'}>
            <WebView
              style={styles.webViewStyle}
              source={{uri: url}}
              //cacheEnabled={true}
              onLoadEnd={() => this.setWebViewVisibleState()}
            />

            {!webViewLoaded && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size={'large'}
                  color={'white'}
                  style={styles.loadingStyle}
                />
              </View>
            )}
          </ImageBackground>
        </SafeAreaView>
      </Modal>
    );
  }
}

WebViewClass.propTypes = {
  modalVisible: PropTypes.bool,
  url: PropTypes.string,
  closeModal: PropTypes.func,
};

WebViewClass.defaultProps = {
  modalVisible: false,
  url: '',
  closeModal: null,
};
