import React, { Component, useEffect, useState } from 'react';
import { Image, View, Text, FlatList, InteractionManager } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CameraRoll from "@react-native-community/cameraroll";

//Local imports
import VideoPreview from '../VideoPreview';
import { Colors } from '../../constants';
import { normalize } from '../../utils';
import styles from './styles';
import CountCheckBox from '../CountCheckBox';


/**
 * Media picker for channels, friends and groups
 * @prop {array} media -  notes media object array such as : [{media_url: '',media_type: ''}]
 * @returns JSX
 */
const MediaPickerList = (props) => {
    
    const [media, setMedia] = useState([]);

    useEffect(()=>{
        InteractionManager.runAfterInteractions(()=>{
            CameraRoll.getPhotos({
                first: 1000,
                assetType: 'All'
            }).then((r) => {
                console.log('edges',JSON.stringify(r.edges));
                setMedia(r.edges);
            })
        })
    },[null]);

    const renderItem = ({item,index}) => {
        let selectedIndex = props.selectedMedia.findIndex((_) => _ === item.node.image.uri);
        return (
            <View style={[styles.itemContainer, styles.itemContainerSeparator]}>
                <Image
                    source={{ uri: item.node.image.uri }}
                    style={styles.image}
                    resizeMode={'cover'}
                />
                <View style={{position: 'absolute',backgroundColor:'#00000020',width:'100%',height:'100%'}}>
                    <CountCheckBox
                        count={selectedIndex + 1}
                        onCheck={props.onSelect.bind(null, item.node)}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={styles.list_container}
                data={media}
                numColumns={3}
                keyExtractor={(item,index)=>`${index}`}
                ItemSeparatorComponent={()=><View style={styles.separator}/>}
                renderItem={renderItem} />
        </View>
    );
}

export default MediaPickerList;