// Libaray imports
import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import {Badge} from 'react-native-paper';
import {connect} from 'react-redux';

// Local imports
import {Colors} from '../../../constants';
import {globalStyles} from '../../../styles';

// StyleSheet import
import styles from './styles';

/**
 * Bottom tab item component
 */
class BottomTabItem extends Component {
  handleBadgeCounts() {
    const {
      routeName,
      unreadFriendMsgsCounts,
      unreadGroupMsgsCounts,
      unreadChannelMsgsCounts,
      friendRequestCount,
      acceptedRequestCount,
    } = this.props;

    switch (routeName) {
      case 'Home':
        return friendRequestCount + acceptedRequestCount;
      case 'Chat':
        return (
          unreadFriendMsgsCounts +
          unreadGroupMsgsCounts +
          unreadChannelMsgsCounts
        );
      case 'Timeline':
      case 'Channel':
      case 'More':
        return 0;
      default:
        return 0;
    }
  }

  render() {
    const {title, titleColor, source, focused} = this.props;

    const titleStyle = [
      globalStyles.smallLightTextTab,
      styles.titleText,
      {
        color: titleColor || Colors.white,
      },
    ];

    return (
      <View>
        <View style={styles.container}>
          <Image
            source={source}
            style={[
              globalStyles.iconStyleTab,
              focused && {tintColor: Colors.yellow},
            ]}
          />
          <Text numberOfLines={1} style={titleStyle}>
            {title}
          </Text>
          <Badge
            visible={this.handleBadgeCounts() > 0}
            style={[globalStyles.smallLightText, styles.badgeStyle]}>
            {this.handleBadgeCounts() > 99 ? '99+' : this.handleBadgeCounts()}
          </Badge>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    unreadFriendMsgsCounts: state.friendReducer.unreadFriendMsgsCounts,
    unreadGroupMsgsCounts: state.groupReducer.unreadGroupMsgsCounts,
    unreadChannelMsgsCounts: state.channelReducer.unreadChannelMsgsCounts,
    friendRequestCount: state.addFriendReducer.friendRequest.length,
    acceptedRequestCount: state.addFriendReducer.acceptedRequest.length,
  };
};

export default connect(mapStateToProps, null)(BottomTabItem);
