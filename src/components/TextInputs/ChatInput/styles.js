// Library imports
import {Dimensions, Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';
import {isIphoneX, normalize} from '../../../utils';

// Height of the current window
const {height} = Dimensions.get('window');

/**
 * StyleSheet for chat input component
 */
export default StyleSheet.create({
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
    // height: '100%',
    // flex: 1,
    // backgroundColor: '#FC94B8',
    // paddingHorizontal: 15,
    // backgroundColor: 'red',
    width: '100%',
    paddingTop: 5,
    maxHeight: 200,
    paddingLeft: 10,
    paddingRight: 15,
    flexDirection: 'row',
    minHeight: isIphoneX() || Platform.isPad ? 70 : 60,
    paddingBottom: isIphoneX() || Platform.isPad ? 20 : 5,
  },
  inputContainer: {
    alignItems: 'flex-end',
    overflow: 'visible',
  },
  chatAttachmentContainer: {
    // height: isIphoneX() ? 40 : 30,
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 5,
  },
  chatAttachmentButton: {
    // height: '100%',
    // width: '29%',
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  attachmentImage: {
    // height: '80%',
    width: '90%',
  },
  textInputContainer: {
    width: '60%',
    // height: '80%',
    justifyContent: 'center',
  },
  textInput: {
    // height: '100%',
    borderWidth: 0.2,
    backgroundColor: Colors.white,
    minHeight: 35,
    borderRadius: 10,
    borderColor: Colors.gray,
    paddingHorizontal: 10,
    paddingTop:
      Platform.OS === 'ios' ? (isIphoneX() || Platform.isPad ? 10 : 10) : 0,
    paddingBottom: 0,
    fontSize: Platform.isPad ? normalize(5.5) : normalize(12),
    textAlignVertical: 'center',
    lineHeight: 15,
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

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  textInputStyle: {
    borderWidth: 0.2,
    backgroundColor: Colors.white,
    minHeight: 35,
    borderRadius: 10,
    borderColor: Colors.gray,
    paddingHorizontal: 10,
    paddingTop:
      Platform.OS === 'ios' ? (isIphoneX() || Platform.isPad ? 10 : 10) : 0,
    paddingBottom: 0,
    fontSize: Platform.isPad ? normalize(5.5) : normalize(11),
    textAlignVertical: 'center',
    lineHeight: 15,
    width: '100%',
    color: '#000',
  },
  suggestedUserComponentImageStyle: {
    width: 20,
    height: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginRight: 5,
  },
  suggestedUserComponentStyle: {
    alignItems: 'center',
    paddingHorizontal: 10,
    height: height / 16,
    flexDirection: 'row',
  },
  mentionStyle: {
    fontWeight: '500',
    color: 'blue',
  },

  // Example styles
  sendButtonStyle: {
    marginTop: 20,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 15,
  },
  exampleContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  exampleHeader: {
    fontWeight: '700',
  },
  rootContainer: {
    // position: 'absolute',
    // bottom: 0,
    minHeight: isIphoneX() || Platform.isPad ? 70 : 50,
    // height: this.newHeight,
    width: '100%',
    backgroundColor: Colors.white,
    overflow: 'visible',
  },
  attachmentContainer: {
    width: '13%',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
  },
  attachmentActionContainer: {
    width: '100%',
  },
  mentionInpiutContainer: {
    width: '80%',
  },
  listContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    borderWidth: 0.25,
    borderColor: 'gray',
    padding: 5,
  },
  mentionListActionContainer: {
    height: normalize(22),
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 5,
  },
  suggestedContainer: {
    width: '100%',
    height: '100%',
  },
  emotionInputContainer: {
    height: 45,
    color: 'black',
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: 'rgba(100, 93, 93, 0.15)',
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  emotionListStyle: {
    margin: 12,
  },
  emotionListContentStyle: {
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
    // alignItems: 'center',
    paddingBottom: 50,
  },
  divider: {
    marginVertical: 6,
  },
  emotionsContainer: {
    backgroundColor: Colors.light_pink,
  },
  stickerContainerStyle: {
    width: Dimensions.get('window').width / 4,
    height: 75,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  stickerImageStyle: {
    width: '100%',
    height: 75,
    borderRadius: 4,
    overflow: 'hidden',
  },
  gifsContainerStyle: {
    width: Dimensions.get('window').width / 2,
    height: 130,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  gifsImageContainerStyle: {
    width: '95%',
    height: 130,
    borderRadius: 4,
    overflow: 'hidden',
  },
  emojiTabBarStyle: {
    marginTop: '3%',
  },
  emojiContainerStyle: {
    height: 300,
    backgroundColor: Colors.light_pink,
  },
  tabBarItemContainer: {
    width: '100%',
    paddingVertical: '4%',
    paddingHorizontal: '3%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.dark_pink,
  },
  tabBarImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  frequentlyUsedListContentContainer: {
    height: '100%',
  },
  frequentlyUsedEmptyContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  frequentlyUsedIcon: {
    width: 64,
    height: 64,
    tintColor: Colors.gray,
  },
  emptyDivider: {
    marginVertical: 6,
  },
  frequentlyUsedEmptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray_dark,
    textAlign: 'center',
  },
  stickerPackIttemViewContainer: {
    padding: 8,
    margin: 8,
    borderRadius: 6,
    backgroundColor: Colors.white,
  },
  stickerPackHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stickerPackTitleText: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
    overflow: 'hidden',
    // backgroundColor: Colors.pink_chat,
    alignSelf: 'flex-start',
    color: Colors.dark_pink,
  },
  stickerPackDownloadText: {
    fontWeight: 'bold',
    fontSize: 12,
    padding: 12,
    borderRadius: 6,
    marginBottom: 6,
    overflow: 'hidden',
    textTransform: 'uppercase',
    backgroundColor: Colors.dark_orange,
    alignSelf: 'flex-start',
    color: Colors.white,
  },
  horizontalListDivider: {
    marginHorizontal: 8,
  },
});
