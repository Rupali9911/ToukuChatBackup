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
  GroupsLastConversation
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
  GroupsLastConversation
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
  realm.write(()=>{
    realm.deleteAll();
  })
}

//Channel Services
export const setChannelChatConversation = (conversation) => {
  for (let item of conversation) {
    var obj = realm.objects('chat_conversation').filtered('id =' + item.id);
    if (obj.length > 0) {
      // alert('matching friend');
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
    .sorted('updated', { ascending: true })
    .filtered(`channel == ${id}`);
};

export const updateMessageById = (id, text, type) => {
  realm.write(() => {
    realm.create(
      'chat_conversation',
      { id: id, message_body: text },
      'modified'
    );
  });
};

export const deleteMessageById = (id) => {
  var message = realm.objects('chat_conversation').filtered(`id == ${id}`);

  realm.write(() => {
    realm.delete(message);
  });
};

export const setMessageUnsend = (id) => {
  realm.write(() => {
    realm.create(
      'chat_conversation',
      { id: id, message_body: '', is_unsent: true },
      'modified'
    );
  });
};

//Friend Services
export const setFriendChatConversation = (conversation) => {
  for (let item of conversation) {
    var obj = realm
      .objects('chat_conversation_friend')
      .filtered('id =' + item.id);
    if (obj.length > 0) {
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
};

export const getFriendChatConversation = () => {
  return realm.objects('chat_conversation_friend');
};

export const getFriendChatConversationById = (id) => {
  return realm
    .objects('chat_conversation_friend')
    .sorted('updated', { ascending: true })
    .filtered(`friend == ${id}`);
};

export const updateFriendMessageById = (id, text, type) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_friend',
      { id: id, message_body: text },
      'modified'
    );
  });
};

export const deleteFriendMessageById = (id) => {
  var message = realm
    .objects('chat_conversation_friend')
    .filtered(`id == ${id}`);

  realm.write(() => {
    realm.delete(message);
  });
};

export const setFriendMessageUnsend = (id) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_friend',
      { id: id, message_body: '', is_unsent: true },
      'modified'
    );
  });
};

//Group Services
export const setGroupChatConversation = (conversation) => {
  for (let item of conversation) {
    var obj = realm.objects('chat_conversation_group').filtered('msg_id =' + item.msg_id);
    if (obj.length > 0) {
      // alert('matching friend');
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
          mentions: item.mentions,
          read_count: item.read_count?item.read_count:0,
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
    .sorted('timestamp', { ascending: true })
    .filtered(`group_id == ${id}`);
};

export const updateGroupMessageById = (id, body) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_group',
      { msg_id: id, message_body: body },
      'modified'
    );
  });
};

export const deleteGroupMessageById = (id) => {
  var message = realm.objects('chat_conversation_group').filtered(`msg_id == ${id}`);

  realm.write(() => {
    realm.delete(message);
  });
};

export const setGroupMessageUnsend = (id) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_group',
      { msg_id: id, message_body: null, is_unsent: true },
      'modified'
    );
  });
};


//Channels List
export const setChannels = (channels) => {
  // console.log('realm insert data',channels);
  for (let item of channels) {
    var obj = realm.objects('channels').filtered('id=' + item.id);
    if (obj.length > 0) {
      realm.write(() => {
        realm.create(
          'channels', {
            id: item.id,
            name: item.name,
            unread_msg: item.unread_msg,
            total_members: item.total_members,
            description: item.description,
            chat: item.chat,
            channel_picture: item.channel_picture,
            last_msg: item.last_msg,
            is_pined: item.is_pined,
            created: item.created,
          },
          'modified'
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
          is_pined: item.is_pined,
          created: item.created,
        });
      });
    }
  }
};

export const getChannels = () => {
  return realm.objects('channels')
  .sorted('last_msg.updated', { ascending: false });
};

export const getChannelsById = (id) => {
  return realm
    .objects('channels')
    .sorted('created', { ascending: true })
    .filtered(`id == ${id}`);
};

export const updateChannelLastMsg = (id, message, unreadCount) => {

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
    to_user: message.to_user?message.to_user.id:null,
    updated: message.updated,
  }

  realm.write(() => {
    realm.create(
      'channels',
      {
        id: id,
        last_msg: last_msg
      },
      'modified'
    );
  });
}

export const updateChannelTotalMember = (id) => {

}

export const updateChannelUnReadCountById = (id, unread_msg) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_group',
      { msg_id: id, unread_msg: unread_msg },
      'modified'
    );
  });
};

//Groups List
export const setGroups = (channels) => {
  // console.log('realm insert data',channels);
  var checkObject = {};
  for (let item of channels) {
    var obj = realm.objects('groups').filtered('group_id=' + item.group_id);
    if (obj.length > 0) {
      realm.write(() => {
        realm.create('groups', {
          group_id: item.group_id,
          group_name: item.group_name,
          unread_msg: item.unread_msg,
          total_members: item.total_members,
          description: item.description,
          chat: item.chat,
          group_picture: item.group_picture,
          last_msg: item.last_msg,
          last_msg_id: item.last_msg_id?item.last_msg_id:null,
          timestamp: item.timestamp,
          event: item.event,
          no_msgs: item.no_msgs,
          is_pined: item.is_pined,
          sender_id: item.sender_id?item.sender_id:null,
          sender_username: item.sender_username,
          sender_display_name: item.sender_display_name,
          mentions: (item.mentions instanceof Object)?[]:item.mentions,
          reply_to: item.reply_to
        },'modified');
      });
    } else {
      realm.write(() => {
        realm.create('groups', {
          group_id: item.group_id,
          group_name: item.group_name,
          unread_msg: item.unread_msg,
          total_members: item.total_members,
          description: item.description,
          chat: item.chat,
          group_picture: item.group_picture,
          last_msg: item.last_msg,
          last_msg_id: item.last_msg_id?item.last_msg_id:null,
          timestamp: item.timestamp,
          event: item.event,
          no_msgs: item.no_msgs,
          is_pined: item.is_pined,
          sender_id: item.sender_id?item.sender_id:null,
          sender_username: item.sender_username,
          sender_display_name: item.sender_display_name,
          mentions: (item.mentions instanceof Object)?[]:item.mentions,
          reply_to: item.reply_to
        });
      });
    }
  }
};

export const getGroups = () => {
  return realm.objects('groups')
  .sorted('timestamp', { ascending: false });
};

export const getGroupsById = (id) => {
  return realm
    .objects('groups')
    .sorted('timestamp', { ascending: true })
    .filtered(`id == ${id}`);
};

export const updateLastMsgGroups = (id, message, unreadCount) => {
  let last_msg = {
    type: message.message_body.type,
    text: message.message_body.text
  }
  realm.write(() => {
    realm.create(
      'groups',
      {
        group_id: id,
        last_msg: last_msg,
        last_msg_id: message.msg_id,
        unread_msg: unreadCount,
        timestamp: message.timestamp
      },
      'modified'
    );
  });
}

export const updateUnReadCount = (id,unreadCount) => {
  realm.write(() => {
    realm.create(
      'groups',
      {
        group_id: id,
        unread_msg: unreadCount
      },
      'modified'
    );
  });
}

export const setGroupLastMessageUnsend = (id) => {
  realm.write(() => {
    realm.create(
      'groups',
      { group_id: id, last_msg: null, is_unsent: true },
      'modified'
    );
  });
}


// User friends

export const getLocalUserFriends = () => {
  return realm.objects('user_friends')
  .sorted('timestamp', { ascending: false });
}

export const getLocalUserFriend = (id) => {
  return realm
    .objects('user_friends')
    .sorted('timestamp', { ascending: true })
    .filtered(`user_id == ${id}`);
}

export const handleRequestAccept = (item) => {
  var obj = realm.objects('user_friends').filtered('user_id=' + item.user_id);
  if (obj.length > 0) {
    realm.write(() => {
      realm.create(
        'user_friends',
        { user_id: item.user_id, unread_msg: 1 },
        'modified'
      );
    });
  } else {
    realm.write(() => {
      realm.create(
        'user_friends',
        {
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
        }
      );
    });
  }
}

export const removeUserFriends = (id) => {
  var user = realm.objects('user_friends').filtered(`user_id == ${id}`);

  realm.write(() => {
    realm.delete(user);
  });
}

export const updateFriendsUnReadCount = (id,unreadCount) => {
  var user = realm.objects('user_friends').filtered(`friend == ${id}`);

  var items = [];
  user.map(item=>{
    items.push(item);
  })

  realm.write(() => {
    realm.create(
      'user_friends',
      {
        user_id: items[0].user_id,
        unread_msg: unreadCount
      },
      'modified'
    );
  });
}

export const updateFriendLastMsg = (message) => {
  var user = realm.objects('user_friends').filtered(`user_id == ${message.from_user.id}`);

  var items = [];
  user.map(item=>{
    items.push(item);
  })

  if(items[0].last_msg_id!==message.id){
    realm.write(() => {
      realm.create(
        'user_friends',
        {
          user_id: message.from_user.id,
          unread_msg: items[0].unread_msg+1,
          last_msg_id: message.id,
          last_msg: message.message_body ? message.message_body : '',
          last_msg_type: message.msg_type,
          timestamp: message.created,
        },
        'modified'
      );
    });
  }
}
