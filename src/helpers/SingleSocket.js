import React, {Component} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {socketUrl} from './api';
import {eventService} from '../utils';
import {
  isEventIdExists,
  getLastEventId
} from '../storage/Service';
import {
  getMissedSocketEventsByIdFromApp
} from '../redux/reducers/userReducer';

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

  static myInstance = null;
  
  static getInstance() {
    if (SingleSocket.myInstance == null) {
      SingleSocket.myInstance = new SingleSocket();
    }

    return this.myInstance;
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
      console.log('webSocketBridge',this.webSocketBridge);
      if(this.webSocketBridge == null){
        console.log('connecting');
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
      }else{
        console.log('Object already exists checking web socket connected');
        if (this.webSocketBridge.readyState === this.webSocketBridge.CLOSED) {
          this.webSocketBridge.close();
          this.webSocketBridge = null;
          setTimeout(()=>{
            this.webSocketBridge = new WebSocket(
              `${socketUrl}/single-socket/${this.userId}?token=${this.jwt}`,
            );
            this.webSocketBridge.onopen = (e) => {
              this.checkSocketConnected();
              if (isEventIdExists()) {
                let idObj = getLastEventId()
                console.log('getLastEventId', idObj)
                if (idObj.length > 0) {
                    getMissedSocketEventsByIdFromApp(idObj[0].socket_event_id);
                }
            }
            };
            this.webSocketBridge.onmessage = (e) => {
              this.onNewMessage(e);
            };
            this.webSocketBridge.onerror = (e) => {
              setTimeout(() => {
                this.checkSocketConnected();
              }, 1000);
            };
          },1000);
        }
      }
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
      this.webSocketBridge && this.webSocketBridge.close();
      console.log('Socket Connection closed');
      clearInterval(this.socketChecker);
      this.webSocketBridge = null;
    }, 1000);
  }

  onNewMessage(e) {
    eventService.sendMessage(JSON.parse(e.data));
  }

  checkSocketConnected() {
    console.log('checking web socket connected',this.webSocketBridge);
    clearInterval(this.socketChecker);
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
      // else if(this.webSocketBridge !== null && this.webSocketBridge.readyState === this.webSocketBridge.OPEN){
      //   console.log('web_socket_connected');
      // }
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
