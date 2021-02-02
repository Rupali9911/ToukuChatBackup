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
import {appleStoreUserId, closeBoxImage, Fonts, openBoxImage} from "../../constants";
import ConfirmationModal from "./ConfirmationModal";
import UpdatePhoneModal from "./UpdatePhoneModal";
import {
    addNewSendMessage, assetXPValueOfChannel, checkLoginBonusOfChannel,
    deleteChannelMessage, deleteMultipleChannelMessage,
    editChannelMessage,
    getChannelConversations, getLocalFollowingChannels, getLoginBonusOfChannel, pinChannel,
    readAllChannelMessages, resetChannelConversation, selectLoginJackpotOfChannel,
    sendChannelMessage, setChannelConversation, unpinChannel
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
            is_bonus_opened: 1
        }

    }

   async UNSAFE_componentWillMount() {
        console.log('Bonus will mount')
       let is_bonus_opened = await AsyncStorage.getItem('is_bonus_opened');
        this.setState({is_bonus_opened: is_bonus_opened})
    }

    selectedLoginBonus = (key) => {
        if (!this.props.userData.phone) {
            this.setState({showPhoneUpdateModal: true});
            return;
        }

        this.setState({loadingJackpot: true});

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
        if (amount === 0) {
            return openBoxImage.open_box;
        } else if (amount >= 10 && amount <= 100) {
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
                parseInt(jackpotData.picked_amount),
                parseInt(jackpotData.missed1_amount),
                parseInt(jackpotData.missed2_amount),
            ];
        } else if (jackpotData.picked_option == 2) {
            array = [
                parseInt(jackpotData.missed1_amount),
                parseInt(jackpotData.picked_amount),
                parseInt(jackpotData.missed2_amount),
            ];
        } else if (jackpotData.picked_option == 3) {
            array = [
                parseInt(jackpotData.missed1_amount),
                parseInt(jackpotData.missed2_amount),
                parseInt(jackpotData.picked_amount),
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
        });
    };

    render() {
        const {currentChannel, visible, bonusXP} = this.props;
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
                            <Text style={styles.bonusTextHeading}>
                                {this.state.jackpotData
                                    ? translate('pages.xchat.seeYouTomorrow')
                                    : translate('pages.xchat.loginBonusText')}
                            </Text>
                            <Text style={styles.bonusTitleText}>
                                {translate('pages.xchat.jackPot')}{' '}
                                <Text style={{fontSize: normalize(25), fontWeight: 'bold'}}>
                                    {bonusXP}
                                </Text>{' '}
                                <Text
                                    style={{fontSize: normalize(15), fontFamily: Fonts.regular, fontWeight: '300'}}>
                                    {'XP'}
                                </Text>
                            </Text>
                            {this.state.assetXPValue ? (
                                <Text style={styles.bonusTitleText}>
                                    {translate('pages.xchat.youOwn')}{' '}
                                    <Text style={{fontSize: normalize(25), fontWeight: 'bold'}}>
                                        {this.state.assetXPValue.XP + ''}
                                    </Text>{' '}
                                    <Text
                                        style={{
                                            fontSize: normalize(15),
                                            fontFamily: Fonts.regular,
                                            fontWeight: '300',
                                        }}>
                                        {'XP'}
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
                                                            )[0],
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
                                                    {this.getAmountValue(this.state.jackpotData)[0] +
                                                    ''}{' '}
                                                    XP
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
                                                            )[1],
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
                                                    {this.getAmountValue(this.state.jackpotData)[1] +
                                                    ''}{' '}
                                                    XP
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
                                                            )[2],
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
                                                    {this.getAmountValue(this.state.jackpotData)[2] +
                                                    ''}{' '}
                                                    XP
                                                </Text>
                                            </View>
                                        ) : null}
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: normalize(14),
                                paddingHorizontal: normalize(5),
                                fontWeight: '300',
                                color: '#fff',
                            }}>
                            {translate('pages.xchat.gamePlatformText')}
                        </Text>
                        <TouchableOpacity
                            style={{margin: normalize(20)}}
                            onPress={this.onRequestClose.bind(this)}>
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
                        title={translate('pages.xchat.touku')}
                        message={translate('swal.NeedToAddPhoneNumber')}
                    />
                    <UpdatePhoneModal
                        visible={isUpdatePhoneModalVisible}
                        onRequestClose={() =>
                            this.setState({isUpdatePhoneModalVisible: false})
                        }
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
        marginTop: 20,
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
};

export default connect(mapStateToProps, mapDispatchToProps)(BonusModal);
