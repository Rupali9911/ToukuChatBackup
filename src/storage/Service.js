import Realm from 'realm';
import {
  ChatConversation,
  UserFriends,
  ConversationUser,
  ChatConversationFriend,
  ChatConversationGroup,
  MessageBody,
  ReplyTo,
  Channels,
  ChannelLastConversation,
  Groups,
  GroupsLastConversation,
  FriendRequest,
  EventDetail,
} from './Schema';

const DB_SCHEMAS = [
  ChatConversation,
  UserFriends,
  ConversationUser,
  ChatConversationFriend,
  ChatConversationGroup,
  MessageBody,
  ReplyTo,
  Channels,
  ChannelLastConversation,
  Groups,
  GroupsLastConversation,
  FriendRequest,
  EventDetail,
];

const DB_SCHEMA_VERSION = 1;
exports.DB_SCHEMAS = DB_SCHEMAS;
exports.DB_SCHEMA_VERSION = DB_SCHEMA_VERSION;
const realm = new Realm({
  path: 'ToukuDB.realm',
  schema: DB_SCHEMAS,
  schemaVersion: DB_SCHEMA_VERSION,
});

export const resetData = () => {
  realm.write(() => {
    realm.deleteAll();
  });
};

//#region Channel Services
export const setChannelChatConversation = (conversation) => {
  for (let item of conversation) {
    var obj = realm.objects('chat_conversation').filtered('id =' + item.id);
    if (obj.length > 0) {
      realm.write(() => {
        realm.create(
          'chat_conversation',
          {
            bonus_message: item.bonus_message,
            channel: item.channel,
            created: item.created,
            deleted_for: item.deleted_for,
            from_user: item.from_user,
            greeting: item.greeting,
            hyperlink: item.hyperlink,
            id: item.id,
            is_edited: item.is_edited,
            is_multilanguage: item.is_multilanguage,
            is_read: item.is_read,
            is_unsent: item.is_unsent,
            message_body: item.message_body,
            msg_type: item.msg_type,
            // mutlilanguage_message_body: [Object],
            read_by: item.read_by,
            read_by_in_replies: item.read_by_in_replies,
            // replies_is_read: null,
            reply_to: item.reply_to,
            schedule_post: item.schedule_post ? item.schedule_post : 0,
            subchat: item.subchat,
            thumbnail: item.thumbnail ? item.thumbnail : null,
            to_user: item.to_user,
            updated: item.updated,
          },
          'modified',
        );
      });
    } else {
      realm.write(() => {
        realm.create('chat_conversation', {
          bonus_message: item.bonus_message,
          channel: item.channel,
          created: item.created,
          deleted_for: item.deleted_for,
          from_user: item.from_user,
          greeting: item.greeting,
          hyperlink: item.hyperlink,
          id: item.id,
          is_edited: item.is_edited,
          is_multilanguage: item.is_multilanguage,
          is_read: item.is_read,
          is_unsent: item.is_unsent,
          message_body: item.message_body,
          msg_type: item.msg_type,
          // mutlilanguage_message_body: [Object],
          read_by: item.read_by,
          read_by_in_replies: item.read_by_in_replies,
          // replies_is_read: null,
          reply_to: item.reply_to,
          schedule_post: item.schedule_post ? item.schedule_post : 0,
          subchat: item.subchat,
          thumbnail: item.thumbnail ? item.thumbnail : null,
          to_user: item.to_user,
          updated: item.updated,
        });
      });
    }
  }
};

export const getChannelChatConversation = () => {
  return realm.objects('chat_conversation');
};

export const getChannelChatConversationById = (id) => {
  return realm
    .objects('chat_conversation')
    .sorted('created', {ascending: true})
    .filtered(`channel == ${id}`);
};

export const updateMessageById = (id, text, type) => {
  realm.write(() => {
    realm.create('chat_conversation', {id: id, message_body: text}, 'modified');
  });
};

export const updateReadByChannelId = (id) => {
  let results = realm.objects('chat_conversation').filtered(`channel == ${id}`);

  for (let chat of results) {
    realm.write(() => {
      realm.create(
        'chat_conversation',
        {id: chat.id, is_read: true},
        'modified',
      );
    });
  }
};

export const deleteMessageById = async (id) => {
  var message = realm.objects('chat_conversation').filtered(`id == ${id}`);

  await realm.write(() => {
    realm.delete(message);
  });
};

export const setMessageUnsend = async (id) => {
  await realm.write(() => {
    realm.create(
      'chat_conversation',
      {id: id, message_body: '', is_unsent: true},
      'modified',
    );
  });
};
//#endregion

//#region Friend Services
export const setFriendChatConversation = (conversation) => {
  for (let item of conversation) {
    var obj = realm
      .objects('chat_conversation_friend')
      .filtered('id =' + item.id);
    if (item.id) {
      if (obj.length > 0) {
        realm.write(() => {
          realm.create(
            'chat_conversation_friend',
            {
              created: item.created,
              deleted_for: item.deleted_for,
              friend: item.friend,
              from_user: item.from_user,
              id: item.id,
              is_edited: item.is_edited,
              is_read: item.is_read,
              is_unsent: item.is_unsent,
              local_id: item.local_id,
              message_body: item.message_body,
              msg_type: item.msg_type,
              reply_to: item.reply_to,
              thumbnail: item.thumbnail,
              to_user: item.to_user,
              updated: item.updated,
            },
            'modified',
          );
        });
      } else {
        realm.write(() => {
          realm.create('chat_conversation_friend', {
            created: item.created,
            deleted_for: item.deleted_for,
            friend: item.friend,
            from_user: item.from_user,
            id: item.id,
            is_edited: item.is_edited,
            is_read: item.is_read,
            is_unsent: item.is_unsent,
            local_id: item.local_id,
            message_body: item.message_body,
            msg_type: item.msg_type,
            reply_to: item.reply_to,
            thumbnail: item.thumbnail,
            to_user: item.to_user,
            updated: item.updated,
          });
        });
      }
    }
  }
};

export const getFriendChatConversation = () => {
  return realm.objects('chat_conversation_friend');
};

export const getFriendChatConversationById = (id) => {
  return realm
    .objects('chat_conversation_friend')
    .sorted('created', {ascending: true})
    .filtered(`friend == ${id}`);
};

export const updateFriendMessageById = (id, text, type) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_friend',
      {id: id, message_body: text},
      'modified',
    );
  });
};

export const deleteFriendMessageById = async (id) => {
  var message = realm
    .objects('chat_conversation_friend')
    .filtered(`id == ${id}`);

  await realm.write(() => {
    realm.delete(message);
  });
};

export const setFriendMessageUnsend = (id) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_friend',
      {id: id, message_body: '', is_unsent: true},
      'modified',
    );
  });
};

export const updateAllFriendMessageRead = (friend) => {
  var results = realm
    .objects('chat_conversation_friend')
    .sorted('created', {ascending: true})
    .filtered(`friend == ${friend}`);

  for (let chat of results) {
    realm.write(() => {
      realm.create(
        'chat_conversation_friend',
        {id: chat.id, is_read: true},
        'modified',
      );
    });
  }
};
//#endregion

//#region Group Services
export const setGroupChatConversation = (conversation) => {
  for (let item of conversation) {
    var obj = realm
      .objects('chat_conversation_group')
      .filtered('msg_id =' + item.msg_id);
    if (obj.length > 0) {
      // alert('matching friend');
      realm.write(() => {
        realm.create(
          'chat_conversation_group',
          {
            msg_id: item.msg_id,
            sender_id: item.sender_id,
            group_id: item.group_id,
            sender_username: item.sender_username,
            sender_display_name: item.sender_display_name,
            sender_picture: item.sender_picture,
            message_body: item.message_body,
            is_edited: item.is_edited,
            is_unsent: item.is_unsent,
            timestamp: item.timestamp,
            reply_to: item.reply_to,
            mentions: item.mentions
              ? item.mentions instanceof Object
                ? []
                : item.mentions
              : [],
            read_count: item.read_count ? item.read_count : 0,
            created: item.created,
          },
          'modified',
        );
      });
    } else {
      realm.write(() => {
        realm.create('chat_conversation_group', {
          msg_id: item.msg_id,
          sender_id: item.sender_id,
          group_id: item.group_id,
          sender_username: item.sender_username,
          sender_display_name: item.sender_display_name,
          sender_picture: item.sender_picture,
          message_body: item.message_body,
          is_edited: item.is_edited,
          is_unsent: item.is_unsent,
          timestamp: item.timestamp,
          reply_to: item.reply_to,
          mentions: item.mentions
            ? item.mentions instanceof Object
              ? []
              : item.mentions
            : [],
          read_count: item.read_count ? item.read_count : 0,
          created: item.created,
        });
      });
    }
  }
};

export const getGroupChatConversation = () => {
  return realm.objects('chat_conversation_group');
};

export const getGroupChatConversationById = (id) => {
  return realm
    .objects('chat_conversation_group')
    .sorted('timestamp', {ascending: true})
    .filtered(`group_id == ${id}`);
};

export const updateGroupMessageById = (id, body) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_group',
      {msg_id: id, message_body: body},
      'modified',
    );
  });
};

export const deleteGroupMessageById = (id) => {
  var message = realm
    .objects('chat_conversation_group')
    .filtered(`msg_id == ${id}`);

  realm.write(() => {
    realm.delete(message);
  });
};

export const deleteAllGroupMessageByGroupId = (group_id) => {
  var results = realm
    .objects('chat_conversation_group')
    .filtered(`group_id == ${group_id}`);

  realm.write(() => {
    realm.delete(results);
  });
};

export const setGroupMessageUnsend = (id) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_group',
      {msg_id: id, message_body: null, is_unsent: true},
      'modified',
    );
  });
};
//#endregion

//#region Channels List
export const setChannels = (channels) => {
  // console.log('realm insert data', channels);
  for (let item of channels) {
    var obj = realm.objects('channels').filtered('id=' + item.id);
    if (obj.length > 0) {
      realm.write(() => {
        realm.create(
          'channels',
          {
            id: item.id,
            name: item.name,
            unread_msg: item.unread_msg,
            total_members: item.total_members,
            description: item.description,
            chat: item.chat,
            channel_picture: item.channel_picture,
            last_msg: item.last_msg,
            is_pined: item.is_pined ? item.is_pined : false,
            created: item.created,
            joining_date: item.joining_date,
          },
          'modified',
        );
      });
    } else {
      realm.write(() => {
        realm.create('channels', {
          id: item.id,
          name: item.name,
          unread_msg: item.unread_msg,
          total_members: item.total_members,
          description: item.description,
          chat: item.chat,
          channel_picture: item.channel_picture,
          last_msg: item.last_msg,
          is_pined: item.is_pined ? item.is_pined : false,
          created: item.created,
          joining_date: item.joining_date,
        });
      });
    }
  }
};

export const getChannels = () => {
  return realm
    .objects('channels')
    .sorted('last_msg.updated', {ascending: false});
};

export const getChannelsById = (id) => {
  return realm
    .objects('channels')
    .sorted('created', {ascending: true})
    .filtered(`id == ${id}`);
};

export const updateChannelLastMsgWithOutCount = (id, message) => {
  console.log('last_msg_update');
  var last_msg = {
    bonus_message: message.bonus_message,
    channel: message.channel,
    created: message.created,
    deleted_for: message.deleted_for,
    from_user: message.from_user.id,
    greeting: message.greeting,
    hyperlink: message.hyperlink,
    id: message.id,
    is_edited: message.is_edited,
    is_multilanguage: message.is_multilanguage,
    is_read: message.is_read,
    is_unsent: message.is_unsent,
    message_body: message.message_body,
    msg_type: message.msg_type,
    read_by: message.read_by,
    read_by_in_replies: message.read_by_in_replies,
    reply_to: message.reply_to,
    schedule_post: message.schedule_post,
    subchat: message.subchat,
    thumbnail: message.thumbnail,
    to_user: message.to_user ? message.to_user.id : null,
    updated: message.updated,
  };

  realm.write(() => {
    realm.create(
      'channels',
      {
        id: id,
        last_msg: last_msg,
      },
      'modified',
    );
  });
};

export const updateChannelLastMsg = (id, message, unreadCount) => {
  console.log('last_msg_update');
  var last_msg = {
    bonus_message: message.bonus_message,
    channel: message.channel,
    created: message.created,
    deleted_for: message.deleted_for,
    from_user: message.from_user.id,
    greeting: message.greeting,
    hyperlink: message.hyperlink,
    id: message.id,
    is_edited: message.is_edited,
    is_multilanguage: message.is_multilanguage,
    is_read: message.is_read,
    is_unsent: message.is_unsent,
    message_body: message.message_body,
    msg_type: message.msg_type,
    read_by: message.read_by,
    read_by_in_replies: message.read_by_in_replies,
    reply_to: message.reply_to,
    schedule_post: message.schedule_post,
    subchat: message.subchat,
    thumbnail: message.thumbnail,
    to_user: message.to_user ? message.to_user.id : null,
    updated: message.updated,
  };

  var channel = realm.objects('channels').filtered(`id == ${id}`);
  var array = [];
  for (let c of channel) {
    array = [...array, c];
  }

  if (array.length > 0) {
    if (array[0].last_msg !== null && array[0].last_msg.id !== message.id) {
      realm.write(() => {
        realm.create(
          'channels',
          {
            id: id,
            last_msg: last_msg,
            unread_msg: unreadCount,
          },
          'modified',
        );
      });
    } else if (array[0].last_msg == null) {
      realm.write(() => {
        realm.create(
          'channels',
          {
            id: id,
            last_msg: last_msg,
            unread_msg: unreadCount,
          },
          'modified',
        );
      });
    }
  }
};

export const updateChannelTotalMember = (id, total_member) => {
  realm.write(() => {
    realm.create('channels', {id: id, total_member: total_member}, 'modified');
  });
};

export const updateChannelDetails = (id, data) => {
  realm.write(() => {
    realm.create(
      'channels',
      {
        id: id,
        channel_picture: data.channel_picture,
        description: data.description,
        name: data.name,
      },
      'modified',
    );
  });
};

export const updateChannelUnReadCountById = (id, unread_msg) => {
  realm.write(() => {
    realm.create('channels', {id: id, unread_msg: unread_msg}, 'modified');
  });
};

export const deleteChannelById = (id) => {
  var message = realm.objects('channels').filtered(`id == ${id}`);

  realm.write(() => {
    realm.delete(message);
  });
};
//#endregion

export const deleteChannelConversationById = (id) => {
  var channel = realm.objects('chat_conversation').filtered(`channel == ${id}`);
  for (let c of channel) {
    realm.write(() => {
      realm.delete(c);
    });
  }
};

//#region Groups List
export const setGroups = async (channels) => {
  //console.log('realm insert data', channels);
  var checkObject = {};
  for (let item of channels) {
    var obj = realm.objects('groups').filtered('group_id=' + item.group_id);
    if (obj.length > 0) {
      //console.log('setGroups -> obj', obj);
      await realm.write(() => {
        realm.create(
          'groups',
          {
            group_id: item.group_id,
            group_name: item.group_name,
            unread_msg: item.unread_msg,
            total_members: item.total_members,
            description: item.description,
            chat: item.chat,
            group_picture: item.group_picture,
            last_msg: item.last_msg,
            last_msg_id: item.last_msg_id ? item.last_msg_id : null,
            timestamp: item.timestamp,
            event: item.event,
            no_msgs: item.no_msgs,
            is_pined: item.is_pined ? item.is_pined : false,
            sender_id: item.sender_id ? item.sender_id : null,
            sender_username: item.sender_username,
            sender_display_name: item.sender_display_name,
            mentions: item.mentions
              ? item.mentions instanceof Object
                ? []
                : item.mentions
              : [],
            reply_to: item.reply_to,
            joining_date: item.joining_date,
          },
          'modified',
        );
      });
    } else {
      await realm.write(() => {
        realm.create('groups', {
          group_id: item.group_id,
          group_name: item.group_name,
          unread_msg: item.unread_msg,
          total_members: item.total_members,
          description: item.description,
          chat: item.chat,
          group_picture: item.group_picture,
          last_msg: item.last_msg,
          last_msg_id: item.last_msg_id ? item.last_msg_id : null,
          timestamp: item.timestamp,
          event: item.event,
          no_msgs: item.no_msgs,
          is_pined: item.is_pined ? item.is_pined : false,
          sender_id: item.sender_id ? item.sender_id : null,
          sender_username: item.sender_username,
          sender_display_name: item.sender_display_name,
          mentions: item.mentions
            ? item.mentions instanceof Object
              ? []
              : item.mentions
            : [],
          reply_to: item.reply_to,
          joining_date: item.joining_date,
        });
      });
    }
  }
};

export const getGroups = () => {
  return realm.objects('groups').sorted('timestamp', {ascending: false});
};

export const getGroupsById = (id) => {
  return realm
    .objects('groups')
    .sorted('timestamp', {ascending: true})
    .filtered(`group_id == ${id}`);
};

export const deleteGroupById = (id) => {
  var message = realm.objects('groups').filtered(`group_id == ${id}`);

  realm.write(() => {
    realm.delete(message);
  });
};

export const UpdateGroupDetail = (
  id,
  group_name,
  group_picture,
  total_members,
) => {
  realm.write(() => {
    realm.create(
      'groups',
      {
        group_id: id,
        group_name: group_name,
        group_picture: group_picture,
        total_members: total_members,
      },
      'modified',
    );
  });
};

export const updateLastMsgGroups = (id, message, unreadCount) => {
  let last_msg = {
    type: message.message_body.type,
    text: message.message_body.text,
  };
  realm.write(() => {
    realm.create(
      'groups',
      {
        group_id: id,
        last_msg: last_msg,
        last_msg_id: message.msg_id,
        unread_msg: unreadCount,
        timestamp: message.timestamp,
      },
      'modified',
    );
  });
};

export const updateLastMsgGroupsWithoutCount = (
  id,
  type,
  text,
  last_msg_id,
  timestamp,
) => {
  let last_msg = {
    type: type,
    text: text,
  };
  realm.write(() => {
    realm.create(
      'groups',
      {
        group_id: id,
        last_msg: last_msg,
        last_msg_id: last_msg_id,
        timestamp: timestamp,
      },
      'modified',
    );
  });
};

export const updateUnReadCount = (id, unreadCount) => {
  realm.write(() => {
    realm.create(
      'groups',
      {
        group_id: id,
        unread_msg: unreadCount,
      },
      'modified',
    );
  });
};

export const setGroupLastMessageUnsend = (id) => {
  realm.write(() => {
    realm.create(
      'groups',
      {group_id: id, last_msg: null, is_unsent: true},
      'modified',
    );
  });
};
//#endregion

//#region User friends

export const setUserFriendsFromApi = (friends) => {
  return new Promise((resolve) => {
    for (let i = 0; i < friends.length; i++) {
      let item = friends[i];
      var obj = realm
        .objects('user_friends')
        .filtered('user_id =' + item.user_id);
      if (obj.length > 0) {
        // alert('matching friend');
        realm.write(() => {
          realm.create(
            'user_friends',
            {
              user_id: item.user_id,
              friend: item.friend,
              unread_msg: item.unread_msg,
              last_msg_id: item.last_msg_id,
              username: item.username,
              avatar: item.avatar,
              profile_picture: item.profile_picture,
              background_image: item.background_image,
              last_msg: item.last_msg ? item.last_msg : '',
              last_msg_type: item.last_msg_type,
              display_name: item.display_name,
              isChecked: false,
              is_online: item.is_online,
              is_typing: false,
              timestamp: item.timestamp,
            },
            'modified',
          );
        });
      } else {
        realm.write(() => {
          realm.create('user_friends', {
            user_id: item.user_id,
            friend: item.friend,
            unread_msg: item.unread_msg,
            last_msg_id: item.last_msg_id,
            username: item.username,
            avatar: item.avatar,
            profile_picture: item.profile_picture,
            background_image: item.background_image,
            last_msg: item.last_msg ? item.last_msg : '',
            last_msg_type: item.last_msg_type,
            display_name: item.display_name,
            isChecked: false,
            is_online: item.is_online,
            is_typing: false,
            timestamp: item.timestamp,
          });
        });
      }
      if (i >= friends.length - 1) {
        resolve();
      }
    }
  });
};

export const getLocalUserFriends = () => {
  return realm.objects('user_friends').sorted('timestamp', {ascending: false});
};

export const getLocalUserFriend = (id) => {
  return realm
    .objects('user_friends')
    .sorted('timestamp', {ascending: true})
    .filtered(`user_id == ${id}`);
};

export const handleRequestAccept = (item) => {
  var obj = realm.objects('user_friends').filtered('user_id=' + item.user_id);
  if (obj.length > 0) {
    realm.write(() => {
      realm.create(
        'user_friends',
        {user_id: item.user_id, unread_msg: 1},
        'modified',
      );
    });
  } else {
    realm.write(() => {
      realm.create('user_friends', {
        user_id: item.user_id,
        friend: item.friend,
        unread_msg: 1,
        last_msg_id: item.last_msg_id,
        username: item.username,
        avatar: item.avatar,
        profile_picture: item.profile_picture,
        background_image: item.background_image,
        last_msg: item.last_msg ? item.last_msg : '',
        last_msg_type: item.last_msg_type,
        display_name: item.display_name,
        isChecked: false,
        is_online: item.is_online,
        is_typing: false,
        timestamp: item.timestamp,
      });
    });
  }
};

export const updateFriendOnlineStatus = (id, status) => {
  realm.write(() => {
    realm.create(
      'user_friends',
      {
        user_id: id,
        is_online: status,
      },
      'modified',
    );
  });
};

export const updateFriendAvtar = (id, data) => {
  realm.write(() => {
    realm.create(
      'user_friends',
      {
        user_id: id,
        avatar: data.avatar,
        display_name: data.display_name,
        username: data.username,
      },
      'modified',
    );
  });
};

export const updateFriendTypingStatus = (id, status) => {
  console.log('status_typing_update', status);
  realm.write(() => {
    realm.create(
      'user_friends',
      {
        user_id: id,
        is_typing: status,
      },
      'modified',
    );
  });
};

export const removeUserFriends = async (id) => {
  var user = realm.objects('user_friends').filtered(`user_id == ${id}`);

  await realm.write(() => {
    realm.delete(user);
  });
};

export const updateFriendsUnReadCount = (id, unreadCount) => {
  var user = realm.objects('user_friends').filtered(`friend == ${id}`);
  var items = [];
  user.map((item) => {
    items.push(item);
  });

  realm.write(() => {
    realm.create(
      'user_friends',
      {
        user_id: items[0].user_id,
        unread_msg: unreadCount,
      },
      'modified',
    );
  });
};

export const updateFriendLastMsgWithoutCount = async (id, message) => {
  // var user = realm.objects('user_friends').filtered(`user_id == ${id}`);

  await realm.write(() => {
    realm.create(
      'user_friends',
      {
        user_id: id,
        last_msg_id: message.id,
        last_msg: message.message_body ? message.message_body : '',
        last_msg_type: message.msg_type,
        timestamp: message.created,
      },
      'modified',
    );
  });
};

export const updateFriendLastMsg = (id, message, updateCount) => {
  var user = realm.objects('user_friends').filtered(`user_id == ${id}`);

  var items = [];
  user.map((item) => {
    items.push(item);
  });

  if (items[0].last_msg_id !== message.id) {
    realm.write(() => {
      realm.create(
        'user_friends',
        {
          user_id: id,
          unread_msg: updateCount
            ? items[0].unread_msg + 1
            : items[0].unread_msg,
          last_msg_id: message.id,
          last_msg: message.message_body ? message.message_body : '',
          last_msg_type: message.msg_type,
          timestamp: message.created,
        },
        'modified',
      );
    });
  }
};
//#endregion

//#region Friend Request
export const setFriendRequests = (requests) => {
  for (let item of requests) {
    var obj = realm
      .objects('friend_reuqest')
      .filtered('from_user_id=' + item.from_user_id);
    if (obj.length > 0) {
      // update schema if require
    } else {
      realm.write(() => {
        realm.create('friend_reuqest', {
          from_user_id: item.from_user_id,
          from_user_display_name: item.from_user_display_name,
          from_user_username: item.from_user_username,
          from_user_avatar: item.from_user_avatar,
          created: item.created,
        });
      });
    }
  }
};

export const getLocalFriendRequests = () => {
  return realm.objects('friend_reuqest').sorted('created', {ascending: true});
};

export const getLocalFriendRequest = (id) => {
  return realm
    .objects('friend_reuqest')
    .sorted('created', {ascending: true})
    .filtered(`from_user_id == ${id}`);
};

export const deleteFriendRequest = async (id) => {
  var user = realm.objects('friend_reuqest').filtered(`from_user_id == ${id}`);

  await realm.write(() => {
    realm.delete(user);
  });
};

export const updateLastEventId = (item) => {
  var obj = realm.objects('event').filtered(`id == 1`);
  // console.log('obj', obj)
  if (obj.length > 0) {
    realm.write(() => {
      realm.create('event', {id: 1, socket_event_id: item}, 'modified');
    });
  } else {
    realm.write(() => {
      realm.create('event', {
        id: 1,
        socket_event_id: item,
      });
    });
  }
};

export const updateGroupnReadCount = (id, read_count) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_group',
      {
        msg_id: id,
        read_count: read_count,
      },
      'modified',
    );
  });
};

export const isEventIdExists = () => {
  var obj = realm.objects('event').filtered(`id == 1`);
  return obj.length > 0;
};

export const getLastEventId = () => {
  return realm.objects('event').filtered(`id == 1`);
};

export const getUserFriendByFriendId = (id) => {
  return realm.objects('user_friends').filtered(`friend == ${id}`);
};
//#endregion
