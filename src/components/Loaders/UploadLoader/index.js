// Libaray imports
import React, {Component} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';

// Local imports
import {Colors} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';

// StyleSheet import
import styles from './styles';

/**
 * Upload loader component
 */
export default class UploadLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: this.props.progress,
    };
  }

  // Sets the progress in state after receiving from component
  componentWillReceiveProps(nextProps) {
    if (nextProps.progress) {
      this.setState({progress: nextProps.progress});
    }
  }

  render() {
    const {large, progress} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          {progress ? (
            <View style={styles.center}>
              <ProgressBar
                color={Colors.primary}
                style={styles.progressBar}
                progress={this.state.progress}
              />
            </View>
          ) : (
            <ActivityIndicator
              color={Colors.primary}
              size={large ? 'large' : 'small'}
            />
          )}
          <Text style={styles.uploadingText}>
            {translate('pages.xchat.uploading')}
          </Text>
        </View>
      </View>
    );
  }
}
