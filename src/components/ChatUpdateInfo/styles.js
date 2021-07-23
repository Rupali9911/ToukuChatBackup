import {
    StyleSheet
} from 'react-native';
import {Colors, Fonts} from '../../constants';
import {normalize} from '../../utils';

export default (isMultiSelect) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            marginLeft: isMultiSelect ? -35 : 0,
        },
        menuStyle: {
            marginTop: 15,
            marginLeft: 20,
            backgroundColor: Colors.gradient_3,
            opacity: 0.9,
        },
        menuContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 5,
        },
        textContainer: {
            maxWidth: '90%',
            backgroundColor: Colors.update_bg,
            padding: normalize(5),
            paddingHorizontal: normalize(8),
            borderRadius: 12,
        },
        messageDateText: {
            color: Colors.dark_pink,
            fontFamily: Fonts.regular,
            fontSize: 13,
            fontWeight: '300',
        },
        menuItemContainer: {
            flex: 1,
            flexDirection: 'row',
            margin: 15,
        },
        menuItemText: { 
            marginLeft: 10, 
            color: '#fff' 
        }
    }); 
} 