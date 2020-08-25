import React, {Component} from 'react';
import {View, ViewPropTypes, Text, AppState} from 'react-native';
import PropTypes from 'prop-types';
import Toast from '../../components/Toast';
import {ProfileModal} from '../../components/Modals';
import SingleSocket from '../../helpers/SingleSocket';
import connect from "react-redux";

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

        {/* <SingleSocket
          ref={(c) => {
            if (c) SingleSocket.singleSocketInstance = c;
          }}
        /> */}
      </View>
    );
  }
}

export default Root;


Root.propTypes = {
    ...ViewPropTypes,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.array,
    ]),
};
