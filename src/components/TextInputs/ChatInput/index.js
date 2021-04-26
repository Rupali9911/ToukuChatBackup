// Library imports
import React, {Component} from 'react';
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FlatList,
  TouchableOpacity as GHTouchableHighlight,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Local imports
import MentionsInput from '../../../../LineLibChanges/react-native-mentions-input/index';
import {Colors, Icons} from '../../../constants';
import {isIphoneX, normalize} from '../../../utils';

// StyleSheet imports
import styles from './styles';

/**
 * Chat input component
 */
export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightItemId: false,
      suggestionData: [],
      suggestionDataHeight: 0,
      mentionUser: [],
      input_focus: false,
    };
    this.newHeight = isIphoneX() ? 70 : 50;
    this.lineHeight = 0;
    this.oldLineHeight = 0;
  }

  // Update references
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  // When group member are mentioned
  groupMembersMentions = (value) => {
    const {groupMembers, currentUserData} = this.props;
    // let splitNewMessageText = value.split(' ');
    // let text = splitNewMessageText[splitNewMessageText.length - 1];
    let text = value;
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
      let suggestionRowHeight;
      if (text.substring(1).length) {
        let newUser = [];
        groupMembers.filter((member) => {
          if (member.id !== currentUserData.id) {
            // return splitNewMessageText.map((text) => {
            if (member.display_name) {
              let obj = {
                ...member,
                name: member.display_name,
              };

              return newUser.push(obj);
            } else {
              let obj = {
                ...member,
                name: member.username,
              };
              return newUser.push(obj);
            }
          } else {
            return false;
          }
        });
        suggestionRowHeight =
          newUser.length < 11
            ? newUser.length * normalize(22) + 5
            : normalize(220) + 5;
        this.setState({
          suggestionData: newUser,
          suggestionDataHeight: suggestionRowHeight,
        });

        console.log('users_array', newUser);
      } else {
        let newUser = [];
        groupMembers.filter((member) => {
          if (member.id !== currentUserData.id) {
            let obj = {
              ...member,
              name: member.display_name ? member.display_name : member.username,
            };
            return newUser.push(obj);
          }
        });

        suggestionRowHeight =
          newUser.length < 11
            ? newUser.length * normalize(22) + 5
            : normalize(220) + 5;
        this.setState({
          suggestionData: newUser,
          suggestionDataHeight: suggestionRowHeight,
        });

        console.log('users_array', newUser);
      }
      this.forceUpdate();
    } else {
      this.setState({suggestionData: [], suggestionDataHeight: 0});
    }
  };

  // Friend Suggestion component height
  suggestionsDataHeight = (users) => {
    // console.log('suggestionsDataHeight -> suggestionsDataHeight', value);
    let groupMembersLength;
    let suggestionRowHeight;
    // groupMembersLength = this.groupMembersMentions(value).length;
    groupMembersLength = users.length;
    // console.log('render -> groupMembersLength', groupMembersLength);
    suggestionRowHeight =
      groupMembersLength < 11
        ? groupMembersLength * normalize(22) + 10
        : normalize(220) + 5;
    // console.log(
    //   'suggestionsDataHeight -> suggestionRowHeight',
    //   suggestionRowHeight,
    // );
    console.log('suggestionRowHeight', suggestionRowHeight);
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
    } = this.props;
    const {input_focus} = this.state;
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
      this.newHeight = isIphoneX() || Platform.isPad ? 70 : 50;
    }

    const container = [
      styles.rootContainer,
      {
        maxHeight: input_focus ? 200 : isIphoneX() || Platform.isPad ? 70 : 50,
      },
    ];

    return (
      <View style={container}>
        <LinearGradient
          colors={['rgba(255, 137, 96, 0.3)', 'rgba(255, 98, 165, 0.3)']}
          // locations={[0.2, 1]}
          useAngle={true}
          // angle={270}
          angleCenter={{x: 0, y: 1}}
          style={styles.chatInputContainer}>
          {/* <View style={styles.chatInputContainer}> */}
          {input_focus ? (
            <View style={styles.sendContainer}>
              <TouchableOpacity
                style={[
                  styles.chatAttachmentContainer,
                  styles.chatAttachmentButton,
                  styles.sendActionContainer,
                ]}
                onPress={() => {
                  this.input_ref && this.input_ref._textInput
                    ? this.input_ref._textInput.blur()
                    : this.input_ref.blur();
                  this.setState({input_focus: false});
                }}>
                <FontAwesome5
                  name={'angle-right'}
                  size={30}
                  color={Colors.gradient_3}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.chatAttachmentContainer}>
              <TouchableOpacity
                style={styles.chatAttachmentButton}
                onPress={() => {
                  onAttachmentPress();
                }}>
                {/* <FontAwesome5 name={'plus'} size={height * 0.03} color={'indigo'} /> */}
                <Image
                  source={Icons.plus_icon_select}
                  style={styles.attachmentImage}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatAttachmentButton}
                onPress={() => {
                  onCameraPress();
                }}>
                <Image
                  source={Icons.icon_camera_grad}
                  style={styles.attachmentImage}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatAttachmentButton}
                onPress={() => {
                  onGalleryPress();
                }}>
                <Image
                  source={Icons.gallery_icon_select}
                  style={styles.attachmentImage}
                  resizeMode={'contain'}
                />
                {/* <FontAwesome5
              name={'image'}
              size={height * 0.03}
              color={'indigo'}
            /> */}
              </TouchableOpacity>
            </View>
          )}
          <View
            style={[
              styles.textInputContainer,
              input_focus && styles.textInputFocusedContainer,
            ]}>
            {this.props.useMentionsFunctionality ? (
              <View>
                <MentionsInput
                  ref={(input) => {
                    this.input_ref = input;
                  }}
                  value={value}
                  maxHeight={50}
                  multiline={true}
                  onFocus={(e) => {
                    this.setState({input_focus: true});
                  }}
                  onBlur={(e) => {
                    this.setState({input_focus: false});
                    this.input_ref && this.input_ref.hideSuggestionPanel();
                  }}
                  onTextChange={(message) => {
                    if (!message.includes('@')) {
                      this.setState({suggestionData: []});
                    }
                    onChangeText(message);
                    this.groupMembersMentions(message);
                  }}
                  onMarkdownChange={(markdown) => {}}
                  placeholder={placeholder}
                  placeholderTextColor={'gray'}
                  mentionStyle={styles.mentionStyle}
                  textInputStyle={styles.textInputStyle}
                  users={this.state.suggestionData}
                  suggestedUsersComponent={(users, addMentions, index) =>
                    users.length > 0 && (
                      <View
                        style={[
                          {
                            top: -this.suggestionsDataHeight(users),
                            height: this.suggestionsDataHeight(users),
                          },
                          styles.suggestedUserContainer,
                        ]}>
                        <FlatList
                          scrollEnabled={true}
                          showsVerticalScrollIndicator={false}
                          nestedScrollEnabled={false}
                          keyboardShouldPersistTaps={'always'}
                          horizontal={this.props.horizontal}
                          ListEmptyComponent={this.props.loadingComponent}
                          enableEmptySections={true}
                          data={users}
                          keyExtractor={this.props.keyExtractor}
                          renderItem={({item, index}) => {
                            const itemContainer = [
                              styles.suggestedUserComponentStyle,
                              {
                                backgroundColor:
                                index === 0 ? '#FFB582' : 'white',
                              },
                            ];

                            const textStyle = {
                              color: index === 0 ? '#fff' : '#000',
                            };

                            return (
                              <GHTouchableHighlight
                                onPress={() => addMentions(item)}
                                style={styles.suggestedUserItemActionContainer}>
                                <View key={item.id} style={itemContainer}>
                                  <Text style={textStyle}>{item.name}</Text>
                                </View>
                              </GHTouchableHighlight>
                            );
                          }}
                        />
                      </View>
                    )
                  }
                />

                {/* <MentionsTextInput
                  multiline={true}
                  textInputStyle={styles.textInput}
                  suggestionsPanelStyle={{
                    width: '100%',
                    height: this.suggestionsDataHeight(value),
                    overflow: 'hidden',
                    position: 'absolute',
                    top: -this.suggestionsDataHeight(value),
                    zIndex: 1,
                    elevation: 4,
                  }}
                  loadingComponent={() => null}
                  textInputMinHeight={35}
                  textInputMaxHeight={input_focus?150:35}
                  trigger={'@'}
                  triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                  value={value}
                  onFocus={(e) => { this.setState({ input_focus: true }) }}
                  onBlur={(e) => this.setState({ input_focus: false })}
                  onChangeText={(message) => {
                    if (!message.includes('@')) {
                      this.setState({suggestionData: []});
                    }
                    onChangeText(message);
                  }}
                  placeholder={placeholder}
                  autoCorrect={false}
                  triggerCallback={(lastKeyword) => {
                    console.log(
                      'ChatInput -> render -> triggerCallback',
                      lastKeyword,
                    );
                    this.groupMembersMentions(lastKeyword);
                  }}
                  suggestionsData={suggestionData} // array of objects
                  keyExtractor={(item, index) => item.id}
                  renderSuggestionsRow={({item, index}, hidePanel) => {
                    return (
                      suggestionData &&
                      suggestionData.length > 0 && (
                        <GHTouchableHighlight
                          key={index + ''}
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
                            this.setState({
                              isMentionsOpen: false,
                              mentionUser: item,
                            });
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
                                  // this.state.highlightItemId === item.id
                                  //   ? 'white'
                                  //   :
                                  index === 0 ? 'white' : 'black',
                                textAlign: 'center',
                              }}>
                              {item.display_name || item.username}
                            </Text>
                          </View>
                        </GHTouchableHighlight>
                      )
                    );
                  }}
                  suggestionRowHeight={suggestionDataHeight}
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
                  }}></MentionsTextInput> */}
              </View>
            ) : (
              <TextInput
                ref={(input) => {
                  this.input_ref = input;
                }}
                multiline={true}
                style={styles.textInput}
                onChangeText={(message) => onChangeText(message)}
                onFocus={(e) => {
                  this.setState({input_focus: true});
                }}
                onBlur={(e) => this.setState({input_focus: false})}
                onContentSizeChange={({nativeEvent}) => {
                  if (nativeEvent.contentSize.height !== this.lineHeight) {
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
            style={styles.sendButoonContainer}
            activeOpacity={value || sendingImage.uri ? 0 : 1}
            onPress={() => {
              console.log('======');
              value || sendingImage.uri ? onSend() : null;
            }}>
            <Image
              source={Icons.icon_send_button}
              style={[styles.sandButtonImage]}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/* </View> */}
        </LinearGradient>
      </View>
    );
  }
}
