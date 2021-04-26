import {Dimensions, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  truncatedText: {
    color: Colors.tintColor,
    marginTop: 5,
  },
  postItemContainer: {
    marginVertical: 10,
    paddingVertical: 10,
    flex: 1,
    borderColor: '#dbdbdb',
  },
  emptyListBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: height / 1.3,
  },
  emptyListMessage: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  emptyChannelContainer: {
    flex: 1,
    alignItems: 'center',
    height: height * 0.5,
  },
  emptyChannelText: {
    fontFamily: Fonts.regular,
    fontSize: normalize(12),
    marginTop: 50,
    color: Colors.dark_gray,
  },
  listFooterComponent: {
    height: 50,
  },
});
