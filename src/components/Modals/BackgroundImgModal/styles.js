// Libaray imports
import {StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';

/**
 * StyleSheet for background image modal
 */
export default StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  wallpaperContainer: {
    backgroundColor: Colors.gray,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  wallpaperTextContainer: {
    flex: 0.8,
    paddingHorizontal: 5,
  },
  wallpaperImageContainer: {
    flex: 0.2,
    paddingHorizontal: 5,
    alignItems: 'flex-end',
  },
  wallpaperImage: {
    tintColor: Colors.black,
    height: '30%',
    width: '30%',
  },
  container: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  listItemContainer: {
    flex: 0.5,
    height: 150,
  },
  avatarContainer: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSubContainer: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    height: '20%',
    alignItems: 'center',
    paddingRight: '30%',
  },
  actionContainer: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
