import React, {Component} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';

import {Colors} from '../../constants';
import {
  normalize,
} from '../../utils';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ScalableImage from '../ScalableImage';
import {createThumbnail} from 'react-native-create-thumbnail';

export default class VideoPreview extends Component{

    constructor(props){
        super(props);
        this.state = {
            preview_img: ''
        }
    }

    componentDidMount(){
        // console.log('video url',this.props.url);
        if(this.props.url){
            this.getThumbnailImageForVideo(this.props.url)
        }
    }

    getThumbnailImageForVideo = (url) => {
        createThumbnail({
          url: url,
          timeStamp: 2000,
        }).then((res)=>{
          this.setState({preview_img: res});
        });
      }

    render(){
        const {url, hideLink, customImageView} = this.props;
        const {preview_img} = this.state;
        return (
            preview_img ? customImageView ? 
                <Image
                    source={{
                        uri: preview_img.path,
                    }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode={'cover'}
                />
             : <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => { Linking.openURL(url) }}
                style={{
                    flex: 1,
                    marginBottom: 5,
                    backgroundColor: 'red'
                }}>
                <ScalableImage
                    src={preview_img.path}
                />
                <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#00000040', position: 'absolute', bottom: 0 }}>
                    {!hideLink && <Text style={{ flex: 1, color: 'white', fontSize: normalize(12) }} numberOfLines={2}>{url}</Text>}
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <FontAwesome name="play" size={15} color={Colors.white} />
                    </View>
                </View>
            </TouchableOpacity> : null
        );
    }
}