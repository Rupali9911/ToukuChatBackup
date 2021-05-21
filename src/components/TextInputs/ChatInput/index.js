import React, {Component, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
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
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MentionsInput from '../../../../LineLibChanges/react-native-mentions-input/index.tsx';
import {Colors, Icons} from '../../../constants';
import {isIphoneX, normalize} from '../../../utils';
import styles from './styles';
import FastImage from 'react-native-fast-image';

import {addEmotionToFrequentlyUsed} from '../../../redux/reducers/chatReducer';
import {connect} from 'react-redux';

// const {height} = Dimensions.get('window');

class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightItemId: false,
      suggestionData: [],
      suggestionDataHeight: 0,
      mentionUser: [],
      input_focus: false,
      isExtrasAreaVisible: false,
      text: '',
      gifs: [],
      stickers: [],
      term: '',
      stickerSearch: '',
      API_KEY: 'GdZTjlnqzAXmqxcpFo9Azs8QznTr5vmH',
      GIFS_BASE_URL: 'https://api.giphy.com/v1/gifs',
      STICKETS_BASE_URL: `https://api.giphy.com/v1/stickers`,
    };
    this.newHeight = isIphoneX() ? 70 : 50;
    this.lineHeight = 0;
    this.oldLineHeight = 0;
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
    this.fetchTrendingGifs();
    this.fetchTrendingStickers();
  }

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

  async fetchGifs() {
    try {
      if (this.state.term !== '') {
        const BASE_URL = `${this.state.GIFS_BASE_URL}/search`;
        const resJson = await fetch(
          `${BASE_URL}?api_key=${this.state.API_KEY}&limit=20&q=${this.state.term}`,
        );
        const res = await resJson.json();
        this.setState({gifs: res.data});
      } else {
        this.fetchTrendingGifs();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async fetchTrendingGifs() {
    try {
      const BASE_URL = `${this.state.GIFS_BASE_URL}/trending`;
      const resJson = await fetch(
        `${BASE_URL}?api_key=${this.state.API_KEY}&limit=16&rating=g`,
      );
      const res = await resJson.json();
      this.setState({gifs: res.data});
    } catch (err) {
      console.error(err);
    }
  }

  async fetchStickers() {
    try {
      console.log(this.state.stickerSearch);
      if (this.state.stickerSearch !== '') {
        const BASE_URL = `${this.state.STICKETS_BASE_URL}/search`;
        const resJson = await fetch(
          `${BASE_URL}?api_key=${this.state.API_KEY}&limit=20&q=${this.state.stickerSearch}`,
        );
        const res = await resJson.json();
        this.setState({stickers: res.data});
      } else {
        this.fetchTrendingStickers();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async fetchTrendingStickers() {
    try {
      const BASE_URL = `${this.state.STICKETS_BASE_URL}/trending`;
      const resJson = await fetch(
        `${BASE_URL}?api_key=${this.state.API_KEY}&limit=16&rating=g`,
      );
      const res = await resJson.json();
      this.setState({stickers: res.data});
    } catch (err) {
      console.error(err);
    }
  }

  onGifEdit(newTerm) {
    this.setState({term: newTerm}, () => this.fetchGifs());
  }

  onStickerEdit(text) {
    this.setState({stickerSearch: text}, () => this.fetchStickers());
  }

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
      sendEmotion,
      addEmotionToFrequentlyUsed,
      emotions,
    } = this.props;
    const {input_focus} = this.state;

    function handleInput(text) {
      onChangeText(text);
    }

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
      {
        // maxHeight: input_focus ? 200 : isIphoneX() || Platform.isPad ? 70 : 50,
      },
      styles.rootContainer,
    ];

    return (
      <View style={container}>
        <LinearGradient
          colors={['rgba(255, 137, 96, 0.3)', 'rgba(255, 98, 165, 0.3)']}
          // locations={[0.2, 1]}
          useAngle={true}
          // angle={270}
          angleCenter={{x: 0, y: 1}}
          style={[styles.chatInputContainer, styles.inputContainer]}>
          {/* <View style={styles.chatInputContainer}> */}
          {input_focus ? (
            <View style={styles.attachmentContainer}>
              <TouchableOpacity
                style={[
                  styles.chatAttachmentContainer,
                  styles.chatAttachmentButton,
                  styles.attachmentActionContainer,
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
                onPress={() => onAttachmentPress()}>
                {/* <FontAwesome5
                  name={'plus'}
                  size={height * 0.03}
                  color={'indigo'}
                /> */}
                <Image
                  source={Icons.plus_icon_select}
                  style={styles.attachmentImage}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatAttachmentButton}
                onPress={() => onCameraPress()}>
                <Image
                  source={Icons.icon_camera_grad}
                  style={styles.attachmentImage}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatAttachmentButton}
                onPress={() => onGalleryPress()}>
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
              <TouchableOpacity
                style={styles.chatAttachmentButton}
                onPress={() =>
                  this.setState({
                    isExtrasAreaVisible: !this.state.isExtrasAreaVisible,
                  })
                }>
                <Image
                  source={Icons.icon_sticker}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={[
              styles.textInputContainer,
              input_focus && styles.mentionInpiutContainer,
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
                  onFocus={() => {
                    this.setState({input_focus: true});
                  }}
                  onBlur={() => {
                    this.setState({input_focus: false});
                    this.input_ref && this.input_ref.hideSuggestionPanel();
                  }}
                  onTextChange={(message) => {
                    if (!message.includes('@')) {
                      this.setState({suggestionData: []});
                    }
                    console.log(message);
                    handleInput(message);
                    this.groupMembersMentions(message);
                  }}
                  onMarkdownChange={(markdown) => {}}
                  placeholder={placeholder}
                  placeholderTextColor={'gray'}
                  mentionStyle={styles.mentionStyle}
                  textInputStyle={styles.textInputStyle}
                  users={this.state.suggestionData}
                  suggestedUsersComponent={(users, addMentions) =>
                    users.length > 0 && (
                      <View
                        style={[
                          {
                            top: -this.suggestionsDataHeight(users),
                            height: this.suggestionsDataHeight(users),
                          },
                          styles.listContainer,
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
                          renderItem={({item, idx}) => (
                            <ListRenderItem
                              item={item}
                              idx={idx}
                              addMentions={addMentions}
                            />
                          )}
                        />
                      </View>
                    )
                  }
                />

                {/* <MentionsTextInput
                  multiline={true}
                  textInputStyle={chatInput.textInput}
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
                onChangeText={(message) => handleInput(message)}
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
              style={styles.sandButtonImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/* </View> */}
        </LinearGradient>
        {this.state.isExtrasAreaVisible && (
          <View>
            <View
              style={[
                styles.emotionsContainer,
                {
                  height: this.state.isExtrasAreaVisible ? 340 : 0,
                  width: '100%',
                },
              ]}>
              <ScrollableTabView
                initialPage={2}
                tabBarPosition={'top'}
                renderTabBar={({activeTab, goToPage}) => {
                  return (
                    <View
                      style={{
                        width: Dimensions.get('screen').width / 3,
                        height: '15%',
                        flexDirection: 'row',
                      }}>
                      {/* <TouchableOpacity
                      onPress={() => props.goToPage(0)}
                      style={{
                        paddingVertical: '4%',
                        paddingHorizontal: '3%',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={Icons.icon_emoji}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                          tintColor:
                            props.activeTab === 0 ? Colors.dark_pink : 'gray',
                        }}
                      />
                    </TouchableOpacity> */}
                      <TabBarItem
                        icon={Icons.icon_frequently_used}
                        onPress={() => goToPage(0)}
                        activeTab={activeTab}
                        index={0}
                      />
                      <TabBarItem
                        icon={Icons.icon_gif}
                        onPress={() => goToPage(1)}
                        activeTab={activeTab}
                        index={1}
                      />
                      <TabBarItem
                        icon={Icons.icon_sticker}
                        onPress={() => goToPage(2)}
                        activeTab={activeTab}
                        index={2}
                      />
                    </View>
                  );
                }}>
                {/* <View tabLabel={'Emojis'} style={{height: '100%'}}>
                <EmojiBoard
                  showBoard={isExtrasAreaVisible}
                  numRows={10}
                  tabBarPosition={'top'}
                  categoryDefautColor={Colors.dark_gray}
                  categoryHighlightColor={Colors.orange}
                  categoryIconSize={18}
                  tabBarStyle={styles.emojiTabBarStyle}
                  containerStyle={styles.emojiContainerStyle}
                  onClick={({code}) => handleInput(code)}
                  hideBackSpace
                />
              </View> */}
                <View tabLabel={'Recent'}>
                  <FrequentlyUsedList
                    addEmotionToFrequentlyUsed={addEmotionToFrequentlyUsed}
                    emotions={emotions}
                    numOfColumns={2}
                    onPress={sendEmotion}
                  />
                </View>
                <View tabLabel={'GIFs'}>
                  <EmotionList
                    searchTitle={'Search GIFs'}
                    type={this.state.gifs}
                    resizeMode={FastImage.resizeMode.cover}
                    numOfColumns={2}
                    containerStyle={styles.gifsContainerStyle}
                    imageStyle={styles.gifsImageContainerStyle}
                    onChangeText={(text) => this.onGifEdit(text)}
                    onPress={sendEmotion}
                    addEmotionToFrequentlyUsed={addEmotionToFrequentlyUsed}
                    loading={this.state.loading}
                  />
                </View>
                <View tabLabel={'Stickers'}>
                  <EmotionList
                    searchTitle={'Search Stickers'}
                    type={this.state.stickers}
                    resizeMode={FastImage.resizeMode.contain}
                    numOfColumns={4}
                    containerStyle={styles.stickerContainerStyle}
                    imageStyle={styles.stickerImageStyle}
                    onChangeText={(text) => this.onStickerEdit(text)}
                    onPress={sendEmotion}
                    addEmotionToFrequentlyUsed={addEmotionToFrequentlyUsed}
                  />
                </View>
              </ScrollableTabView>
            </View>
          </View>
        )}
      </View>
    );
  }
}

function TabBarItem({icon, onPress, index, activeTab}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '100%',
        paddingVertical: '4%',
        paddingHorizontal: '3%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderBottomWidth: activeTab === index ? 1 : 0,
        borderBottomColor: Colors.dark_pink,
      }}>
      <Image
        source={icon}
        style={{
          width: 20,
          height: 20,
          resizeMode: 'contain',
          tintColor: activeTab === index ? Colors.dark_pink : 'gray',
        }}
      />
    </TouchableOpacity>
  );
}

function FrequentlyUsedList({emotions = [], numOfColumns, onPress}) {
  return (
    <FlatList
      data={emotions}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      style={styles.emotionListStyle}
      contentContainerStyle={[
        styles.emotionListContentStyle,
        emotions.length === 0 && {height: '100%'},
      ]}
      keyExtractor={(item) => item.url}
      maxToRenderPerBatch={5}
      initialNumToRender={10}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      ListEmptyComponent={
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={Icons.icon_frequently_used}
            style={{width: 64, height: 64, tintColor: Colors.gray}}
          />
          <View style={{marginVertical: 6}} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: Colors.gray_dark,
              textAlign: 'center',
            }}>
            Select a GIF or a Sticker{'\n'}to use it instantly
          </Text>
        </View>
      }
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity
            style={styles.gifsContainerStyle}
            activeOpacity={0.8}
            onPress={() => {
              emotions.forEach((value, idx) => {
                if (value.url === item.url) {
                  emotions.splice(idx, 1);
                  emotions.unshift(value);
                }
              });
              onPress(item.url);
            }}>
            <FastImage
              resizeMode={
                item.type === 'gif'
                  ? FastImage.resizeMode.cover
                  : FastImage.resizeMode.contain
              }
              style={[
                item.type === 'gif'
                  ? styles.gifsImageContainerStyle
                  : styles.stickerImageStyle,
                numOfColumns === 2 && {marginEnd: index % 2 === 0 ? 12 : 0},
              ]}
              source={{
                uri: item.url,
                priority: FastImage.priority.high,
              }}
            />
          </TouchableOpacity>
        );
      }}
    />
  );
}

function EmotionList({
  searchTitle,
  type,
  onChangeText,
  resizeMode,
  numOfColumns,
  containerStyle,
  imageStyle,
  onPress,
  addEmotionToFrequentlyUsed,
  loading,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <>
      <TextInput
        placeholder={searchTitle}
        placeholderTextColor={'gray'}
        style={[
          styles.emotionInputContainer,
          {
            fontWeight: focused ? 'normal' : 'bold',
          },
        ]}
        autoCorrect={false}
        textAlign={focused ? 'left' : 'center'}
        onChangeText={onChangeText}
        // clearButtonMode={'while-editing'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {loading ? (
        <View>
          <ActivityIndicator color={'red'} />
        </View>
      ) : (
        <FlatList
          data={type}
          numColumns={numOfColumns}
          showsVerticalScrollIndicator={false}
          style={styles.emotionListStyle}
          contentContainerStyle={styles.emotionListContentStyle}
          keyExtractor={(item) => item.id}
          maxToRenderPerBatch={5}
          initialNumToRender={10}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={containerStyle}
                activeOpacity={0.8}
                onPress={() => {
                  addEmotionToFrequentlyUsed({
                    url: item.images.original.url,
                    type: item.type,
                  });
                  const model = {
                    url: item.images.original.url,
                    type: item.type,
                    name: item.title,
                  };
                  onPress(model);
                }}>
                <FastImage
                  resizeMode={resizeMode}
                  style={[
                    imageStyle,
                    item.type === 'gif' && {
                      marginEnd: index % 2 === 0 ? 12 : 0,
                    },
                  ]}
                  source={{
                    uri: item.images.preview_gif.url,
                    priority: FastImage.priority.high,
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </>
  );
}

function ListRenderItem({item, idx, addMentions}) {
  const suggestionContainer = [
    styles.suggestedUserComponentStyle,
    styles.suggestedContainer,
    {
      backgroundColor: idx === 0 ? '#FFB582' : 'white',
    },
  ];

  const nameStyle = {
    color: idx === 0 ? '#fff' : '#000',
  };

  return (
    <GHTouchableHighlight
      onPress={() => addMentions(item)}
      style={styles.mentionListActionContainer}>
      <View key={item.id} style={suggestionContainer}>
        <Text style={nameStyle}>{item.name}</Text>
      </View>
    </GHTouchableHighlight>
  );
}

const mapStateToProps = (state) => {
  return {
    emotions: state.chatReducer.emotions,
  };
};

const mapDispatchToProps = {
  addEmotionToFrequentlyUsed,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
