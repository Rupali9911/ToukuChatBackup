import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { Colors, Fonts, Images, Icons } from '../constants';
import { translate } from '../redux/reducers/languageReducer';
import ScalableImage from './ScalableImage';
import PostCardHeader from './PostCardHeader';

const { width, height } = Dimensions.get('window');

export default class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

  render() {
    const { menuItems, posts } = this.props;
    return posts.length ? (
      posts.map((post, index) => {
        return (
          <View
            style={{
              backgroundColor: Colors.white,
              marginVertical: 10,
              paddingVertical: 10,
            }}
          >
            <PostCardHeader menuItems={menuItems} post={post} />
            {post.media.image && post.media.image.length ? (
              <View style={{ margin: 5 }}>
                <ScalableImage src={post.media.image[0]} />
              </View>
            ) : null}
            <View style={{ marginHorizontal: '4%', marginVertical: 5 }}>
              <Text style={{ fontFamily: Fonts.light }}>
                {post.text ? post.text : post.mutlilanguage_message_body.en}
              </Text>
            </View>
          </View>
        );
      })
    ) : (
      <Text
        style={{
          fontFamily: Fonts.thin,
          fontSize: 12,
          marginTop: 20,
          textAlign: 'center',
        }}
      >
        {translate('pages.xchat.noTimelineFound')}
      </Text>
    );
  }
}

PostCard.propTypes = {
  menuItems: PropTypes.object,
};

PostCard.defaultProps = {
  menuItems: {},
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    height: height * 0.06,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: Platform.OS === 'ios' ? 0.3 : 0.2,
    borderBottomColor: Colors.gray_dark,
  },
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_1,
    fontFamily: Fonts.regular,
  },
});
