import React from 'react';
import {FlatList, Image, SafeAreaView, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../constants';
import {Images} from '../../constants/index';
import {translate} from '../../redux/reducers/languageReducer';
import styles from './styles';

export default class PostChannelCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }
  _renderItem = ({item}) => {
    return (
      <View style={styles.gridView}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ChannelInfo', {channelItem: item})
          }>
          {item.channel_picture ? (
            <Image
              defaultSource={Images.header_bg}
              style={styles.gridImageView}
              source={{uri: item.channel_picture}}
            />
          ) : (
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.5, y: 0.2}}
              locations={[0.1, 0.6, 1]}
              colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
              style={styles.squareImage}>
              <Text style={styles.channelName}>
                {item.channel_name[0].toUpperCase()}
              </Text>
            </LinearGradient>
          )}
          {item.channel_picture ? (
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
        </TouchableOpacity>
      </View>
    );
  };

  EmptyList = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>
          {translate('pages.xchat.noChannelFound')}
        </Text>
      </View>
    );
  };

  render() {
    const {posts, onLoad} = this.props;
    return (
      <SafeAreaView style={styles.Container}>
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          renderItem={this._renderItem}
          keyExtractor={(index) => index.toString()}
          numColumns={2}
          style={styles.listStyle}
          contentContainerStyle={styles.listContentContainerStyle}
          refreshing={onLoad}
          onRefresh={() => this.props.onRefresh()}
          onEndReachedThreshold={0.4}
          onEndReached={() => this.props.pagination(20)}
          ListEmptyComponent={this.EmptyList()}
        />
      </SafeAreaView>
    );
  }
}
