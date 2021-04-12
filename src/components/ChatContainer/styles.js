import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';

export default StyleSheet.create({
  messageAreaConatiner: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.light_pink,
    // marginBottom: isIphoneX() ? 70 : 50,
  },
  messareAreaScroll: {flexGrow: 1, paddingBottom: 20},
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageDateCntainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  messageDate: {
    // backgroundColor: Colors.orange_header,
    // paddingVertical: 4,
    // paddingHorizontal: 11,
    // borderRadius: 18,
  },
  messageDateText: {
    color: Colors.dark_pink,
    fontFamily: Fonts.medium,
    fontSize: 13,
    fontWeight: '300',
  },
  singleFlex: {
    flex: 1,
  },
  keyboardFlatlistContentContainer: {
    padding: '20%',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replayContainer: {
    width: '100%',
    backgroundColor: '#FFDBE9',
    // position: 'absolute',
    padding: 10,
    // bottom: Platform.OS=='ios'?20:30,
    borderTopColor: Colors.gradient_1,
    borderTopWidth: 1,
  },
  replyHeader: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyUser: {
    flex: 8,
  },
  replyCloseIcon: {
    flex: 2,
    alignItems: 'flex-end',
  },
  replyCloseActionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%',
    width: '18%',
    borderRadius: 100,
    backgroundColor: Colors.gradient_1,
  },
  closeIcon: {
    tintColor: Colors.white,
    height: '50%',
    width: '100%',
  },
  messageTypeContainer: {
    flex: 7,
    justifyContent: 'center',
    width: '95%',
  },
  mediaMessageBody: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Fonts.light,
  },
  mediaContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  mediaLabel: {
    color: Colors.dark_gray,
    fontSize: 13,
    marginLeft: 5,
    fontFamily: Fonts.light,
  },
  multiSelectContainer: {
    backgroundColor: Colors.light_pink,
    flexDirection: 'row',
    borderTopColor: Colors.pink_chat,
    borderTopWidth: 3,
    paddingBottom: 20,
    justifyContent: 'space-between',
    padding: 10,
  },
  divider: {
    flex: 0.3,
  },
});
