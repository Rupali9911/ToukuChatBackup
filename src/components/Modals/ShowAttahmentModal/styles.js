// Library imports
import {StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../../constants';

/**
 * StyleSheet for show attachment modal
 */
export default StyleSheet.create({
  safeAreaContainer: {
    // flex: '10%',
    // height: '90%',
    // alignSelf: 'center',
    // width: '90%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    // flex: this.state.orientation === 'LANDSCAPE' ? 0.9 : 0.95,
    flex: 1,
    width: '100%',
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  headerContainer: {
    flex: 0.05,
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.light_gray,
    flexDirection: 'row',
  },
  uploadLabelContainer: {
    flex: 0.8,
    paddingHorizontal: 10,
  },
  uploadButtonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  uploadLabel: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  closeIconContainer: {
    flex: 0.2,
  },
  closeActionContainer: {
    flex: 1,
    paddingHorizontal: 5,
    justifyContent: 'center',
    paddingRight: 10,
    alignItems: 'flex-end',
  },
  closeIcon: {
    tintColor: Colors.white,
    height: 10,
    width: 10,
  },
  selectionContainer: {
    flex: 0.85,
    paddingVertical: 10,
  },
  singleFlex: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 5,
  },
  itemSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingRight: 10,
    height: 50,
  },
  fileIconContainer: {
    flex: 0.2,
    borderWidth: 0.4,
    borderColor: '#eaeaea',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  fileIcon: {
    marginRight: 10,
  },
  fileTitleContainer: {
    flex: 0.8,
  },
  fileName: {
    marginBottom: 5,
    color: Colors.black_light,
  },
  removeActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeIcon: {
    marginRight: 5,
  },
  removeLabel: {
    color: Colors.gray_dark,
  },
  attachmentButtonContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  uploadIcon: {
    tintColor: '#80a9d2',
    height: 25,
    width: 25,
  },
  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  uploadSubContainer: {
    // flex: 0.5,
    width: '90%',
    marginHorizontal: 5,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.1,
    // marginTop: 20,
  },
  bottomButtonSubContainer: {
    // flex: 0.5,
    width: '70%',
    marginHorizontal: 5,
  },
  cancelContainer: {
    // flex: 0.5,
    marginHorizontal: 5,
    width: '70%',
  },
});
