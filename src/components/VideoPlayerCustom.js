import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Image,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {WebView} from 'react-native-webview';
import VideoPlayer from 'react-native-video-player';
import {createThumbnail} from 'react-native-create-thumbnail';
import YoutubePlayer from 'react-native-youtube-iframe';
import YouTube from 'react-native-youtube';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default class VideoPlayerCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrl: '',
      playing: false,
      isFullscreen: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.generateThumbnail(this.props.url);
    console.log('resr12312313313', this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url && nextProps.url !== this.props.url) {
      this.generateThumbnail(nextProps.url);
    }
  }

  generateThumbnail = (url) => {
    if (url.includes('youtube.com')) {
    } else {
      createThumbnail({
        url: url,
        timeStamp: 2000,
      })
        .then((response) => {
          console.log('res', response);
          this.setState({thumbnailUrl: response.path});
        })
        .catch((err) => console.log({err}));
    }
  };
  getAspectRatio = () => {};

  onStateChange = () => {
    if (state === 'ended') {
      this.setState({playing: false});
    }
  };

  getVideoId = (url) => {
    let video_id = '';
    if (url.includes('youtube.com')) {
      video_id = url.substring(url.lastIndexOf('/') + 1);
    }
    console.log('video_id', video_id);
    return video_id;
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      this.props.url === nextProps.url &&
      nextState.thumbnailUrl === this.state.thumbnailUrl
    )
      return false;
    else return true;
  };

  Main_Script = (video_id) => {
    return `<html>
    <style>
    /* html {
      overflow: hidden;
      background-color: black;
     }
     html,
     body,
     div,
     iframe {
       margin: 0px;
       padding: 0px;
       height: 100%;
       border: none;
       display: block;
       width: 100%;
       border: none;
       overflow: hidden;
       padding-bottom: 100;
     } */
     body {
      margin: 0;
      }
    .hytPlayerWrap{display: inline-block; position: relative;}
    .hytPlayerWrap.ended::after{content:""; position: absolute; top: 0; left: 0; bottom: 0; right: 0; cursor: pointer; background-color: black; background-repeat: no-repeat; background-position: center; background-size: 64px 64px; background-image: url(data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgNTEwIDUxMCI+PHBhdGggZD0iTTI1NSAxMDJWMEwxMjcuNSAxMjcuNSAyNTUgMjU1VjE1M2M4NC4xNSAwIDE1MyA2OC44NSAxNTMgMTUzcy02OC44NSAxNTMtMTUzIDE1My0xNTMtNjguODUtMTUzLTE1M0g1MWMwIDExMi4yIDkxLjggMjA0IDIwNCAyMDRzMjA0LTkxLjggMjA0LTIwNC05MS44LTIwNC0yMDQtMjA0eiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==);}
    .hytPlayerWrap.paused::after{content:""; position: absolute; top: 0px; left: 0; bottom: 0px; right: 0; cursor: pointer; background-color: black; background-repeat: no-repeat; background-position: center; background-size: 40px 40px; background-image: url(data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEiIHdpZHRoPSIxNzA2LjY2NyIgaGVpZ2h0PSIxNzA2LjY2NyIgdmlld0JveD0iMCAwIDEyODAgMTI4MCI+PHBhdGggZD0iTTE1Ny42MzUgMi45ODRMMTI2MC45NzkgNjQwIDE1Ny42MzUgMTI3Ny4wMTZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+);}
    </style>
    <head>
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
    </head>
    <body>
    <div class="hytPlayerWrapOuter"> 
      <div class="hytPlayerWrap">
      <iframe
        id="thisIframe"
        width="260" height="150"
        src="https://www.youtube.com/embed/jzD_yyEcp0M?rel=0&enablejsapi=1&playsinline=1&showInfo=0&controls=0&fullscreen=1"frameborder="0"allowfullscreen="true"></iframe>
        </div>
        </div>
    </body>
    <script>
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      var s = document.getElementById('thisIframe');
      s.src = "https://www.youtube.com/embed/${video_id}?rel=0&enablejsapi=1&playsinline=1&showInfo=0&controls=0&fullscreen=1";
      "use strict"; 
      document.addEventListener('DOMContentLoaded', function(){
        if (window.hideYTActivated) return; 
        let onYouTubeIframeAPIReadyCallbacks=[]; 
        for (let playerWrap of document.querySelectorAll(".hytPlayerWrap")){
          let playerFrame=playerWrap.querySelector("iframe"); 
          let tag=document.createElement('script'); 
          tag.src="https://www.youtube.com/iframe_api"; 
          let firstScriptTag=document.getElementsByTagName('script')[0]; 
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); 
          let onPlayerStateChange=function(event){
            if (event.data==YT.PlayerState.ENDED){
              playerWrap.classList.add("ended");
            }else if (event.data==YT.PlayerState.PAUSED){
              playerWrap.classList.add("paused");
            }else if (event.data==YT.PlayerState.PLAYING){
              playerWrap.classList.remove("ended"); 
              playerWrap.classList.remove("paused");
            }
          }; 
          let player; 
          onYouTubeIframeAPIReadyCallbacks.push(function(){
            player=new YT.Player(playerFrame,{
              events:{'onStateChange': onPlayerStateChange}
            });
          }); 
          playerWrap.addEventListener("click", function(){
            let playerState=player.getPlayerState(); 
            if (playerState==YT.PlayerState.ENDED){
              player.seekTo(0);
            }else if (playerState==YT.PlayerState.PAUSED){
              player.playVideo();
            }
          });
        }
        window.onYouTubeIframeAPIReady=function(){
          for (let callback of onYouTubeIframeAPIReadyCallbacks){
            callback();
          }
        }; 
        window.hideYTActivated=true;
      });
    </script>
    </html>`;
  };

  render() {
    const {url, width, height, thumbnailImage} = this.props;
    const {playing, isLoading, isFullscreen, thumbnailUrl,} = this.state;
    return (
      url.includes('youtube.com') ?
        <View style={{ height: 150, width: 260}}>
          {Platform.OS === 'ios' ?
            <YouTube
              videoId={this.getVideoId(url)} // The YouTube video ID
              play={false} // control playback of video with true/false
              fullscreen // control whether the video should play in fullscreen or inline
              loop // control whether the video should loop when ended
              onReady={e => this.setState({ isReady: true })}
              onChangeState={e => this.setState({ status: e.state })}
              onChangeQuality={e => this.setState({ quality: e.quality })}
              onError={e => this.setState({ error: e.error })}
              style={{ alignSelf: 'stretch', height: 150 }}
              origin={"https://youtube.com/"}
            />
            :
            <YoutubePlayer
              height={150}
              play={playing}
              videoId={this.getVideoId(url)}
              onChangeState={this.onStateChange}
              onError={(err) => {
                console.log('youtube err', err);
              }}
            />}

          {/* <WebView
            ref={this.webViewRef}
            allowsFullscreenVideo
            useWebKit
            // onLoad={this.webViewLoaded}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction
            javaScriptEnabled
            scrollEnabled={false}
            source={{
              html: this.Main_Script(this.getVideoId(url)),
              baseUrl: "https://youtube.com/"
            }}
            onShouldStartLoadWithRequest={request => {
              return request.mainDocumentURL === 'about:blank';
            }}
            /> */}
        </View>
        :
        <VideoPlayer
          video={{
            uri: url,
        }}
        // autoplay
        fullScreenOnLongPress
        videoWidth={width ? width : 1600}
        videoHeight={height ? height : 900}
        thumbnail={thumbnailUrl ? {uri: thumbnailUrl} : ''}
      />
    );
  }
}
