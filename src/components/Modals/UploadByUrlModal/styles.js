// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';

/**
 * StyleSheet for upload by url modal
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
  inputContainer: {
    padding: Platform.OS === 'ios' ? 10 : 0,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginVertical: 5,
  },
  uploadByUrlText: {
    textAlign: 'left',
  },
  singleFlex: {
    flex: 1,
  },
  urlInputContainer: {
    padding: 15,
  },
  dividerContainer: {
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  dividerSpacing: {
    padding: 10,
  },
  toastContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
});
