import React, {Component} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {socketUrl} from './api';
import {eventService} from '../utils';

export default class BulkSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.webSocketBridge;
    this.jwt;
    this.subject;
    this.socketChecker;
  }

  static myInstance = null;

  static getInstance() {
    if (BulkSocket.myInstance == null) {
      BulkSocket.myInstance = new BulkSocket();
    }
    return this.myInstance;
  }

  async create({...config}) {
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

  async connectSocket() {
    if (this.jwt !== '') {
      if(this.webSocketBridge == null){
        this.webSocketBridge = new WebSocket(
          `${socketUrl}/bulk-socket?token=${this.jwt}`,
        );
        this.webSocketBridge.onopen = (e) => {
          console.log('Bulk Socket Connected.....');
          this.checkSocketConnected();
        };
        this.webSocketBridge.onmessage = (e) => {
            this.onNewMessage(e);
        };
        this.webSocketBridge.onerror = (e) => {
          console.log('Bulk socket Error.....', JSON.stringify(e));
          setTimeout(() => {
            this.checkSocketConnected();
          }, 1000);
        };
        this.webSocketBridge.onclose = (e) => {
          console.log('Bulk socket closed');
        }
      }else{
        console.log('Object already exists checking bulk web socket connected');
        if (this.webSocketBridge.readyState === this.webSocketBridge.CLOSED) {
          this.webSocketBridge.close();
          this.webSocketBridge = null;
          setTimeout(()=>{
            console.log('connection_url',`${socketUrl}/single-socket/${this.userId}?token=${this.jwt}`);
            this.webSocketBridge = new WebSocket(
              `${socketUrl}/bulk-socket?token=${this.jwt}`,
            );
            this.webSocketBridge.onopen = (e) => {
              console.log('Bulk Socket Connected.....');
              this.checkSocketConnected();
            };
            this.webSocketBridge.onmessage = (e) => {
                this.onNewMessage(e);
            };
            this.webSocketBridge.onerror = (e) => {
              console.log('Bulk socket Error.....', JSON.stringify(e));
              setTimeout(() => {
                this.checkSocketConnected();
              }, 1000);
            };
            this.webSocketBridge.onclose = (e) => {
              console.log('Bulk socket closed');
            }
          },1000);
        }
      }
    }
  }

  sendMessage(msg) {
    this.webSocketBridge && this.webSocketBridge.send(
      JSON.stringify({
        message: msg,
      }),
    );
  }

  closeSocket() {
    setTimeout(() => {
      this.jwt = '';
      this.webSocketBridge && this.webSocketBridge.close();
      console.log('Bulk Socket Connection closed');
      clearInterval(this.socketChecker);
      this.webSocketBridge = null;
    }, 1000);
  }

  onNewMessage(e) {
    // this.subject.next(JSON.parse(e.data));
    console.log('socket_new_bulk_message',e);
    eventService.sendMessage(JSON.parse(e.data));
  }

  async checkSocketConnected() {
    clearInterval(this.socketChecker);
    if (this.jwt && this.jwt !== '') {
      this.socketChecker = setInterval(() => {
        if (this.webSocketBridge == null || this.webSocketBridge.readyState === this.webSocketBridge.CLOSED) {
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
