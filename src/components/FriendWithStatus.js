import React, { Component } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
} from 'react-native';
import { Colors, Icons, Fonts } from '../constants';
import { globalStyles } from '../styles';
const { width, height } = Dimensions.get('window');
import { getAvatar } from '../utils';
import RoundedImage from './RoundedImage';
import Button from './Button';
import {translate, setI18nConfig} from "../redux/reducers/languageReducer";
import { connect } from 'react-redux';

class FriendWithStatus extends Component {
    constructor(props) {
        super(props);
        setI18nConfig(this.props.selectedLanguageItem.language_name);
        this.state = {
            isAdded: false,
        };
    }

    componentDidMount() {
        if (this.props.onRef != null) {
            this.props.onRef(this);
        }
    }

    onButtonAction = () => {
        const {user} = this.props;
        if (!user.is_friend) {
            this.props.onButtonAction();
        }
    };

    render() {
        const {user} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <RoundedImage source={getAvatar(user.profile_picture)} size={35} />
                    <Text
                        style={[
                            globalStyles.regularWeightedText,
                            { textAlign: 'left', marginStart: 15 },
                        ]}
                    >{user.username}</Text>
                </View>
                <View style={{width: user.is_requested === true ? 120 : 100}}>
             <Button
                title={user.is_requested === true ? translate('pages.xchat.cancelRequest'): user.is_friend === true
                ? translate('pages.xchat.friend') : translate('pages.xchat.add')}
                type={user.is_requested === true ? 'translucent' : 'primary'}
                height={30}
                onPress={this.onButtonAction.bind(this)}
                fontType={'smallRegularText'}
             />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

const mapStateToProps = (state) => {
    return {
        selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    };
};

export default connect(mapStateToProps)(FriendWithStatus);
