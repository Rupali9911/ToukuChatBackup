// Library imports
import React, {Component} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

// Local imports
import {Colors} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';

// StyleSheet import
import styles from './styles';

/**
 * Open loader component
 */
export default class OpenLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: this.props.progress,
    };
  }

  // Sets the state after receiving props
  componentWillReceiveProps(nextProps) {
    if (nextProps.progress) {
      this.setState({progress: nextProps.progress});
    }
  }

  render() {
    const {large, hideText} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <ActivityIndicator
            color={Colors.primary}
            size={large ? 'large' : 'small'}
          />
          {!hideText && <Text style={styles.textStyle}>
            {translate('pages.xchat.donloading')}
          </Text>}
        </View>
      </View>
    );
  }
}
