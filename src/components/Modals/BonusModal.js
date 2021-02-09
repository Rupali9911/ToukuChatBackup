import React, {Component} from 'react';
import {
    ActivityIndicator, Dimensions,
    Image,
    ImageBackground,
    Modal,
    SafeAreaView, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {globalStyles} from "../../styles";
import ChatHeader from "../Headers/ChatHeader";
import {translate, translateMessage} from "../../redux/reducers/languageReducer";
import {normalize} from "../../utils";
import {appleStoreUserId, closeBoxImage, Fonts, openBoxImage, Images} from "../../constants";
import ConfirmationModal from "./ConfirmationModal";
import UpdatePhoneModal from "./UpdatePhoneModal";
import {
    addNewSendMessage, assetXPValueOfChannel, checkLoginBonusOfChannel,
    deleteChannelMessage, deleteMultipleChannelMessage,
    editChannelMessage,
    getChannelConversations, getLocalFollowingChannels, getLoginBonusOfChannel, pinChannel,
    readAllChannelMessages, resetChannelConversation, selectLoginJackpotOfChannel,
    sendChannelMessage, setChannelConversation, unpinChannel, selectRegisterJackpot
} from "../../redux/reducers/channelReducer";
import {setCommonChatConversation} from "../../redux/reducers/commonReducer";
import {connect} from 'react-redux';
import bonusImage from '../../../assets/images/bonus_bg.png';
import Toast from "../Toast";
import {Avatar} from 'react-native-paper';
import Orientation from "react-native-orientation";
import AsyncStorage from "@react-native-community/async-storage";
const dimensions = Dimensions.get('window');

class BonusModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bonusModal: false,
            selectedKey: null,
            jackpotData: null,
            assetXPValue: null,
            loadingJackpot: false,
            showPhoneUpdateModal: false,
            isUpdatePhoneModalVisible: false,
        }

    }

    selectedLoginBonus = (key) => {
        // if (!this.props.userData.phone) {
        //     this.setState({showPhoneUpdateModal: true});
        //     return;
        // }
        this.setState({loadingJackpot: true});

        if(this.props.registerBonus){
            this.props
            .selectRegisterJackpot({picked_option: key})
            .then((res) => {
                if (res) {
                    console.log('register jackpotData', res);
                    this.setState({jackpotData: res.data});
                    this.getAssetXpValue();
                    AsyncStorage.setItem('is_bonus_opened', 'true');
                }
                this.setState({loadingJackpot: false});
            })
            .catch((err) => {
                console.log('err', err);
                this.setState({loadingJackpot: false});
            });
        }else{
            this.props
            .selectLoginJackpotOfChannel({picked_option: key})
            .then((res) => {
                if (res) {
                    console.log('jackpotData', res);
                    this.setState({jackpotData: res.data});
                    this.getAssetXpValue();
                }
                this.setState({loadingJackpot: false});
            })
            .catch((err) => {
                console.log('err', err);
                this.setState({loadingJackpot: false});
            });
        }
    };

    getAssetXpValue = () => {
        this.props
            .assetXPValueOfChannel()
            .then((res) => {
                if (res) {
                    console.log('asset_xp', res);
                    if (res && res.data) this.setState({assetXPValue: res.data});
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };

    checkImageWithAmount = (amount) => {
        console.log('amount',amount);
        if (amount === 0) {
            return openBoxImage.open_box;
        } else if (amount >= 0 && amount <= 100) {
            return openBoxImage.less_gold;
        } else if (amount >= 100 && amount <= 1000) {
            return openBoxImage.mid_gold;
        } else if (amount >= 1000) {
            return openBoxImage.full_gold;
        }
    };

    getAmountValue = (jackpotData) => {
        var array = [];
        if (jackpotData.picked_option == 1) {
            array = [
                {amount: parseInt(jackpotData.picked_amount),type: jackpotData.picked_amount_type || "XP"},
                {amount: parseInt(jackpotData.missed1_amount),type: jackpotData.missed1_amount_type || "XP"},
                {amount: parseInt(jackpotData.missed2_amount),type: jackpotData.missed2_amount_type || "XP"},
            ];
        } else if (jackpotData.picked_option == 2) {
            array = [
                {amount: parseInt(jackpotData.missed1_amount),type: jackpotData.missed1_amount_type || "XP"},
                {amount: parseInt(jackpotData.picked_amount),type: jackpotData.picked_amount_type || "XP"},
                {amount: parseInt(jackpotData.missed2_amount),type: jackpotData.missed2_amount_type || "XP"},
            ];
        } else if (jackpotData.picked_option == 3) {
            array = [
                {amount: parseInt(jackpotData.missed1_amount),type: jackpotData.missed1_amount_type || "XP"},
                {amount: parseInt(jackpotData.missed2_amount),type: jackpotData.missed2_amount_type || "XP"},
                {amount: parseInt(jackpotData.picked_amount),type: jackpotData.picked_amount_type || "XP"},
            ];
        }
        return array;
    };


    onRequestClose = () => {
        this.props.onRequestClose();
    };

    onCancel = () => {
        this.setState({
            showPhoneUpdateModal: false
        },()=>{
            this.onRequestClose();
        });
    };

    getHintText = () => {
        const {registerBonus} = this.props;
        const {jackpotData} = this.state;

        if(registerBonus){
            return jackpotData?`${translate('pages.adWall.bonusUseText1')}\n${translate('pages.adWall.bonusUseText2')}\n${translate('pages.adWall.bonusUseText3')}`:translate('pages.xchat.amazonGiftCardText')
        }else{
            return jackpotData?`${translate('swal.xpusedForText')}`:`${translate('swal.extraCashWiningText')}\n${translate('swal.xpusedForText')}`
        }
    }

    getAssetValue = () => {
        if(this.state.jackpotData && this.state.jackpotData.picked_amount_type==="TP"){
            let amount = this.props.userData.total_tp+this.state.jackpotData.picked_amount;
            return `${parseInt(amount)}`;
        }else{
            return `${this.state.assetXPValue.XP}`;
        }
    }

    render() {
        const {currentChannel, visible, bonusXP, registerBonus} = this.props;
        //console.log('registerBonus', registerBonus, visible)
        const {
            showPhoneUpdateModal,
            orientation,
            isUpdatePhoneModalVisible,
        } = this.state;
        return (
            <Modal
                visible={visible}
                transparent
                onRequestClose={this.onRequestClose.bind(this)}>
                <View style={styles.bonusModalContainer}>
                    <SafeAreaView/>
                    <ImageBackground
                        source={bonusImage}
                        resizeMode={'cover'}
                        style={styles.bonusBgContainer}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.bonusTextHeading, {fontSize: normalize(20)}]}>
                                {this.state.jackpotData
                                    ? this.state.jackpotData.picked_amount>0 ? translate('pages.xchat.congratulations') : translate('pages.xchat.seeYouTomorrow')
                                    : registerBonus ? translate('pages.xchat.specialSignupBonus'): translate('pages.xchat.loginBonusText')}
                            </Text>
                            {/* {registerBonus?null:<Text style={styles.bonusTitleText}>
                                {translate('pages.xchat.jackPot')}{' '}
                                <Text style={{fontSize: normalize(25), fontWeight: 'bold'}}>
                                    {bonusXP}
                                </Text>{' '}
                                <Text
                                    style={{fontSize: normalize(15), fontFamily: Fonts.regular, fontWeight: '300'}}>
                                    {'XP'}
                                </Text>
                            </Text>} */}
                            {this.state.assetXPValue ? (
                                <Text style={styles.bonusTitleText}>
                                    {translate('pages.adWall.yourPoint')}{' '}
                                    <Text style={{fontSize: normalize(25), fontWeight: 'bold'}}>
                                        {/* {this.state.assetXPValue.XP + ''} */}
                                        {this.getAssetValue()}
                                    </Text>{' '}
                                    <Text
                                        style={{
                                            fontSize: normalize(15),
                                            fontFamily: Fonts.regular,
                                            fontWeight: '300',
                                        }}>
                                        {this.state.jackpotData.picked_amount_type?this.state.jackpotData.picked_amount_type:'XP'}
                                    </Text>
                                </Text>
                            ) : null}
                            {this.state.loadingJackpot ? (
                                <ActivityIndicator
                                    style={{marginTop: 10}}
                                    size={'large'}
                                    color={'#fff'}
                                />
                            ) : (
                                <View style={styles.bonusImageContainer}>
                                    <TouchableOpacity
                                        disabled={this.state.jackpotData}
                                        onPress={() => {
                                            this.selectedLoginBonus(1);
                                        }}
                                        style={{
                                            marginHorizontal: 10,
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <Image
                                                style={
                                                    this.state.jackpotData &&
                                                    this.state.jackpotData.picked_option == 1
                                                        ? styles.bonusImageZoom
                                                        : styles.bonusImage
                                                }
                                                source={{
                                                    uri: this.state.jackpotData
                                                        ? this.checkImageWithAmount(
                                                            this.getAmountValue(
                                                                this.state.jackpotData,
                                                            )[0].amount,
                                                        )
                                                        : closeBoxImage[0].value,
                                                }}
                                                resizeMode={'contain'}
                                            />
                                        </View>
                                        {this.state.jackpotData ? (
                                            <View
                                                style={{
                                                    flex: 1,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#fff',
                                                }}>
                                                <Text
                                                    style={{
                                                        textAlign: 'right',
                                                        color:
                                                            this.state.jackpotData &&
                                                            this.state.jackpotData.picked_option == 1
                                                                ? '#dbf875'
                                                                : '#fff',
                                                        fontSize: normalize(24),
                                                        fontFamily: Fonts.beba_regular,
                                                    }}>
                                                    {this.getAmountValue(this.state.jackpotData)[0].amount +
                                                    ''}{' '+this.getAmountValue(this.state.jackpotData)[0].type}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        disabled={this.state.jackpotData}
                                        onPress={() => {
                                            this.selectedLoginBonus(2);
                                        }}
                                        style={{
                                            marginHorizontal: 10,
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <Image
                                                style={
                                                    this.state.jackpotData &&
                                                    this.state.jackpotData.picked_option == 2
                                                        ? styles.bonusImageZoom
                                                        : styles.bonusImage
                                                }
                                                source={{
                                                    uri: this.state.jackpotData
                                                        ? this.checkImageWithAmount(
                                                            this.getAmountValue(
                                                                this.state.jackpotData,
                                                            )[1].amount,
                                                        )
                                                        : closeBoxImage[1].value,
                                                }}
                                                resizeMode={'contain'}
                                            />
                                        </View>
                                        {this.state.jackpotData ? (
                                            <View
                                                style={{
                                                    flex: 1,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#fff',
                                                }}>
                                                <Text
                                                    style={{
                                                        textAlign: 'right',
                                                        color:
                                                            this.state.jackpotData &&
                                                            this.state.jackpotData.picked_option == 2
                                                                ? '#dbf875'
                                                                : '#fff',
                                                        fontSize: normalize(24),
                                                        fontFamily: Fonts.beba_regular,
                                                    }}>
                                                    {this.getAmountValue(this.state.jackpotData)[1].amount +
                                                    ''}{' '+this.getAmountValue(this.state.jackpotData)[1].type}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        disabled={this.state.jackpotData}
                                        onPress={() => {
                                            this.selectedLoginBonus(3);
                                        }}
                                        style={{
                                            marginHorizontal: 10,
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <Image
                                                style={
                                                    this.state.jackpotData &&
                                                    this.state.jackpotData.picked_option == 3
                                                        ? styles.bonusImageZoom
                                                        : styles.bonusImage
                                                }
                                                source={{
                                                    uri: this.state.jackpotData
                                                        ? this.checkImageWithAmount(
                                                            this.getAmountValue(
                                                                this.state.jackpotData,
                                                            )[2].amount,
                                                        )
                                                        : closeBoxImage[2].value,
                                                }}
                                                resizeMode={'contain'}
                                            />
                                        </View>
                                        {this.state.jackpotData ? (
                                            <View
                                                style={{
                                                    flex: 1,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#fff',
                                                }}>
                                                <Text
                                                    style={{
                                                        textAlign: 'right',
                                                        color:
                                                            this.state.jackpotData &&
                                                            this.state.jackpotData.picked_option == 3
                                                                ? '#dbf875'
                                                                : '#fff',
                                                        fontSize: normalize(24),
                                                        fontFamily: Fonts.beba_regular,
                                                    }}>
                                                    {this.getAmountValue(this.state.jackpotData)[2].amount +
                                                    ''}{' '+this.getAmountValue(this.state.jackpotData)[2].type}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        {(!this.state.jackpotData && registerBonus)?
                            <Image
                                style={{width:'70%'}}
                                source={Images.amazon_gift_logo}
                                resizeMode={'contain'}
                            />
                        :null}
                        <Text
                            style={{
                                textAlign: registerBonus?'left':'center',
                                fontSize: normalize(12),
                                paddingHorizontal: normalize(5),
                                fontWeight: '300',
                                color: '#fff',
                            }}>
                            {/* {registerBonus?translate('pages.xchat.amazonGiftCardText'):translate('pages.xchat.gamePlatformText')} */}
                            {this.getHintText()}
                        </Text>
                        <TouchableOpacity
                            style={{margin: normalize(15)}}
                            onPress={()=>{
                                if (this.state.jackpotData && !this.props.userData.phone) {
                                    this.setState({showPhoneUpdateModal: true});
                                    return;
                                }
                                this.onRequestClose()
                            }}>
                            <Avatar.Icon
                                size={50}
                                icon="close"
                                color={'#fff'}
                                style={{backgroundColor: '#e2b2ac'}}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                    <ConfirmationModal
                        visible={showPhoneUpdateModal}
                        onCancel={this.onCancel.bind(this)}
                        onConfirm={() => {
                            this.setState({showPhoneUpdateModal: false}, () => {
                                setTimeout(() => {
                                    this.setState({isUpdatePhoneModalVisible: true});
                                }, 500);
                            });
                        }}
                        orientation={orientation}
                        confirmText={translate('swal.ok')}
                        title={translate('swal.AuthenticateNumber')}
                        message={translate('swal.NeedToAddPhoneNumber')}
                    />
                    <UpdatePhoneModal
                        visible={isUpdatePhoneModalVisible}
                        onRequestClose={() => {
                            this.setState({isUpdatePhoneModalVisible: false})
                            this.onRequestClose()
                        }}
                    />
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    bonusModalContainer: {
        flex: 1,
        backgroundColor: '#00000080',
        // paddingTop: 40,
    },
    bonusBgContainer: {
        flex: 1,
        margin: 20,
        borderRadius: 30,
        alignItems: 'center',
        overflow: 'hidden',
    },
    bonusTextHeading: {
        marginTop: normalize(20),
        // marginBottom:PixelRatio.getPixelSizeForLayoutSize(10),
        textAlign: 'center',
        fontSize: normalize(25),
        fontWeight: '300',
        color: '#ffd300',
        fontFamily: Fonts.regular,
    },
    bonusTitleText: {
        textAlign: 'center',
        fontSize: normalize(20),
        fontWeight: '300',
        color: '#fff',
        fontFamily: Fonts.beba_regular,
    },
    bonusImageContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        marginBottom: 20,
        marginTop: 10,
    },
    bonusImage: {
        width: Math.round(dimensions.width / 4),
        height: Math.round(dimensions.width / 4),
    },
    bonusImageZoom: {
        width: Math.round(dimensions.width / 3),
        height: Math.round(dimensions.width / 3),
    },
});

const mapStateToProps = (state) => {
    return {
        currentChannel: state.channelReducer.currentChannel,
        channelLoading: state.channelReducer.loading,
        userData: state.userReducer.userData,
        selectedLanguageItem: state.languageReducer.selectedLanguageItem,
        chatConversation: state.channelReducer.chatConversation,
    };
};

const mapDispatchToProps = {
    getChannelConversations,
    readAllChannelMessages,
    sendChannelMessage,
    translateMessage,
    editChannelMessage,
    deleteChannelMessage,
    deleteMultipleChannelMessage,
    setChannelConversation,
    resetChannelConversation,
    addNewSendMessage,
    getLoginBonusOfChannel,
    checkLoginBonusOfChannel,
    selectLoginJackpotOfChannel,
    assetXPValueOfChannel,
    setCommonChatConversation,
    getLocalFollowingChannels,
    pinChannel,
    unpinChannel,
    selectRegisterJackpot
};

export default connect(mapStateToProps, mapDispatchToProps)(BonusModal);
