import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Images, Colors, Icons, Fonts} from '../../constants';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  channelImageContainer: {
    height: height * 0.35,
    marginVertical: 15,
  },
  profileImage: {
    height: '100%',
    width: '100%',
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
    alignItems: 'flex-end',
    paddingBottom: 30,
  },
  channelNameInput: {
    height: 50,
    width: '95%',
    fontSize: 25,
    fontWeight: '300',
    // marginBottom: '5%',
    includeFontPadding: false,
    color: Colors.white,
    paddingHorizontal: 5,
    paddingVertical: 0,
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
  buttonContainer: {
    paddingHorizontal: 5,
  },
  statusCount: {
    position: 'absolute',
    top: 25,
    width: '95%',
    color: Colors.white,
    textAlign: 'right',
  },
  headerContainer: {
    paddingHorizontal: 5,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonContainer: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  actionButton: {
    paddingHorizontal:10
  },
  actionButtonImage: {
    width:30,
    height:30,
  },
  mediaContainer: {
    flex:1,
  },
  submitButtonContainer: {
    padding: 10
  },
  mediaItemContainer: {
    flex: 1, 
    margin: 5
  },
  imageItem: {
    width: '100%', 
    height: 200
  },
  itemVideoContainer: {
    width: '100%', 
    height: 200, 
    backgroundColor: 'black', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  playIconContainer: { 
    width: '100%', 
    flexDirection: 'row', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    backgroundColor: '#00000040', 
    position: 'absolute', 
    bottom: 0 
  },
  playIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIconConatiner: {
    flexDirection: 'row', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    backgroundColor: '#00000040', 
    position: 'absolute', 
    top: 0, 
    right: 0
  },
  removeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
