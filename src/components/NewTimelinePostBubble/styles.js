import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { normalize } from '../../utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        alignSelf: 'center',
        padding: normalize(5),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    linearGradient: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: Platform.isPad ? 55 / 2 : 45 / 2,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    textStyle: {
        color: Colors.white
    }
});
