import {Platform, StyleSheet} from 'react-native';
import {Colors} from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  termsContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  suggestionsContainer: {
    marginBottom: 15,
    flexDirection: 'column',
    marginStart: 10,
  },
  usernamExistText: {
    textAlign: 'left',
    marginBottom: 5,
  },
  suggestionsSubContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  suggestionsTextContainer: {
    flexDirection: 'row',
  },
  suggestionsListContainer: {
    flex: 1,
    borderColor: 'red',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 5,
  },
  suggestionsListItemActionContainer: {
    marginBottom: 10,
  },
  suggestionsListItemActionText: {
    textDecorationLine: 'underline',
    marginHorizontal: 8,
  },
  registrationStepText: {
    paddingHorizontal: Platform.isPad ? 50 : 20,
  },
  registrationInputContainer: {
    marginTop: Platform.isPad ? 200 : 50,
  },
  passwordErrorText: {
    textAlign: 'left',
    marginTop: -10,
    marginStart: 10,
    marginBottom: 5,
  },
  usernameContainer: {
    marginTop: 50,
  },
  usernameHeading: {
    textAlign: 'left',
    marginStart: 10,
    marginBottom: 5,
  },
  usernameErrorText: {
    textAlign: 'left',
    marginStart: 10,
    marginBottom: 5,
  },
  termsAndConditionText: {
    textDecorationLine: 'underline',
  },
  keyboardScrollContentContainer: {
    padding: 20,
    flex: Platform.isPad ? 1 : 0,
  },
  pageContainer: {
    flex: 1,
    maxWidth: Platform.isPad ? '75%' : '100%',
    alignSelf: 'center',
    marginTop: 20,
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
