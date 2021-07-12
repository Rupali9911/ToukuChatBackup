import React, {Component} from 'react';
import {
    View, Text, SafeAreaView, StyleSheet
} from 'react-native';
import { FlatList } from 'react-native-bidirectional-infinite-scroll';
import { getGroupChatConversationNextFromId, getGroupChatConversationPrevFromId, getGroupChatConversationById } from '../storage/Service';
import { realmToPlainObject, queryMoreMessages, generateUniqueKey, getRandomInt } from '../utils';
import { MessageBubble } from './MessageBubble';
// import { ScrollView } from '@stream-io/flat-list-mvcp';
import {setMessages} from '../redux/reducers/groupReducer';
import {connect} from 'react-redux';
import { TextInput } from 'react-native-paper';
import ChatInput from '../components/TextInputs/ChatInput';

class Conversations extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            group_id: this.props.navigation.state.params.group_id,
            userData: this.props.navigation.state.params.userData,
        }
    }

    async componentDidMount(){
        let chats = getGroupChatConversationById(this.state.group_id,20,this.props.navigation.state.params.msg_id);
        let result = realmToPlainObject(chats);

        let initialMessages = [];

        result.map((item)=>{
            initialMessages.push({
                id: generateUniqueKey(),
                msg_id: item.msg_id,
                text: (item.message_body && item.message_body.text) || '',
                isMyMessage: Boolean(getRandomInt(0, 2))
            });
        });

        // this.setState({messages: initialMessages});
        this.props.setMessages(initialMessages);

        // setTimeout(()=>{
        //     this.loadMoreRecentMessages();
        // },5000);

        // const initialMessages = await queryMoreMessages(20);
        // if (!initialMessages) return;
        // this.setState({ messages: initialMessages });

    }

    getPreviousMessages = (id) => {
        return new Promise((resolve) => {
            console.log('msg_id',id);
            let chats = getGroupChatConversationPrevFromId(this.state.group_id,id);
            let result  = realmToPlainObject(chats).slice(0,30);
            
            let newMessages = [];
    
            result.map((item)=>{
                newMessages.push({
                    id: generateUniqueKey(),
                    text: (item.message_body && item.message_body.text) || '',
                    isMyMessage: Boolean(getRandomInt(0, 2)),
                    ...item
                });
            });

            setTimeout(()=>{
                resolve(newMessages);
            },500);
        });
    }

    getMoreMessages = (id) => {
        return new Promise((resolve) => {
            console.log('msg_id',id);
            let chats = getGroupChatConversationNextFromId(this.state.group_id,id);
            let result  = realmToPlainObject(chats).slice(chats.length-10,chats.length);
            
            let newMessages = [];
    
            result.map((item)=>{
                newMessages.push({
                    id: generateUniqueKey(),
                    text: (item.message_body && item.message_body.text) || '',
                    isMyMessage: Boolean(getRandomInt(0, 2)),
                    ...item
                });
            });

            setTimeout(()=>{
                resolve(newMessages);
            },500);
        });
    } 

    loadMoreOlderMessages = async () => {
        const newMessages = await this.getPreviousMessages(this.props.messages[this.props.messages.length-1].msg_id);        
        // const newMessages = await queryMoreMessages(10);
        // this.setState({messages: this.state.messages.concat(newMessages)});
        this.props.setMessages(this.props.messages.concat(newMessages));
    }

    loadMoreRecentMessages = async () => {
        const newMessages = await this.getMoreMessages(this.props.messages[0].msg_id);
        // const newMessages = await queryMoreMessages(5);
        // console.log('new Messages', newMessages);
        // this.setState({ messages: newMessages.concat(this.state.messages) });
        this.props.setMessages(newMessages.concat(this.props.messages));
    }

    render(){
        const {messages} = this.props;

        if (!messages.length) {
            return null;
        }
        return(
            <View style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Chat between two users</Text>
                </View>
                <FlatList
                    data={messages}
                    inverted
                    onEndReached={this.loadMoreOlderMessages}
                    onStartReached={this.loadMoreRecentMessages}
                    renderItem={MessageBubble}
                />
                <ChatInput
                    // sendEmotion={sendEmotion}
                    // onAttachmentPress={onAttachmentPress}
                    // onCameraPress={onCameraPress}
                    // onGalleryPress={onGalleryPress}
                    onChangeText={()=>{}}
                    // onSend={this.onSend}
                    // value={newMessageText}
                    // sendEnable={sendEnable}
                    placeholder={'pages.xchat.enterMessage'}
                    sendingImage={{uri: null, type: null, name: null}}
                />
            </View>
            // <View style={{flex:1}}>
            //     <SafeAreaView style={{flex:1}}>
            //         <FlatList
            //             data={this.state.messages}
            //             keyExtractor={(item, index) => item.msg_id + ''}
            //             inverted
            //             // contentOffset={{x: 0, y: 100}}
            //             onEndReached={this.loadMoreOlderMessages}
            //             onStartReached={this.loadMoreRecentMessages}
            //             // onStartReachedThreshold={20} // optional
            //             // onEndReachedThreshold={20} // optional
            //             renderItem={({ item, index }) => {
            //                 let isMySent = this.state.userData.id == item.sender_id;
            //                 return (
            //                     <View style={{ padding: 50, alignItems: isMySent ? 'flex-end' : 'flex-start', borderColor: '#ccc', borderWidth: 1 }}>
            //                         <Text>{item.message_body.text}</Text>
            //                     </View>

            //                 );
            //             }}
            //         />
            //     </SafeAreaView>
            // </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomColor: '#BEBEBE',
      borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    safeArea: {
      flex: 1,
    },
    sendMessageButton: {
      width: '100%',
      padding: 20,
      backgroundColor: '#FF4500',
      alignItems: 'center',
    },
    sendButtonTitle: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
    },
  });


  const mapStateToProps = (state) => {
    return {
      userData: state.userReducer.userData,
      messages: state.groupReducer.messages
    };
  };
  
  const mapDispatchToProps = {
    setMessages
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Conversations);