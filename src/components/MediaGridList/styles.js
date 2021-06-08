import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { normalize } from '../../utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        minWidth: normalize(210),
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ccc',
        borderRadius: 7,
        overflow: 'hidden'
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
        width:'100%', 
        height:'100%', 
        position: 'absolute', 
        backgroundColor: '#00000045', 
        justifyContent:'center',
        alignItems: 'center',
    },
    count: {
        color:'white', 
        fontSize: normalize(12)
    }
});
