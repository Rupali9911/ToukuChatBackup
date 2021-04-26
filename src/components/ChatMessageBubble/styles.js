import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  talkBubble: {
    justifyContent: 'flex-end',
    marginBottom: 5,
    // marginTop: 10
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
    // borderLeftColor: Colors.gradient_3,
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
    flexDirection: 'row',
  },
  replyUserTitleContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyMessageContainer: {
    flex: 7,
    justifyContent: 'center',
    width: '100%',
  },
  mediaMessage: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Fonts.light,
  },
  mediaLabelContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  mediaLabel: {
    color: Colors.dark_gray,
    fontSize: 13,
    marginLeft: 5,
    fontFamily: Fonts.light,
  },
  menuContainer: {
    marginTop: 25,
    marginLeft: -20,
    backgroundColor: Colors.gradient_3,
    opacity: 0.9,
  },
  talkBubbleContainer: {
    marginVertical: 5,
  },
  contentContainer: {
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
  hyperlinkMessage: {
    marginLeft: -15,
  },
  imageMessage: {
    minHeight: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  audioMessage: {
    minWidth: '100%',
  },
  docMessageBody: {
    fontFamily: Fonts.regular,
    fontWeight: '300',
    fontSize: 15,
  },
  docMessage: {
    color: Colors.dark_gray,
    marginLeft: 5,
    fontFamily: Fonts.regular,
    fontWeight: '300',
    fontSize: 15,
  },
  linkStyle: {
    color: Colors.link_color,
    textDecorationLine: 'underline',
  },
  messageBody: {
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: Platform.isPad ? normalize(7.5) : normalize(12),
  },
  messageUnsentContainer: {
    minHeight: 40,
    backgroundColor: Colors.gray,
  },
  messageUnsentSubContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  audioMessageStyle: {
    minHeight: 40,
    backgroundColor: Colors.pink_chat,
  },
  audioMessageWidth: {
    minWidth: '100%',
  },
  imageActionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  docMessageContainer: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '300',
    fontFamily: Fonts.regular,
  },
  docMessageLabel: {
    color: Colors.dark_gray,
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '300',
    fontFamily: Fonts.regular,
  },
  hyperlinkText: {
    color: Colors.black,
    fontSize: Platform.isPad ? normalize(7.5) : normalize(12),
    fontWeight: '300',
    fontFamily: Fonts.regular,
  },
  translateContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 15,
  },
  translateText: {
    marginLeft: 10,
    color: '#fff',
  },
  singleFlex: {
    flex: 1,
  },
  iconLabel: {
    // flex: 2,
    marginLeft: 10,
    color: '#fff',
  },
  downloadContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
  },
});
