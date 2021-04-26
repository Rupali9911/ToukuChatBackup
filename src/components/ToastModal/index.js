import React, {Component} from 'react';
import {
  Animated,
  AppState,
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import {Colors, Icons} from '../../constants';
import styles from './styles';

const {width} = Dimensions.get('window');

class ToastModal extends Component {
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
    if (this.toastInstance) {
      console.log('config', config);
      this.toastInstance.start(config);
    } else {
      this.toastInstance = this;
      console.log('config', config);
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

    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }

    Animated.spring(this.state.toast, {
      toValue: Platform.isPad ? width - width + width * 0.15 : width - width,
      bounciness: 5,
      useNativeDriver: true,
    }).start();

    const duration = config.timing > 0 ? config.timing : 5000;

    this.timeout = setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  hideToast() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
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
    const {title, text, orientation} = this.state;
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
                  orientation !== 'PORTRAIT'
                    ? Platform.isPad
                      ? 100
                      : 60
                    : 100,
              },
            ],
          },
        ]}>
        <TouchableWithoutFeedback
          style={styles.content}
          onPress={() => {
            this.hideToast();
          }}>
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
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{text}</Text>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

export default ToastModal;
