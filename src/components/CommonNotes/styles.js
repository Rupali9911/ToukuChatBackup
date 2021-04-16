import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  notes: {
    color: Colors.black,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(12),
  },
  count: {
    color: '#e26161',
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: normalize(12),
  },
  addIconActionContainer: {
    alignSelf: 'flex-end',
  },
  addIcon: {
    height: 20,
    width: 20,
  },
  textBoxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // flex: 0.5,
    marginTop: 10,
    height: 30,
    width: '100%',
  },
  buttonContainer: {
    marginHorizontal: 5,
    // width: 60,
  },
  emptyNotesLabel: {
    paddingBottom: 0,
  },
  emptyNotesFoundText: {
    paddingTop: 0,
  },
  emptyNotesFoundTextStyle: {
    marginTop: 0,
  },
  divider: {
    height: 10,
  },
});
