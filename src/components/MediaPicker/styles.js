import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { normalize } from '../../utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        minWidth: 300,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    videoContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoIconContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#00000040',
        position: 'absolute',
        bottom: 0,
    },
    playIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    countCounter: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: '#00000045',
        justifyContent: 'center',
        alignItems: 'center',
    },
    count: {
        color: 'white',
        fontSize: normalize(12)
    },
    itemContainer: {
        maxWidth: width / 3.1,
        maxHeight: width / 3,
        flex: 1,
    },
    itemContainerSeparator: {
        flex: 1,
        borderLeftWidth: 5,
        borderColor: 'transparent',
    },
    itemContainerAnimationEnd: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
    },
    separator: {
        borderColor: 'transparent',
        borderWidth: 5 * 0.5,
    },
    list_container: {
        borderRightWidth: 5,
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderColor: 'transparent',
    },
});
