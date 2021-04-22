import {StyleSheet, Dimensions} from 'react-native';
import {Images, Colors, Icons, Fonts} from '../../constants';
import {normalize} from '../../utils';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  singleFlex: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    borderBottomColor: '#c5c1c1',
    borderBottomWidth: 1,
  },
  actionContainer: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  itemContainer: {
    borderColor: '#ff0078',
    borderWidth: 1,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  statusContainer: {
    flex: 3,
    marginLeft: 10,
  },
  exchanceType: {
    fontSize: normalize(13),
    fontWeight: 'bold',
  },
  statusContentContainer: {
    flexDirection: 'row',
  },
  statusText: {
    color: '#ff00a3',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  dropdownIcon: {
    width: 15,
    height: 10,
  },
  currencyText: {
    color: '#ff00a3',
  },
  amountText: {
    fontSize: normalize(20),
    fontFamily: Fonts.regular,
  },
  itemAmountType: {
    fontSize: normalize(10),
  },
  amountType: {
    fontSize: normalize(13),
  },
  noExchageHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noExchageHistoryText: {
    fontSize: normalize(16),
  },
  actionText: {
    fontSize: normalize(13),
  },
});
