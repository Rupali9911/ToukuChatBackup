import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Fonts} from '../../constants';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  Container: {flex: 1},
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridView: {flex: 1, margin: 5, marginBottom: 5},
  gridImageView: {height: Platform.isPad ? 350 : 175},
  gridImageText: {
    width: '100%',
    color: 'white',
    bottom: 0,
    padding: 5,
    fontFamily: Fonts.light,
  },
  squareImage: {
    height: Platform.isPad ? 350 : 175,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradientVisible: {
    bottom: 0,
    height: 80,
    flexDirection: 'column-reverse',
    position: 'absolute',
    width: '100%',
  },
  textLinearGradient: {
    position: 'absolute',
    bottom: 0,
    padding: 5,
    color: 'white',
    fontFamily: Fonts.light,
  },
  channelName: {
    fontSize: 60,
    fontWeight: '400',
    color: 'white',
    fontFamily: Fonts.light,
  },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: height / 1.5,
  },
  emptyListText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  listStyle: {
    flex: 1,
  },
  listContentContainerStyle: {
    margin: 5,
  },
});
