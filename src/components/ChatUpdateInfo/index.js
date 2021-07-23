import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import StyleCreator from './styles';
import {Colors} from '../../constants';
import Menu from '../Menu/Menu';
import MenuItem from '../Menu/MenuItem';
import {translate} from '../../redux/reducers/languageReducer';

const ChatUpdateInfo = (props) => {
    const styles = StyleCreator(props.isMultiSelect);
    const {
        infoMenuRef,
        onItemPress,
        showMenu,
        text,
        isMultiSelect,
        onInfoDelete
    } = props;
    return(
        <TouchableOpacity
            style={styles.container}
            onPress={onItemPress}>
            <Menu
                ref={infoMenuRef}
                style={styles.menuStyle}
                tabHeight={110}
                headerHeight={80}
                button={
                    <TouchableOpacity
                        disabled={isMultiSelect}
                        onLongPress={showMenu}
                        style={styles.menuContainer}>
                        <View
                            style={styles.textContainer}>
                            <Text style={styles.messageDateText}>
                                {text}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }>
                <MenuItem
                    onPress={onInfoDelete}
                    customComponent={
                        <View
                            style={styles.menuItemContainer}>
                            <FontAwesome5
                                name={'trash'}
                                size={20}
                                color={Colors.white}
                            />
                            <Text style={styles.menuItemText}>
                                {translate('common.delete')}
                            </Text>
                        </View>
                    }
                />
            </Menu>
        </TouchableOpacity>
    );
}

export default React.memo(ChatUpdateInfo);