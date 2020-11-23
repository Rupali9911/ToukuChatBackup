import {StyleSheet, Dimensions} from 'react-native';
import {Images, Colors, Icons, Fonts} from '../../constants';
const {width, height} = Dimensions.get('window');

export const channelInfoStyles = StyleSheet.create({
  mainContainer: {
    paddingBottom: 50,
  },
  channelImageContainer: {
    height: height * 0.35,
  },
  channelCoverContainer: {
    flex: 1,
  },
  updateBackgroundContainer: {
    flex: 0.65,
  },
  channelInfoContainer: {
    flex: 0.25,
    flexDirection: 'row',
  },
  imageContainer: {
    // flex: 0.35,
    paddingHorizontal: '2%',
    alignItems: 'center',
  },
  imageView: {
    height: height * 0.09,
    width: height * 0.09,
  },
  profileImage: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.gray,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  coverImage: {
    height: 70,
    width: 70,
  },
  detailView: {
    flex: 0.65,
    paddingLeft: 5,
    paddingVertical: 5,
  },
  changeChannelContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelNameText: {
    fontSize: 18,
    maxWidth: '80%',
    marginRight: 5,
    fontFamily: Fonts.regular,
    color: Colors.white,
  },
  channelInfoDetail: {
    flex: 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '2%',
  },
  channelDetailStatus: {
    flex: 0.75,
    flexDirection: 'row',
    paddingHorizontal: '2%',
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
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  channelDetailButton: {
    flex: 0.25,
    paddingHorizontal: '1%',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-evenly',
  },
  tabItem: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  tabIamge: {
    tintColor: Colors.gradient_2,
    marginVertical: 5,
    height: 20,
    width: 20,
  },
  tabTitle: {
    fontSize: 13,
    color: Colors.gradient_2,
  },
  about: {
    marginHorizontal: '5%',
    marginVertical: 15,
  },
  aboutHeading: {
    color: '#E26161',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  aboutText: {
    fontSize: 13,
    fontFamily: Fonts.light,
  },
  buttonContainer: {
    alignSelf: 'center',
    marginHorizontal: '5%',
    width: '50%',
  },
  followerDetails: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: '5%',
  },
  detailText: {
    fontFamily: Fonts.regular,
    color: Colors.orange,
    fontSize: 16,
  },
});
