// Library imports
import {StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';

/**
 * StyleSheet for channel category modal
 */
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 10,
  },
  nameContainer: {
    flex: 0.8,
    justifyContent: 'center',
  },
  selectionContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  selectionSubContainer: {
    height: 20,
    width: 20,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedContainer: {
    height: 10,
    width: 10,
    borderRadius: 20,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
