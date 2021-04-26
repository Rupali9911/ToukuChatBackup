import React, {Component} from 'react';
import {View, ViewPropTypes, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Toast from '../../components/Toast';
import {ProfileModal} from '../../components/Modals';

class Root extends Component {
  static toastInstance;

  render() {
    return (
      <View
        ref={(c) => (this._root = c)}
        style={styles.singleFlex}
        {...this.props}>
        {this.props.children}

        <Toast
          ref={(c) => {
            this.toastInstance = c;
            if (c) {
              Toast.toastInstance = c;
            }
          }}
        />

        <ProfileModal
          ref={(c) => {
            if (c) {
              ProfileModal.userProfleInstance = c;
            }
          }}
        />

        {/* <SingleSocket
          ref={(c) => {
            if (c) SingleSocket.singleSocketInstance = c;
          }}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  singleFlex: {
    flex: 1,
  },
});

Root.propTypes = {
  ...ViewPropTypes,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default Root;
