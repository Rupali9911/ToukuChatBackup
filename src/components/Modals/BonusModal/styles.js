// Library imports
import {StyleSheet, Dimensions} from 'react-native';

// Local imports
import {Fonts} from '../../../constants';
import {normalize} from '../../../utils';

// Get the dimensions of current window
const dimensions = Dimensions.get('window');

/**
 * StyleSheet for bonus modal
 */
export default StyleSheet.create({
  singleFlezx: {
    flex: 1,
  },
  bonusModalContainer: {
    flex: 1,
    backgroundColor: '#00000080',
  },
  bonusBgContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 30,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bonusTextHeading: {
    marginTop: normalize(20),
    textAlign: 'center',
    fontSize: normalize(25),
    fontWeight: '300',
    color: '#ffd300',
    fontFamily: Fonts.regular,
  },
  bonusTitleText: {
    textAlign: 'center',
    fontSize: normalize(20),
    fontWeight: '300',
    color: '#fff',
    fontFamily: Fonts.beba_regular,
  },
  bonusImageContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginBottom: 20,
    marginTop: 10,
  },
  bonusImage: {
    width: Math.round(dimensions.width / 4),
    height: Math.round(dimensions.width / 4),
  },
  bonusImageZoom: {
    width: Math.round(dimensions.width / 3),
    height: Math.round(dimensions.width / 3),
  },
  assetText: {
    fontSize: normalize(25),
    fontWeight: 'bold',
  },
  chosenAmount: {
    fontSize: normalize(15),
    fontFamily: Fonts.regular,
    fontWeight: '300',
  },
  loading: {
    marginTop: 10,
  },
  bonusImageActionContainer: {
    marginHorizontal: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  jackpotContainer: {
    flex: 1,
    alignItems: 'center',
  },
  jackpotAmountContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  jackpotAmount: {
    textAlign: 'right',
    fontSize: normalize(24),
    fontFamily: Fonts.beba_regular,
  },
  amazonGiftLogo: {
    width: '70%',
  },
  hintText: {
    fontSize: normalize(12),
    paddingHorizontal: normalize(5),
    fontWeight: '300',
    color: 'white',
  },
  closeIcon: {
    backgroundColor: '#e2b2ac',
  },
});
