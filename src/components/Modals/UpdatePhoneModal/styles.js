// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';

/**
 * StyleSheet for update phone modal
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
  singleFlex: {
    flex: 1,
  },
  headerTitle: {
    textAlign: 'left',
  },
  contentContainer: {
    padding: 15,
  },
  contentSubContainer: {
    marginTop: 20,
  },
  toastContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
});
