import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

const {width,height} = Dimensions.get('screen');

export default StyleSheet.create({
  container: {
    marginVertical: 5,
    marginTop: 15,
  },
  contentContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#e13887',
    flexDirection: 'row',
  },
  linkStyle: {
    color: Colors.link_color,
    textDecorationLine: 'underline',
  },
  hyperlinkStyle: {
    paddingHorizontal: 10,
    flex: 1,
  },
  text: {
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: Platform.isPad ? normalize(7.5) : normalize(12),
  },
  imageLoaderContainer: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  imageLoader: {
    width: 50,
    height: 50,
    borderRadius: 5,
    overflow: 'hidden',
  },
  videoContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#e13887',
  },
  mediaLinkStyle: {
    color: Colors.link_color,
    textDecorationLine: 'underline',
  },
  mediaHyperlink: {
    paddingHorizontal: 10,
    flex: 1,
  },
  mediaText: {
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: Platform.isPad ? normalize(7.5) : normalize(12),
  },
  linkPreviewURL: {
    paddingHorizontal: 10,
    marginTop: 5,
  },
  audioContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#e13887',
    alignItems: 'center',
  },
  audioPlayer: {
    marginTop: 10,
    width: '90%',
  },
});
