// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';

/**
 * StyleSheet for upload user image modal
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
    backgroundColor: Colors.white,
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
  header: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    height: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: Platform.OS === 'ios' ? 10 : 0,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginVertical: 5,
  },
  iconUpload: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginEnd: 10,
  },
  singleFlex: {
    flex: 1,
  },
  titleStyle: {
    textAlign: 'left',
  },
  uploadActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  uploadButtonContainer: {
    flex: 1,
    marginEnd: 10,
  },
  cancelButtonContainer: {
    flex: 1,
    marginStart: 10,
  },
});
