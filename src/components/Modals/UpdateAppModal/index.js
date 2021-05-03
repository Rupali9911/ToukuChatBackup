import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    FlatList,
    Image,
    Platform,
    ActivityIndicator,
    StyleSheet, ImageBackground,
} from 'react-native';
import Modal from 'react-native-modal';
import {Colors, Fonts, Images, Icons} from '../../../constants';
import Button from '../../Button';
import {translate} from '../../../redux/reducers/languageReducer';
import {UpdateAppModalStyles as style} from './styles';
import {normalize} from "../../../utils";

export default class UpdateAppModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            visible,
            onConfirm,
            title,
            confirmText,
            message,
            isLoading,
        } = this.props;
        return (
            <Modal isVisible={visible}>
                <View style={style.container}>
                    <Image
                        source={Images.img_upgrade}
                        style={style.bgImage}
                        resizeMode="stretch"/>
                    <View style={style.bgImage}>
                        <View style={{flex: 1.4}}/>
                    <View style={style.innerContainer}>
                            <Text style={style.alertTitleTextStyle}>{title}</Text>
                            <Text style={style.alertmessageTextStyel}>
                                {message ? message : ''}
                            </Text>
                        <View style={style.singleBtnSubVw}>
                            <Button
                                title={confirmText?confirmText:translate('pages.xchat.toastr.sure')}
                                type={'primary'}
                                onPress={isLoading ? null : onConfirm}
                                isRounded={false}
                                loading={isLoading}
                                fontSize={normalize(12)}
                                height={37}
                            />
                        </View>
                    </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

