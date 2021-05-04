import {Platform, StyleSheet} from 'react-native';

const center = {
  flexDirection: 'row',
  alignItems: 'center',
};

export default StyleSheet.create({
  headerContainer: {
    ...center,
  },
  container: {
    ...center,
    padding: 20,
  },
  backIcon: {
    height: 15,
    tintColor: 'white'
  },
  singleFlex: {
    flex: 1,
  },
  backIconContainer: {
    flex: 0.1,
    height: 30,
    justifyContent: 'center',
  },
  touchArea: {
    top: 10,
    bottom: 10,
    right: 10,
    left: 10,
  },
  backIconAction: {
    flex: 1,
    paddingBottom: Platform.OS === 'android' ? 4 : 0,
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 0.8,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
