import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    Image,
    ScrollView,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';

import { globalStyles } from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import { Images, Icons, Colors, Fonts } from '../../constants';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import TabBar from '../../components/TabBar';
import PostCard from '../../components/PostCard';
import {
    getTrendChannel,
    getFollowingChannel,
    getRankingChannel,
} from '../../redux/reducers/timelineReducer';

class Channel extends Component {
    constructor(props) {
        super(props);
        setI18nConfig(this.props.selectedLanguageItem.language_name);
        this.state = {
            orientation: 'PORTRAIT',
            activeTab: 'trend',
            tabBarItem: [
                {
                    id: 1,
                    title: 'trend',
                    icon: Icons.icon_chat,
                    action: () => {
                        this.setState({ activeTab: 'trend' });
                    },
                },
                {
                    id: 2,
                    title: 'following',
                    icon: Icons.icon_setting,
                    action: () => {
                        this.setState({ activeTab: 'following' });
                    },
                },
                {
                    id: 3,
                    title: 'ranking',
                    icon: Icons.icon_timeline,
                    action: () => {
                        this.setState({ activeTab: 'ranking' });
                    },
                },
            ],
            visible: false,
            menuItems: [
                {
                    id: 1,
                    title: translate('pages.xchat.hideThisPost'),
                    icon: 'bars',
                    onPress: () => {},
                },
                {
                    id: 1,
                    title: translate('pages.xchat.hideAllPost'),
                    icon: 'bars',
                    onPress: () => {},
                },
                {
                    id: 1,
                    title: translate('pages.xchat.reportContent'),
                    icon: 'bars',
                    onPress: () => {},
                },
            ],
        };
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

   async componentDidMount() {
        Orientation.addOrientationListener(this._orientationDidChange);
        // this.props.getTrendChannel();
        // this.props.getFollowingChannel();
        // this.props.getRankingChannel();
        // this.showData();

        await this.props.getTrendChannel().then((res) => {
            this.props.getFollowingChannel().then((res) => {
                this.props.getUserFriends().then((res) => {
                    this.props.getRankingChannel().then((res) => {
                        this.showData();
                    })
                })
            })
        })
    }

    showData() {
        const { trendChannel, followingChannel, rankingChannel } = this.props;
        console.log('Timeline -> showData -> trendChannel', trendChannel);
    }

    _orientationDidChange = (orientation) => {
        this.setState({ orientation });
    };

    _openMenu = () => this.setState({ visible: true });

    _closeMenu = () => this.setState({ visible: false });

    getAspectRatio = () => {
        Image.getSize(
            'https://angelium-media.s3.ap-southeast-1.amazonaws.com/image_1589547165984_1.png',
            (height, width) => {
                this.setState({
                    ratio: height / width,
                });
            }
        );
    };

    onLayout = () => {
        this.getAspectRatio();
    };
    render() {
        const { tabBarItem, activeTab, menuItems, posts } = this.state;
        const { trendChannel, followingChannel, rankingChannel } = this.props;
        return (
            <ImageBackground
                source={Images.image_home_bg}
                style={globalStyles.container}
            >
                <View style={globalStyles.container}>
                    <HomeHeader title={translate('pages.xchat.channel')} />
                    <View style={globalStyles.container}>
                        <TabBar tabBarItem={tabBarItem} activeTab={activeTab} />
                        <ScrollView>
                            {activeTab === 'trend' ? (
                                <PostCard menuItems={menuItems} posts={trendChannel} isTimeline={false} />
                            ) : activeTab === 'following' ? (
                                <PostCard menuItems={menuItems} posts={followingChannel} isTimeline={false}/>
                            ) : (
                                <PostCard menuItems={menuItems} posts={rankingChannel} isTimeline={false}/>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        selectedLanguageItem: state.languageReducer.selectedLanguageItem,
        loading: state.timelineReducer.loading,
        trendChannel: state.timelineReducer.trendChannel,
        followingChannel: state.timelineReducer.followingChannel,
        rankingChannel: state.timelineReducer.rankingChannel,
    };
};

const mapDispatchToProps = {
    getTrendChannel,
    getFollowingChannel,
    getRankingChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
