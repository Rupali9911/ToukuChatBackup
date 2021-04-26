// Library imports
import {StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../../constants';

/**
 * StyleSheet for show gallery modal
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
  headerTitleContainer: {
    flex: 0.8,
    paddingHorizontal: 10,
  },
  headerTitleSubContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitleText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  closeIconContainer: {
    flex: 0.2,
  },
  closeIconActionContainer: {
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
  listContainer: {
    flex: 1,
    padding: 10,
  },
  singleFlex: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 5,
  },
  itemContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  mediaStyle: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  contentActionContainer: {
    flex: 0.8,
  },
  fileName: {
    marginBottom: 5,
  },
  removeActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trashIcon: {
    marginRight: 5,
  },
  galleryActionContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  uploadIcon: {
    tintColor: '#80a9d2',
    height: 25,
    width: 25,
  },
  selectFileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  selectFileButtonContainer: {
    // flex: 0.5,
    width: '90%',
    marginHorizontal: 5,
  },
  bottomButtonContainer: {
    // paddingHorizontal: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 20,
  },
  uploadImageContainer: {
    // flex: 0.5,
    width: '90%',
    marginHorizontal: 5,
  },
  uploadByUrlContainer: {
    // flex: 0.5,
    width: '90%',
    marginHorizontal: 5,
  },
  cancelContainer: {
    // flex: 0.5,
    marginHorizontal: 5,
    width: '90%',
  },
});
