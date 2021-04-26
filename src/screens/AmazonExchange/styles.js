import {Dimensions, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  keyboardAwareScrollContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 50,
    paddingVertical: 15,
  },
  amazonLogoContainer: {
    alignItems: 'center',
  },
  amazonLogo: {
    width: 170,
    height: 80,
  },
  container: {
    marginTop: 10,
    justifyContent: 'center',
  },
  minExchangePointContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e4',
    // alignItems: 'center'
  },
  minExchangePointSubContainer: {
    flex: 0.75,
  },
  minExchangePointText: {
    // flex: 0.75,
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#0a1f44',
  },
  firstTimeExchangeText: {
    // flex: 0.75,
    fontSize: normalize(10),
    fontWeight: '600',
    color: '#ee6f70',
  },
  colon: {
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#0a1f44',
  },
  minExchangePoints: {
    flex: 0.25,
    fontSize: normalize(15),
    textAlign: 'right',
    fontWeight: '600',
    color: '#ee6f70',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e4',
    alignItems: 'center',
  },
  titleText: {
    flex: 0.75,
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#0a1f44',
  },
  valueText: {
    flex: 0.25,
    fontSize: normalize(15),
    textAlign: 'right',
    fontWeight: '600',
    color: '#ee6f70',
  },
  exchangeDaysNumberContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: Colors.light_pink,
    borderRadius: 10,
  },
  sendItToYourEmailContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  exchangeHistoryContianer: {
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  singleFlex: {
    flex: 1,
  },
  divider: {
    flex: 0.1,
  },
  currentPointsContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e4',
    alignItems: 'center',
  },
  currentPointHeldText: {
    flex: 1,
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#0a1f44',
  },
  currentPointHeldValue: {
    fontSize: normalize(15),
    textAlign: 'right',
    fontWeight: '600',
    color: '#ee6f70',
  },
  exchangePointContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  exchangePoints: {
    fontSize: normalize(12),
    fontWeight: '500',
  },
  exchangePointInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: '#ff728a',
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
  },
  exchangePointInput: {
    flex: 1,
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#0a1f44',
    textAlign: 'right',
  },
  exchangeValues: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#0a1f44',
    textAlign: 'right',
    marginLeft: 5,
  },
  convertImage: {
    marginHorizontal: 15,
  },
  tpPoints: {
    flex: 0.9,
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#0a1f44',
    textAlign: 'right',
  },
  confirmButtonContainer: {
    width: '60%',
    alignSelf: 'center',
    marginTop: 15,
  },
});
