import Realm from 'realm';
import moment from 'moment';
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
  GroupMentions,
  MediaObject
} from './Schema';
import { isNaN, isNumber } from 'lodash';
import { updateGroup } from '../redux/reducers/groupReducer';

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
  GroupMentions,
  MediaObject,
];

const DB_SCHEMA_VERSION = 1;
exports.DB_SCHEMAS = DB_SCHEMAS;
exports.DB_SCHEMA_VERSION = DB_SCHEMA_VERSION;
export const realm = new Realm({
  path: 'ToukuDB.realm',
  schema: DB_SCHEMAS,
  schemaVersion: DB_SCHEMA_VERSION,
  deleteRealmIfMigrationNeeded: true,
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

export const setChannelChatSingleConversation = (item) => {
  let returnObject = null;
  var obj = realm.objects('chat_conversation').filtered('id =' + item.id);
  if (obj.length > 0) {
    realm.write(() => {
      let object = realm.create(
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
      returnObject = object;
    });
  } else {
    realm.write(() => {
      let object = realm.create('chat_conversation', {
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
      returnObject = object;
    });
  }
  return returnObject;
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

export const getChannelChatConversationByMsgId = (id, msg_id, limit = 50, isInclusive = true) => {
  let filter = `channel == ${id}`;
  filter = msg_id ? `${filter} && id ${isInclusive?'>=':'>'} ${msg_id}` : filter;
  return realm
    .objects('chat_conversation')
    .sorted('created',false)
    .filtered(filter).slice(0,limit).reverse();
};

export const getChannelChatPreviousConversationFromMsgId = (id, msg_id, limit = 50, isInclusive = false) => {
  let filter = `channel == ${id}`;
  filter = msg_id ? `${filter} && id ${isInclusive?'<=':'<'} ${msg_id}` : filter;
  return realm
    .objects('chat_conversation')
    .sorted('created',true)
    .filtered(filter).slice(0,limit);
};

export const getChannelChatConversationOldestMsgId = (id) => {
  let filter = `channel == ${id}`;
  return realm.objects('chat_conversation').filtered(filter).min('id');
};

export const updateMessageById = (id, text, type) => {
  let returnObject = null
  realm.write(() => {
    let object = realm.create('chat_conversation', {id: id, message_body: text}, 'modified');
    returnObject = object;
  });
  return returnObject;
};

export const updateReadByChannelId = (id) => {
  let results = realm.objects('chat_conversation').filtered(`channel == ${id} && is_read == false`);
  let returnArray = [];
  realm.write(() => {
    for (let chat of results) {
      let object = realm.create(
        'chat_conversation',
        { id: chat.id, is_read: true },
        'modified',
      );
      returnArray.push(object);
    }
  });
  return returnArray;
};

export const deleteMessageById = async (id) => {
  var message = realm.objects('chat_conversation').filtered(`id == ${id}`);

  await realm.write(() => {
    realm.delete(message);
  });
};

export const setMessageUnsend = (id) => {
  let returnObject = null;
  realm.write(() => {
    let object = realm.create(
      'chat_conversation',
      {id: id, message_body: '', is_unsent: true},
      'modified',
    );
    returnObject = object;
  });
  return returnObject;
};

export const updateChannelTranslatedMessage = (id, translated_text) => {
  realm.write(() => {
    realm.create(
      'chat_conversation',
      {id: id, translated: translated_text},
      'modified',
    );
  });
};

export const deleteChannelAllConversationsById = (channel_id) => {
  try {
    let chats = getChannelChatConversationById(channel_id);
    realm.write(() => {
      realm.delete(chats);
    });
  } catch (err) {
    console.log('err', err);
  }
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
              media: item.media || [],
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
            media: item.media || [],
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

export const setNewFriendChatConversation = (item) => {
  let returnObject = null;

  var obj = realm
    .objects('chat_conversation_friend')
    .filtered('id =' + item.id);

  if (item.id) {
    if (obj.length > 0) {
      realm.write(() => {
        let object = realm.create(
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
            media: item.media || [],
            message_body: item.message_body,
            msg_type: item.msg_type,
            reply_to: item.reply_to,
            thumbnail: item.thumbnail,
            to_user: item.to_user,
            updated: item.updated,
          },
          'modified',
        );
        returnObject = object;
      });
    } else {
      realm.write(() => {
        let object = realm.create('chat_conversation_friend', {
          created: item.created,
          deleted_for: item.deleted_for,
          friend: item.friend,
          from_user: item.from_user,
          id: item.id,
          is_edited: item.is_edited,
          is_read: item.is_read,
          is_unsent: item.is_unsent,
          local_id: item.local_id,
          media: item.media || [],
          message_body: item.message_body,
          msg_type: item.msg_type,
          reply_to: item.reply_to,
          thumbnail: item.thumbnail,
          to_user: item.to_user,
          updated: item.updated,
        });
        returnObject = object;
      });
    }
  }
  return returnObject;
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

export const getFriendChatConversationByMsgId = (id, msg_id, limit = 50, isInclusive = true) => {
  let filter = `friend == ${id}`;
  filter = msg_id ? `${filter} && id ${isInclusive?'>=':'>'} ${msg_id}` : filter;
  return realm
    .objects('chat_conversation_friend')
    .sorted('created',false)
    .filtered(filter).slice(0,limit).reverse();
};

export const getFriendChatPreviousConversationFromMsgId = (id, msg_id, limit = 50, isInclusive = false) => {
  let filter = `friend == ${id}`;
  filter = msg_id ? `${filter} && id ${isInclusive?'<=':'<'} ${msg_id}` : filter;
  return realm
    .objects('chat_conversation_friend')
    .sorted('created',true)
    .filtered(filter).slice(0,limit);
};

export const getFriendChatConversationOldestMsgId = (id) => {
  let filter = `friend == ${id}`;
  return realm.objects('chat_conversation_friend').filtered(filter).min('id');
};

export const updateFriendMessageById = (id, text, type, media) => {
  let returnObject = null;
  realm.write(() => {
    let object = realm.create(
      'chat_conversation_friend',
      {id: id, message_body: text, media: media},
      'modified',
    );
    returnObject = object;
  });
  return returnObject;
};

export const updateConversationUserAvtar = (id, data) => {
  console.log('updateConversationUserAvtar -> id, data', id, data);

  var results = realm.objects('conversation_user').filtered(`id == ${id}`);

  for (let chatUser of results) {
    realm.write(() => {
      realm.create(
        'conversation_user',
        {id: chatUser.id, avatar: data.avatar},
        'modified',
      );
    });
  }
  // realm.write(() => {
  //   realm.create(
  //     'conversation_user',
  //     {id: id, avatar: data.avatar},
  //     'modified',
  //   );
  // });
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
  let returnObject = null;
  realm.write(() => {
    let object = realm.create(
      'chat_conversation_friend',
      {id: id, message_body: '', is_unsent: true},
      'modified',
    );
    returnObject = object;
  });
  return returnObject;
};

export const updateAllFriendMessageRead = (friend) => {
  var results = realm
    .objects('chat_conversation_friend')
    .sorted('created', {ascending: true})
    .filtered(`friend == ${friend} && is_read == false`);
  let returnArray = [];
  realm.write(() => {
    for (let chat of results) {
      // chat.is_read = true;
      let object = realm.create(
        'chat_conversation_friend',
        { id: chat.id, is_read: true },
        'modified',
      );
      returnArray.push(object);
    }
  });
  return returnArray;
};

export const updateFriendTranslatedMessage = (id, translated_text) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_friend',
      {id: id, translated: translated_text},
      'modified',
    );
  });
};

export const deleteFriendAllConversationsById = (friend_id) => {
  try {
    let chats = getFriendChatConversationById(friend_id);
    realm.write(() => {
      realm.delete(chats);
    });
  } catch (err) {
    console.log('err', err);
  }
};

//#endregion

//#region Group Services
export const setGroupChatConversation = (conversation) => {
  for (let item of conversation) {
    var obj = realm
      .objects('chat_conversation_group')
      .filtered(`msg_id ==${item.msg_id} ${isNumber(item.local_id)?`|| msg_id ==${item.local_id}`:''}`);
    if (obj.length > 0) {
      if(item.local_id && obj[0].msg_id == item.local_id){
        console.log('remove temp object');
        realm.write(() => {
          realm.delete(obj);
        });
      }
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
              ? item.mentions instanceof Array
                ? item.mentions
                : [item.mentions]
              : [],
            read_count: item.read_count ? item.read_count : 0,
            created: item.created || item.timestamp,
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
            ? item.mentions instanceof Array
              ? item.mentions
              : [item.mentions]
            : [],
          read_count: item.read_count ? item.read_count : 0,
          created: item.created || item.timestamp,
        });
      });
    }
  }
};

export const setSingleGroupChatConversation = (item) => {
    let returnObject = null;
    var obj = realm.objectForPrimaryKey('chat_conversation_group',item.msg_id);
    if (obj) {
      // alert('matching friend');
      realm.write(() => {
        let object = realm.create(
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
              ? item.mentions instanceof Array
                ? item.mentions
                : [item.mentions]
              : [],
            read_count: item.read_count ? item.read_count : 0,
            created: item.created || item.timestamp,
          },
          'modified',
        );
        returnObject = object;
      });
    } else {
      realm.write(() => {
        let object = realm.create('chat_conversation_group', {
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
            ? item.mentions instanceof Array
              ? item.mentions
              : [item.mentions]
            : [],
          read_count: item.read_count ? item.read_count : 0,
          created: item.created || item.timestamp,
        });
        returnObject = object;
      });
    }
    return returnObject;
};

export const getGroupChatConversation = () => {
  return realm.objects('chat_conversation_group');
};

export const getGroupChatConversationById = (id,offset,msg_id) => {
  return realm
    .objects('chat_conversation_group')
    .sorted('timestamp', {ascending: true})
    .filtered(`group_id == ${id} ${msg_id?`&& msg_id <= ${msg_id}`:''}`).slice(0,offset);
};

export const getGroupChatConversationNextFromId = (id, msg_id, isInclusive) => {
  return realm
    .objects('chat_conversation_group')
    .sorted('timestamp', true)
    .filtered(`group_id == ${id} && msg_id ${isInclusive?'>=':'>'} ${msg_id}`);
};

export const getGroupChatConversationPrevFromId = (id, msg_id, isInclusive) => {
  console.log('msg_id',msg_id);
  return realm
    .objects('chat_conversation_group')
    .sorted('timestamp', true)
    .filtered(`group_id == ${id} && msg_id ${isInclusive?'<=':'<'} ${msg_id}`);
};

export const getGroupChatConversationByMsgId = (id, msg_id) => {
  console.log(`group_id == ${id} && msg_id == ${msg_id}`);
  return realm.objectForPrimaryKey('chat_conversation_group',msg_id);    
}

export const getGroupChatConversationLatestMsgId = (id) => {
  return realm.objects('chat_conversation_group').filtered(`group_id == ${id}`).max('msg_id');    
}

export const getGroupChatConversationOldestMsgId = (id) => {
  return realm.objects('chat_conversation_group').filtered(`group_id == ${id}`).min('msg_id');    
}

export const getGroupChatConversationLengthById = (id) => {
  return realm
    .objects('chat_conversation_group')
    .sorted('timestamp', {ascending: true})
    .filtered(`group_id == ${id}`);
};

export const updateGroupMessageById = (id, body, mentions = []) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_group',
      {msg_id: id, message_body: body, mentions},
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

export const updateGroupTranslatedMessage = (id, translated_text) => {
  realm.write(() => {
    realm.create(
      'chat_conversation_group',
      {msg_id: id, translated: translated_text},
      'modified',
    );
  });
};

//#endregion

//#region Channels List
export const setChannels = (channels) => {
  // console.log('realm insert data', JSON.stringify(channels));
  for (let item of channels) {
    var obj = realm.objects('channels').filtered('id=' + item.id);
    // console.log('obj',JSON.stringify(obj.toJSON()));
    if (obj.length > 0) {
      try {
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
              last_msg: item.last_msg
                ? Array.isArray(item.last_msg)
                  ? item.last_msg.length
                    ? item.last_msg[0]
                    : null
                  : item.last_msg
                : null,
              is_pined: item.is_pined ? item.is_pined : false,
              created: item.created,
              joining_date: item.joining_date
                ? item.joining_date
                : item.created,
              subject_message: item.subject_message,
                show_followers: item.show_followers,
            },
            'modified',
          );
        });
      } catch (err) {
        console.log('realm_error', err);
      }
    } else {
      try {
        realm.write(() => {
          realm.create('channels', {
            id: item.id,
            name: item.name,
            unread_msg: item.unread_msg,
            total_members: item.total_members,
            description: item.description,
            chat: item.chat,
            channel_picture: item.channel_picture,
            last_msg: item.last_msg
              ? item.last_msg instanceof Array
                ? item.last_msg.length
                  ? item.last_msg[0]
                  : null
                : item.last_msg
              : null,
            is_pined: item.is_pined ? item.is_pined : false,
            created: item.created,
            joining_date: item.joining_date ? item.joining_date : item.created,
            subject_message: item.subject_message,
              show_followers: item.show_followers,
          });
        });
      } catch (err) {
        console.log('realm_error', err);
      }
    }
  }
};

export const setSingleChannel = (item) => {
  // console.log('realm insert data', JSON.stringify(channels));
  let returnObject = null;  
  var obj = realm.objects('channels').filtered('id=' + item.id);
    // console.log('obj',JSON.stringify(obj.toJSON()));
    if (obj.length > 0) {
      try {
        realm.write(() => {
          let object = realm.create(
            'channels',
            {
              id: item.id,
              name: item.name,
              unread_msg: item.unread_msg,
              total_members: item.total_members,
              description: item.description,
              chat: item.chat,
              channel_picture: item.channel_picture,
              last_msg: item.last_msg
                ? Array.isArray(item.last_msg)
                  ? item.last_msg.length
                    ? item.last_msg[0]
                    : null
                  : item.last_msg
                : null,
              is_pined: item.is_pined ? item.is_pined : false,
              created: item.created,
              joining_date: item.joining_date
                ? item.joining_date
                : item.created,
              subject_message: item.subject_message,
                show_followers: item.show_followers,
            },
            'modified',
          );
          returnObject = object;
        });
      } catch (err) {
        console.log('realm_error', err);
      }
    } else {
      try {
        realm.write(() => {
          let object = realm.create('channels', {
            id: item.id,
            name: item.name,
            unread_msg: item.unread_msg,
            total_members: item.total_members,
            description: item.description,
            chat: item.chat,
            channel_picture: item.channel_picture,
            last_msg: item.last_msg
              ? item.last_msg instanceof Array
                ? item.last_msg.length
                  ? item.last_msg[0]
                  : null
                : item.last_msg
              : null,
            is_pined: item.is_pined ? item.is_pined : false,
            created: item.created,
            joining_date: item.joining_date ? item.joining_date : item.created,
            subject_message: item.subject_message,
              show_followers: item.show_followers,
          });
          returnObject = object;
        });
      } catch (err) {
        console.log('realm_error', err);
      }
    }
    return returnObject;
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
  let returnObject = null;
  var last_msg = null;
  if (message) {
    last_msg = {
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
      reply_to:
        message.reply_to instanceof Object
          ? message.reply_to.id
          : message.reply_to,
      schedule_post: message.schedule_post,
      subchat: message.subchat,
      thumbnail: message.thumbnail,
      to_user: message.to_user ? message.to_user.id : null,
      updated: message.updated,
    };
  }

  realm.write(() => {
    let object = realm.create(
      'channels',
      {
        id: id,
        last_msg: last_msg,
        subject_message: message?message.last_msg:'',
      },
      'modified',
    );
    returnObject = object;
  });
  return returnObject;
};

export const updateChannelLastMsg = (id, message, unreadCount) => {
  console.log('last_msg_update');
  let returnObject = null;
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
    reply_to:
      message.reply_to instanceof Object
        ? message.reply_to.id
        : message.reply_to,
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
        let object = realm.create(
          'channels',
          {
            id: id,
            last_msg: last_msg,
            subject_message: message.subject_message
              ? message.subject_message
              : null,
            unread_msg: unreadCount,
          },
          'modified',
        );
        returnObject = object;
      });
    } else if (array[0].last_msg == null) {
      realm.write(() => {
        let object = realm.create(
          'channels',
          {
            id: id,
            last_msg: last_msg,
            subject_message: message.subject_message
              ? message.subject_message
              : null,
            unread_msg: unreadCount,
          },
          'modified',
        );
        returnObject = object;
      });
    }
  }
  return returnObject;
};

export const updateChannelTotalMember = (id, total_member) => {
  let returnObject = null;
  realm.write(() => {
    let object = realm.create('channels', {id: id, total_member: total_member}, 'modified');
    returnObject = object;
  });
  return returnObject;
};

export const updateChannelDetails = (id, data) => {
  let updatedChannel = null;
  realm.write(() => {
    let object = realm.create(
      'channels',
      {
        id: id,
        channel_picture: data.channel_picture,
        description: data.description,
        name: data.name,
          show_followers: data.show_followers,
      },
      'modified',
    );
    updatedChannel = object;
  });
  return updatedChannel;
};

export const updateChannelUnReadCountById = (id, unread_msg) => {
  console.log('unread_count update', unread_msg, id);
  let returnObject = null;
  realm.write(() => {
    let object = realm.create('channels', {id: id, unread_msg: unread_msg}, 'modified');
    returnObject = object;
  });
  return returnObject;
};

export const deleteChannelById = (id) => {
  var message = realm.objects('channels').filtered(`id == ${id}`);
  realm.write(() => {
    realm.delete(message);
  });
};

export const deleteChannelConversationById = (id) => {
  var channel = realm.objects('chat_conversation').filtered(`channel == ${id}`);
  for (let c of channel) {
    realm.write(() => {
      realm.delete(c);
    });
  }
};
//#endregion

//#region Groups List
export const setGroups = async (group) => {
  //console.log('realm insert data', channels);
  var checkObject = {};
  for (let item of group) {
    var obj = realm.objects('groups').filtered('group_id=' + item.group_id);
    if (obj.length > 0) {
      //console.log('setGroups -> obj', obj);
      realm.write(() => {
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
            mentions: item.mentions.length ? item.mentions : [],
            reply_to: item.reply_to,
            joining_date: item.joining_date,
            is_group_member: item.is_group_member,
            is_mentioned: item.is_mentioned ? item.is_mentioned : false,
            mention_msg_id: item.mention_msg_id,
            unread_msg_id: item.unread_msg_id,
          },
          'modified',
        );
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
          last_msg_id: item.last_msg_id ? item.last_msg_id : null,
          timestamp: item.timestamp,
          event: item.event,
          no_msgs: item.no_msgs,
          is_pined: item.is_pined ? item.is_pined : false,
          sender_id: item.sender_id ? item.sender_id : null,
          sender_username: item.sender_username,
          sender_display_name: item.sender_display_name,
          mentions: item.mentions.length ? item.mentions : [],
          reply_to: item.reply_to,
          joining_date: item.joining_date,
          is_group_member: item.is_group_member,
          is_mentioned: item.is_mentioned ? item.is_mentioned : false,
          mention_msg_id: item.mention_msg_id,
          unread_msg_id: item.unread_msg_id,
        });
      });
    }
  }
  console.log('insert all object');
};

export const setSingleGroup = async (item) => {
  let updatedGroup = null;
    var obj = realm.objects('groups').filtered('group_id=' + item.group_id);
    if (obj.length > 0) {
      //console.log('setGroups -> obj', obj);
      realm.write(() => {
        let object = realm.create(
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
            mentions: item.mentions.length ? item.mentions : [],
            reply_to: item.reply_to,
            joining_date: item.joining_date,
            is_group_member: item.is_group_member,
            is_mentioned: item.is_mentioned ? item.is_mentioned : false,
            mention_msg_id: item.mention_msg_id,
            unread_msg_id: item.unread_msg_id,
          },
          'modified',
        );
        updatedGroup = object;
      });
    } else {
      realm.write(() => {
        let object = realm.create('groups', {
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
          mentions: item.mentions.length ? item.mentions : [],
          reply_to: item.reply_to,
          joining_date: item.joining_date,
          is_group_member: item.is_group_member,
          is_mentioned: item.is_mentioned ? item.is_mentioned : false,
          mention_msg_id: item.mention_msg_id,
          unread_msg_id: item.unread_msg_id,
        });
        updatedGroup = object;
      });
    }
    return updatedGroup;
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

export const getGroupObjectById = (id) => {
  return realm.objectForPrimaryKey('groups',parseInt(`${id}`));
};

export const deleteGroupById = (id) => {
  var message = realm.objects('groups').filtered(`group_id == ${id}`);

  realm.write(() => {
    realm.delete(message);
  });
};

export const removeGroupById = (id, is_group_member) => {
  let updatedGroup = null;
  realm.write(() => {
    let object = realm.create(
      'groups',
      {
        group_id: id,
        is_group_member: is_group_member,
      },
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const UpdateGroupDetail = (
  id,
  group_name,
  group_picture,
  total_members,
) => {
  let updatedGroup = null;
  realm.write(() => {
    let object = realm.create(
      'groups',
      {
        group_id: id,
        group_name: group_name,
        group_picture: group_picture,
        total_members: total_members,
      },
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const updateLastMsgGroups = (id, message, unreadCount) => {
  let updatedGroup = null;
  let last_msg = {
    type: message.message_body.type,
    text: message.message_body.text,
  };
  realm.write(() => {
    let object = realm.create(
      'groups',
      {
        group_id: id,
        last_msg: last_msg,
        last_msg_id: message.msg_id,
        mentions: message.mentions.length ? message.mentions : [],
        no_msgs: false,
        unread_msg: unreadCount,
        timestamp: message.timestamp
      },
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const updateLastMsgGroupsWithMention = (id, message, unreadCount, mention_msg_id,unread_msg_id,is_mentioned) => {
  let updatedGroup = null;

  let last_msg = {
    type: message.message_body.type,
    text: message.message_body.text,
  };
  realm.write(() => {
    let object = realm.create(
      'groups',
      {
        group_id: id,
        last_msg: last_msg,
        last_msg_id: message.msg_id,
        mentions: message.mentions.length ? message.mentions : [],
        no_msgs: false,
        unread_msg: unreadCount,
        timestamp: message.timestamp,
        mention_msg_id,
        unread_msg_id,
        is_mentioned
      },
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const updateGroupsWithMention = (id, mention_msg_id, is_mentioned) => {
  let updatedGroup = null;
  realm.write(() => {
    let object = realm.create(
      'groups',
      {
        group_id: id,
        mention_msg_id,
        is_mentioned
      },
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const updateLastMsgGroupsWithoutCount = (
  id,
  type,
  text,
  last_msg_id,
  timestamp,
  no_msgs = false,
  mentions = []
) => {
  let updatedGroup = null;
  let last_msg = {
    type: type,
    text: text,
  };
  realm.write(() => {
    let object = realm.create(
      'groups',
      {
        group_id: id,
        last_msg: text === null && type === null ? null : last_msg,
        last_msg_id: last_msg_id,
        no_msgs: no_msgs,
        timestamp: timestamp,
        mentions: mentions
      },
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const updateLastMsgTimestamp = (id, timestamp, unreadCount, message) => {
  let updatedGroup = null;
  realm.write(() => {
    let object = realm.create(
      'groups',
      {
        group_id: id,
        last_msg_id: message.msg_id,
        timestamp: timestamp,
        no_msgs: false,
        unread_msg: unreadCount,
      },
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const updateUnReadCount = (id, unreadCount) => {
  let updatedGroup = null;
  realm.write(() => {
    let object = realm.create(
      'groups',
      {
        group_id: id,
        unread_msg: unreadCount,
        is_mentioned: false,
        mention_msg_id: null,
        unread_msg_id: null,
      },
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const updateGroupStoreMsgId = (id, msg_id, current_msg_id) => {
  realm.write(() => {
    realm.create(
      'groups',
      {
        group_id: id,
        store_msg_id: msg_id,
        latest_sequence_msg_id: current_msg_id
      },
      'modified',
    );
  });
};

export const updateGroupInitialOpenStatus = (id, status) => {
  realm.write(() => {
    realm.create(
      'groups',
      {
        group_id: id,
        is_group_open: status
      },
      'modified',
    );
  });
};

export const setGroupLastMessageUnsend = (id) => {
  let updatedGroup = null;
  realm.write(() => {
    let object = realm.create(
      'groups',
      {group_id: id, last_msg: null, is_unsent: true},
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
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
              display_name_edited: item.display_name_edited,
              isChecked: false,
              is_online: item.is_online,
              is_typing: false,
              timestamp: item.timestamp,
              is_pined: item.is_pined ? item.is_pined : false,
              friend_status: item.friend_status,
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
            display_name_edited: item.display_name_edited,
            isChecked: false,
            is_online: item.is_online,
            is_typing: false,
            timestamp: item.timestamp,
            is_pined: item.is_pined ? item.is_pined : false,
            friend_status: item.friend_status,
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

export const getLocalUserFriendById = (id) => {
  return realm.objectForPrimaryKey('user_friends',parseInt(`${id}`));
}

export const getUserFriend = (id) => {
  return realm
    .objects('user_friends')
    .sorted('timestamp', {ascending: true})
    .filtered(`friend == ${id}`);
};

export const handleRequestAccept = (item, isInvitation) => {
  let updatedFriend = null;
  var obj = realm.objects('user_friends').filtered('user_id=' + item.user_id);
  if (obj.length > 0) {
    realm.write(() => {
      let object = realm.create(
        'user_friends',
        isInvitation
          ? {user_id: item.user_id, friend_status: 'ACCEPTED', timestamp: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")}
          : {user_id: item.user_id, unread_msg: 0, friend_status: 'ACCEPTED', timestamp: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")},
        'modified',
      );
      updatedFriend = object;
    });
  } else {
    realm.write(() => {
      let object = realm.create('user_friends', {
        user_id: item.user_id,
        friend: item.friend,
        unread_msg: 0,
        last_msg_id: item.last_msg_id,
        username: item.username,
        avatar: item.avatar,
        profile_picture: item.profile_picture,
        background_image: item.background_image,
        last_msg: item.last_msg ? item.last_msg : '',
        last_msg_type: item.last_msg_type,
        display_name: item.display_name,
        display_name_edited: item.display_name_edited,
        isChecked: false,
        is_online: item.is_online,
        is_typing: false,
        timestamp: item.timestamp,
        is_pined: item.is_pined ? item.is_pined : false,
        friend_status: item.friend_status,
      });
      updatedFriend = object;
    });
  }
  return updatedFriend;
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
  let updatedFriend = null;
  realm.write(() => {
    let object = realm.create(
      'user_friends',
      {
        user_id: id,
        avatar: data.avatar,
        display_name: data.display_name,
        username: data.username,
      },
      'modified',
    );
    updatedFriend = object;
  });
  return updatedFriend;
};

export const updateFriendDisplayName = (userId, data) => {
  let updatedFriend = null;
  realm.write(() => {
    let object = realm.create(
      'user_friends',
      {
        user_id: userId,
        display_name: data.display_name,
      },
      'modified',
    );
    updatedFriend = object;
  });
  return updatedFriend;
};

export const updateFriendProfileData = (userId, display_name, background_image) => {
  console.log('data',userId,display_name,background_image);
  let updatedFriend = null;
  if(background_image){
    realm.write(() => {
      let object = realm.create(
        'user_friends',
        {
          user_id: userId,
          display_name: display_name,
          background_image: background_image
        },
        'modified',
      );
      updatedFriend = object;
    });
  }else{
    realm.write(() => {
      let object = realm.create(
        'user_friends',
        {
          user_id: userId,
          display_name: display_name
        },
        'modified',
      );
      updatedFriend = object;
    });
  }
  return updatedFriend;
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

export const updateFriendStatus = (id, status) => {
  console.log('updateFriendStatus');
  let updatedFriend = null;
  realm.write(() => {
    let object = realm.create(
      'user_friends',
      {
        user_id: id,
        friend_status: status,
      },
      'modified',
    );
    updatedFriend = object;
  });
  return updatedFriend;
};

export const updateFriendsUnReadCount = (id, unreadCount) => {
  var user = realm.objects('user_friends').filtered(`friend == ${id}`);
  var items = [];
  user.map((item) => {
    items.push(item);
  });
  let returnObject = null;
  realm.write(() => {
    let object = realm.create(
      'user_friends',
      {
        user_id: items[0].user_id,
        unread_msg: unreadCount,
      },
      'modified',
    );
    returnObject = object;
  });
  return returnObject;
};

export const updateFriendLastMsgWithoutCount = (id, message) => {
  // var user = realm.objects('user_friends').filtered(`user_id == ${id}`);
  console.log('updateFriendLastMsgWithoutCount');
  let updatedFriend = null;
  if (message) {
    realm.write(() => {
      let object = realm.create(
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
      updatedFriend = object;
    });
  } else {
    realm.write(() => {
      let object = realm.create(
        'user_friends',
        {
          user_id: id,
          last_msg_id: null,
          last_msg: '',
          last_msg_type: null,
        },
        'modified',
      );
      updatedFriend = object;
    });
  }
  return updatedFriend;
};

export const updateFriendLastMsg = (id, message, updateCount) => {
  var user = realm.objects('user_friends').filtered(`user_id == ${id}`);
  console.log('updateFriendLastMsg');
  var items = [];
  user.map((item) => {
    items.push(item);
  });
  let updatedFriend = null;
  if (items[0].last_msg_id !== message.id) {
    realm.write(() => {
      let object = realm.create(
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
      updatedFriend = object;
    });
  }
  return updatedFriend;
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

export const getUserFriendByUserId = (id) => {
    return realm.objects('user_friends').filtered(`user_id == ${id}`);
};

export const updateUserFriendsWhenPined = (item) => {
  let updatedFriend = null;
  realm.write(() => {
    let object = realm.create(
      'user_friends',
      {user_id: item.user_id, is_pined: true},
      'modified',
    );
    updatedFriend = object;
  });
  return updatedFriend;
};

export const updateUserFriendsWhenUnpined = (item) => {
  let updatedFriend = null;
  realm.write(() => {
    let object = realm.create(
      'user_friends',
      {user_id: item.user_id, is_pined: false},
      'modified',
    );
    updatedFriend = object;
  });
  return updatedFriend;
};

export const updateGroupsWhenPined = (item) => {
  let updatedGroup = null;
  realm.write(() => {
    let object = realm.create(
      'groups',
      {group_id: item.group_id, is_pined: true},
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const updateGroupsWhenUnpined = (item) => {
  let updatedGroup = null;
  realm.write(() => {
    let object = realm.create(
      'groups',
      {group_id: item.group_id, is_pined: false},
      'modified',
    );
    updatedGroup = object;
  });
  return updatedGroup;
};

export const updateChannelsWhenPined = (item) => {
  let updatedChannel = null;
  realm.write(() => {
    let object = realm.create('channels', {id: item.channel_id, is_pined: true}, 'modified');
    updatedChannel = object;
  });
  return updatedChannel;
};

export const updateChannelsWhenUnpined = (item) => {
  let updatedChannel = null;
  realm.write(() => {
    let object = realm.create(
      'channels',
      {id: item.channel_id, is_pined: false},
      'modified',
    );
    updatedChannel = object;
  });
  return updatedChannel;
};

export const multipleData = (type, multichat) => {
  console.log('type', type, multichat);
  if (type === 'channel') {
    realm.write(() => {
      realm.create(
        'channels',
        {
          id: multichat[0].id,
          last_msg: null,
          timestamp: multichat[0].timestamp,
          unread_msg: 0
        },
        'modified',
      );
    });
    deleteChannelAllConversationsById(multichat[0].id);
  } else if (type === 'friend') {
    console.log('data', multichat[0].friend);
    // let users = getUserFriend(multichat[0].friend);
    realm.write(() => {
      realm.create(
        'user_friends',
        {
          user_id: multichat[0].user_id,
          last_msg: null,
          last_msg_id: null,
          unread_msg: 0
        },
        'modified',
      );
    });
    deleteFriendAllConversationsById(multichat[0].friend);
  } else {
    realm.write(() => {
      console.log('data', multichat[0].group_id);
      realm.create(
        'groups',
        {
          group_id: multichat[0].group_id,
          last_msg: null,
          last_msg_id: null,
          timestamp: multichat[0].timestamp,
          no_msgs: true,
          unread_msg: 0
        },
        'modified',
      );
    });
    deleteAllGroupMessageByGroupId(multichat[0].group_id);
  }
};

export const multipleDeleteChatConversation = (deletedObject) => {
  // channel
  if (deletedObject.channel_ids && deletedObject.channel_ids.length > 0) {
    deletedObject.channel_ids.map((channelItem, index) => {
      realm.write(() => {
        realm.create(
          'channels',
          {
            id: channelItem,
            last_msg: null,
          },
          'modified',
        );
      });
      deleteChannelAllConversationsById(channelItem);
    });
  }

  // friend
  if (deletedObject.friend_ids && deletedObject.friend_ids.length > 0) {
    deletedObject.friend_ids.map((friendItem, index) => {
      var user = realm.objects('user_friends').filtered(`friend == ${friendItem}`);
      realm.write(() => {
        realm.create(
          'user_friends',
          {
            user_id: user[0].user_id,
            last_msg: null,
            last_msg_id: null,
          },
          'modified',
        );
      });
      deleteFriendAllConversationsById(friendItem);
    });
  }

  // group
  if (deletedObject.group_ids && deletedObject.group_ids.length > 0) {
    deletedObject.group_ids.map((groupItem, index) => {
      realm.write(() => {
        realm.create(
          'groups',
          {
            group_id: groupItem,
            last_msg: null,
            last_msg_id: null,
            no_msgs: true
          },
          'modified',
        );
      });
      deleteAllGroupMessageByGroupId(groupItem);
    });
  }
}

//#endregion
