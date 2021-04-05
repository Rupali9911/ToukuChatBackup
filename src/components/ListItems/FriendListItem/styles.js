// Library imports
import {Platform, StyleSheet} from 'react-native';

// Locals imports
import {Colors} from '../../../constants';
import {normalize} from '../../../utils';

/**
 * StyleSheet for friend list item
 */
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  firstView: {
    flexDirection: 'row',
  },
  secondView: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  squareImage: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBox: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    borderColor: '#ff62a5',
    borderWidth: 1,
    alignSelf: 'center',
    margin: 5,
    marginRight: 15,
  },
  checkBoxIscheck: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 5,
    marginRight: 15,
  },
  singleFlex: {
    flex: 1,
  },
  swipeRightButtonContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  swipeButtonContainer: {
    alignSelf: 'center',
    aspectRatio: 1,
    height: '100%',
    flexDirection: 'row',
  },
  swipeButtonActionContainer: {
    padding: 10,
    backgroundColor: '#99B1F9',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  swipeItemContainer: {
    backgroundColor: '#f2f2f2',
  },
  checkedActionContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  checkIconColor: {
    color: 'white',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 5,
  },
  titleText: {
    color: Colors.black_light,
    fontWeight: '400',
  },
  descriptionText: {
    color: Colors.message_gray,
    fontSize: Platform.isPad ? normalize(7) : normalize(11.5),
    fontWeight: '400',
  },
  pinnedIconContainer: {
    marginTop: 2,
    marginRight: 5,
  },
  dateText: {
    color: Colors.message_gray,
    fontSize: 12,
    fontWeight: '400',
  },
  badgeStyle: {
    backgroundColor: Colors.green,
    color: Colors.white,
    fontSize: 12,
    marginTop: 5,
  },
});
