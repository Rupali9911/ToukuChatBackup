import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Images, Colors, Icons, Fonts} from '../../constants';
import {normalize} from '../../utils';
const {width, height} = Dimensions.get('window');

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
  amazonLogoContainer: {
    alignItems: 'center',
  },
  amazonLogo: {
    width: 170,
    height: 80,
  },
  container: {
    marginTop: 10,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e4',
    alignItems: 'center',
  },
  contentText: {
    flex: 0.75,
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#0a1f44',
  },
  colon: {
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#0a1f44',
  },
  contentLabel: {
    flex: 0.25,
    fontSize: normalize(15),
    textAlign: 'right',
    fontWeight: '600',
    color: '#ee6f70',
  },
  exchangeDaysNumberContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: Colors.light_pink,
    borderRadius: 10,
  },
  sendToEmailContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  interactionContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  singleFlex: {
    flex: 1,
  },
  divider: {
    flex: 0.1,
  },
  currentPointContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e4',
    alignItems: 'center',
  },
  currentPointText: {
    flex: 0.75,
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#0a1f44',
  },
  currentPointLabel: {
    flex: 0.25,
    fontSize: normalize(15),
    textAlign: 'right',
    fontWeight: '600',
    color: '#ee6f70',
  },
  exchangeAmountContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  exchangeAmountText: {
    fontSize: normalize(12),
    fontWeight: '500',
  },
  convertInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: '#ff728a',
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
  },
  tpPointText: {
    flex: 1,
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#0a1f44',
    textAlign: 'right',
  },
  label: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#0a1f44',
    textAlign: 'right',
  },
  convertImage: {
    marginHorizontal: 15,
  },
  pointsInYen: {
    flex: 0.9,
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#0a1f44',
    textAlign: 'right',
  },
  exchangeButtonContainer: {
    width: '60%',
    alignSelf: 'center',
    marginTop: 15,
  },
});
