import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';

export default StyleSheet.create({
  toast: {
    position: 'absolute',
    width: Platform.isPad ? '50%' : '96%',
    alignSelf: 'center',
    borderRadius: 8,
    minHeight: Platform.isPad ? 100 : 90,
    shadowColor: '#ccc',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
  },
  content: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    color: '#f1f1f1',
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 4,
    marginEnd: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
