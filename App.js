import React, {Component} from 'react';
import {View, Text, StatusBar} from 'react-native';
import Routes from './src/navigation';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {store, persistor} from './src/redux/store';
import Root from './src/screens/Root';
import InternetInfo from './src/components/InternetInfo';
import {socket} from './src/helpers/api';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // socket.on('connect', function (e) {
    //   alert('on Connect');
    // });
    // socket.on('connect_error', (err) => {
    //   alert(err);
    // });
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <View style={{flex: 1}}>
              <StatusBar barStyle="light-content" translucent />
              <InternetInfo />
              <Routes />
            </View>
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}
