import {Dimensions, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';

const {height} = Dimensions.get('window');

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
    height: height * 0.02,
    width: height * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateBackgroundIcon: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    flex: 0.35,
    // justifyContent: 'center',
    alignItems: 'flex-end',
  },
  imageView: {
    height: height * 0.12,
    width: height * 0.12,
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
    flex: 0.65,
    paddingLeft: 5,
    // justifyContent: 'center',
  },
  channelCoverContainer: {
    flex: 1,
  },
  updateBackgroundContainer: {
    flex: 0.55,
    alignItems: 'flex-end',
    paddingTop: '2.5%',
    paddingRight: '1%',
  },
  channelInfoContainer: {
    flex: 0.45,
    flexDirection: 'row',
  },
  channelNameInput: {
    height: 50,
    width: '95%',
    fontSize: 25,
    marginBottom: '5%',
    color: Colors.white,
    paddingHorizontal: 5,
  },
  changeChannelContainer: {
    paddingHorizontal: 5,
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
    fontFamily: Fonts.light,
    color: Colors.gradient_1,
  },
  tabBarBorder: {
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.gradient_1,
  },
  inputesContainer: {},
  searchContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: Platform.OS === 'android' ? 0.1 : 0.2,
    borderColor: Colors.gray_dark,
  },
  inputStyle: {
    flex: 1,
    color: Colors.black,
    fontSize: 13,
    marginStart: 10,
    alignSelf: 'center',
    fontFamily: Fonts.light,
    paddingVertical: 0,
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
    fontFamily: Fonts.regular,
  },
  detailText: {
    fontFamily: Fonts.light,
    color: Colors.orange,
    fontSize: 18,
  },
  detailTextInput: {
    height: 50,
    color: Colors.orange,
    marginRight: 2,
    width: '80%',
    paddingHorizontal: 5,
    textAlign: 'right',
    fontSize: 18,
    fontFamily: Fonts.medium,
  },
  buttonContainer: {},
});
