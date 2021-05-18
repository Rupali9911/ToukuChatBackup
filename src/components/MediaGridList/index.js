import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';
import GridList from 'react-native-grid-list';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//Local imports
import VideoPreview from '../VideoPreview';
import { Colors } from '../../constants';
import { normalize } from '../../utils';
import styles from './styles';


/**
 * Chat header for channels and groups
 * @prop {array} media -  notes media object array such as : [{media_url: '',media_type: ''}]
 * @returns JSX
 */
const MediaGridList = (props) => {
    const { media } = props;
    const media_to_show = [...media];
    media_to_show.length > 4 && media_to_show.splice(4);
    return (
        <View style={styles.container}>
            <GridList
                showSeparator={true}
                separatorBorderWidth={5}
                separatorBorderColor={'transparent'}
                data={media_to_show}
                numColumns={3}
                renderItem={({ item, index }) => {
                    return (
                        <>
                            {item.media_type && item.media_type.includes('image') ? (
                                <Image
                                    source={{ uri: item.media_url }}
                                    style={styles.image}
                                    resizeMode={'cover'}
                                />
                            ) : item.media_type && item.media_type.includes('video') ? (
                                    <View style={styles.videoContainer}>
                                        <VideoPreview
                                            url={item.media_url}
                                            customImageView
                                            hideLink
                                        />
                                        <View style={styles.videoIconContainer}>
                                            <View style={styles.playIcon}>
                                                <FontAwesome name="play" size={20} color={Colors.white} />
                                            </View>
                                        </View>
                                    </View>
                                ) : null}
                            {media.length > 4 && index == 3 &&
                                <View style={styles.countCounter}>
                                    <Text style={styles.count}>+{media.length - 4}</Text>
                                </View>
                            }
                        </>
                    );
                }} />
        </View>
    );
}

export default React.memo(MediaGridList);