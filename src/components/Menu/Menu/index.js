// Library imports
import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  I18nManager,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// StyleSheet import
import styles from './styles';

// Initial states
const STATES = {
  HIDDEN: 'HIDDEN',
  ANIMATING: 'ANIMATING',
  SHOWN: 'SHOWN',
};

const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;

/**
 * Menu component
 */
class Menu extends Component {
  _container = null;

  constructor(props) {
    super(props);

    this.state = {
      menuState: STATES.HIDDEN,

      top: 0,
      left: 0,

      menuWidth: 0,
      menuHeight: 0,

      buttonWidth: 0,
      buttonHeight: 0,

      menuSizeAnimation: new Animated.ValueXY({x: 0, y: 0}),
      opacityAnimation: new Animated.Value(0),
    };
  }

  // Set container reference
  _setContainerRef = (ref) => {
    this._container = ref;
  };

  // Start menu animation
  _onMenuLayout = (e) => {
    if (this.state.menuState === STATES.ANIMATING) {
      return;
    }

    const {width, height} = e.nativeEvent.layout;

    this.setState(
      {
        menuState: STATES.ANIMATING,
        menuWidth: width,
        menuHeight: height,
      },
      () => {
        Animated.parallel([
          Animated.timing(this.state.menuSizeAnimation, {
            toValue: {x: width, y: height},
            duration: this.props.animationDuration,
            easing: EASING,
            useNativeDriver: false,
          }),
          Animated.timing(this.state.opacityAnimation, {
            toValue: 1,
            duration: this.props.animationDuration,
            easing: EASING,
            useNativeDriver: false,
          }),
        ]).start();
      },
    );
  };

  // When the menu dismisses
  _onDismiss = () => {
    if (this.props.onHidden) {
      this.props.onHidden();
    }
  };

  // Show the menu
  show = () => {
    this._container.measureInWindow((left, top, buttonWidth, buttonHeight) => {
      this.setState({
        buttonHeight,
        buttonWidth,
        left: left === 0 ? 51 : left,
        menuState: STATES.SHOWN,
        top,
      });
    });
  };

  // Hide the menu
  hide = (onHidden) => {
    Animated.timing(this.state.opacityAnimation, {
      toValue: 0,
      duration: this.props.animationDuration,
      easing: EASING,
      useNativeDriver: false,
    }).start(() => {
      // Reset state
      this.setState(
        {
          menuState: STATES.HIDDEN,
          menuSizeAnimation: new Animated.ValueXY({x: 0, y: 0}),
          opacityAnimation: new Animated.Value(0),
        },
        () => {
          if (onHidden) {
            onHidden();
          }

          // Invoke onHidden callback if defined
          if (Platform.OS !== 'ios' && this.props.onHidden) {
            this.props.onHidden();
          }
        },
      );
    });
  };

  // TODO: Rework this
  _hide = () => {
    this.hide();
  };

  render() {
    const {isRTL} = I18nManager;

    const dimensions = Dimensions.get('window');
    const {width: windowWidth} = dimensions;
    const windowHeight =
      dimensions.height - this.props.tabHeight - (StatusBar.currentHeight || 0);

    const {
      menuSizeAnimation,
      menuWidth,
      menuHeight,
      buttonWidth,
      buttonHeight,
      opacityAnimation,
    } = this.state;
    const menuSize = {
      width: menuSizeAnimation.x,
      height: menuSizeAnimation.y,
    };

    // Adjust position of menu
    let {left, top} = this.state;
    const transforms = [];

    if (
      (isRTL && left + buttonWidth - menuWidth > SCREEN_INDENT) ||
      (!isRTL && left + menuWidth > windowWidth - SCREEN_INDENT)
    ) {
      transforms.push({
        translateX: Animated.multiply(menuSizeAnimation.x, -1),
      });

      left = Math.min(windowWidth - SCREEN_INDENT, left + buttonWidth);
    } else if (left < SCREEN_INDENT) {
      left = SCREEN_INDENT;
    }

    // Flip by Y axis if menu hits bottom screen border
    if (top > windowHeight - menuHeight - SCREEN_INDENT) {
      transforms.push({
        translateY: Animated.multiply(menuSizeAnimation.y, -1),
      });

      top = windowHeight - SCREEN_INDENT;
      top = Math.min(windowHeight - SCREEN_INDENT, top + buttonHeight);
    } else if (top < SCREEN_INDENT) {
      top = SCREEN_INDENT;
    }

    if (this.props.headerHeight && top < this.props.headerHeight) {
      top = top + (this.props.headerHeight - top);
    }

    const shadowMenuContainerStyle = {
      opacity: opacityAnimation,
      transform: transforms,
      top,

      // Switch left to right for rtl devices
      ...(isRTL ? {right: left} : {left}),
    };

    const {menuState} = this.state;
    const animationStarted = menuState === STATES.ANIMATING;
    const modalVisible = menuState === STATES.SHOWN || animationStarted;

    const {testID, button, style, children} = this.props;

    return (
      <View ref={this._setContainerRef} collapsable={false} testID={testID}>
        <View>{button}</View>

        <Modal
          visible={modalVisible}
          onRequestClose={this._hide}
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}
          transparent
          onDismiss={this._onDismiss}>
          <TouchableWithoutFeedback onPress={this._hide} accessible={false}>
            <View style={StyleSheet.absoluteFill}>
              <Animated.View
                onLayout={this._onMenuLayout}
                style={[
                  styles.shadowMenuContainer,
                  shadowMenuContainerStyle,
                  style,
                ]}>
                <Animated.View
                  style={[styles.menuContainer, animationStarted && menuSize]}>
                  {children}
                </Animated.View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

/**
 * Menu default props
 */
Menu.defaultProps = {
  animationDuration: 300,
};

export default Menu;
