import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { Menu } from 'react-native-paper';
import { Colors, Fonts, Icons } from '../constants';
import { globalStyles } from '../styles';
const { width, height } = Dimensions.get('window');

export default class ButtonWithArrow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  getGradientColors() {
    switch (this.props.type) {
      case 'primary':
        return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
      case 'secondary':
        return [Colors.gray, Colors.gray, Colors.gray];
      case 'transparent':
        return ['rgba(0,0,0, 0.4)', 'rgba(0,0,0, 0.4)', 'rgba(0,0,0, 0.4)'];
      case 'translucent':
        return ['transparent', 'transparent', 'transparent'];
      default:
        return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
    }
  }

  getBorderColor() {
    switch (this.props.type) {
      case 'primary':
        return 'transparent';
      case 'secondary':
        return 'transparent';
      case 'transparent':
        return Colors.primary;
      case 'translucent':
        return Colors.gradient_3;
      default:
        return 'transparent';
    }
  }

  getIndicatorColor() {
    switch (this.props.type) {
      case 'primary':
        return Colors.white;
      case 'transparent':
        return Colors.primary;
      case 'translucent':
        return Colors.primary;
      default:
        return Colors.white;
    }
  }

  getTitleColor() {
    switch (this.props.type) {
      case 'primary':
        return Colors.white;
      case 'secondary':
        return Colors.black;
      case 'transparent':
        return Colors.white;
      case 'translucent':
        return Colors.gradient_2;
      default:
        return Colors.white;
    }
  }

  getImageTintColor() {
    switch (this.props.type) {
      case 'primary':
        return Colors.white;
      case 'secondary':
        return Colors.black;
      case 'transparent':
        return Colors.white;
      case 'translucent':
        return Colors.gradient_2;
      default:
        return Colors.white;
    }
  }

  render() {
    const {
      user,
      title,
      onPress,
      loading,
      isRounded,
      height,
      disabled,
      dropDownData,
      memberType,
    } = this.props;
    const { visible } = this.state;
    let renderMenu = (dropDownData) => {
      return dropDownData.map((item, index) => {
        return (
          <Menu.Item
            style={[
              {
                backgroundColor: Colors.white,
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: '100%',
              },
              index === 0 && {
                borderTopWidth: 1,
                borderColor: this.getBorderColor(),
              },
              index === dropDownData.length - 1 && {
                borderBottomStartRadius: 15,
                borderBottomEndRadius: 15,
              },
            ]}
            titleStyle={[
              globalStyles.normalRegularText,
              {
                color: Colors.gradient_3,
                width: '100%',
              },
            ]}
            title={item.title}
            onPress={() => {
              item.onPress(user.user_id ? user.user_id : user.id, memberType);
              this.setState({ visible: false });
            }}
          />
        );
      });
    };

    return (
      <Menu
        style={{
          marginTop: Platform.OS === 'android' ? 34 : 5,
          backgroundColor: 'transprent',
        }}
        contentStyle={{
          borderRadius: 15,
          borderColor: Colors.gradient_3,
          backgroundColor: 'transprent',
          borderWidth: 1.5,
          paddingVertical: 0,
          alignSelf: 'flex-end',
          width: '51%',
          elevation: 0,
        }}
        theme={{ animation: { scale: 0 } }}
        visible={visible}
        onDismiss={() => this.setState({ visible: false })}
        anchor={
          <TouchableOpacity
            disabled={disabled}
            activeOpacity={0.8}
            onPress={() => this.setState({ visible: true })}
          >
            <LinearGradient
              start={{ x: 0.1, y: 0.7 }}
              end={{ x: 0.5, y: 0.8 }}
              locations={[0.1, 0.6, 1]}
              colors={this.getGradientColors()}
              style={[
                styles.linearGradient,
                {
                  height: height,
                  borderRadius: isRounded ? 30 / 2 : 4,
                  borderColor: this.getBorderColor(),
                  opacity: disabled ? 0.5 : 1,
                },
                this.state.visible && {
                  // borderWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderBottomWidth: 0,
                  borderTopWidth: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator
                  size={'small'}
                  color={this.getIndicatorColor()}
                />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      globalStyles.normalRegularText,
                      { color: this.getTitleColor(), flex: 0.9, fontSize: 14 },
                    ]}
                    adjustsFontSizeToFit
                  >
                    {title[0].toUpperCase() + title.slice(1)}
                  </Text>
                  <Image
                    source={Icons.icon_triangle_down}
                    style={[
                      styles.channelIcon,
                      { tintColor: this.getImageTintColor() },
                    ]}
                  />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        }
      >
        <Menu.Item
          style={[
            styles.txtDrpDwn,
            {
              backgroundColor: 'transprent',
              borderTopStartRadius: 10,
              borderTopEndRadius: 10,
              minWidth: '100%',
            },
          ]}
          onPress={() => this.setState({ visible: false })}
        />
        {renderMenu(dropDownData)}
      </Menu>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  channelIcon: {
    flex: 0.1,
    height: 8,
    resizeMode: 'contain',
  },
  txtDrpDwn: {
    height: 30,
  },
});

ButtonWithArrow.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  isRounded: PropTypes.bool,

  type: PropTypes.oneOf(['primary', 'secondary', 'transparent', 'translucent']),

  /**
   * StyleSheet props
   */
  borderColor: PropTypes.string,
  height: PropTypes.any,

  /**
   * Callbacks
   */
  onPress: PropTypes.func,
};

ButtonWithArrow.defaultProps = {
  height: 35,
  type: 'primary',
  title: 'Submit',
  disabled: false,
  loading: false,
  isRounded: true,
  onPress: null,
};
