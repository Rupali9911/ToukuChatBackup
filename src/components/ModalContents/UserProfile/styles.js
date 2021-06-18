// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../../constants';
import {normalize} from '../../../utils';

/**
 * Similar styles
 */
const center = {
  alignSelf: 'center',
  alignItems: 'center',
};

/**
 * StyleSheet for user profile component
 */
export default StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    display: 'flex',
  },
  Wrapper: {
    width: '80%',
    backgroundColor: 'transparent',
    display: 'flex',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  firstView: {
    height: 150,
    width: '100%',
  },
  firstBottomView: {
    bottom: 0,
    right: 0,
    position: 'absolute',
    padding: 10,
  },
  centerBottomView: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  iconClose: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.white,
    top: 10,
    right: 10,
    position: 'absolute',
  },
  textNormal: {
    textAlign: 'left',
    color: Colors.black,
  },
  inputTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  linearGradientStyle: {
    height: 150,
  },
  singleFlex: {
    flex: 1
  },
  closeIconPadding: {
    padding: 10,
  },
  cameraContainer: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: -40,
  },
  avatarLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    backgroundColor: '#e9eef1',
    borderRadius: 40,
    borderWidth: 0.5,
  },
  cameraIconContainer: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    ...center,
    marginTop: 10,
  },
  nameText: {
    color: Colors.black,
    marginHorizontal: 10,
    fontSize: normalize(15),
  },
  usernameContainer: {
    ...center,
  },
  usernameText: {
    color: Colors.black,
    marginBottom: 10,
    fontSize: normalize(12),
    fontFamily: Fonts.light,
  },
  toastContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  itemLabel: {
    fontSize: Platform.isPad ? normalize(8) : normalize(13),
    fontFamily: Fonts.light,
    color: 'rgba(87,132,178,1)',
  },
  addIcon: {
    padding: 5,
  },
});
