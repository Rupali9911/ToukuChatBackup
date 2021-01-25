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
import { getChannelsById, getChannels } from '../../storage/Service';
import { realmToPlainObject, normalize } from '../../utils';

class AmazonExchange extends Component {
    constructor(props) {
        super(props);
        setI18nConfig(this.props.selectedLanguageItem.language_name);
        this.state = {
            orientation: 'PORTRAIT',
            isExchange: false,
            loading: false,
            tp_point: 0,
            point_in_yen: 0
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

    render() {
        const { isExchange, loading } = this.state;
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
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                flex: 0.75,
                                fontSize: normalize(15),
                                fontWeight: '600',
                                color: '#0a1f44',
                            }}>{translate('pages.adWall.miniExchangePoint')}</Text>
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
                            }}>{translate('pages.xchat.free')}</Text>
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
                            marginHorizontal: 20,
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
                                    }} />
                            </View>
                            <View style={{ flex: 0.1 }} />
                            <View style={{ flex: 1 }}>
                                <Button
                                    type={isExchange?'':'translucent'}
                                    title={translate('pages.adWall.exchange')}
                                    onPress={() => {
                                        this.setState({isExchange: !this.state.isExchange})
                                    }} />
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
                                        flex: 0.75,
                                        fontSize: normalize(15),
                                        fontWeight: '600',
                                        color: '#0a1f44',
                                    }}>{translate('pages.adWall.currentPointHeld')}</Text>

                                    <Text style={{
                                        flex: 0.25,
                                        fontSize: normalize(15),
                                        textAlign: 'right',
                                        fontWeight: '600',
                                        color: '#ee6f70',
                                    }}>0TP</Text>
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
                                    <TextInput style={{
                                        flex: 1,
                                        fontSize: normalize(14),
                                        fontWeight: '600',
                                        color: '#0a1f44',
                                        textAlign: 'right'
                                    }}
                                    value={this.state.tp_point}
                                        onChangeText={(text) => {
                                            this.setState({ tp_point: text, point_in_yen: text })
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: normalize(14),
                                        fontWeight: '600',
                                        color: '#0a1f44',
                                        textAlign: 'right'
                                    }}>TP</Text>
                                    <Image source={Images.convert_img} style={{ marginHorizontal: 15}}/>
                                    <Text numberOfLines={1} style={{
                                        flex: 0.9,
                                        fontSize: normalize(14),
                                        fontWeight: '600',
                                        color: '#0a1f44',
                                        textAlign: 'right'
                                    }}>{this.state.point_in_yen}</Text>
                                    <Text numberOfLines={1} style={{
                                        fontSize: normalize(14),
                                        fontWeight: '600',
                                        color: '#0a1f44',
                                        textAlign: 'right'
                                    }}>YEN</Text>
                                </View>
                                <View style={{ width: '60%', alignSelf: 'center', marginTop: 15 }}>
                                    <Button
                                        type={isExchange ? '' : 'translucent'}
                                        title={translate('pages.adWall.confirm')}
                                        onPress={() => {
                                            
                                        }} />
                                </View>
                        </View>
                        :null}
                    </View>
                </KeyboardAwareScrollView>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(AmazonExchange);
