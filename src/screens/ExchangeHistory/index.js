import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { exchangeHistoryStyles } from './styles';
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
import { RadioButton } from 'react-native-paper';

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
                <View style={{}}>
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
                    <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
                        <FlatList
                            data={[1]}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{borderColor: '#ff0078', borderWidth: 1, flexDirection: 'row',padding: 10, borderRadius: 10}}>
                                        <Image source={Images.amazon_img}/>
                                        <View style={{marginLeft: 10}}>
                                            <Text style={{fontSize: normalize(13), fontWeight: 'bold'}}>Amazon</Text>
                                            <Text>2021.01.01 20:40</Text>
                                            <Text>Status: Sent</Text>
                                        </View>
                                    </View>
                                );
                            }}
                            ItemSeparatorComponent={()=><View style={{padding:5}}/>} 
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
