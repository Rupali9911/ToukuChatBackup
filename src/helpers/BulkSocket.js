import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {socketUrl} from './api';

export default class BulkSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.webSocketBridge;
    this.jwt;
    this.subject;
    this.socketChecker;
  }

  create({...config}) {
    this.jwt = config.token;
    this.connectSocket();
  }

  connectSocket() {
    if (this.jwt !== '') {
      this.webSocketBridge = new WebSocket(
        `${socketUrl}/bulk-socket?token=${this.jwt}`,
      );
      this.webSocketBridge.onopen = (e) => {
        console.log('Bulk Socket Connected.....');
        this.checkSocketConnected();
      };
      this.webSocketBridge.onmessage = (e) => {
        //   this.onNewMessage(e);
        console.log('Bulk socket on Message.....', JSON.stringify(e));
      };
      this.webSocketBridge.onerror = (e) => {
        console.log('Bulk socket Error.....', JSON.stringify(e));
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
      this.webSocketBridge.close();
    }, 1000);
  }

  onNewMessage(e) {
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
