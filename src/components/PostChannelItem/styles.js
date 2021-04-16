import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: height * 0.06,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: Platform.OS === 'ios' ? 0.3 : 0.2,
    borderBottomColor: Colors.gray_dark,
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
  subContainer: {
    marginTop: 10,
  },
  mediaContainer: {
    margin: 5,
  },
  hyperlinkContainer: {
    marginHorizontal: '4%',
    marginVertical: 5,
  },
  linkStyle: {
    color: '#7e8fce',
    textDecorationLine: 'underline',
  },
  textContent: {
    lineHeight: 18,
  },
  showLessText: {
    fontFamily: Fonts.regular,
    fontSize: normalize(12),
    margin: 15,
    color: '#7e8fce',
  },
  showMoreText: {
    fontFamily: Fonts.regular,
    fontSize: normalize(12),
    color: '#7e8fce',
    flex: 1,
  },
  messageBodyContainer: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
});
