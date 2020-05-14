import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {isIphoneX} from '../utils';
import {Icons, Colors, Fonts} from '../constants';

const {height, width} = Dimensions.get('window');

class Toast extends Component {
  static toastInstance;

  static show({...config}) {
    this.toastInstance.start(config);
  }

  static hide() {
    this.toastInstance.hideToast();
  }

  state = {
    toast: new Animated.Value(width),
  };

  start({...config}) {
    this.setState({
      title: config.title,
      text: config.text,
      icon: config.icon || Icons.icon_tick,
      timing: config.timing,
    });

    Animated.spring(this.state.toast, {
      toValue:
        Platform.OS === 'ios'
          ? isIphoneX()
            ? width - 350
            : width - 380
          : width - 380,
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
      toValue: width + 500,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const {title, text, icon} = this.state;
    return (
      <Animated.View
        ref={(c) => (this._root = c)}
        style={[
          styles.toast,
          {
            transform: [{translateX: this.state.toast}, {translateY: 100}],
          },
        ]}>
        <LinearGradient
          start={{x: 0.1, y: 0.7}}
          end={{x: 0.5, y: 0.8}}
          locations={[0.1, 0.6, 1]}
          colors={['#f23ca6', '#f64690', '#f74978']}
          style={styles.content}>
          <View style={styles.iconContainer}>
            <Image source={icon} style={styles.iconStyle} />
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
    width: '80%',
    alignSelf: 'center',
    // backgroundColor: Colors.white,
    borderRadius: 8,
    minHeight: 90,
    shadowColor: '#ccc',
    // borderWidth: 1,
    // borderColor: Colors.gray,
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
    // backgroundColor: 'red',
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
    tintColor: Colors.primary,
  },
});

export default Toast;
