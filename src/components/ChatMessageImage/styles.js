import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../constants';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
  imageContainer: {
    justifyContent: 'flex-end',
    marginBottom: 15,
    marginTop: 5,
    borderRadius: 10,
    padding: 10,
    width: width * 0.65,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  imagePortrait: {
    flex: 1,
    height: null,
    width: null,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  isNotUser: {
    marginLeft: 5,
  },
});
