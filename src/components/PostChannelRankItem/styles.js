import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  container: {
    marginVertical: 5,
    flex: 1,
    borderColor: '#dbdbdb',
    paddingHorizontal: 5,
  },
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_1,
    fontFamily: Fonts.regular,
  },
  coverStyle: {
    width: '100%',
    height: 100,
  },
  squareImage: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelInfoDetail: {
    // flex: 0.15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    // paddingVertical: '2%',
  },
  channelDetailStatus: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: '2%',
  },
  channelDetailButton: {
    flexDirection: 'row',
    paddingHorizontal: '1%',
    justifyContent: 'flex-end',
  },
  detailStatusItem: {
    paddingTop: '5%',
    marginRight: '5%',
  },
  detailStatusItemCount: {
    alignSelf: 'center',
    color: Colors.white,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  detailStatusItemName: {
    alignSelf: 'center',
    color: Colors.white,
    fontSize: normalize(9),
    fontFamily: Fonts.regular,
  },
  channelDetailContainer: {
    height: '100%',
    padding: 7,
    paddingTop: 15,
    backgroundColor: '#00000040',
  },
  row: {
    flexDirection: 'row',
  },
  channelContentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  codeContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  followCode: {
    marginLeft: 5,
    color: Colors.white,
    textDecorationLine: 'underline',
  },
  followButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  followButtonContainerStyle: {
    marginVertical: 0,
  },
  countContainerStyleOne: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#fb8ea1',
    borderBottomWidth: 3,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  countContainerStyleTwo: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fb8ea1',
    borderWidth: 3,
    backgroundColor: '#f57158fc',
  },
  countBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: normalize(30),
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 30,
  },
  countTextWithoutBackground: {
    fontSize: normalize(30),
    fontWeight: 'bold',
    color: Colors.white,
  },
  channelCoverImageContainer: {
    flex: 0.75,
    marginLeft: 3,
  },
  channelCoverImage: {
    width: '100%',
  },
});
