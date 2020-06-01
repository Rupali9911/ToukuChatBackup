import {StyleSheet, Dimensions} from 'react-native';
import {Images, Colors, Icons, Fonts} from '../../constants';
const {width, height} = Dimensions.get('window');

export const createChannelStyles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    paddingBottom: 50,
  },
  channelImageContainer: {
    height: height * 0.55,
    marginVertical: 15,
  },
  profileImage: {
    height: '90%',
    width: '90%',
    backgroundColor: Colors.gray,
    borderWidth: 3,
    borderColor: '#fff',
  },
  updateBackground: {
    height: height * 0.03,
    width: height * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateBackgroundIcon: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: height * 0.15,
    width: height * 0.15,
  },
  uploadImageButton: {
    height: height * 0.03,
    width: height * 0.03,
    borderRadius: height * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: '10%',
    bottom: '10%',
  },
  uploadImageIcon: {
    height: '50%',
    width: '50%',
    tintColor: Colors.orange,
  },
  detailView: {
    flex: 0.55,
    justifyContent: 'center',
  },
  channelCoverContainer: {
    flex: 1,
  },
  updateBackgroundContainer: {
    flex: 0.4,
    alignItems: 'flex-end',
    paddingTop: '1%',
    paddingRight: '1%',
  },
  channelInfoContainer: {
    flex: 0.6,
    flexDirection: 'row',
  },
  channelNameInput: {
    height: 60,
    width: '95%',
    fontSize: 25,
    marginBottom: '5%',
    color: Colors.white,
  },
  changeChannelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelNameText: {
    fontSize: 20,
    maxWidth: '80%',
    marginRight: 5,
    color: Colors.white,
  },
  channelIcon: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
  },
  tabBar: {
    flexDirection: 'row',
    marginVertical: 5,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 0.5,
  },
  tabItem: {
    flex: 0.5,
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabBarTitle: {
    fontSize: 16,
    color: Colors.orange,
  },
  tabBarBorder: {
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.gradient_1,
  },
  inputesContainer: {},
  searchContainer: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 0.2,
    marginTop: 20,
  },
  inputStyle: {
    flex: 1,
    color: Colors.black,
    fontSize: 13,
    marginStart: 10,
    alignSelf: 'center',
  },
  iconSearch: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  frindListContainer: {
    marginVertical: 20,
  },
  swithContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 20,
  },
  VIPText: {
    color: Colors.orange,
    marginRight: 2,
    fontSize: 12,
  },
  vipDetails: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginVertical: 10,
  },
  followerDetails: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginVertical: 20,
  },
  detailHeadingText: {
    fontFamily: Fonts.extralight,
  },
  detailText: {
    fontFamily: Fonts.medium,
    color: Colors.orange,
  },
  buttonContainer: {},
});
