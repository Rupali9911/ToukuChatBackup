import React, {Component} from 'react';
import {
    SafeAreaView,
    View,
    Image,
    Modal, Text, TouchableOpacity, Dimensions, StyleSheet
} from 'react-native';
import {Icons, registerUrl, Colors, Fonts} from "../../constants";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {setAppLanguage, translate, userLanguage} from "../../redux/reducers/languageReducer";
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

class QRCodeClass extends Component {
    constructor(props) {
        super(props);

    }

    closeModal(){
        console.log('closeModal')
        this.props.closeModal()
    }

    render() {
        const {modalVisible, userData} = this.props;

        return (
                modalVisible ? (<View style={styles.mainContainer}>
                        <View style={styles.subCont}/>

                        <View style={{width: 250, marginTop: (Dimensions.get('window').height/2)-125}}>
                            <LinearGradient
                                start={{x: 0.1, y: 0.7}}
                                end={{x: 0.5, y: 0.2}}
                                locations={[0.1, 0.6, 1]}
                                colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
                                style={styles.lgVw}>
                                <Text style={styles.qrTxt}>{translate('pages.setting.QRCode')}</Text>
                                <TouchableOpacity
                                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                    style={styles.touchCross}
                                    onPress={() => this.closeModal()}>
                                    <AntDesign name="close" color={Colors.white} />
                                </TouchableOpacity>
                            </LinearGradient>

                            <View style={styles.vwQr}>
                                <View style={{top: 23}}>
                                <QRCode
                                    size={70}
                                    value={registerUrl + userData.invitation_code}
                                />
                                </View>
                            </View>
                        </View>
                    </View>)
                    : null
        );
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    subCont: {
        position: 'absolute',
        backgroundColor: Colors.black,
        opacity: 0.5,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    lgVw:{
        height: 30,
        flexDirection: 'row'
    },
    qrTxt:{
        flex: 9,
        color: Colors.white,
        fontFamily: Fonts.light,
        fontSize: 13,
        marginStart: 10,
        alignSelf: 'center'
    },
    touchCross:{
        height: 20,
        width: 20,
        alignSelf: 'center',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    vwQr:{
        height: 120,
        alignItems: 'center',
        backgroundColor: Colors.white
    }
})

QRCodeClass.propTypes = {
    modalVisible: PropTypes.bool,
    closeModal: PropTypes.func,
};

QRCodeClass.defaultProps = {
    modalVisible: false,
    closeModal: null
};

const mapStateToProps = (state) => {
    return {
        userData: state.userReducer.userData,
    };
};

const mapDispatchToProps = {
    setAppLanguage,
    userLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeClass);
