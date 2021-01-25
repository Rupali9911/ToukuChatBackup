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
import { getChannelsById, getChannels } from '../../storage/Service';
import { realmToPlainObject, normalize } from '../../utils';
import { RadioButton } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

class ExchangeHistory extends Component {
    constructor(props) {
        super(props);
        setI18nConfig(this.props.selectedLanguageItem.language_name);
        this.state = {
            orientation: 'PORTRAIT',
            loading: false,
            option: 1
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
    }

    _orientationDidChange = (orientation) => {
        this.setState({ orientation });
    };

    render() {
        const { isExchange, option, loading } = this.state;
        return (
            <View style={[globalStyles.container, { backgroundColor: Colors.white }]}>
                <HeaderWithBack
                    onBackPress={() => this.props.navigation.goBack()}
                    title={translate('pages.adWall.exchangeHistory')}
                />
                <View style={{flex:1}}>
                    <View style={{ flexDirection:'row', borderBottomColor: '#c5c1c1', borderBottomWidth: 1 }}>
                        <TouchableOpacity style={{flex: 1,paddingVertical: 15, alignItems:'center'}}
                            onPress={()=>this.setState({option:1})}>
                            <Text style={{fontSize: normalize(13), color: option===1?'#ff00a3':'#0a1f44'}}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1,paddingVertical: 15, alignItems:'center'}}
                            onPress={()=>this.setState({option:2})}>
                            <Text style={{fontSize: normalize(13), color: option===2?'#ff00a3':'#0a1f44'}}>Amazon</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1,paddingVertical: 15, alignItems:'center'}}
                            onPress={()=>this.setState({option:3})}>
                            <Text style={{fontSize: normalize(13), color: option===3?'#ff00a3':'#0a1f44'}}>BTC</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1, paddingHorizontal: 15, paddingVertical: 10, paddingBottom:20}}>
                        <FlatList
                            data={[1,1,1,1,1,2,1,2,1]}
                            renderItem={({ item, index }) => {
                                if(option==2 && item==2){
                                    return null;
                                }else if(option==3 && item==1){
                                    return null;
                                }
                                return (
                                    <View style={{borderColor: '#ff0078', borderWidth: 1, flexDirection: 'row',padding: 10, borderRadius: 10, marginBottom:10}}>
                                        <Image source={item==2?Images.bitcoin_img:Images.amazon_img}/>
                                        <View style={{marginLeft: 10}}>
                                            <Text style={{fontSize: normalize(13), fontWeight: 'bold'}}>{item==2?"Bitcoin":"Amazon"}</Text>
                                            <Text>2021.01.01 20:40</Text>
                                            <Text><Text style={{color:'#ff00a3'}}>Status: </Text>Sent</Text>
                                        </View>
                                        <View style={{flex:1, alignItems: 'flex-end'}}>
                                            <Text>TP<Text style={{ fontSize: normalize(13) }}>10,000</Text></Text>
                                            <Image source={Icons.icon_drop_down} style={{width:15,height:10}}/>
                                            <Text style={{ color: '#ff00a3' }}>¥<Text style={{fontSize: normalize(20),fontFamily: Fonts.regular}}>10,000</Text></Text>
                                        </View>
                                    </View>
                                );
                            }}
                            />
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeHistory);
