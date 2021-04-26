import {StyleSheet} from 'react-native';
import {Colors} from '../../constants';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  subContainer: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ifCheckboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  tickCircleActionContainer: {
    height: 20,
    width: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: Colors.green,
  },
  tickCircleSelectedContainer: {
    borderWidth: 1,
    borderColor: Colors.green,
  },
  tickCircleIcon: {
    height: '100%',
    width: '100%',
    tintColor: Colors.white,
  },
  subContainerFlex: {
    flex: 0.7,
  },
  nameText: {
    color: Colors.black,
    textAlign: 'left',
    marginStart: 15,
    flexWrap: 'wrap',
    flex: 1,
  },
  addButttonContainer: {
    flex: 0.2,
  },
  personButtonText: {
    flex: 0.3,
  },
});
