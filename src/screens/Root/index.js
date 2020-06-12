import React, {Component} from 'react';
import {View, ViewPropTypes, Text} from 'react-native';
import PropTypes from 'prop-types';
import Toast from '../../components/Toast';
import {ProfileModal} from '../../components/Modals';

class Root extends Component {
  render() {
    return (
      <View ref={(c) => (this._root = c)} style={{flex: 1}} {...this.props}>
        {this.props.children}

        <Toast
          ref={(c) => {
            if (c) Toast.toastInstance = c;
          }}
        />

        <ProfileModal
          ref={(c) => {
            if (c) ProfileModal.userProfleInstance = c;
          }}
        />
      </View>
    );
  }
}

Root.propTypes = {
  ...ViewPropTypes,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default Root;
