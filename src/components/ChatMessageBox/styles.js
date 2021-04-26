import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  container: {
    // maxWidth: width * 0.65,
    paddingHorizontal: '1.5%',
  },
  containerSelf: {
    // maxWidth: width * 0.75,
    paddingHorizontal: '3%',
  },
  statusText: {
    color: Colors.dark_pink,
    fontFamily: Fonts.light,
    fontSize: Platform.isPad ? normalize(5.5) : normalize(8),
    marginLeft: Platform.isPad ? 15 : 7,
  },
  squareImage: {
    width: 40,
    height: 40,
    // borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
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
  translateMessageActionContainer: {
    marginLeft: 10,
  },
  containerWidth: {
    justifyContent: 'flex-start',
  },
  subContainer: {
    alignItems: 'flex-start',
    // marginVertical: message.msg_type === 'image' ? 0 : 5,
  },
  row: {
    flexDirection: 'row',
  },
  linearGradientStyle: {
    marginHorizontal: 0,
    // marginTop: 10,
    marginRight: 5,
  },
  channelName: {
    marginTop: 2,
  },
  hyperlinkIcon: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    // marginTop: 10,
    marginRight: 5,
  },
  imageMessageContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    // message.msg_type === 'image' ? 'column' : 'row',
    marginTop: 2,
  },
  statusContainer: {
    // marginHorizontal: '1.5%',
    alignItems: 'center',
    // marginVertical: message.msg_type === 'image' ? 0 : 15,
    alignSelf: 'flex-end',
    paddingBottom: 5,
  },
  imageMessageTypeContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    // paddingHorizontal: 0,
  },
  notImageMessageTypeContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  notImageMessageTypeSubContainer: {
    alignItems: 'flex-end',
  },
  readContainer: {
    marginHorizontal: '1.5%',
    alignItems: 'center',
    // marginVertical: 15,
    alignSelf: 'flex-end',
    paddingBottom: 5,
  },
});
