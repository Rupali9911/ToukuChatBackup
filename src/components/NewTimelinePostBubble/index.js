import React, { Component } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import GridList from 'react-native-grid-list';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//Local imports
import VideoPreview from '../VideoPreview';
import { Colors } from '../../constants';
import { normalize } from '../../utils';
import styles from './styles';
import { ImageLoader } from '../Loaders';
import { translate } from '../../redux/reducers/languageReducer';
import LinearGradient from 'react-native-linear-gradient';


/**
 * New Timeline post bubble component
 * @prop {array} visible -  show or hide bubble
 * @prop {function} onPress - call api for new posts
 * @returns JSX
 */
const NewTimelinePostBubble = (props) => {
    const { visible,onPress } = props;
    
    return (
        visible ? 
            <TouchableOpacity style={styles.container} onPress={onPress || null}>
                <LinearGradient
                    start={{ x: 0.2, y: 0.7 }}
                    end={{ x: 0.95, y: 0.8 }}
                    locations={[0.1, 0.9, 1]}
                    colors={[
                        Colors.header_gradient_3,
                        Colors.header_gradient_2,
                        Colors.header_gradient_1,
                      ]}
                    style={styles.linearGradient}>
                    <Text style={styles.textStyle}>{translate('pages.xchat.newPost')}</Text>
                </LinearGradient>
            </TouchableOpacity>
        : null
    );
}

export default React.memo(NewTimelinePostBubble);