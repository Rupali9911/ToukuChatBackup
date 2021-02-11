import React, { Component } from 'react';
import { View, Text, Image, TextInput } from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { amazonExchangeStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import { Colors, Fonts, Images } from '../../constants';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import S3uploadService from '../../helpers/S3uploadService';

import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import {
    followChannel,
    setCurrentChannel,
} from '../../redux/reducers/channelReducer';
import {
    sendOtpToAddAmount,
    verifyOtpToAddAmount
} from '../../redux/reducers/userReducer';
import { getChannelsById, getChannels } from '../../storage/Service';
import { realmToPlainObject, normalize, isNumeric } from '../../utils';
import {
    ConfirmationModal,
    UpdatePhoneModal,
    VerifyOtpModal,
  } from '../../components/Modals';

class AmazonExchange extends Component {
    constructor(props) {
        super(props);
        setI18nConfig(this.props.selectedLanguageItem.language_name);
        this.state = {
            orientation: 'PORTRAIT',
            isExchange: false,
            loading: false,
            tp_point: 5,
            point_in_yen: 0,
            showPhoneUpdateModal: false,
            isUpdatePhoneModalVisible: false,
            verifyOtpModalVisible: false,
            sendOtpLoading: false,
            verifyOtpLoading: false
        };
        this.S3uploadService = new S3uploadService();
        this.isPressed = false;
    }

    static navigationOptions = () => {
        return {
            headerShown: false,
        };
    };

    UNSAFE_componentWillMount() {
        const initial = Orientation.getInitialOrientation();
        this.setState({ orientation: initial });
    }

    componentDidMount() {
        Orientation.addOrientationListener(this._orientationDidChange);
        // console.log('this.props.getChannels', this.props.followingChannels);
    }

    _orientationDidChange = (orientation) => {
        this.setState({ orientation });
    };

    checkChannelFollow = (id) => {
        var channels = getChannelsById(id);
        if (channels && channels.length > 0) {
            return true;
        } else {
            return false;
        }
    };

    onCancel = () => {
        this.setState({
          showPhoneUpdateModal: false,
        });
      };

    sendOtpToAdd = () => {
        this.setState({sendOtpLoading: true});
        this.props.sendOtpToAddAmount()
            .then((res)=>{
                if(res && res.status){
                    this.setState({sendOtpLoading: false});
                    Toast.show({
                        title: 'Touku',
                        text: translate(res.message),
                        type: 'positive',
                    });
                    this.setState({verifyOtpModalVisible: true});
                }
            }).catch((err)=>{
                if(err){
                    Toast.show({
                        title: 'Touku',
                        text: translate(err.message),
                        type: 'primary',
                    });
                }
                this.setState({sendOtpLoading: false});
            });
    }

    verifyOtpToAddAmount = (amount, code) => {
        let data = {
            amount: amount,
            code: code,
            exchange_type: "AMAZON",
            amount_type: "TP"
        }

        this.setState({ verifyOtpLoading: true });
        this.props.verifyOtpToAddAmount(data)
            .then((res) => {
                this.setState({ verifyOtpLoading: false });
                if (res && res.status) {
                    Toast.show({
                        title: 'Touku',
                        text: translate('pages.adWall.exchangesuccessfully'),
                        type: 'positive',
                    });
                    this.setState({ verifyOtpModalVisible: false });
                }
            }).catch((err) => {
                console.log('error_verify', err);
                Toast.show({
                    title: 'Touku',
                    text: translate(err.response.data.errors),
                    type: 'primary',
                });
                this.setState({ verifyOtpLoading: false });
            });
    } 

    render() {
        const {
            orientation,
            isExchange,
            showPhoneUpdateModal,
            isUpdatePhoneModalVisible,
            loading,
            verifyOtpModalVisible,
            sendOtpLoading,
            verifyOtpLoading
        } = this.state;
        return (
            <View
                style={[globalStyles.container, { backgroundColor: Colors.white }]}>
                <HeaderWithBack
                    onBackPress={() => this.props.navigation.goBack()}
                    title={translate('pages.adWall.amazonExchange')}
                    isCentered
                />
                <KeyboardAwareScrollView
                    scrollEnabled
                    // enableOnAndroid={true}
                    keyboardShouldPersistTaps={'handled'}
                    // extraScrollHeight={100}
                    extraHeight={100}
                    behavior={'position'}
                    contentContainerStyle={amazonExchangeStyles.mainContainer}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center', }}>
                        <Image source={Images.amazon_logo} style={{ width: 170, height: 80 }} resizeMode={'contain'} />
                    </View>

                    <View style={{ marginTop: 10, justifyContent: 'center' }}>
                        <View style={{
                            flexDirection: 'row',
                            padding: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#e4e4e4',
                            // alignItems: 'center'
                        }}>
                            <View style={{flex:0.75}}>
                                <Text style={{
                                    // flex: 0.75,
                                    fontSize: normalize(15),
                                    fontWeight: '600',
                                    color: '#0a1f44',
                                }}>{translate('pages.adWall.miniExchangePoint')}</Text>
                                <Text style={{
                                    // flex: 0.75,
                                    fontSize: normalize(10),
                                    fontWeight: '600',
                                    color: '#ee6f70',
                                }}>{translate('pages.adWall.firstTimeExchangeText')}</Text>
                            </View>
                            <Text style={{
                                fontSize: normalize(15),
                                fontWeight: '600',
                                color: '#0a1f44',
                            }}>:</Text>
                            <Text style={{
                                flex: 0.25,
                                fontSize: normalize(15),
                                textAlign: 'right',
                                fontWeight: '600',
                                color: '#ee6f70',
                            }}>500TP</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            padding: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#e4e4e4',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                flex: 0.75,
                                fontSize: normalize(15),
                                fontWeight: '600',
                                color: '#0a1f44',
                            }}>{translate('pages.adWall.exchangeFee')}</Text>
                            <Text style={{
                                fontSize: normalize(15),
                                fontWeight: '600',
                                color: '#0a1f44',
                            }}>:</Text>
                            <Text style={{
                                flex: 0.25,
                                fontSize: normalize(15),
                                textAlign: 'right',
                                fontWeight: '600',
                                color: '#ee6f70',
                            }}>{translate('pages.xchat.planFreeText')}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            padding: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#e4e4e4',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                flex: 0.75,
                                fontSize: normalize(15),
                                fontWeight: '600',
                                color: '#0a1f44',
                            }}>{translate('pages.adWall.twoStepVerificaion')}</Text>
                            <Text style={{
                                fontSize: normalize(15),
                                fontWeight: '600',
                                color: '#0a1f44',
                            }}>:</Text>
                            <Text style={{
                                flex: 0.25,
                                fontSize: normalize(15),
                                textAlign: 'right',
                                fontWeight: '600',
                                color: '#ee6f70',
                            }}>{translate('pages.adWall.yes')}</Text>
                        </View>
                        <View style={{
                            marginTop: 10,
                            marginHorizontal: 15,
                            paddingHorizontal: 10,
                            paddingVertical: 15, 
                            backgroundColor: Colors.light_pink,
                            borderRadius: 10
                            }}>
                                <Text>{translate('pages.adWall.exchangeDaysNumber')}</Text>
                        </View>
                        <View style={{
                            marginTop: 10,
                            marginHorizontal: 15,
                            paddingHorizontal: 10,
                            paddingVertical: 5, 
                            }}>
                                <Text>{translate('pages.adWall.sendItToYourEmail')}</Text>
                        </View>
                        <View style={{
                            marginHorizontal: 10,
                            marginVertical: 15,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{ flex: 1 }}>
                                <Button
                                    type={'translucent'}
                                    title={translate('pages.adWall.exchangeHistory')}
                                    onPress={() => {
                                        this.setState({isExchange: !this.state.isExchange})
                                        this.props.navigation.navigate('ExchangeHistoryScreen');
                                    }} 
                                    fontSize={normalize(13)}/>
                            </View>
                            <View style={{ flex: 0.1 }} />
                            <View style={{ flex: 1 }}>
                                <Button
                                    type={isExchange?'':'translucent'}
                                    title={translate('pages.adWall.exchange')}
                                    onPress={() => {
                                        this.setState({isExchange: !this.state.isExchange})
                                    }} 
                                    fontSize={normalize(13)}/>
                            </View>
                        </View>
                        {isExchange?
                        <View>
                                <View style={{
                                    flexDirection: 'row',
                                    padding: 15,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#e4e4e4',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        flex: 1,
                                        fontSize: normalize(15),
                                        fontWeight: '600',
                                        color: '#0a1f44',
                                    }}>{translate('pages.adWall.currentPointHeld')}</Text>

                                    <Text style={{
                                        fontSize: normalize(15),
                                        textAlign: 'right',
                                        fontWeight: '600',
                                        color: '#ee6f70',
                                    }}>{parseInt(this.props.userData.total_tp)}TP</Text>
                                </View>
                                <View style={{
                                    marginTop: 10,
                                    marginHorizontal: 15,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                }}>
                                    <Text style={{fontSize: normalize(12), fontWeight: '500'}}>{translate('pages.adWall.amountOfExchangePoint')}</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    borderColor: '#ff728a',
                                    borderWidth: 1,
                                    borderRadius: 30,
                                    alignItems:'center'
                                }}>
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            fontSize: normalize(14),
                                            fontWeight: '600',
                                            color: '#0a1f44',
                                            textAlign: 'right'
                                        }}
                                        keyboardType={'numeric'}
                                        value={this.state.tp_point + ""}
                                        onChangeText={(text) => {
                                            if (isNumeric(text) || text.length==0) {
                                                this.setState({ tp_point: text, point_in_yen: text })
                                            }
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: normalize(14),
                                        fontWeight: '600',
                                        color: '#0a1f44',
                                        textAlign: 'right',
                                        marginLeft:5
                                    }}>TP</Text>
                                    <Image source={Images.convert_img} style={{ marginHorizontal: 15}}/>
                                    <Text numberOfLines={1} style={{
                                        flex: 0.9,
                                        fontSize: normalize(14),
                                        fontWeight: '600',
                                        color: '#0a1f44',
                                        textAlign: 'right'
                                    }}>{this.state.tp_point}</Text>
                                    <Text numberOfLines={1} style={{
                                        fontSize: normalize(14),
                                        fontWeight: '600',
                                        color: '#0a1f44',
                                        textAlign: 'right',
                                        marginLeft:5
                                    }}>{translate('pages.xchat.yen')}</Text>
                                </View>
                                <View style={{ width: '60%', alignSelf: 'center', marginTop: 15 }}>
                                    <Button
                                        type={isExchange ? '' : 'translucent'}
                                        title={translate('pages.adWall.confirm')}
                                        onPress={() => {

                                            if(this.props.userData.total_tp<5){
                                                Toast.show({
                                                    title: 'Touku',
                                                    text: translate(`pages.adWall.dontHaveSufficientAmount`),
                                                    type: 'primary',
                                                });
                                                return;
                                            }
                                            if(this.state.tp_point.length==0 || parseFloat(this.state.tp_point)<5){
                                                Toast.show({
                                                    title: 'Touku',
                                                    text: translate(`pages.adWall.minimumAmountOfTp`),
                                                    type: 'primary',
                                                });
                                                return;
                                            }
                                            if(parseFloat(this.state.tp_point)>this.props.userData.total_tp){
                                                Toast.show({
                                                    title: 'Touku',
                                                    text: translate(`pages.adWall.dontHaveSufficientAmount`),
                                                    type: 'primary',
                                                });
                                               return; 
                                            }
                                            if (!this.props.userData.phone) {
                                                this.setState({showPhoneUpdateModal: true});
                                                return;
                                            }
                                            this.sendOtpToAdd();
                                        }}
                                        loading={sendOtpLoading} 
                                        />
                                </View>
                        </View>
                        :null}
                    </View>
                </KeyboardAwareScrollView>
                <ConfirmationModal
                    visible={showPhoneUpdateModal}
                    onCancel={this.onCancel.bind(this)}
                    onConfirm={() => {
                        this.setState({ showPhoneUpdateModal: false }, () => {
                            setTimeout(() => {
                                this.setState({ isUpdatePhoneModalVisible: true });
                            }, 500);
                        });
                    }}
                    orientation={orientation}
                    confirmText={translate('swal.ok')}
                    title={translate('pages.xchat.touku')}
                    message={translate('pages.register.toastr.enterPhoneNumber')}
                />
                <UpdatePhoneModal
                    visible={isUpdatePhoneModalVisible}
                    onRequestClose={() =>
                        this.setState({ isUpdatePhoneModalVisible: false })
                    }
                    onVerificationComplete={() => {
                        this.sendOtpToAdd();
                    }}
                />
                <VerifyOtpModal
                    visible={verifyOtpModalVisible}
                    onRequestClose={() =>
                        this.setState({ verifyOtpModalVisible: false })
                    }
                    onVerify={(code)=>{
                        let amount = parseFloat(this.state.tp_point);
                        this.verifyOtpToAddAmount(amount,code);
                    }}
                    loading={verifyOtpLoading}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        selectedLanguageItem: state.languageReducer.selectedLanguageItem,
        userData: state.userReducer.userData,
        userFriends: state.friendReducer.userFriends,
        friendLoading: state.friendReducer.loading,
        groupLoading: state.groupReducer.loading,
        followingChannels: state.channelReducer.followingChannels,
    };
};

const mapDispatchToProps = {
    followChannel,
    setCurrentChannel,
    sendOtpToAddAmount,
    verifyOtpToAddAmount,
};

export default connect(mapStateToProps, mapDispatchToProps)(AmazonExchange);
