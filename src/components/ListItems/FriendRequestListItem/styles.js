import {StyleSheet} from 'react-native';
import {Colors} from '../../../constants';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  firstView: {
    flexDirection: 'row',
  },
  secondView: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  squareImage: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleText: {
    color: Colors.black_light,
    fontWeight: '400',
  },
  actionButtonContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginRight: 10,
    width: 100,
  },
  dateText: {
    color: Colors.message_gray,
    fontSize: 11,
    fontWeight: '400',
  },
});
