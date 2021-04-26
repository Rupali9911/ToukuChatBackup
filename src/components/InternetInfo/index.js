// Library imports
import NetInfo from '@react-native-community/netinfo';
import {PureComponent} from 'react';

// Local imports
import Toast from '../Toast';

/**
 * Internet connectivity information component
 */
export default class InternetInfo extends PureComponent {
  state = {
    isConnected: true,
  };

  // Add event listener for internet connectivity=
  componentDidMount() {
    NetInfo.addEventListener((state) => {
      this.handleConnectivityChange(state.isConnected);
    });
  }

  // function for handling internet connectivity changes
  handleConnectivityChange = (isConnected) => {
    this.setState({isConnected});
    if (!isConnected) {
      Toast.show({
        title: 'Notwork Error',
        text: 'Please check your internet connection',
      });
    }
  };

  render() {
    return null;
  }
}
