import React, { Component, Fragment } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    TouchableOpacity,
    Image,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ChatMessageBox from './ChatMessageBox';
import ChatInput from './TextInputs/ChatInput';
import { translate } from '../redux/reducers/languageReducer';
import { Colors, Fonts, Images, Icons } from '../constants';
import { getAvatar, isIphoneX, normalize, getUserName } from '../../src/utils';
import NoData from './NoData';

import TextAreaWithTitle from '../components/TextInputs/TextAreaWithTitle';
import RoundedImage from './RoundedImage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoThumbnailPlayer from './VideoThumbnailPlayer';
import CheckBox from './CheckBox';
import Button from './Button';

const { height } = Dimensions.get('window');

class CommentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            commentText: '',
            showComment: false,
            showCommentBox: false,
            commentData: {}
        };
    }

    getDate = (date) => {
        return moment(date).format('MM/DD/YYYY HH:mm');
    };

    render() {
        const {
            index,
            item,
            onDelete,
            onLikeUnlike,
            userData
        } = this.props;
        const {
            showComment,
            showCommentBox,
            text,
            commentText
        } = this.state;
        return (
            <View style={{
                padding: 10,
                flexDirection:'row'
            }}>
                <Image
                    source={getAvatar(item.created_by_avatar)}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        resizeMode: 'cover',
                        marginRight: 5,
                    }}
                />
                <View
                    style={{
                        // paddingBottom: 2,
                        flex:1
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <View style={{ marginLeft: 5, flexDirection: 'row' }}>
                                    <Text
                                        style={{
                                            marginRight: 5,
                                            color: '#e26161',
                                            fontFamily: Fonts.regular,
                                            fontWeight: '400',
                                            fontSize: normalize(10),
                                        }}>
                                        {userData.id === item.created_by ? translate('pages.xchat.you') : getUserName(item.created_by) || item.created_by_username}
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#6c757dc7',
                                            fontFamily: Fonts.regular,
                                            fontWeight: '400',
                                            fontSize: normalize(10),
                                        }}>
                                        {this.getDate(item.updated)}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        color: Colors.black,
                                        fontFamily: Fonts.regular,
                                        fontWeight: '400',
                                        fontSize: normalize(10),
                                        marginLeft: 5,
                                    }}>
                                    {item.text}
                                </Text>
                            </View>
                        </View>
                        {userData.id === item.created_by && (
                            <View style={{ flexDirection: 'row' }}>
                                <FontAwesome5
                                    name={'trash'}
                                    size={14}
                                    color={Colors.black}
                                    style={{ marginLeft: 5 }}
                                    onPress={() => {
                                        onDelete(index,item);
                                    }}
                                />
                            </View>
                        )}
                    </View>
                    <View style={{ marginTop:5, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome
                                name={item.is_liked ? 'thumbs-up' : 'thumbs-o-up'}
                                size={normalize(12)}
                                color={Colors.black}
                                style={{ marginRight: 5 }} />

                            <Text style={{
                                color: Colors.black,
                                fontFamily: Fonts.regular,
                                fontWeight: '400',
                                fontSize: normalize(10),
                            }}>{item.liked_by_count}</Text>

                            <Text style={{
                                color: Colors.textTitle_orange,
                                fontFamily: Fonts.regular,
                                fontWeight: '400',
                                fontSize: normalize(10),
                                marginLeft: 10,
                            }}
                                onPress={() => {
                                    onLikeUnlike(item, index);
                                }}
                            >{item.is_liked ? translate('pages.xchat.unlike') : translate('pages.xchat.like')}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.userReducer.userData,
    };
};

const mapDispatchToProps = {
    
};

// export default connect(mapStateToProps, mapDispatchToProps)(CommentItem);
export default CommentItem;
