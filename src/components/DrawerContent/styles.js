import {Platform, StyleSheet} from 'react-native';
import {Colors} from '../../constants';

export default StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginEnd: 5,
  },
  headerRightIcon: {
    width: 10,
    height: 10,
  },
  bodyContainer: {
    paddingStart: 30,
  },
  bodyText: {
    textAlign: 'left',
  },
  singleFlex: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 10 : 50,
  },
  usernameContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  username: {
    marginTop: 10,
  },
  collapseHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderBottomWidth: 1,
    borderColor: Colors.white,
    marginTop: 15,
  },
  collapseHeaderIcon: {
    width: 8,
    height: 8,
  },
});
