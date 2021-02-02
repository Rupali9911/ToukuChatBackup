import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  AppState,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';

import {isIphoneX} from '../utils';
import {Icons, Colors, Fonts} from '../constants';

const {height, width} = Dimensions.get('window');

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      toast: new Animated.Value(width + width),
      type: 'primary',
    };
  }

  static toastInstance;

  static show({...config}) {
    if(this.toastInstance){
      console.log('config', config)
      this.toastInstance.start(config);
    }else{
      this.toastInstance = this;
      console.log('config', config)
      this.toastInstance.start(config);
    }
  }

  static hide() {
    this.toastInstance.hideToast();
  }

  // state = {
  //   toast: new Animated.Value(width),
  // };

  start({...config}) {
    this.setState({
      title: config.title,
      text: config.text,
      type: config.type || 'primary',
      icon: config.icon || Icons.icon_alert,
      timing: config.timing,
    });

    Animated.spring(this.state.toast, {
      toValue: Platform.isPad ? width - width + width * 0.15 : width - width,
      bounciness: 5,
      useNativeDriver: true,
    }).start();

    const duration = config.timing > 0 ? config.timing : 2000;

    setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  hideToast() {
    Animated.timing(this.state.toast, {
      toValue: width + width,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  getGradientColors() {
    switch (this.state.type) {
      case 'primary':
        return ['#f23ca6', '#f64690', '#f74978'];
      case 'positive':
        return ['#1bd078', '#1acf98', '#1bd0b7'];
      case 'warning':
        return ['#f5c120', '#f8b824', '#f9a92e'];
    }
  }

  getIcon() {
    switch (this.state.type) {
      case 'primary':
        return Icons.icon_alert;
      case 'positive':
        return Icons.icon_tick_circle;
      default:
        return Icons.icon_warning;
    }
  }

  getIconColor() {
    switch (this.state.type) {
      case 'primary':
        return Colors.danger;
      case 'positive':
        return null;
      default:
        return Colors.danger;
    }
  }

  render() {
    const {title, text, icon, orientation} = this.state;
    if (AppState.currentState === 'background') {
      return null;
    }
    return (
      <Animated.View
        ref={(c) => (this._root = c)}
        style={[
          styles.toast,
          {
            transform: [
              {translateX: this.state.toast},
              {
                translateY:
                  orientation != 'PORTRAIT' ? (Platform.isPad ? 100 : 60) : 100,
              },
            ],
          },
        ]}>
        <LinearGradient
          start={{x: 0.1, y: 0.7}}
          end={{x: 0.5, y: 0.8}}
          locations={[0.1, 0.6, 1]}
          colors={this.getGradientColors()}
          style={styles.content}>
          <View style={styles.iconContainer}>
            <Image
              source={this.getIcon()}
              style={[styles.iconStyle, {tintColor: this.getIconColor()}]}
            />
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{text}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    width: Platform.isPad ? '50%' : '96%',
    alignSelf: 'center',
    borderRadius: 8,
    minHeight: Platform.isPad ? 100 : 90,
    shadowColor: '#ccc',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
  },
  content: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    color: '#f1f1f1',
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 4,
    marginEnd: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default Toast;
