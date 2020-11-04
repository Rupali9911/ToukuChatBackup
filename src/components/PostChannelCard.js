import React, {Component} from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {translate} from '../redux/reducers/languageReducer';
import {Colors, Fonts} from '../constants';
import {Images} from '../constants/index';
import {globalStyles} from '../styles';
import {ListLoader} from './Loaders';
export default class PostChannelCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }
  _renderItem = ({item}) => (
    <View style={styles.gridView}>
      {item.channel_picture_thumb ? (
        <Image
          defaultSource={Images.header_bg}
          style={styles.gridImageView}
          source={{uri: item.channel_picture_thumb}}
        />
      ) : (
        <LinearGradient
          start={{x: 0.1, y: 0.7}}
          end={{x: 0.5, y: 0.2}}
          locations={[0.1, 0.6, 1]}
          colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
          style={styles.squareImage}>
          <Text
            style={{
              fontSize: 60,
              fontWeight: '400',
              color: 'white',
              fontFamily: Fonts.light,
            }}>
            {item.channel_name[0].toUpperCase()}
          </Text>
        </LinearGradient>
      )}
      {item.channel_picture_thumb ? (
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          style={styles.linearGradientVisible}>
          <Text style={[styles.gridImageText]}>{item.channel_name}</Text>
        </LinearGradient>
      ) : (
        <Text style={styles.textLinearGradient}>{item.channel_name} </Text>
      )}
    </View>
  );

  render() {
    const {posts, isTimeline} = this.props;
    return (
      <SafeAreaView style={styles.Container}>
        {posts.length > 0 ? (
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            style={{flex: 1}}
            contentContainerStyle={{margin: 5}}
          />
        ) : (
          <Text
            style={{
              fontFamily: Fonts.thin,
              fontSize: 12,
              marginTop: 20,
              textAlign: 'center',
            }}>
            {translate('pages.xchat.noChannelFound')}
          </Text>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  Container: {flex: 1},
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridView: {flex: 1, margin: 5, marginBottom: 5},
  gridImageView: {height: 175},
  gridImageText: {
    width: '100%',
    color: 'white',
    bottom: 0,
    padding: 5,
    fontFamily: Fonts.light,
  },
  squareImage: {
    height: 175,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradientVisible: {
    bottom: 0,
    height: 80,
    flexDirection: 'column-reverse',
    position: 'absolute',
    width: '100%',
  },
  textLinearGradient: {
    position: 'absolute',
    bottom: 0,
    padding: 5,
    color: 'white',
    fontFamily: Fonts.light,
  },
});
