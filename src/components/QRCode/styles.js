// Library imports
import {Dimensions, StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../constants';

// Get width and height from Dimensions
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

/**
 * StyleSheet of QR code
 */
export default StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    width,
    height,
  },
  subCont: {
    position: 'absolute',
    backgroundColor: Colors.black,
    opacity: 0.5,
    width,
    height,
  },
  lgVw: {
    height: 30,
    flexDirection: 'row',
  },
  qrTxt: {
    flex: 9,
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 14,
    marginStart: 10,
    alignSelf: 'center',
    fontWeight: '300',
  },
  touchCross: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vwQr: {
    height: 170,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  modalContainer: {
    width: '80%',
    marginTop: height / 3,
  },
  qrCodeContainer: {
    top: 27,
  },
});
