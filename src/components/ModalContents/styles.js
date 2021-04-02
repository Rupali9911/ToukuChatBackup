import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  gradientContainer: {
    height: 150,
  },
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
  singleFlex: {
    flex: 1,
  },
  closeActionContainer: {
    padding: 10,
  },
  iconContainer: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: -40,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    backgroundColor: '#e9eef1',
    borderRadius: 40,
    borderWidth: 0.5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  nameText: {
    color: Colors.black,
    marginHorizontal: 10,
    fontSize: normalize(15),
  },
  usernameContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  usernameText: {
    color: Colors.black,
    marginBottom: 10,
    fontSize: normalize(12),
    fontFamily: Fonts.light,
  },
  addIcon: {
    padding: 5,
  },
  toastContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  valueText: {
    fontSize: Platform.isPad ? normalize(8) : normalize(13),
    fontFamily: Fonts.light,
    color: 'rgba(87, 132, 178, 1)',
  },
});
