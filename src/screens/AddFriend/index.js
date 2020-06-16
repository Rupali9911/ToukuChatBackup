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
import { createFilter } from 'react-native-search-filter';
import { addFriendStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import { Images, Icons, Colors, Fonts } from '../../constants';
import NoData from '../../components/NoData';
import Toast from '../../components/Toast';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import {
    getUserChannels,
    createNewChannel,
} from '../../redux/reducers/channelReducer';
import { getUserGroups } from '../../redux/reducers/groupReducer';
import { getUserFriends } from '../../redux/reducers/friendReducer';
import SwitchCustom from '../../components/SwitchCustom';

import {getSearchedFriends} from '../../redux/reducers/addFriendReducer'

class AddFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        }
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


    renderUserFriends() {
        const { getSearchedFriends, friendLoading } = this.props;
        const filteredFriends = userFriends.filter(
            createFilter(this.state.searchText, ['username'])
        );

        if (filteredFriends.length === 0 && friendLoading) {
            return <ListLoader />;
        } else if (filteredFriends.length > 0) {
            return (
                <FlatList
                    data={filteredFriends}
                    renderItem={({ item, index }) => (
                        <GroupFriend
                            user={item}
                            onAddPress={(isAdded) => this.onAdd(isAdded, item)}
                            isRightButton
                        />
                    )}
                    ListFooterComponent={() => (
                        <View>{friendLoading ? <ListLoader /> : null}</View>
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
                            onChangeText={(searchText) => this.setState({ searchText })}
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

    };
};

const mapDispatchToProps = {
    getSearchedFriends
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFriend);
