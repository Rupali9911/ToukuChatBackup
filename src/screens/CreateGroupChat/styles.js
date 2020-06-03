import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Icons, Fonts } from '../../constants';
const { width, height } = Dimensions.get('window');

export const createGroupStyles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 50,
  },
  imageContainer: {
    height: height * 0.22,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageView: {
    height: height * 0.17,
    width: height * 0.17,
  },
  profileImage: {
    height: '90%',
    width: '90%',
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraButton: {
    height: height * 0.03,
    width: height * 0.03,
    borderRadius: height * 0.15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: '5%',
    bottom: '5%',
  },
  cameraIcon: {
    height: '60%',
    width: '60%',
  },
  inputesContainer: {},
  searchContainer: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    borderColor: Colors.gray_dark,
    marginTop: 20,
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
});
