import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import {getAvatar} from '../../utils';
import Button from '../Button';
import RoundedImage from '../RoundedImage';
import styles from './styles';

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
    const {
      user: {is_friend},
    } = this.props;
    if (!is_friend) {
      this.props.onButtonAction();
    }
  };

  render() {
    const {user} = this.props;
    const {
      display_name,
      username,
      is_friend,
      profile_picture,
      is_requested,
    } = user;

    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <RoundedImage source={getAvatar(profile_picture)} size={35} />
          <Text style={[globalStyles.regularWeightedText, styles.username]}>
            {display_name ? display_name : username}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={
              is_requested === true
                ? translate('pages.xchat.cancelRequest')
                : is_friend === true
                ? translate('pages.xchat.friend')
                : translate('pages.xchat.add')
            }
            type={is_requested === true ? 'translucent' : 'primary'}
            height={30}
            onPress={this.onButtonAction.bind(this)}
            fontType={'smallRegularText'}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

export default connect(mapStateToProps)(FriendWithStatus);
