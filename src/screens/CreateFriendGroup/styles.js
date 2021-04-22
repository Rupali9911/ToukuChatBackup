import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Colors} from '../../constants';
const {height} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 50,
  },
  imageContainer: {
    height: height * 0.23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: height * 0.15,
    width: height * 0.15,
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
  searchContainer: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: Colors.white,
    borderRadius: 10,
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
  titleHeaderContainer: {
    height: '5%',
    justifyContent: 'center',
  },
  contentContainer: {
    maxHeight: '30%',
  },
  groupName: {
    color: Colors.danger,
    textAlign: 'left',
    // marginTop: 10,
    // marginStart: 10,
    marginBottom: 5,
  },
});
