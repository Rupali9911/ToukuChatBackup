import React, { Component, Fragment } from 'react';
import {
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    Text,
    TextInput,
    FlatList,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { addFriendStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import { Images, Icons, Colors, Fonts } from '../../constants';
import NoData from '../../components/NoData';
import Toast from '../../components/Toast';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {ListLoader} from '../../components/Loaders';
import FriendWithStatus from '../../components/FriendWithStatus';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import {getSearchedFriends, sendFriendRequest, cancelFriendRequest, setIsRequestedParam} from '../../redux/reducers/addFriendReducer'
import {showToast} from '../../utils'
import {getUserProfile} from "../../redux/reducers/userReducer";

class AddFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            arrFriends: []
        }
        global.timeout = null
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

    searchFriends = (txt) => {
        const {getSearchedFriends} = this.props
        clearTimeout(timeout)
        if (txt && txt.length !== 0) {
            timeout = setTimeout(() => {
                getSearchedFriends(txt).then((res) => {
                    this.setState({arrFriends: res})
                });
            }, 500)
        }else{
            this.setState({arrFriends: []})
        }
    }

    actionOnStatus (user, index){
        const {cancelFriendRequest, setIsRequestedParam, sendFriendRequest, searchedFriend} = this.props
        if (user.is_requested && user.is_requested === true){
            cancelFriendRequest(user.id).then((res) => {
                setIsRequestedParam(searchedFriend, false, index).then((res) => {
                    this.setState({arrFriends: res})
                });
            });
        }else{
            sendFriendRequest(user.id).then((res) => {
                setIsRequestedParam(searchedFriend, true, index).then((res) => {
                    this.setState({arrFriends: res})
                });
                showToast(translate('pages.xchat.toastr.added'),translate('pages.xchat.toastr.friendRequestSentSuccessfully'), 'positive')
            });
        }
    }

    renderUserFriends() {
        const { arrFriends } = this.state;
        const { isLoading, userData } = this.props;

        if (arrFriends.length === 0 && isLoading) {
            return <ListLoader />;
        } else if (arrFriends.length > 0) {
            return (
                <FlatList
                    data={arrFriends}
                    renderItem={({ item, index }) => item.id === userData.id ? null : (
                        <FriendWithStatus
                        user={item}
                        onButtonAction={() => this.actionOnStatus(item, index)}
                        />
                    )}
                    ListFooterComponent={() => (
                        <View>{isLoading ? <ListLoader /> : null}</View>
                    )}
                />
            );
        } else {
            return <NoData title={translate('pages.xchat.noFriendFound')} />;
        }
    }


    render() {
        const {

        } = this.state;
        return (
            <ImageBackground
                source={Images.image_home_bg}
                style={globalStyles.container}
            >
                <View style={globalStyles.container}>
                    <HeaderWithBack
                        onBackPress={() => this.props.navigation.goBack()}
                        title={translate('pages.xchat.addFriend')}
                    />
                    <View style={{backgroundColor: Colors.home_header, padding: 10}}>
                    <View style={addFriendStyles.searchContainer}>
                        <FontAwesome name={'search'} size={18} style={addFriendStyles.iconSearch}/>
                        <TextInput
                            style={[addFriendStyles.inputStyle]}
                            placeholder={translate('pages.xchat.search')}
                            onChangeText={(searchText) =>  this.searchFriends(searchText)}
                            returnKeyType={'done'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                    </View>
                        <View style={addFriendStyles.mainContainer}>
                            {this.renderUserFriends()}
                        </View>
                </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.addFriendReducer.loading,
        searchedFriend: state.addFriendReducer.searchedFriend,
        userData: state.userReducer.userData,
    };
};

const mapDispatchToProps = {
    getSearchedFriends,
    sendFriendRequest,
    cancelFriendRequest,
    setIsRequestedParam
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFriend);
