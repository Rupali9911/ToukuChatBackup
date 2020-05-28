import React, { Fragment, Component } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, Icons, Fonts, Images } from '../constants';
import RoundedImage from './RoundedImage';

const { width, height } = Dimensions.get('window');
let borderRadius = 20;
export default class ChatMessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  layoutChange = (event) => {
    var { x, y, width, height } = event.nativeEvent.layout;
    borderRadius = height / 2;
    console.log(
      'ChatMessageBox -> layoutChange -> this.props.message',
      this.props.message
    );
    if (height > 40) {
      borderRadius = height / 2;
    }
  };

  render() {
    const { message, isUser } = this.props;
    return !isUser ? (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'flex-start',
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <RoundedImage
            source={Images.image_default_profile}
            size={50}
            resizeMode={'cover'}
          />
          <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
            <View style={styles.talkBubble}>
              <View style={{ marginLeft: 5 }}>
                <View style={styles.talkBubbleAbsoluteLeft} />
                <View
                  style={{
                    minHeight: 40,
                    backgroundColor: Colors.white,
                    borderRadius: borderRadius,
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: Fonts.light,
                    }}
                  >
                    {message}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: '1.5%',
                alignItems: 'center',
                marginVertical: 15,
              }}
            >
              <Text style={styles.statusText}>Read</Text>
              <Text style={styles.statusText}>20:20</Text>
            </View>
          </View>
        </View>
      </View>
    ) : (
      <View
        style={[
          styles.container,
          {
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              marginHorizontal: '1.5%',
              alignItems: 'center',
              marginVertical: 15,
            }}
          >
            <Text style={styles.statusText}>Read</Text>
            <Text style={styles.statusText}>20:20</Text>
          </View>
          <View style={styles.talkBubble}>
            <View style={styles.talkBubbleAbsoluteRight} />
            <LinearGradient
              colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
              style={{
                minHeight: 40,
                borderRadius: borderRadius,
                justifyContent: 'center',
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}
            >
              <Text style={{ color: 'white', fontSize: 15 }}>{message}</Text>
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '65%',
    paddingHorizontal: '3%',
  },
  talkBubble: {
    justifyContent: 'flex-end',
    marginVertical: 15,
  },
  talkBubbleAbsoluteRight: {
    width: 120,
    height: 60,
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderTopColor: 'transparent',
    borderTopWidth: 25,
    borderLeftWidth: 13,
    borderLeftColor: Colors.gradient_3,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
    right: -35,
    top: -65,
  },
  talkBubbleAbsoluteLeft: {
    width: 120,
    height: 60,
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderTopColor: 'transparent',
    borderTopWidth: 25,
    borderRightWidth: 13,
    borderRightColor: Colors.white,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '90deg' }],
    left: -35,
    top: -65,
  },
  statusText: {
    color: Colors.gradient_1,
    fontFamily: Fonts.light,
  },
});
