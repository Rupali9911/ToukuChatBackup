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
    ActivityIndicator,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ChatMessageBox from './ChatMessageBox';
import ChatInput from './TextInputs/ChatInput';
import { translate } from '../redux/reducers/languageReducer';
import { Colors, Fonts, Images, Icons, SocketEvents } from '../constants';
import { getAvatar, isIphoneX, normalize, eventService } from '../../src/utils';
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
import {
    getGroupCommentList,
    likeUnlikeGroupComment,
    deleteComment,
    commentOnGroupNote
  } from '../redux/reducers/groupReducer';
import {
    commentOnNote,
    getFriendCommentList,
    likeUnlikeComment,
    deleteFriendComment
} from '../redux/reducers/friendReducer';
import CommentItem from './CommentItem';
import {ConfirmationModal} from './Modals';

const { height } = Dimensions.get('window');

class NoteItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orientation: 'PORTRAIT',
            text: '',
            commentText: '',
            showComment: false,
            showCommentBox: false,
            commentData: [],
            offset: 0,
            commentResult: null,
            showDeleteConfirmationModal: false,
            deleteIndex: null,
            deleteItem: null,
            loadComment: false
        };
    }

    UNSAFE_componentWillMount() {
        const initial = Orientation.getInitialOrientation();
        this.setState({orientation: initial});

        this.events = eventService.getMessage().subscribe((message) => {
            this.checkEventTypes(message);
        });
    }

    componentWillUnmount() {
        this.events.unsubscribe();
    }

    componentDidMount(){
        Orientation.addOrientationListener(this._orientationDidChange);
    }

    _orientationDidChange = (orientation) => {
        this.setState({orientation});
      };

    checkEventTypes(message) {
        const {currentGroupDetail} = this.props;
        switch (message.text.data.type) {
            case SocketEvents.LIKE_OR_UNLIKE_GROUP_NOTE_COMMENT_DATA:
                this.handleCommentLikeUnlike(message);
                break;
            case SocketEvents.DELETE_GROUP_NOTE_COMMENT:
                this.handleDeleteComment(message);
                break;
            case SocketEvents.GROUP_NOTE_COMMENT_DATA:
                this.handleCommentAdd(message);
                break;
            case SocketEvents.LIKE_OR_UNLIKE_FRIEND_NOTE_COMMENT_DATA:
                this.handleCommentLikeUnlike(message);
                break;
            case SocketEvents.FRIEND_NOTE_COMMENT_DATA:
                this.handleCommentAdd(message);
                break;
            case SocketEvents.DELETE_FRIEND_NOTE_COMMENT:
                this.handleDeleteComment(message);
                break;
        }
      }

    getDate = (date) => {
        return moment(date).format('MM/DD/YYYY HH:mm');
    };

    onCancelDeletePress = () => {
        this.setState({
            showDeleteConfirmationModal: false,
        });
      };

    toggleDeleteConfirmationModal = (index = null, item = null) => {
        this.setState((prevState) => ({
            showDeleteConfirmationModal: !prevState.showDeleteConfirmationModal,
            deleteIndex: index,
            deleteItem: item,
        }));
      };

    onConfirmDelete = () => {
        this.deleteComment(this.state.deleteItem.id);
    };

    getCommentList = (note_id,offset) => {
        this.setState({loadComment:true});
        console.log(this.props.isFriend);
        if(this.props.isFriend){
            this.props.getFriendCommentList(note_id,offset)
            .then((res)=>{
                if(res){
                    this.setState({loadComment:false, commentResult: res, commentData: [...this.state.commentData,...res.results], offset: res.next?offset+20:offset});
                }
            }).catch((err)=>{
                console.log('err',err);
            });
        }else{
            this.props.getGroupCommentList(note_id,offset)
            .then((res)=>{
                if(res){
                    this.setState({loadComment:false, commentResult: res, commentData: [...this.state.commentData,...res.results], offset: res.next?offset+20:offset});
                }
            }).catch((err)=>{
                console.log('err',err);
            });
        }
    }

    postGroupComment = (text,mentions) => {
        const {item} =this.props;
        const {showComment,commentResult,offset} = this.state;
        if(this.props.isFriend){
            let data = {friend_note:item.id,text:text}
            this.props.commentOnNote(data)
            .then((res)=>{
                if(res){
                    this.setState({showCommentBox:false,showComment: true},()=>{
                        if(!commentResult)
                        this.getCommentList(item.id, offset);
                    });
                }
            }).catch((err)=>{
                console.log('err',err);
            })
        }else{
            let data = {group_note:item.id,text:text}
            this.props.commentOnGroupNote(data)
                .then((res) => {
                    if (res) {
                        this.setState({ showCommentBox: false, showComment: true }, () => {
                            if (!commentResult)
                                this.getCommentList(item.id, offset);
                        });
                    }
                }).catch((err) => {
                    console.log('err', err);
                })
        }
    }

    likeUnlikeComment = (item,index) => {
        let data = {comment_id: item.id};
        if(this.props.isFriend){
            this.props.likeUnlikeComment(data)
            .then((res)=>{
                if(res){
                    // let array = this.state.commentData;
                    // item['is_liked'] = res.like;
                    // item['liked_by_count'] = res.like ? (item.liked_by_count + 1) : (item.liked_by_count - 1);
                    // array.splice(index, 1, item);
                    // this.setState({ commentData: [...array] });
                }
            }).catch((err)=>{
                console.log('err',err);
            });
        }else{
            this.props.likeUnlikeGroupComment(data)
                .then((res) => {
                    if (res) {
                        // let array = this.state.commentData;
                        // item['is_liked'] = res.like;
                        // item['liked_by_count'] = res.like ? (item.liked_by_count + 1) : (item.liked_by_count - 1);
                        // array.splice(index, 1, item);
                        // this.setState({ commentData: [...array] });
                    }
                }).catch((err) => {
                    console.log('err', err);
                });
        }
    }

    deleteComment = (comment_id) => {
        if(this.props.isFriend){
            this.props.deleteFriendComment(comment_id)
                .then((res) => {
                    this.toggleDeleteConfirmationModal();
                    if (res) {

                    }
                }).catch((err) => {
                    console.log('err', err);
                })
        }else{
            this.props.deleteComment(comment_id)
            .then((res)=>{
                this.toggleDeleteConfirmationModal();
                if(res){
                    
                }
            }).catch((err)=>{
                console.log('err',err);
            })
        }
    }

    handleCommentAdd = (message) => {
        const {item,isFriend} = this.props;
        const {commentResult} = this.state;
        if(isFriend){
            let data = message.text.data.message_details.data;
            if (commentResult && data && data.friend_note === item.id) {
                let array = this.state.commentData;
                array = [data,...array];
                this.setState({ commentData: array });
            }
        }else{
            let data = message.text.data.message_details;
            if (commentResult && data && data.group_note === item.id) {
                let array = this.state.commentData;
                array = [data,...array];
                this.setState({ commentData: array });
            }
        }
        
        
    }

    handleCommentLikeUnlike = (message) => {
        const {item,isFriend} = this.props;

        let data = isFriend?message.text.data.message_details.data:message.text.data.message_details;
        if (data && data.note_id === item.id) {
            let array = this.state.commentData;
            let i = array.find((e) => e.id === data.comment_id);
            let index = array.indexOf(i);
            i['is_liked'] = data.like.like;
            i['liked_by_count'] = data.like.like ? (i.liked_by_count + 1) : (i.liked_by_count - 1);
            array.splice(index, 1, i);
            this.setState({ commentData: array });
            // this.refs['comment_'+data.comment_id] && this.refs['comment_'+data.comment_id].forceUpdate();
        }
    }

    handleDeleteComment = (message) => {
        const {item,isFriend} = this.props;
        let data = isFriend?message.text.data.message_details.data:message.text.data.message_details;
        if (data && data.note_id === item.id) {
            let array = this.state.commentData;
            let i = array.find((e) => e.id === data.comment_id);
            let index = array.indexOf(i);
            array.splice(index, 1);
            this.setState({ commentData: array });
        }
    }

    render() {
        const {
            index,
            editNote,
            item,
            onEdit,
            onDelete,
            onCancel,
            onPost,
            onLikeUnlike,
            userData,
            isFriend
        } = this.props;
        const {
            orientation,
            showComment,
            showCommentBox,
            text,
            commentText,
            commentData,
            offset,
            commentResult,
            showDeleteConfirmationModal,
            loadComment
        } = this.state;
        console.log('commentData',commentData);
        return (
            <View style={{
                borderWidth: 0.5,
                borderColor: Colors.light_gray,
                borderRadius: 3,
                padding: 10
            }}>
                {!editNote ? (
                    <View>
                        <View style={{
                            borderBottomColor: Colors.light_gray,
                            borderBottomWidth: showComment ? 0.5 : 0,
                            // paddingBottom: 2,
                        }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <View style={{ flexDirection: 'row' }}>
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
                                    <View style={{ marginLeft: 5 }}>
                                        <Text
                                            style={{
                                                marginRight: 5,
                                                color: '#e26161',
                                                fontFamily: Fonts.regular,
                                                fontWeight: '400',
                                                fontSize: normalize(10),
                                            }}>
                                            {userData.id === item.created_by ? translate('pages.xchat.you') : item.created_by_username}
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
                                </View>
                                {userData.id === item.created_by && (
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome5
                                            name={'pencil-alt'}
                                            size={14}
                                            color={Colors.black}
                                            style={{ marginRight: 5 }}
                                            onPress={() => {
                                                onEdit(index, item);
                                                this.setState({ text: item.text });
                                            }}
                                        />
                                        <FontAwesome5
                                            name={'trash'}
                                            size={14}
                                            color={Colors.black}
                                            style={{ marginLeft: 5 }}
                                            onPress={() => {
                                                onDelete(index, item);
                                            }}
                                        />
                                    </View>
                                )}
                            </View>
                            <View style={{ marginTop: 5, }}>
                                <Text
                                    style={{
                                        color: Colors.black,
                                        fontFamily: Fonts.regular,
                                        fontWeight: '400',
                                        fontSize: normalize(10),
                                    }}>
                                    {item.text}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{
                                        color: Colors.textTitle_orange,
                                        fontFamily: Fonts.regular,
                                        fontWeight: '400',
                                        fontSize: normalize(10),
                                    }}
                                        onPress={() => {
                                            onLikeUnlike(item.id, index);
                                        }}
                                    >{item.is_liked ? translate('pages.xchat.unlike') : translate('pages.xchat.like')}</Text>

                                    <Entypo name={'dot-single'} color={'#6c757dc7'} size={normalize(18)} />

                                    <Text style={{
                                        color: Colors.textTitle_orange,
                                        fontFamily: Fonts.regular,
                                        fontWeight: '400',
                                        fontSize: normalize(10),
                                    }}
                                        onPress={() => { this.setState({ showCommentBox: !this.state.showCommentBox }) }}
                                    >{translate('pages.xchat.comment')}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
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

                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => {
                                            if (item.comment_count > 0) {
                                                this.setState({ showComment: !showComment }, () => {
                                                    if(!commentResult)
                                                    this.getCommentList(item.id, offset);
                                                });
                                            }
                                        }}>
                                        <MaterialCommunityIcons
                                            name={'comment-outline'}
                                            size={normalize(12)}
                                            color={Colors.black}
                                            style={{ marginRight: 5, marginLeft: 5 }} />

                                        <Text style={{
                                            color: Colors.black,
                                            fontFamily: Fonts.regular,
                                            fontWeight: '400',
                                            fontSize: normalize(10),
                                        }}>{item.comment_count}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {showCommentBox && (
                                <>
                                    <TextAreaWithTitle
                                        onChangeText={(text) => this.setState({ commentText: text })}
                                        value={commentText}
                                        rightTitle={`${commentText.length}/150`}
                                        maxLength={150}
                                        placeholder={translate('pages.xchat.enterComment')}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            // flex: 0.5,
                                            marginTop: 10,
                                            height: 30,
                                            width: '100%',
                                        }}>
                                        <View
                                            style={{
                                                marginHorizontal: 5,
                                                // width: 60,
                                            }}>
                                            <Button
                                                title={translate('common.cancel')}
                                                type={'secondary'}
                                                onPress={() => {
                                                    this.setState({ commentText: '', showCommentBox: false });
                                                }}
                                                height={30}
                                                isRounded={false}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                // width: 60,
                                                marginHorizontal: 5,
                                            }}>
                                            <Button
                                                title={translate('pages.xchat.post')}
                                                type={'primary'}
                                                onPress={() => {
                                                    console.log('post pressed');
                                                    this.postGroupComment(commentText);
                                                    this.setState({ commentText: '' });
                                                }}
                                                height={30}
                                                isRounded={false}
                                                disabled={!commentText}
                                            // loading={isLoading}
                                            />
                                        </View>
                                    </View>
                                </>
                            )}
                        </View>
                        {showComment ?
                            <View style={{marginTop:5}}>
                                {commentData.length>0 ? commentData.map((item,index)=>{
                                    return (
                                        <CommentItem
                                            ref={'comment_'+item.id}
                                            index={index}
                                            item={item}
                                            onDelete={this.toggleDeleteConfirmationModal}
                                            onLikeUnlike={this.likeUnlikeComment}
                                            userData = {userData}
                                        />
                                    );
                                }):<View style={{flexDirection:'row',justifyContent:'center'}}><ActivityIndicator /></View>}
                                {commentResult && commentResult.next && <View style={{flexDirection:'row',justifyContent:'center'}}>
                                {loadComment?
                                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                                        <ActivityIndicator />
                                    </View>
                                    :<Text style={{
                                        color: Colors.textTitle_orange,
                                        fontFamily: Fonts.regular,
                                        fontWeight: '400',
                                        fontSize: normalize(10),
                                    }} 
                                    onPress={()=>{
                                        this.getCommentList(item.id,offset);
                                    }}>{translate('pages.xchat.loadMore')}</Text>}
                                </View>}
                            </View>
                            : null}
                    </View>
                ) : (
                        <View
                            style={{
                                borderBottomColor: Colors.black_light,
                                borderBottomWidth: 0.5,
                                marginBottom: 10,
                                paddingBottom: 2,
                            }}>
                            <TextAreaWithTitle
                                onChangeText={(text) => this.setState({ text })}
                                value={text}
                                rightTitle={`${text.length}/300`}
                                maxLength={300}
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                    // flex: 0.5,
                                    marginTop: 10,
                                    height: 30,
                                    width: '100%',
                                }}>
                                <View
                                    style={{
                                        marginHorizontal: 5,
                                        // width: 60,
                                    }}>
                                    <Button
                                        title={translate('common.cancel')}
                                        type={'secondary'}
                                        onPress={() => {
                                            onCancel(), this.setState({ text: '' });
                                        }}
                                        height={30}
                                        isRounded={false}
                                    />
                                </View>
                                <View
                                    style={{
                                        // width: 60,
                                        marginHorizontal: 5,
                                    }}>
                                    <Button
                                        title={translate('pages.xchat.update')}
                                        type={'primary'}
                                        onPress={() => {
                                            console.log('post pressed');
                                            onPost(text);
                                            this.setState({ text: '' });
                                        }}
                                        height={30}
                                        isRounded={false}
                                        disabled={!text}
                                    // loading={isLoading}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                <ConfirmationModal
                    orientation={orientation}
                    visible={showDeleteConfirmationModal}
                    onCancel={this.onCancelDeletePress.bind(this)}
                    onConfirm={this.onConfirmDelete.bind(this)}
                    title={translate('pages.xchat.toastr.deleteComment')}
                    message={translate('pages.xchat.deleteCommentText')}
                />
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
    getGroupCommentList,
    likeUnlikeGroupComment,
    deleteComment,
    commentOnGroupNote,
    commentOnNote,
    getFriendCommentList,
    likeUnlikeComment,
    deleteFriendComment
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteItem);
