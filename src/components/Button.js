import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <LinearGradient
        start={{x: 0.1, y: 0.7}}
        end={{x: 0.5, y: 0.8}}
        locations={[0.1, 0.6, 1]}
        colors={['#f68b6b', '#f27478', '#ef4f8f']}
        style={styles.linearGradient}>
        <Text style={{color: 'white', fontSize: 12}}>{this.props.btnText}</Text>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
