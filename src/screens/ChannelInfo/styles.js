import {StyleSheet, Dimensions} from 'react-native';
import {Images, Colors, Icons, Fonts} from '../../constants';
const {width, height} = Dimensions.get('window');

export const channelInfoStyles = StyleSheet.create({
  mainContainer: {
    paddingBottom: 50,
  },
  channelImageContainer: {
    height: height * 0.45,
  },
  channelCoverContainer: {
    flex: 1,
  },
  updateBackgroundContainer: {
    flex: 0.6,
  },
  channelInfoContainer: {
    flex: 0.25,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 0.35,
    alignItems: 'center',
  },
  imageView: {
    height: height * 0.12,
    width: height * 0.12,
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
    paddingHorizontal: '3%',
    alignItems: 'center',
    paddingVertical: '2%',
  },
  channelDetailStatus: {
    flex: 0.65,
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
    flex: 0.35,
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-evenly',
  },
  tabItem: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  tabIamge: {
    tintColor: Colors.gradient_2,
    marginVertical: 5,
    height: 30,
    width: 30,
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_2,
  },
  about: {
    marginHorizontal: '5%',
    marginVertical: 10,
  },
  aboutHeading: {
    color: Colors.gradient_2,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  buttonContainer: {
    marginHorizontal: '5%',
    width: '90%',
  },
});
