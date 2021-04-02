// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {normalize} from '../../../utils';

/**
 * Similar styles
 */
const subContainer = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};

const center = {
  flexDirection: 'row',
  alignItems: 'center',
};

/**
 * StyleSheet for chat header
 */
export default StyleSheet.create({
  headerContainer: {
    ...center,
  },
  container: {
    ...center,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  subContainer: {
    ...subContainer,
  },
  squareImage: {
    width: Platform.isPad ? 50 : 40,
    height: Platform.isPad ? 50 : 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  singleFlex: {
    flex: 1,
  },
  touchArea: {
    top: 10,
    bottom: 10,
    right: 10,
    left: 10,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTypeContainer: {
    ...subContainer,
    flex: 0,
    maxWidth: '90%',
  },
  headerTypeSubContainer: {
    marginHorizontal: 10,
  },
  headerTitleSubContainer: {
    maxWidth: '80%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: Platform.isPad ? normalize(7.5) : normalize(12),
  },
  deafultAvatarSpacing: {
    marginHorizontal: 10,
  },
  groupOrChannelText: {
    maxWidth: '80%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  groupOrChannelTitle: {
    fontSize: Platform.isPad ? normalize(8.5) : normalize(12),
  },
  groupOrChannelDescription: {
    fontSize: Platform.isPad ? normalize(5.5) : normalize(10),
  },
  menuContainer: {
    marginTop: 30,
  },
  menuTitleStyle: {
    marginLeft: -25,
    marginTop: -3,
    fontSize: 16,
    fontWeight: '200',
  },
});
