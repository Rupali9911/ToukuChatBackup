import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { exchangeHistoryStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import { Colors, Fonts, Images, Icons } from '../../constants';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import S3uploadService from '../../helpers/S3uploadService';

import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import {
    followChannel,
    setCurrentChannel,
} from '../../redux/reducers/channelReducer';
import {
    getExchangeHistory,
    getAmazonExchangeHistory,
    getBtcExchangeHistory
} from '../../redux/reducers/userReducer';
import { getChannelsById, getChannels } from '../../storage/Service';
import { realmToPlainObject, normalize } from '../../utils';
import { RadioButton } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import { ListLoader } from '../../components/Loaders';
import moment from 'moment';

class ExchangeHistory extends Component {
    constructor(props) {
        super(props);
        setI18nConfig(this.props.selectedLanguageItem.language_name);
        this.state = {
            orientation: 'PORTRAIT',
            loading: false,
            amazonLoading: false,
            btcLoading: false,
            option: 1,
            allHistoryResponse: null,
            allHistory: [],
            amazonHistoryResponse: null,
            amazonHistory: [],
            btcHistoryResponse: null,
            btcHistory: []
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
        this.getAllExchangeHistory();
        this.getAmazonHistory();
        this.getBtcHistory();
    }

    _orientationDidChange = (orientation) => {
        this.setState({ orientation });
    };

    getAllExchangeHistory = () => {
        this.setState({loading: true});
        this.props.getExchangeHistory()
            .then((res) => {
                console.log('res', res);
                this.setState({loading: false});
                if(res){
                    this.setState({allHistory: res.results || [], allHistoryResponse: res});
                }
            }).catch((err) => {
                this.setState({loading: false});
                console.log('err', err);
            });
    }

    getAmazonHistory = () => {
        this.setState({amazonLoading: true});
        this.props.getAmazonExchangeHistory()
        .then((res)=>{
            this.setState({amazonLoading: false});
            if(res){
                this.setState({amazonHistory: res.results || [], amazonHistoryResponse: res});
            }
        }).catch((err)=>{
            this.setState({amazonLoading: false});
                console.log('err', err);
        });
    }

    getBtcHistory = () => {
        this.setState({btcLoading: true});
        this.props.getBtcExchangeHistory()
        .then((res)=>{
            this.setState({btcLoading: false});
            if(res){
                this.setState({btcHistory: res.results || [], btcHistoryResponse: res});
            }
        }).catch((err)=>{
            this.setState({btcLoading: false});
                console.log('err', err);
        });
    }

    exchangeTypeText = (type) => {
        if(type === 'AMAZON'){
            return translate('pages.adWall.amazonExchangeHistory');
        }else if(type === 'BTC'){
            return translate('pages.adWall.btcExchangeHistory');
        }
        return type;
    }

    render() {
        const { isExchange, option, allHistory, amazonHistory, btcHistory, loading, amazonLoading, btcLoading } = this.state;
        const listData = option==1?allHistory:option==2?amazonHistory:btcHistory;
        const listLoading = option==1?loading:option==2?amazonLoading:btcLoading;
        return (
            <View style={[globalStyles.container, { backgroundColor: Colors.white }]}>
                <HeaderWithBack
                    onBackPress={() => this.props.navigation.goBack()}
                    title={translate('pages.adWall.exchangeHistory')}
                    isCentered
                />
                <View style={{flex:1}}>
                    <View style={{ flexDirection:'row', borderBottomColor: '#c5c1c1', borderBottomWidth: 1 }}>
                        <TouchableOpacity style={{flex: 1,paddingVertical: 15, alignItems:'center'}}
                            onPress={()=>this.setState({option:1})}>
                            <Text style={{fontSize: normalize(13), color: option===1?'#ff00a3':'#0a1f44'}}>{translate('pages.adWall.allExchangeHistory')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1,paddingVertical: 15, alignItems:'center'}}
                            onPress={()=>this.setState({option:2})}>
                            <Text style={{fontSize: normalize(13), color: option===2?'#ff00a3':'#0a1f44'}}>{translate('pages.adWall.amazonExchangeHistory')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1,paddingVertical: 15, alignItems:'center'}}
                            onPress={()=>this.setState({option:3})}>
                            <Text style={{fontSize: normalize(13), color: option===3?'#ff00a3':'#0a1f44'}}>{translate('pages.adWall.btcExchangeHistory')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1, paddingHorizontal: 15, paddingVertical: 10, paddingBottom:20}}>
                        {listLoading ?
                            <ListLoader />
                        : listData.length > 0
                                ? <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={listData}
                                    renderItem={({ item, index }) => {
                                        let amount = Math.round(item.amount);
                                        return (
                                            <View style={{ borderColor: '#ff0078', borderWidth: 1, flexDirection: 'row', padding: 10, borderRadius: 10, marginBottom: 10, alignItems:'center' }}>
                                                <Image source={item.exchange_type === 'AMAZON' ? Images.amazon_img : Images.bitcoin_img} />
                                                <View style={{ flex:3, marginLeft: 10 }}>
                                                    <Text style={{ fontSize: normalize(13), fontWeight: 'bold' }}>{this.exchangeTypeText(item.exchange_type)}</Text>
                                                    <Text>{moment(item.updated).format("YYYY.MM.DD, HH:mm")}</Text>
                                                    <View style={{flexDirection:'row'}}>
                                                        <Text style={{ color: '#ff00a3' }}>Status: </Text>
                                                        <Text style={{flex:1}}>{item.status!=='PENDING'?item.status:translate('pages.adWall.processing')} {translate('pages.adWall.processingDetail')}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ alignItems: 'flex-end' }}>
                                                    <Text style={{fontSize: normalize(10)}}>{item.amount_type}<Text style={{ fontSize: normalize(13) }}>{amount}</Text></Text>
                                                    <Image source={Icons.icon_drop_down} style={{ width: 15, height: 10 }} />
                                                    <Text style={{ color: '#ff00a3' }}>¥<Text style={{ fontSize: normalize(20), fontFamily: Fonts.regular }}>{amount}</Text></Text>
                                                </View>
                                            </View>
                                        );
                                    }}
                                /> :
                                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: normalize(16)}}>{translate('pages.adWall.noExchageHistory')}</Text>
                                </View>
                        }
                    </View>
                </View>
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
    getExchangeHistory,
    getAmazonExchangeHistory,
    getBtcExchangeHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeHistory);
