import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';
const {height} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    // flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 50,
    paddingVertical: 15,
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
    height: normalize(110),
    width: normalize(110),
    backgroundColor: Colors.gray,
    alignSelf: 'center',
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
  inputesContainer: {
    // alignItems:'center'
  },
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
  rightBtnContainer: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: Colors.white,
    height: 45,
    flex: 0.25,
  },
  rightBtnSubContainer: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: Colors.white,
    height: 45,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  url_container: {
    flexDirection: 'row',
    height: 45,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingLeft: 10,
    marginBottom: 15,
  },
  similarText: {
    marginTop: normalize(15),
    fontFamily: Fonts.regular,
    fontSize: normalize(11.5),
    fontWeight: '300',
  },
  followCode: {
    textDecorationLine: 'underline',
  },
  reachOutSocialMediaText: {
    marginTop: normalize(25),
    fontSize: normalize(18),
    fontWeight: '300',
  },
  urlHeadingText: {
    marginTop: normalize(15),
    alignSelf: 'center',
    fontFamily: Fonts.regular,
    fontSize: normalize(11.5),
    fontWeight: '300',
  },
  followActionHeadingText: {
    fontFamily: Fonts.regular,
    fontSize: normalize(9),
    fontWeight: '300',
  },
  qrCodeText: {
    marginTop: normalize(20),
    alignSelf: 'center',
    fontFamily: Fonts.regular,
    fontSize: normalize(11.5),
    fontWeight: '300',
  },
  qrCodeContainer: {
    alignSelf: 'center',
    padding: 15,
    backgroundColor: Colors.white,
    borderColor: Colors.gradient_2,
    borderWidth: 1,
    borderRadius: 5,
  },
  downloadContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  downloadIcon: {
    padding: 5,
  },
});
