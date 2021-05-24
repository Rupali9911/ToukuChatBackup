import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import { normalize } from '../../utils';

export default StyleSheet.create({
  messageAreaContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.light_pink,
    // marginBottom: isIphoneX() ? 70 : 50,
  },
  messageAreaScroll: {flexGrow: 1, paddingBottom: 20},
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageDateContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  messageDate: {
    // backgroundColor: Colors.orange_light,
    // paddingVertical: 3,
    // paddingHorizontal: 11,
    // borderRadius: 18,
  },
  messageDateText: {
    color: Colors.dark_pink,
    fontFamily: Fonts.regular,
    fontSize: 13,
    fontWeight: '300',
  },
  singleFlex: {
    flex: 1,
  },
  replyPadding: {
    paddingBottom: '20%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageBodyContainer: {
    width: '100%',
  },
  menuStyle: {
    marginTop: 15,
    marginLeft: 20,
    backgroundColor: Colors.gradient_3,
    opacity: 0.9,
  },
  menuButtonActionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  menuButtonActionContainer: {
    maxWidth: '90%', 
    backgroundColor: Colors.update_bg, 
    padding: normalize(5), 
    paddingHorizontal: normalize(8), 
    borderRadius: 12,
  },
  menuItemCustomComponentContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 15,
  },
  replyContainer: {
    width: '100%',
    backgroundColor: '#FFDBE9',
    // position: 'absolute',
    padding: 10,
    // bottom: Platform.OS=='ios'?20:30,
    borderTopColor: Colors.gradient_1,
    borderTopWidth: 1,
  },
  deleteLabel: {
    marginLeft: 10,
    color: 'white',
  },
  replySubContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameContainer: {
    flex: 8,
  },
  usernameTextStyle: {
    color: Colors.gradient_1,
  },
  cancelContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  cancelActionContainer: {
    //   paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%',
    width: '18%',
    borderRadius: 100,
    backgroundColor: Colors.gradient_1,
  },
  cancelIcon: {
    tintColor: Colors.white,
    height: '50%',
    width: '100%',
  },
  repliedMessageContainer: {
    flex: 7,
    justifyContent: 'center',
    width: '95%',
  },
  mediaMessage: {
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary
  },
});
