import React, {Component} from 'react';
import {View, Text, StatusBar} from 'react-native';
import Routes from './src/navigation';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {store, persistor} from './src/redux/store';
import Root from './src/screens/Root';
import InternetInfo from './src/components/InternetInfo';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
