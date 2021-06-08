import {StyleSheet} from 'react-native';
import { normalize } from '../../utils';

export default StyleSheet.create({
    container: {
        width: normalize(200),
        height: normalize(200)
    },
    loaderConatiner: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});