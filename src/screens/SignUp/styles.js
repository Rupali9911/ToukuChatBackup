import {StyleSheet} from 'react-native';
import {Colors} from '../../constants';

export const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  text: {
    fontSize: 12,
    padding: 15,
    textAlign: 'center',
    color: 'white',
  },
  underlineTxt: {
    fontSize: 14,
    paddingVertical: 5,
    textAlign: 'center',
    color: 'white',
    textDecorationLine: 'underline',
  },
  termsContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});

export const stepIndicatorStyle = {
  stepIndicatorSize: 26,
  currentStepIndicatorSize: 26,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: 'transparent',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: Colors.primary,
  stepStrokeUnFinishedColor: 'transparent',
  separatorFinishedColor: Colors.primary,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: Colors.primary,
  stepIndicatorUnFinishedColor: Colors.white,
  stepIndicatorCurrentColor: Colors.primary,
  stepIndicatorLabelCurrentColor: Colors.white,
  stepIndicatorLabelFinishedColor: Colors.white,
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  currentStepLabelColor: Colors.primary,
};
