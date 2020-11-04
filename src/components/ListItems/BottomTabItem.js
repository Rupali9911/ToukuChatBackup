import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {connect} from 'react-redux';
import {Badge} from 'react-native-paper';

import {Colors} from '../../constants';
import {globalStyles} from '../../styles';

class BottomTabItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getBadgeCounts() {
    const {
      routeName,
      unreadFriendMsgsCounts,
      unreadGroupMsgsCounts,
      unreadChannelMsgsCounts,
      friendRequestCount,
    } = this.props;

    switch (routeName) {
      case 'Home':
        return friendRequestCount;
      case 'Chat':
        return (
          unreadFriendMsgsCounts +
          unreadGroupMsgsCounts +
          unreadChannelMsgsCounts
        );
      case 'Timeline':
        return 0;
      case 'Channel':
        return 0;
      case 'More':
        return 0;
      default:
        return 0;
    }
  }

  render() {
    const {
      title,
      titleColor,
      source,
      unreadFriendMsgsCounts,
      focused,
    } = this.props;
    return (
      <View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={source}
            style={[
              globalStyles.iconStyleTab,
              focused && {tintColor: Colors.yellow},
            ]}
          />
          <Text
            style={[
              globalStyles.smallLightTextTab,
              {color: titleColor || Colors.white, paddingTop: 5},
            ]}>
            {title}
          </Text>
          <Badge
            visible={this.getBadgeCounts() > 0}
            style={[
              globalStyles.smallLightText,
              {
                backgroundColor: Colors.green,
                color: Colors.white,
                fontSize: 11,
                position: 'absolute',
                top: -5,
                right: -6,
              },
            ]}>
            {this.getBadgeCounts()}
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
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BottomTabItem);
