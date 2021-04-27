// Library imports
import { StyleSheet } from 'react-native';

// Local imports
import { Colors, Fonts } from '../../../constants';
import { normalize } from '../../../utils';


/**
 * StyleSheet for Timeline comment modal
 */
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00000040',
    },
    NonViewContainer: {
        flex: 1,
    },
    stickyViewContainer: {
        backgroundColor: '#fff',
    },
    commentConatiner: {
        width: '100%',
        maxHeight: normalize(200),
        backgroundColor: '#fff',
    },
    countContainer: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    countText: {
        color: Colors.black,
        fontFamily: Fonts.regular,
        fontWeight: '400',
        fontSize: normalize(10),
        margin: 10,
    },
    titleContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    title: {
        fontSize: normalize(12),
    },
    emptyViewContainer: {
        backgroundColor: '#fff',
        minHeight: 100,
        justifyContent: 'center',
        transform: [{rotate: '180deg'}],
    },
    emptyText: {
        alignSelf: 'center',
        transform: [{rotateY: '180deg'}],
    },
    inputContainer: {
        padding: 10,
        paddingTop: 8,
        width: '100%',
        flexDirection: 'row',
        borderTopWidth: 1,
        alignItems: 'center',
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    inputStyle: {
        flex: 1,
        fontSize: normalize(12),
        maxHeight: 70,
        backgroundColor: '#fff',
    },
    sendButoonContainer: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    sendButtonImage: {
        width: '65%',
    },
    safeAreaView: {
        backgroundColor: '#fff',
    },
    commentItemContainer: {
        padding: 10,
        flexDirection: 'row',
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover',
        marginRight: 5,
    },
    commentDataContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    singleFlex: {
        flex:1,
    },
    commentUserContainer: {
        marginLeft: 5, 
        flexDirection: 'row',
        marginBottom:5,
    },
    userName: {
        marginRight: 5,
        color: '#e26161',
        fontFamily: Fonts.regular,
        fontWeight: '400',
        fontSize: normalize(10),
    },
    dateText: {
        color: '#6c757dc7',
        fontFamily: Fonts.regular,
        fontWeight: '400',
        fontSize: normalize(10),
    },
    commentText: {
        color: Colors.black,
        fontFamily: Fonts.regular,
        fontWeight: '400',
        fontSize: normalize(10),
        marginLeft: 5,
    },
    deleteIcon: {
        marginLeft: 5,
    }
});