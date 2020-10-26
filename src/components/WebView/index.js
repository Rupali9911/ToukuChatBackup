import React, {Component} from 'react';
import {
    SafeAreaView,
    View,
    Image,
    ActivityIndicator,
    Modal, Text, TouchableOpacity, ImageBackground
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Icons, Images} from "../../constants";
import PropTypes from 'prop-types';
import {
    translate,
} from '../../redux/reducers/languageReducer';

export default class WebViewClass extends Component {
    constructor(props) {
        super(props);
        this.state={
            webViewLoaded: false
        }
    }

    closeModal(){
        console.log('closeModal')
        this.props.closeModal()
    }

    setWebViewVisibleState () {
        const { webViewLoaded} = this.state
        if (!this.state.webViewLoaded) {
            console.log('Webview loaded')
            setTimeout( () => {
                this.setState({ webViewLoaded: true })
            },1500);
        }
    }

    render() {
        const {modalVisible, url} = this.props;
        const {webViewLoaded} = this.state;
        console.log('URL to webview', url)
        return (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                >
                    <SafeAreaView style={{flex: 1}}>
                    <TouchableOpacity
                        style={{height: 20, width: 60, marginLeft: 10}}
                        onPress={() => this.closeModal()}
                    >
                        <Text >{translate('common.close')}</Text>
                    </TouchableOpacity>
                    <ImageBackground source={Images.image_touku_bg_phone}
                                     style={{flex:1}} resizeMode={'cover'}>
                <WebView
                    style={{backgroundColor : 'transparent'}}
                    source={{uri: url}}
                    //cacheEnabled={true}
                    onLoadEnd={() => this.setWebViewVisibleState() }
                />

                        {!webViewLoaded && (
                            <View style={{width: '100%', height: '100%', position: 'absolute'}}>
                                <ActivityIndicator size="large" color="white" style={{position: 'absolute',top: 0, left: 0, right: 0, bottom: 0}} />
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
    closeModal: PropTypes.func
};

WebViewClass.defaultProps = {
    modalVisible: false,
    url: '',
    closeModal: null
};

