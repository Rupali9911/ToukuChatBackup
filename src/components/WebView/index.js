import React, {Component} from 'react';
import {
    SafeAreaView,
    View,
    Image,
    Modal, Text, TouchableOpacity
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Icons} from "../../constants";
import PropTypes from 'prop-types';

export default class WebViewClass extends Component {
    constructor(props) {
        super(props);

    }

    closeModal(){
        console.log('closeModal')
        this.props.closeModal()
    }

    render() {
        const {modalVisible, url} = this.props;

        return (
            <SafeAreaView style={{flex: 1}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                >
                    <TouchableOpacity
                        style={{height: 40, width: 40, top: 20}}
                        onPress={() => this.closeModal()}
                    >
                        <Text >Close</Text>
                    </TouchableOpacity>

                <WebView
                    style={{backgroundColor : 'transparent'}}
                    source={{uri: url, headers: {"Cache-Control": "no-cache"}}}
                    cacheEnabled={false}/>
                </Modal>
            </SafeAreaView>
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
