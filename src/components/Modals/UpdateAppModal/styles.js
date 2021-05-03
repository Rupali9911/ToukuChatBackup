import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../constants';
import {normalize} from '../../../utils';

export const UpdateAppModalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgImage:{
        position:'absolute',
        height: '48%',
        width: '100%'
    },
    innerContainer: {
        //backgroundColor: 'red',
        flex: 1.6,
        alignSelf: 'center',
        // position:'absolute',
        // height: '50%',
         width: '80%',
       // bottom:15,
        left: -15
    },
    alertTitleTextStyle: {
        fontFamily: Fonts.medium,
        //fontSize: 24,
        fontSize: normalize(18),
        textAlign: 'center'
    },
    alertmessageTextStyel: {
        fontFamily: Fonts.light,
        //fontSize: 16,
        fontSize: normalize(10),
        color: Colors.black,
        textAlign: 'center',
        padding: 15,
        //marginRight: 35
    },
    singleBtnSubVw:{
        flex: 1,
        alignItems: 'center',
    }
});
