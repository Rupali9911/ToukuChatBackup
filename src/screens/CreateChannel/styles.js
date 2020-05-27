import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Icons } from '../../constants';
const { width, height } = Dimensions.get('window');

export const createChannelStyles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    paddingHorizontal: 15,
  },
  createContainer: {
    height: height * 0.55,
    paddingVertical: 15,
    // justifyContent: 'center',
    // alignItems: 'center',
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
    position: 'absolute',
    right: '2%',
    top: '2%',
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
  tabBar: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  tabItem: {
    flex: 0.5,
    alignItems: 'center',
    paddingBottom: 8,
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
    // width: '100%',
    color: Colors.black,
    fontSize: 13,
    // fontFamily: Fonts.light,
    marginStart: 10,
    alignSelf: 'center',
  },
  iconRight: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  iconSearch: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  iconRightContainer: {
    marginStart: 15,
    alignSelf: 'center',
  },
  frindListContainer: {
    marginVertical: 20,
  },
  buttonContainer: {},
});
