import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill_border_box_style: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: '#ff728a',
    borderWidth: 1,
    marginTop: 10,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  displayName: {
    color: Colors.black,
    marginStart: 10,
    fontSize: 14,
  },
  headingContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  headingText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.regular,
    color: '#0A1F44',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  tpPointsGradientContainer: {
    marginRight: 10,
  },
  xpPointsGradientContainer: {
    marginLeft: 10,
  },
  pointsText: {
    color: '#0a1f44',
    fontFamily: Fonts.regular,
  },
  pointsCount: {
    marginTop: -10,
    textAlign: 'right',
    color: '#0a1f44',
    fontFamily: Fonts.regular,
    fontSize: normalize(20),
  },
  singleFlex: {
    flex: 1,
  },
  amazonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bitcoinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  bannerImage: {
    width: '100%',
    height: 100,
    marginTop: 10,
  },
  recommendedContainers: {
    width: 100,
    marginTop: 10,
    marginRight: 15,
  },
  recommendedPosters: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  recommendedLabels: {
    flex: 1,
    marginTop: 5,
    fontSize: normalize(12),
  },
  recommendedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    tintColor: '#ffbf00',
    resizeMode: 'contain',
  },
  dropdownHeaderGradientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderColor: '#f2f3f5',
    borderWidth: 1,
  },
  dropdownHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 5,
    tintColor: '#0a1f44',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#3c3a3a',
    textShadowColor: 'rgba(0,0,0,.004)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 10,
  },
  headerItemCount: {
    marginStart: 5,
    fontSize: 14,
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,.004)',
    color: '#3c3a3a',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 1,
  },
  headerListDropDownIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginStart: 10,
    tintColor: '#b3b3b3',
  },
  flexDisplay: {
    display: 'flex',
  },
});
