import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import {Menu} from 'react-native-paper';
import Menu from '../Menu/GroupMenu';
import {Colors, Icons} from '../../constants';
import {globalStyles} from '../../styles';
import {normalize} from '../../utils';
import styles from './styles';

export default class ButtonWithArrow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      viewWidth: 0,
      below: true,
    };
  }

  getGradientColors() {
    switch (this.props.type) {
      case 'primary':
        return [Colors.gradient_1, Colors.gradient_2, Colors.gradient_3];
      case 'secondary':
        return [Colors.gray, Colors.gray, Colors.gray];
      case 'transparent':
        return ['rgba(0,0,0, 0.4)', 'rgba(0,0,0, 0.4)', 'rgba(0,0,0, 0.4)'];
      case 'translucent':
        return ['transparent', 'transparent', 'transparent'];
      default:
        return [Colors.gradient_1, Colors.gradient_2, Colors.gradient_3];
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
      loading,
      isRounded,
      height,
      disabled,
      dropDownData,
      memberType,
      isSmall,
    } = this.props;
    const {visible, below} = this.state;

    const menuItemStyle = (index) => {
      return [
        styles.menuItemStyle,
        {
          height: isSmall ? 40 : height,
        },
        index === 0 && {
          borderTopWidth: 0,
          borderColor: this.getBorderColor(),
        },
        index === dropDownData.length - 1 &&
          below && {
            borderBottomStartRadius: height / 2,
            borderBottomEndRadius: height / 2,
          },
        index === 0 &&
          !below && {
            borderTopStartRadius: height / 2,
            borderTopEndRadius: height / 2,
          },
      ];
    };

    const renderMenu = () => {
      return dropDownData.map((item, index) => {
        return (
          <Menu.Item
            style={menuItemStyle(index)}
            titleStyle={[globalStyles.normalRegularText, styles.menuTitleStyle]}
            title={item.title}
            onPress={() => {
              item.onPress(user.user_id ? user.user_id : user.id, memberType);
              this.setState({visible: false});
            }}
          />
        );
      });
    };

    const menuStyle = {
      marginTop: Platform.OS === 'android' ? normalize(35) : below ? 5 : -5,
      ...styles.transparentBackground,
    };

    const linearGradientStyle = [
      styles.linearGradient,
      {
        height: height,
        borderRadius: isRounded ? height / 2 : 4,
        borderColor: this.getBorderColor(),
        opacity: disabled ? 0.5 : 1,
        // width: '100%',
      },
      this.state.visible && below && styles.visibleAndBelow,
      this.state.visible && !below && styles.visibleAndNotBelow,
    ];

    return (
      <View
        onLayout={(event) => {
          const {width} = event.nativeEvent.layout;
          this.setState({viewWidth: width});
        }}>
        <Menu
          style={menuStyle}
          contentStyle={[
            {width: this.state.viewWidth},
            styles.menuContentStyle,
          ]}
          theme={{animation: {scale: 0}}}
          visible={visible}
          onDismiss={() => {
            this.setState({visible: false});
          }}
          onPosition={(e) => {
            console.log('isPosition_below_anchor', e);
            this.setState({below: e});
          }}
          anchor={
            <TouchableOpacity
              disabled={disabled}
              activeOpacity={0.8}
              onPress={() => this.setState({visible: true})}>
              <LinearGradient
                start={{x: 0.1, y: 0.7}}
                end={{x: 0.5, y: 0.8}}
                locations={[0.3, 0.5, 1]}
                useAngle={true}
                // angle={222.28}
                colors={this.getGradientColors()}
                style={linearGradientStyle}>
                {loading ? (
                  <ActivityIndicator
                    size={'small'}
                    color={this.getIndicatorColor()}
                  />
                ) : (
                  <View style={styles.titleContainer}>
                    <Text
                      style={[
                        globalStyles.normalRegularText,
                        {
                          color: this.getTitleColor(),
                        },
                        styles.title,
                      ]}
                      adjustsFontSizeToFit>
                      {title[0].toUpperCase() + title.slice(1)}
                    </Text>
                    <Image
                      source={Icons.icon_triangle_down}
                      style={[
                        styles.channelIcon,
                        {tintColor: this.getImageTintColor()},
                      ]}
                    />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          }>
          {below && (
            <Menu.Item
              style={styles.menuItemBelow}
              onPress={() => this.setState({visible: false})}
            />
          )}
          {renderMenu(dropDownData)}
          {!below && (
            <Menu.Item
              style={styles.menuItemNotBelow}
              onPress={() => this.setState({visible: false})}
            />
          )}
        </Menu>
      </View>
    );
  }
}

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
