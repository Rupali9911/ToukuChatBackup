import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  container: {
    // maxWidth: width * 0.65,
    paddingHorizontal: '1.5%',
  },
  statusText: {
    color: Colors.dark_pink,
    fontFamily: Fonts.light,
    fontSize: Platform.isPad ? normalize(5) : normalize(8),
    marginLeft: Platform.isPad ? 15 : 7,
  },
  translatedMessageContainer: {
    minHeight: 40,
    backgroundColor: Colors.gray,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 15,
  },
  translatedMessage: {
    fontFamily: Fonts.light,
    fontSize: 14,
  },
  translatedMessageSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  translatedMessageLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.gray_dark,
  },
  translatedMessageIcon: {
    marginLeft: 10,
  },
  containerJustification: {
    justifyContent: 'flex-start',
  },
  contentContainer: {
    alignItems: 'flex-start',
    // marginVertical:
    //   message.message_body && message.message_body.type === 'image'
    //     ? 0
    //     : 2,
  },
  row: {
    flexDirection: 'row',
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
    marginRight: 5,
  },
  senderUsername: {
    fontSize: Platform.isPad ? normalize(5.5) : normalize(9),
    fontFamily: Fonts.regular,
    color: Colors.primary,
    textAlign: 'left',
    marginStart: 10,
    fontWeight: '300',
  },
  time: {
    // marginHorizontal: '1.5%',
    alignItems: 'center',
    // marginVertical:
    //   message.message_body &&
    //   message.message_body.type === 'image'
    //     ? 0
    //     : 15,
    alignSelf: 'flex-end',
    paddingBottom: 5,
  },
  chatContentContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    // message.message_body &&
    // message.message_body.type === 'image'
    //   ? 'column'
    //   : 'row',
  },
  imageContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    // paddingHorizontal: 0,
  },
  ifNotImageContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  ifNotImageSubContainer: {
    alignItems: 'flex-end',
  },
  dateSubContainer: {
    marginHorizontal: '1.5%',
    alignItems: 'center',
    // marginTop: 15,
    alignSelf: 'flex-end',
    paddingBottom: 5,
  },
});
