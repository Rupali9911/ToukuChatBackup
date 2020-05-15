import React, {PureComponent} from 'react';
import {Dimensions, Text, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Toast from '../Toast';
import {Icons} from '../../constants';
// import { InternetInfoModal } from '../Modals/BottomModals';

const {width} = Dimensions.get('window');

class InternetInfo extends PureComponent {
  state = {
    isConnected: true,
  };

  componentDidMount() {
    NetInfo.addEventListener((state) => {
      this.handleConnectivityChange(state.isConnected);
    });
  }

  //   componentWillUnmount() {
  //     NetInfo.removeEventListener(
  //       'connectionChange',
  //       this.handleConnectivityChange,
  //     );
  //   }

  handleConnectivityChange = (isConnected) => {
    this.setState({isConnected});
    if (!isConnected) {
      Toast.show({
        title: 'Notwork Error',
        text: 'Please check your internet connection',
        icon: Icons.icon_message,
      });
    }
  };

  render() {
    return null;
  }
}

export default InternetInfo;
