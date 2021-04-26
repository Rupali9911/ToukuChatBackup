import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  rightBtnContainer: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: Colors.white,
    height: 45,
    flex: 0.25,
  },
  rightBtnSubContainer: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: Colors.white,
    height: 45,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallRegularText: {
    fontSize: normalize(12),
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },
  container: {
    borderColor: Colors.gradient_2,
    borderWidth: 1,
    flexDirection: 'row',
    height: 45,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingLeft: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  singleFlex: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingRight: 10,
  },
});
