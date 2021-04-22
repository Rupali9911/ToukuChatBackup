import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '4%',
  },
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_1,
    fontFamily: Fonts.regular,
  },
  squareImage: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    justifyContent: 'center',
  },
  channelHeaderContainer: {
    height: 35,
    marginHorizontal: 5,
    flex: 1,
  },
  channelName: {
    //fontFamily: Fonts.smallNunitoRegularText,
    color: Colors.black,
    fontSize: 15,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  channelCreatedDate: {
    fontFamily: Fonts.regular,
    color: Colors.gray_dark,
    fontSize: 13,
    flex: 1,
  },
  channelTimelineContainer: {
    height: 35,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  channelTimelineSubContainer: {
    width: 100,
  },
  menuStyle: {
    marginTop: 25,
    marginLeft: -20,
  },
  menuButttonActionContainer: {
    height: 30,
    width: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  dotsIcon: {
    tintColor: Colors.black_light,
    height: 15,
  },
});
