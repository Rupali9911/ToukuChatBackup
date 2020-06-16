import React, {Component} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {socketUrl} from './api';

export default class SingleSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.webSocketBridge;
    this.jwt;
    this.userId;
    this.subject;
    this.socketChecker;
  }

  async create({...config}) {
    this.userId = config.user_id;
    this.jwt = config.token;

    let basicAuth = await AsyncStorage.getItem('userToken');
    let socialAuth = await AsyncStorage.getItem('socialToken');
    if (socialAuth && socialAuth != null) {
      this.jwt = socialAuth;
    } else if (basicAuth && basicAuth != null) {
      this.jwt = basicAuth;
    }

    this.connectSocket();
  }

  connectSocket() {
    if (this.jwt !== '') {
      this.webSocketBridge = new WebSocket(
        `${socketUrl}/single-socket/${this.userId}?token=${this.jwt}`,
      );
      this.webSocketBridge.onopen = (e) => {
        this.checkSocketConnected();
      };
      this.webSocketBridge.onmessage = (e) => {
        this.onNewMessage(e);
      };
      this.webSocketBridge.onerror = (e) => {
        setTimeout(() => {
          this.checkSocketConnected();
        }, 1000);
      };
    }
  }

  sendMessage(msg) {
    this.webSocketBridge.send(
      JSON.stringify({
        message: msg,
      }),
    );
  }

  closeSocket() {
    setTimeout(() => {
      this.jwt = '';
      this.userId = 0;
      this.webSocketBridge.close();
    }, 1000);
  }

  onNewMessage(e) {
    // alert(JSON.stringify(e));
    // this.subject.next(JSON.parse(e.data));
  }

  checkSocketConnected() {
    clearInterval(this.socketChecker);
    this.socketChecker = setInterval(() => {
      if (this.webSocketBridge.readyState === this.webSocketBridge.CLOSED) {
        this.connectSocket();
        // setTimeout(() => {
        //   const payload: any = {
        //     data: JSON.stringify({
        //       data: {
        //         type: AppConstants.SOCKET_EVENTS.SOCKET_CONNECTED,
        //         message_details: null
        //       }
        //     })
        //   };
        //   this.onNewMessage(payload);
        // }, 5000);
      }
    }, 5000);
  }

  //   onDisconnect() {
  //     return Observable.create((observer) => {
  //       this.webSocketBridge.onclose = function (e: any) {
  //         observer.next(e);
  //       };
  //     });
  //   }

  render() {
    return null;
  }
}