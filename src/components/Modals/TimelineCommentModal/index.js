// Library imports
import React, {Component} from 'react';
import {
  Modal,
  Image,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform
} from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Local imports
import { Colors, Fonts, Icons } from '../../../constants';
import { translate } from '../../../redux/reducers/languageReducer';
import { normalize, getAvatar, getUserName } from '../../../utils';

// Component imports
import ConfirmationModal from '../ConfirmationModal';
import KeyboardStickyView from '../../KeyboardStickyView';

// StyleSheet import
import styles from './styles';
import ClickableImage from '../../ClickableImage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const CommentInputContainer = (props) => {
    return(
        Platform.OS=='ios' ? 
        <KeyboardStickyView style={styles.stickyViewContainer}>
            {props.children}
        </KeyboardStickyView> : 
        <KeyboardAwareScrollView 
            style={styles.stickyViewAndroidContainer} 
            contentContainerStyle={styles.stickyViewAndroidContainer}
            keyboardShouldPersistTaps={'always'}>
            <KeyboardStickyView style={styles.stickyViewContainer}>
                {props.children}
            </KeyboardStickyView>
        </KeyboardAwareScrollView>
    );
}

export default class TimelineCommentModal extends Component{

    constructor(props){
        super(props)
        this.state = {
            comment: '',
            showDeleteConfirmation: false,
            deleteLoading: false,
            deleteCommentId: null,
            editCommentId: null,
            addLoading: false
        }
    }

    actionCancel = () => {
        this.setState({ showDeleteConfirmation: false });
    }

    actionSure = () => {
        const { onDeleteComment } = this.props
        if (this.state.deleteCommentId) {
            this.setState({ deleteLoading: true });
            onDeleteComment(this.state.deleteCommentId, () => {
                this.setState({ deleteLoading: false, showDeleteConfirmation: false });
                console.log(res);
            });
        }
    }

    actionSend = () => {
        const {post,onAddComment,onEditComment} = this.props;
        const {comment, editCommentId} = this.state;
        if (comment.trim().length > 0) {
            if(editCommentId){
                this.setState({ addLoading: true });
                onEditComment(editCommentId, comment, () => {
                    this.setState({addLoading: false, comment: '', editCommentId: null});
                })
            }else{
                this.setState({ addLoading: true });
                onAddComment(post.id, comment,() => {
                    this.setState({ addLoading: false, comment: '' });
                });
            }
        }
    }

    getDate = (date) => {
        return moment(date).format('YYYY/MM/DD HH:mm');
    };

    renderCommentItem = ({item}) => {
        const {userData} = this.props;
        return (
          <View style={styles.commentItemContainer}>
            <Image
              source={getAvatar(item.created_by_avatar)}
              style={styles.commentAvatar}
            />
            <View style={styles.commentDataContainer}>
                <View style={styles.singleFlex}>
                    <View style={styles.commentUserContainer}>
                      <Text
                        style={styles.userName}>
                        {userData.id === item.created_by ? translate('pages.xchat.you') : getUserName(item.created_by) || item.created_by_username}
                      </Text>
                      <Text
                        style={styles.dateText}>
                        {this.getDate(item.updated)}
                      </Text>
                    </View>
                    <Text
                      style={styles.commentText}>
                      {item.text}
                    </Text>
                </View>
                {userData.id === item.created_by && (
                    <View style={{flexDirection:'row'}}>
                        <ClickableImage
                            source={Icons.icon_edit_grad}
                            size={normalize(14)}
                            color={null}
                            containerStyle={{marginHorizontal: 5}}
                            onPress={()=>{
                                this.setState({comment: item.text, editCommentId: item.id});
                            }}/>
                        <ClickableImage
                            source={Icons.icon_delete_grad}
                            size={normalize(14)}
                            color={null}
                            containerStyle={{marginHorizontal: 5}}
                            onPress={() => {
                                this.setState({ showDeleteConfirmation: true, deleteCommentId: item.id, comment: '' });
                            }} />
                        {/* <FontAwesome5
                            name={'trash'}
                            size={14}
                            color={Colors.black}
                            style={styles.deleteIcon}
                            onPress={() => {
                                this.setState({ showDeleteConfirmation: true, deleteCommentId: item.id });
                            }}
                        /> */}
                    </View>
                )}
              </View>
          </View>
        );
      }

    listEmptyComponent = () => {
        return (
            <View style={styles.emptyViewContainer}>
                <Text style={styles.emptyText}>{translate('pages.xchat.beTheFirstToLeaveComment')}</Text>
            </View>
        );
    }

    render(){
        const {visible,post,autoFocus,onRequestClose} = this.props;
        const {addLoading,comment,showDeleteConfirmation,deleteLoading} = this.state;
        return (
            <Modal
                visible={visible}
                transparent
                onRequestClose={onRequestClose}
                >
                <View style={styles.container}>
                    <TouchableOpacity style={styles.NonViewContainer} onPress={onRequestClose} />
                        <CommentInputContainer>
                            <View style={styles.commentConatiner}>
                                <View style={styles.countContainer}>
                                    {post.liked_by_count > 0 &&
                                        <Text style={styles.countText}>
                                            {post.liked_by_count} {translate('pages.xchat.like')}
                                        </Text>
                                    }
                                    {(post.post_comments && post.post_comments.length > 0) &&
                                        <Text style={styles.countText}>
                                            {post.post_comments && post.post_comments.length} {translate('pages.xchat.comment')}
                                        </Text>
                                    }
                                </View>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>
                                        {translate('pages.xchat.comment')}
                                    </Text>
                                </View>
                                <FlatList
                                    data={post.post_comments}
                                    extraData={this.props}
                                    renderItem={this.renderCommentItem}
                                    keyboardShouldPersistTaps={'always'}
                                    inverted
                                    ListEmptyComponent={this.listEmptyComponent}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    autoFocus={autoFocus}
                                    keyboardType='twitter'
                                    style={styles.inputStyle}
                                    textAlignVertical={'center'}
                                    placeholder={translate('pages.xchat.enterComment')}
                                    multiline
                                    onChangeText={(text) => this.setState({ comment: text })}
                                    value={comment}
                                />
                                <TouchableOpacity
                                    style={styles.sendButoonContainer}
                                    activeOpacity={addLoading ? 0 : 1}
                                    disabled={addLoading}
                                    onPress={this.actionSend}>
                                    <Image
                                        source={Icons.icon_send_button}
                                        style={[styles.sendButtonImage]}
                                        resizeMode={'contain'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <SafeAreaView style={styles.safeAreaView} />
                            </CommentInputContainer>
                    <ConfirmationModal
                        visible={showDeleteConfirmation}
                        onCancel={this.actionCancel.bind(this)}
                        onConfirm={this.actionSure.bind(this)}
                        title={translate('pages.xchat.toastr.deleteComment')}
                        message={translate('pages.xchat.deleteCommentText')}
                        isLoading={deleteLoading}
                    />
                </View>
            </Modal>
        );
    }
}

/**
 * TimelineCommentModal prop types
 */
TimelineCommentModal.propTypes = {
    autoFocus: PropTypes.bool,
    post: PropTypes.any,
    visible: PropTypes.bool,
    userData: PropTypes.any,
    onAddComment: PropTypes.func,
    onDeleteComment: PropTypes.func,
    onRequestClose: PropTypes.func,
};

/**
 * TimelineCommentModal default props
 */
TimelineCommentModal.defaultProps = {
    autoFocus: false,
    post: null,
    visible: false,
    userData: null,
};
