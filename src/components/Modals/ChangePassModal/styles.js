// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';

/**
 * StyleSheet for change pass modal
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
    width: '100%',
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
    paddingHorizontal: 15,
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
  scrollViewContainer: {
    flex: 1,
    width: '80%',
  },
  scrollViewContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleFlex: {
    flex: 1,
  },
  changePassword1: {
    textAlign: 'left',
  },
  oldPassInputContainer: {
    padding: 15,
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'left',
    marginStart: 10,
    marginBottom: 5,
  },
  toastContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
});
