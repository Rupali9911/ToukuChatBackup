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

    }

    closeModal(){
        console.log('closeModal')
        this.props.closeModal()
    }

    render() {
        const {modalVisible, url, webViewLoaded} = this.props;
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
                    cacheEnabled={true}/>
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

