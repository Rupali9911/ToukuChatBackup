/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import SignUp from './src/screens/SignUp';
import {name as appName} from './app.json';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => SignUp);
