import Realm from 'realm';
import {
  ChatConversation,
  UserFriends,
  ConversationUser,
  ChatConversationFriend,
  ChatConversationGroup,
  MessageBody,
  ReplyTo,
} from './Schema';

const DB_SCHEMAS = [
  ChatConversation,
  UserFriends,
  ConversationUser,
  ChatConversationFriend,
  ChatConversationGroup,
  MessageBody,
  ReplyTo,
];
const DB_SCHEMA_VERSION = 1;
exports.DB_SCHEMAS = DB_SCHEMAS;
exports.DB_SCHEMA_VERSION = DB_SCHEMA_VERSION;
const realm = new Realm({
  path: 'ToukuDB.realm',
  schema: DB_SCHEMAS,
  schemaVersion: DB_SCHEMA_VERSION,
});

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