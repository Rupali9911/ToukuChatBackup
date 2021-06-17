import React, {Component, useState} from 'react';
import {
  Animated,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
    Keyboard,
    InteractionManager
} from 'react-native';
import {
  FlatList,
  TouchableOpacity as GHTouchableHighlight,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MentionsInput from '../../../../LineLibChanges/react-native-mentions-input/index.tsx';
import {Colors, Icons, Images} from '../../../constants';
import {isIphoneX, normalize, wait} from '../../../utils';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import stickerPacks from './data.json';

import {addEmotionToFrequentlyUsed} from '../../../redux/reducers/chatReducer';
import {connect} from 'react-redux';
import {findIndex} from 'lodash';
import { ListLoader } from '../../Loaders';
import NormalImage from '../../NormalImage';
import MediaPickerList from '../../MediaPicker';

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
      extraAreaHeight: new Animated.Value(0),
      text: '',
      gifs: [],
      stickers: [],
      term: '',
      stickerSearch: '',
      API_KEY: 'GdZTjlnqzAXmqxcpFo9Azs8QznTr5vmH',
      GIFS_BASE_URL: 'https://api.giphy.com/v1/gifs',
      STICKETS_BASE_URL: `https://api.giphy.com/v1/stickers`,
      isExtraAreaVisible: false,
      picker_height: new Animated.Value(0),
      selected_medias: [],
      selectedMediaObject: [],
      selectedEmotion: null
    };
    this.newHeight = isIphoneX() ? 70 : 50;
    this.lineHeight = 0;
    this.oldLineHeight = 0;
    this.isExtrasAreaVisible = false;
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
    this.fetchTrendingGifs();
    this.fetchTrendingStickers();
  }

  showPicker = () => {
    this.setState({
      isExtraAreaVisible: true
    });
    Animated.timing(this.state.picker_height, {
      toValue: 300,
      timing: 1000,
      useNativeDriver: false
    }).start();
  }

  hidePicker = () => {
    Animated.timing(this.state.picker_height, {
      toValue: 0,
      timing: 1000,
      useNativeDriver: false
    }).start(()=>{
      this.setState({
        isExtraAreaVisible: false,
        selected_medias: [], 
        selectedMediaObject: []
      });
    });
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
    // console.log('suggestionRowHeight', suggestionRowHeight);
    return suggestionRowHeight;
  };

  async fetchGifs() {
    try {
      if (this.state.term !== '') {
        const BASE_URL = `${this.state.GIFS_BASE_URL}/search`;
        const resJson = await fetch(
          `${BASE_URL}?api_key=${this.state.API_KEY}&limit=20&q=${this.state.term}`,
        );
        if(resJson.ok){
          const res = await resJson.json();
          this.setState({gifs: res.data});
        }
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
      if(resJson.ok){
        const res = await resJson.json();
        this.setState({gifs: res.data});
      }
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
        if(resJson.ok){
          const res = await resJson.json();
          this.setState({stickers: res.data});
        }
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
      if(resJson.ok){
        const res = await resJson.json();
        this.setState({stickers: res.data});
      }
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

  hideKeyboard = async() => {
    this.input_ref && this.input_ref._textInput
      ? this.input_ref._textInput.blur()
      : this.input_ref.blur()
  }

  showExtraArea = () => {
    // this.setState({isExtrasAreaVisible: true});
    this.isExtrasAreaVisible = true;
    this.forceUpdate();
    Animated.timing(this.state.extraAreaHeight, {
      toValue: 340,
      timing: 500,
      useNativeDriver: false
    }).start();
  }

  hideExtraArea = () => {
    this.isExtrasAreaVisible = false;
    this.forceUpdate();
    Animated.timing(this.state.extraAreaHeight, {
      toValue: 0,
      timing: 50,
      useNativeDriver: false
    }).start(()=>{
      // this.forceUpdate();
    });
  }

  onSelectMedia = (media,index) => {
    let selected_medias = this.state.selected_medias;
    let selectedMediaObject = this.state.selectedMediaObject;
    console.log('index',index);
    if(index>0){
      selected_medias.splice(index-1,1);
      selectedMediaObject.splice(index-1,1);
      this.setState({selected_medias,selectedMediaObject});
    }else{
      let uri_set = new Set(selected_medias);
      let object_set = new Set(selectedMediaObject);
      uri_set.add(media.image.uri);
      object_set.add(media);

      this.setState({selected_medias: [...uri_set],selectedMediaObject: [...object_set]});
    }
  }

  addEmotionToFrequentlyUsed = (model) => {
    const {emotions,addEmotionToFrequentlyUsed} = this.props;
    if(model){
      let isModelExist = emotions.findIndex((item)=>item.url === model.url);
      if(isModelExist<0){
        addEmotionToFrequentlyUsed(model);
      }else {
        emotions.splice(isModelExist,1);
        emotions.push(model);
      }
    }
  }

  selectEmotion = (emotion) => {
    this.setState({selectedEmotion: emotion});
  }

  clearSelection = () => {
    this.setState({selectedEmotion: null});
  }

  onSelectedEmotionPress = () => {
    const {sendEmotion} = this.props;
    const {selectedEmotion} = this.state;
    sendEmotion(selectedEmotion);
    this.addEmotionToFrequentlyUsed(selectedEmotion);
    this.setState({ selectedEmotion: null });
  }

  render() {
    const {
      onAttachmentPress,
      onCameraPress,
      onGalleryPress,
      onChangeText,
      onSend,
      onMediaSend,
      value,
      placeholder,
      sendingImage,
      sendEmotion,
      addEmotionToFrequentlyUsed,
      emotions,
    } = this.props;
    const {input_focus,isExtraAreaVisible,selected_medias, selectedEmotion} = this.state;

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
        // maxHeight: input_focus ? 200 : isExtraAreaVisible ? 400 : isIphoneX() || Platform.isPad ? 70 : 50,
      },
      styles.rootContainer,
    ];
    return (
      <>
      {selectedEmotion && <View style={[styles.selectItemContainer,{bottom: 340+this.newHeight}]}>
        <TouchableOpacity style={styles.frequentUseItemContainerStyle}
            activeOpacity={0.8}
            onPress={this.onSelectedEmotionPress}>
            <FastImage
              resizeMode={
                selectedEmotion.url.includes('&ct=g')
                  ? FastImage.resizeMode.cover
                  : FastImage.resizeMode.contain
              }
              style={[
                   styles.gifsImageContainerStyle,
                  {alignSelf: 'center'}
              ]}
              source={{
                uri: selectedEmotion.url,
                priority: FastImage.priority.high,
              }}
            />
          </TouchableOpacity>
          <FontAwesome5
              name={'times'}
              size={30}
              style={styles.closeIconStyle}
              color={Colors.white}
              onPress={this.clearSelection}
            />
        </View>}
      <View style={container}>
        <LinearGradient
          colors={['rgba(255, 137, 96, 0.3)', 'rgba(255, 98, 165, 0.3)']}
          // locations={[0.2, 1]}
          useAngle={true}
          // angle={270}
          angleCenter={{x: 0, y: 1}}
          style={[styles.chatInputContainer, styles.inputContainer]}>
          {/* <View style={styles.chatInputContainer}> */}
          {input_focus || this.isExtrasAreaVisible ? (
            <View style={styles.attachmentContainer}>
              <TouchableOpacity
                style={[
                  styles.chatAttachmentButton,
                ]}
                onPress={() => {
                  this.hideExtraArea();
                  this.input_ref && this.input_ref._textInput
                    ? this.input_ref._textInput.blur()
                    : this.input_ref.blur();
                  this.setState({input_focus: false, selectedEmotion: null});
                  onChangeText('');
                }}>
                <FontAwesome5
                  name={'angle-right'}
                  size={30}
                  style={styles.rightIconStyle}
                  color={Colors.gradient_3}
                />
              </TouchableOpacity>
                {/* <TouchableOpacity
                    style={styles.chatAttachmentButton}
                    onPress={() =>{
                        // Keyboard.dismiss(()=> {
                        //     this.setState({
                        //         isExtrasAreaVisible: !isExtrasAreaVisible,
                        //     })
                        // })
                        // this.hideKeyboard().then(()=>{
                          this.showExtraArea();
                          Keyboard.dismiss();
                          // console.log('isExtrasAreaVisible', isExtrasAreaVisible)
                          // wait(100).then(()=>{
                          //   this.setState({
                          //     isExtrasAreaVisible: !isExtrasAreaVisible,
                          //   })
                          // });
                                
                        // });
                    }}>
                    <Image
                        source={Icons.icon_sticker_pack}
                        style={styles.attachmentImage}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity> */}
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
                onPress={() => {
                  // this.setState({isExtraAreaVisible: true});
                  if(this.props.onMediaSend){
                    if(isExtraAreaVisible){
                      this.hidePicker();
                    }else{
                      this.showPicker();
                    }
                  }else{
                    onGalleryPress();
                  }
                  // onGalleryPress();
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
              (input_focus || this.isExtrasAreaVisible) && styles.mentionInpiutContainer,
            ]}>
            {this.props.useMentionsFunctionality ? (
                <MentionsInput
                  ref={(input) => {
                    this.input_ref = input;
                  }}
                  value={value}
                  maxHeight={50}
                  multiline={true}
                  onFocus={() => {
                    this.setState({input_focus: true, selectedEmotion: null},()=>{
                      this.hideExtraArea();
                    });
                  }}
                  onBlur={() => {
                    this.setState({input_focus: false});
                    this.input_ref && this.input_ref.hideSuggestionPanel();
                  }}
                  onTextChange={(message) => {
                    if (!message.includes('@')) {
                      this.setState({suggestionData: []});
                    }else{
                      this.groupMembersMentions(message);
                    }
                    console.log(message);
                    handleInput(message);
                    this.groupMembersMentions(message);
                  }}
                  onMarkdownChange={(markdown) => {}}
                  placeholder={placeholder}
                  placeholderTextColor={'gray'}
                  autoCorrect={false}
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
            ) : (
              <TextInput
                ref={(input) => {
                  this.input_ref = input;
                }}
                multiline={true}
                style={styles.textInput}
                onChangeText={(message) => handleInput(message)}
                onFocus={(e) => {
                  this.setState({input_focus: true, selectedEmotion: null},()=>{
                    this.hideExtraArea();
                  });
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
             {(input_focus || this.isExtrasAreaVisible) && <View style={styles.attachmentContainer}>
                <TouchableOpacity
                  style={styles.chatAttachmentButton}
                  onPress={() => {
                    this.showExtraArea();
                    Keyboard.dismiss();
                  }}>
                  <Image
                    source={Icons.icon_sticker_pack}
                    style={styles.attachmentImage}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </View>}
          </View>
          <TouchableOpacity
            style={styles.sendButoonContainer}
            activeOpacity={value || sendingImage.uri ? 0 : 1}
            onPress={() => {
              console.log('======');
              if(value){
                value || sendingImage.uri ? onSend() : null;
              }else if(selected_medias && selected_medias.length>0){
                onMediaSend(this.state.selectedMediaObject);
                this.hidePicker();
              }else if(selectedEmotion){
                sendEmotion(selectedEmotion);
                this.addEmotionToFrequentlyUsed(selectedEmotion);
                this.setState({selectedEmotion: null});
              }
            }}>
            <Image
              source={Icons.icon_send_button}
              style={styles.sandButtonImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/* </View> */}
        </LinearGradient>
        {this.isExtrasAreaVisible && (
            <Animated.View
              style={[
                styles.emotionsContainer,
                {
                  // height: isExtrasAreaVisible ? 340 : 0,
                  height: this.state.extraAreaHeight,
                  width: '100%',
                },
              ]}>
              <ScrollableTabView
                initialPage={1}
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
                      {/*<TabBarItem*/}
                        {/*icon={Icons.icon_sticker_pack}*/}
                        {/*onPress={() => goToPage(3)}*/}
                        {/*activeTab={activeTab}*/}
                        {/*index={3}*/}
                      {/*/>*/}
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
                    addEmotionToFrequentlyUsed={this.addEmotionToFrequentlyUsed}
                    emotions={emotions}
                    numOfColumns={2}
                    onPress={this.selectEmotion}
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
                    onPress={this.selectEmotion}
                    addEmotionToFrequentlyUsed={this.addEmotionToFrequentlyUsed}
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
                    onPress={this.selectEmotion}
                    addEmotionToFrequentlyUsed={this.addEmotionToFrequentlyUsed}
                  />
                </View>
                {/*<View tabLabel={'Stickers Pack'}>*/}
                  {/*<StickerPackSection />*/}
                {/*</View>*/}
              </ScrollableTabView>
            </Animated.View>
        )}
        {isExtraAreaVisible?
        <Animated.View style={{ height: this.state.picker_height, width: '100%', paddingBottom: 20, backgroundColor: Colors.light_pink }}>
          <MediaPickerList onSelect={this.onSelectMedia} selectedMedia={selected_medias}/>
        </Animated.View>
        :null}
        
      </View>
      </>
    );
  }
}

function StickerPackSection() {
  const [packs, setPacks] = useState(stickerPacks);
  const [offset, setOffset] = useState(10);

  async function fetchMoreStickers(item) {
    try {
      // Fetch more sticker pack
      const res = await fetch(
        `https://api.giphy.com/v1/stickers/packs/${item.id}/stickers?api_key=GdZTjlnqzAXmqxcpFo9Azs8QznTr5vmH&limit=25&offset=${offset}`,
      );

      // Update offset
      const currentOffset = offset + 10;
      setOffset(currentOffset);

      // Resolve incoming data
      const {data} = await res.json();
      const images = [];
      for (const element of data) {
        images.push(element.images.preview_gif.url);
      }

      // Get current item
      const list = item.data;
      const model = {
        ...item,
        data: list.concat(images),
      };
      const index = findIndex(packs, {id: item.id});
      packs.splice(index, 1, model);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <FlatList
      data={packs}
      keyExtractor={(item) => `pack_${item.id}`}
      renderItem={({item}) => (
        <StickerPackItemView
          item={item}
          fetchMoreStickers={() => fetchMoreStickers(item)}
        />
      )}
    />
  );
}

function StickerPackItemView({item, fetchMoreStickers}) {
  return (
    <View style={styles.stickerPackIttemViewContainer}>
      <View style={styles.stickerPackHeaderContainer}>
        <Text style={styles.stickerPackTitleText}>{item.title}</Text>
        {/* <Text
          onPress={() =>
            Alert.alert('Download Feature', 'Add Download Feature')
          }
          style={styles.stickerPackDownloadText}>
          Download
        </Text> */}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={item.data}
        keyExtractor={(i) => `${i}`}
        renderItem={StickerSubItemView}
        ItemSeparatorComponent={() => (
          <View style={styles.horizontalListDivider} />
        )}
        onScrollEndDrag={fetchMoreStickers}
      />
    </View>
  );
}

function StickerSubItemView({item}) {
  return (
    <FastImage
      resizeMode={FastImage.resizeMode.contain}
      style={{
        width: 75,
        height: 75,
      }}
      source={{
        uri: item,
        priority: FastImage.priority.high,
      }}
    />
  );
}

function TabBarItem({icon, onPress, index, activeTab}) {
  const container = [
    {
      borderBottomWidth: activeTab === index ? 1 : 0,
    },
    styles.tabBarItemContainer,
  ];

  const imageStyle = [
    {
      tintColor: activeTab === index ? Colors.dark_pink : 'gray',
    },
    styles.tabBarImage,
  ];

  return (
    <TouchableOpacity onPress={onPress} style={container}>
      <Image source={icon} style={imageStyle} />
    </TouchableOpacity>
  );
}

function FrequentlyUsedList({emotions = [], numOfColumns, onPress}) {
  return (
    <FlatList
      data={emotions.reverse()}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      style={styles.emotionListStyle}
      contentContainerStyle={[
        styles.emotionListContentStyle,
        emotions.length === 0 && styles.frequentlyUsedListContentContainer,
      ]}
      keyExtractor={(item) => item.url}
      maxToRenderPerBatch={5}
      initialNumToRender={10}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      ListEmptyComponent={
        <View style={styles.frequentlyUsedEmptyContainer}>
          <Image
            source={Icons.icon_frequently_used}
            style={styles.frequentlyUsedIcon}
          />
          <View style={styles.emptyDivider} />
          <Text style={styles.frequentlyUsedEmptyText}>
            Select a GIF or a Sticker{'\n'}to use it instantly
          </Text>
        </View>
      }
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity
            style={styles.frequentUseItemContainerStyle}
            activeOpacity={0.8}
            onPress={() => {
              // emotions.forEach((value, idx) => {
              //   if (value.url === item.url) {
              //     emotions.splice(idx, 1);
              //     emotions.push(value);
              //   }
              // });
              onPress(item);
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

  const textInputStyle = [
    styles.emotionInputContainer,
    {
      fontWeight: focused ? 'normal' : 'bold',
    },
  ];

  return (
    <>
        <TextInput
          placeholder={searchTitle}
          placeholderTextColor={'gray'}
          style={textInputStyle}
          autoCorrect={false}
          textAlign={'left'}
          onChangeText={onChangeText}
          inlineImageLeft={'search_icon'}
          clearButtonMode={'while-editing'}
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
          ListEmptyComponent={() => <ListLoader />}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={containerStyle}
                activeOpacity={0.8}
                onPress={() => {
                  // addEmotionToFrequentlyUsed({
                  //   url: item.images.original.url,
                  //   type: item.type,
                  // });
                  const model = {
                    url: item.images.original.url,
                    type: item.type,
                    name: item.title,
                  };
                  onPress(model);
                }}>
                <NormalImage
                  src={item.images.preview_gif.url}
                  style={[
                    imageStyle,
                    item.type === 'gif' && {
                      marginEnd: index % 2 === 0 ? 12 : 0,
                    },
                  ]}
                  resizeMode={resizeMode}
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
