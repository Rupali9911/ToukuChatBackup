import {StyleSheet} from 'react-native';
import {Fonts} from '../../constants';

export default StyleSheet.create({
  qrTopViewStyle: {
    flex: 0,
  },
  qrContainerStyle: {
    flex: 1,
  },
  qrCameraStyle: {
    height: '100%',
  },
  background: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 80,
    position: 'absolute',
    bottom: 0,
  },
  actionContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  qrIcon: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    padding: 10,
  },
  myQrCodeText: {
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 10,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: 14,
    color: 'white',
  },
  searchQRIcon: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  searchByImageText: {
    textAlign: 'center',
    alignSelf: 'center',
    padding: 10,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: 14,
    color: 'white',
  },
  loaderStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
