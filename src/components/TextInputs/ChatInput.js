import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Colors, Icons, Fonts} from '../../constants';
import {isIphoneX, normalize} from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {t} from 'i18n-js';
import MentionsTextInput from 'react-native-mentions';
import {TouchableHighlight as GHTouchableHighlight} from 'react-native-gesture-handler';
const {height} = Dimensions.get('window');

export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state = {
      highlightItemId: false,
    };
    this.newHeight = isIphoneX() ? 70 : 50;
    this.lineHeight = 0;
    this.oldLineHeight = 0;
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  groupMembersMentions = (value) => {
    const {groupMembers, currentUserData} = this.props;
    let splitNewMessageText = value.split(' ');
    let text = splitNewMessageText[splitNewMessageText.length - 1];
    // let splitNewMessageText = value.split(' ');
    // let newMessageMentions = [];
    // const newMessageTextWithMention = splitNewMessageText
    //   .map((text) => {
    //     let mention = null;
    //     groupMembers.forEach((groupMember) => {
    //       if (text === `~${groupMember.id}~`) {
    //         mention = `@${groupMember.display_name}`;
    //         newMessageMentions = [...newMessageMentions, groupMember.id];
    //       }
    //     });
    //     if (mention) {
    //       return mention;
    //     } else {
    //       return text;
    //     }
    //   })
    //   .join(' ');

    if (groupMembers && currentUserData) {
      return groupMembers.filter((member) => {
        if (member.id !== currentUserData.id) {
          // return splitNewMessageText.map((text) => {
          if (
            text.substring(1) &&
            member.display_name
              .toLowerCase()
              .startsWith(text.substring(1).toLowerCase())
          ) {
            return member;
          } else if (text.substring(1).length) {
            return null;
          }
          return member;
        }
        // });
        // if (
        //   value.substring(1) &&
        //   member.display_name
        //     .toLowerCase()
        //     .startsWith(value.substring(1).toLowerCase())
        // ) {
        //   return member;
        // } else if (value.substring(1).length) {
        //   return null;
        // }
        // return member;
        return null;
      });
    }
    return null;
  };

  suggestionsDataHeight = (value) => {
    console.log('suggestionsDataHeight -> suggestionsDataHeight', value);
    let groupMembersLength;
    let suggestionRowHeight;
    groupMembersLength = this.groupMembersMentions(value).length;
    console.log('render -> groupMembersLength', groupMembersLength);
    suggestionRowHeight =
      groupMembersLength < 11
        ? groupMembersLength * normalize(22) + 5
        : normalize(220) + 5;
    console.log(
      'suggestionsDataHeight -> suggestionRowHeight',
      suggestionRowHeight,
    );
    return suggestionRowHeight;
  };

  render() {
    const {
      onAttachmentPress,
      onCameraPress,
      onGalleryPress,
      onChangeText,
      onSend,
      value,
      placeholder,
      sendingImage,
      sendEnable,
      groupMembers,
    } = this.props;
    // let groupMembersLength;
    // let suggestionRowHeight;
    // if (groupMembers) {
    //   groupMembersLength = this.groupMembersMentions(value).length;
    //   console.log('render -> groupMembersLength', groupMembersLength);
    //   suggestionRowHeight =
    //     groupMembersLength < 2
    //       ? 35
    //       : groupMembersLength < 3
    //       ? 70
    //       : groupMembersLength < 4
    //       ? 105
    //       : 140;
    // }
    if (value.length === 0) {
      this.newHeight = isIphoneX() ? 70 : 50;
    }
    return (
      <View
        style={{
          // position: 'absolute',
          // bottom: 0,
          width: '100%',
          minHeight: isIphoneX() ? 70 : 50,
          // height: this.newHeight,
          maxHeight: 200,
          backgroundColor: Colors.white,
          overflow: 'visible',
        }}>
        <LinearGradient
          colors={['rgba(255, 137, 96, 0.3)', 'rgba(255, 98, 165, 0.3)']}
          // locations={[0.2, 1]}
          useAngle={true}
          // angle={270}
          angleCenter={{x: 0, y: 1}}
          style={[
            chatInput.chatInputContainer,
            {
              alignItems: 'flex-end',
              overflow: 'visible',
            },
          ]}>
          {/* <View style={chatInput.chatInputContainer}> */}
          <View style={chatInput.chatAttachmentContainer}>
            <TouchableOpacity
              style={chatInput.chatAttachmentButton}
              onPress={() => {
                onAttachmentPress();
              }}>
              {/* <FontAwesome5 name={'plus'} size={height * 0.03} color={'indigo'} /> */}
              <Image
                source={Icons.plus_icon_select}
                style={chatInput.attachmentImage}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={chatInput.chatAttachmentButton}
              onPress={() => {
                onCameraPress();
              }}>
              <Image
                source={Icons.icon_camera_grad}
                style={chatInput.attachmentImage}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={chatInput.chatAttachmentButton}
              onPress={() => {
                onGalleryPress();
              }}>
              <Image
                source={Icons.gallery_icon_select}
                style={chatInput.attachmentImage}
                resizeMode={'contain'}
              />
              {/* <FontAwesome5
              name={'image'}
              size={height * 0.03}
              color={'indigo'}
            /> */}
            </TouchableOpacity>
          </View>
          <View style={chatInput.textInputContainer}>
            {this.props.useMentionsFunctionality ? (
              <View style={{}}>
                <MentionsTextInput
                  multiline={true}
                  textInputStyle={chatInput.textInput}
                  suggestionsPanelStyle={{
                    width: '100%',
                    overflow: 'hidden',
                    position: 'absolute',
                    top: -this.suggestionsDataHeight(value),
                    zIndex: 1,
                  }}
                  loadingComponent={() => null}
                  textInputMinHeight={35}
                  // textInputMaxHeight={500}
                  trigger={'@'}
                  triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                  value={value}
                  onChangeText={(message) => onChangeText(message)}
                  placeholder={placeholder}
                  autoCorrect={false}
                  triggerCallback={() => {
                    console.log('ChatInput -> render -> triggerCallback');
                  }}
                  suggestionsData={this.groupMembersMentions(value)} // array of objects
                  keyExtractor={(item, index) => item.id}
                  renderSuggestionsRow={({item, index}, hidePanel) => {
                    return (
                      <GHTouchableHighlight
                        underlayColor="#FFB582"
                        onShowUnderlay={() => {
                          this.setState({highlightItemId: item.id});
                        }}
                        onHideUnderlay={() => {
                          this.setState({highlightItemId: null});
                        }}
                        style={{
                          backgroundColor: index === 0 ? '#FFB582' : 'white',
                          paddingTop: index === 0 ? 5 : 0,
                        }}
                        onPress={() => {
                          hidePanel();
                          this.setState({isMentionsOpen: false});
                          this.props.onSelectMention(
                            item,
                            value.split(' ')[value.split(' ').length - 1]
                              .length,
                          );
                        }}>
                        <View
                          style={{
                            height: normalize(22),
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            width: '100%',
                            paddingLeft: 5,
                          }}>
                          <Text
                            style={{
                              fontSize: normalize(11),
                              paddingHorizontal: 10,
                              // backgroundColor: '#FFB582',
                              fontFamily: Fonts.regular,
                              fontWeight: '400',
                              color:
                                this.state.highlightItemId === item.id
                                  ? 'white'
                                  : index === 0
                                  ? 'white'
                                  : 'black',
                              textAlign: 'center',
                            }}>
                            {item.display_name}
                          </Text>
                        </View>
                      </GHTouchableHighlight>
                    );
                  }}
                  suggestionRowHeight={this.suggestionsDataHeight(value)}
                  horizontal={false}
                  customOnContentSizeChange={({nativeEvent}) => {
                    this.forceUpdate();
                    // if (nativeEvent.contentSize.height != this.lineHeight) {
                    //   this.lineHeight = nativeEvent.contentSize.height;
                    //   if (
                    //     this.lineHeight > 20 &&
                    //     this.lineHeight > this.oldLineHeight &&
                    //     this.newHeight <= 200
                    //   ) {
                    //     this.newHeight = this.newHeight + 15;
                    //   }
                    //   if (
                    //     this.lineHeight > 20 &&
                    //     this.lineHeight < this.oldLineHeight
                    //   ) {
                    //     this.newHeight = this.newHeight - 15;
                    //   }
                    //   if (
                    //     this.lineHeight <= 20 &&
                    //     this.lineHeight != this.oldLineHeight
                    //   ) {
                    //     this.newHeight = isIphoneX() ? 70 : 50;
                    //   }
                    //   this.oldLineHeight = this.lineHeight;
                    // }
                  }}
                />
              </View>
            ) : (
              <TextInput
                multiline={true}
                style={chatInput.textInput}
                onChangeText={(message) => onChangeText(message)}
                onContentSizeChange={({nativeEvent}) => {
                  if (nativeEvent.contentSize.height != this.lineHeight) {
                    this.lineHeight = nativeEvent.contentSize.height;
                    if (
                      this.lineHeight > 20 &&
                      this.lineHeight > this.oldLineHeight &&
                      this.newHeight <= 200
                    ) {
                      this.newHeight = this.newHeight + 15;
                    }
                    if (
                      this.lineHeight > 20 &&
                      this.lineHeight < this.oldLineHeight
                    ) {
                      this.newHeight = this.newHeight - 15;
                    }
                    if (
                      isIphoneX() || Platform.isPad
                        ? this.lineHeight <= 70
                        : this.lineHeight <= 50
                    ) {
                      this.newHeight = isIphoneX() || Platform.isPad ? 70 : 50;
                    }
                    this.oldLineHeight = this.lineHeight;
                  }
                }}
                value={value}
                placeholder={placeholder}
                autoCorrect={false}
              />
            )}
          </View>
          <TouchableOpacity
            style={chatInput.sendButoonContainer}
            activeOpacity={value || sendingImage.uri ? 0 : 1}
            onPress={() => {
              value || sendingImage.uri ? onSend() : null;
            }}>
            <Image
              source={Icons.icon_send_button}
              style={[chatInput.sandButtonImage]}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/* </View> */}
        </LinearGradient>
      </View>
    );
  }
}

const chatInput = StyleSheet.create({
  messareAreaConatiner: {
    flex: 0.95,
    justifyContent: 'flex-end',
  },
  messareAreaScroll: {flexGrow: 1},
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chatInputContainer: {
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    // height: '100%',
    // flex: 1,
    minHeight: isIphoneX() || Platform.isPad ? 70 : 50,
    maxHeight: 200,
    // backgroundColor: '#FC94B8',
    flexDirection: 'row',
    // paddingHorizontal: 15,
    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: isIphoneX() || Platform.isPad ? 20 : 5,
  },
  chatAttachmentContainer: {
    // height: isIphoneX() ? 40 : 30,
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 5,
  },
  chatAttachmentButton: {
    // height: '100%',
    width: '29%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  attachmentImage: {
    // height: '80%',
    width: '90%',
  },
  textInputContainer: {
    width: '65%',
    // height: '80%',s
    justifyContent: 'center',
  },
  textInput: {
    // height: '100%',
    borderWidth: 0.2,
    backgroundColor: Colors.white,
    minHeight: Platform.isPad ? 45 : 35,
    borderRadius: 10,
    borderColor: Colors.gray,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? (isIphoneX() ? 10 : 10) : 0,
    paddingBottom: 0,
    fontSize: Platform.isPad ? normalize(8) : normalize(12),
    textAlignVertical: 'center',
    lineHeight: Platform.isPad ? -20 : 15,
  },
  sendButoonContainer: {
    // height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  sandButtonImage: {
    // height: '50%',
    width: '65%',
    // tintColor: Colors.gray,
  },
});
