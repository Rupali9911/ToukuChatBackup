import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Icons, Fonts } from '../../constants';
const { width, height } = Dimensions.get('window');

export const addFriendStyles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 15,
        paddingBottom: 50
    },
    channelImageContainer: {
        height: height * 0.55,
        marginVertical: 15,
    },
    searchContainer: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 10 : 0,
        backgroundColor: Colors.white,
        borderRadius: 5,
        borderWidth: Platform.OS === 'android' ? 0.1 : 0.2,
        borderColor: Colors.gray_dark,
    },
    inputStyle: {
        flex: 1,
        color: Colors.black,
        fontSize: 13,
        marginStart: 10,
        alignSelf: 'center',
        fontFamily: Fonts.medium,
        paddingVertical: 0,
        height: 20
    },
    iconSearch: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    frindListContainer: {
        marginVertical: 20,
    },
    swithContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginVertical: 20,
    },
    VIPText: {
        color: Colors.orange,
        marginRight: 2,
        fontSize: 12,
    },
    vipDetails: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginVertical: 10,
    },
    followerDetails: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginVertical: 20,
    },
    detailHeadingText: {
        fontFamily: Fonts.extralight,
    },
    detailText: {
        fontFamily: Fonts.light,
        color: Colors.orange,
        fontSize: 18,
    },
    detailTextInput: {
        height: 50,
        color: Colors.orange,
        marginRight: 2,
        width: '80%',
        paddingHorizontal: 5,
        textAlign: 'right',
        fontSize: 18,
        fontFamily: Fonts.medium,
    }
});
