import {StyleSheet, Dimensions} from 'react-native';
import {Images, Colors, Icons, Fonts} from '../../../constants';
const {width, height} = Dimensions.get('window');

export const UpdateAppModalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
       // backgroundColor: 'red'
    },
    bgImage:{
        position:'absolute',
       // backgroundColor: 'yellow',
        height: '45%',
        width: '100%'
    },
    innerContainer: {
        backgroundColor: 'grey',
         //justifyContent: 'center',
         //alignItems: 'center',
        //padding : 80,
        // position: 'absolute',
        // bottom:'10%',
        height: '45%',
        width: '100%',
    },
    alertImage: {
        height: 70,
        width: 70,
        tintColor: Colors.orange_light,
        marginBottom: 25,
    },
    detailsAreaView: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
    },
    alertTitleTextStyle: {
        fontFamily: Fonts.medium,
        fontSize: 24,
        //marginTop: 100,
        //marginBottom: 10,
        textAlign: 'center'
    },
    alertmessageTextStyel: {
        fontFamily: Fonts.light,
        fontSize: 16,
        color: Colors.black,
        textAlign: 'center',
        //margin: 50
    },
    singleBtnVw:{
        flexDirection: 'row',
        marginTop: 20
    },
    singleBtnSubVw:{
        width: '50%'
    }
});
