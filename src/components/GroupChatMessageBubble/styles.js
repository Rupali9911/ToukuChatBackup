import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

const parsedTextStyle = {
  fontSize: Platform.isPad ? normalize(8) : normalize(12),
  fontFamily: Fonts.regular,
};

export default StyleSheet.create({
  talkBubble: {
    justifyContent: 'flex-end',
    marginBottom: 7,
    marginTop: 2,
  },
  talkBubbleAbsoluteRight: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderTopWidth: 12.5,
    borderLeftWidth: 6.5,
    borderLeftColor: Colors.pink_chat,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{rotate: '-90deg'}],
    right: -5,
    top: -15,
  },
  talkBubbleAbsoluteLeft: {
    width: 30,
    height: 30,
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderTopWidth: 12.5,
    borderRightWidth: 6.5,
    borderRightColor: Colors.white,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{rotate: '90deg'}],
    left: -5,
    top: -15,
  },
  replyMessageActionContainer: {
    padding: 5,
    width: '100%',
    borderRadius: 5,
    marginBottom: 5,
  },
  replyContentContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyContentSubContainer: {
    flex: 7,
    justifyContent: 'center',
    width: '100%',
    marginTop: 5,
  },
  mediaHeading: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Fonts.light,
  },
  mediaContentContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  mediaLabel: {
    color: Colors.dark_gray,
    fontSize: 13,
    marginLeft: 5,
    fontFamily: Fonts.light,
  },
  menuStyle: {
    marginTop: 25,
    marginLeft: -20,
    backgroundColor: Colors.gradient_3,
    opacity: 0.9,
  },
  menuButtonContentContainer: {
    marginLeft: 5,
  },
  unsentContainer: {
    minHeight: 40,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  unsentMessage: {
    color: Colors.black,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  messageBodyActionContainer: {
    flex: 0,
    minHeight: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  replyAudioMessageWidth: {
    minWidth: '100%',
  },
  messageBodyText: {
    fontFamily: Fonts.regular,
    fontWeight: '300',
    fontSize: 15,
  },
  messageContentContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  messageLabel: {
    color: Colors.dark_gray,
    fontSize: 13,
    marginLeft: 5,
    fontFamily: Fonts.light,
  },
  memoContainer: {
    paddingHorizontal: 10,
  },
  memotText: {
    fontFamily: Fonts.regular,
    fontWeight: '300',
    fontSize: 15,
    marginTop: normalize(5)
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginVertical: 5,
  },
  notesContainer: {
    minWidth: 100,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  notesText: {
    flex: 1,
    color: Colors.black_light,
    fontSize: 13,
    fontFamily: Fonts.regular,
    fontWeight: '600',
  },
  parsedTextStyle: {
    ...parsedTextStyle,
    fontWeight: '400',
  },
  urlParsedTextStyle: {
    ...parsedTextStyle,
    fontWeight: '300',
  },
  imageMessageBodyMargin: {
    marginVertical: 5,
  },
  imageUnsentMessageContainer: {
    minHeight: 40,
    backgroundColor: Colors.gray,
  },
  imageUnsentMessageSubContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  audioMessageBodyContainer: {
    minHeight: 40,
    backgroundColor: Colors.pink_chat,
  },
  audioMultiSelectActionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemCustomComponentContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 15,
  },
  menuItemCustomComponentText: {
    marginLeft: 10,
    color: 'white',
  },
  linkPreviewContainer: {
    minWidth: normalize(140)
  }
});
