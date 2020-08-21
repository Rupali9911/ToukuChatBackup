export const ConversationUser = {
  name: 'conversation_user',
  properties: {
    avatar: 'string?',
    display_name: 'string?',
    email: 'string?',
    id: { type: 'int', default: 0 },
    is_online: 'bool',
    username: 'string?',
  },
};

export const ReplyTo = {
  name: 'reply_to',
  properties: {
    display_name: 'string?',
    id: { type: 'int', default: 0 },
    message: 'string?',
    msg_type: 'string?',
    name: 'string?',
    sender_id: { type: 'int', default: 0 },
  },
};

export const MessageBody = {
  name: 'message_body',
  properties: {
    thumbnail: 'string?',
    type: 'string?',
    text: 'string?'
  },
};

export const ChatConversation = {
  name: 'chat_conversation',
  primaryKey: 'id',
  properties: {
    bonus_message: 'bool?',
    channel: { type: 'int', default: 0 },
    created: 'string?',
    deleted_for: 'int?[]',
    from_user: {
      type: 'object?',
      objectType: 'conversation_user',
      default: null,
    },
    greeting: 'int?',
    hyperlink: 'string?',
    id: { type: 'int', default: 0 },
    is_edited: 'bool?',
    is_multilanguage: 'bool?',
    is_read: 'bool?',
    is_unsent: 'bool?',
    message_body: 'string?',
    msg_type: 'string?',
    // mutlilanguage_message_body: [Object],
    read_by: 'int?[]',
    read_by_in_replies: 'int?[]',
    // replies_is_read: null,
    reply_to: {
      type: 'object?',
      objectType: 'reply_to',
      default: null,
    },
    schedule_post: 'int?',
    subchat: 'int?',
    thumbnail: 'string?',
    to_user: {
      type: 'object?',
      objectType: 'conversation_user',
      default: null,
    },
    updated: 'string?',
  },
};

export const ChatConversationFriend = {
  name: 'chat_conversation_friend',
  primaryKey: 'id',
  properties: {
    created: 'string?',
    deleted_for: 'int?[]',
    friend: { type: 'int', default: 0 },
    from_user: {
      type: 'object?',
      objectType: 'conversation_user',
      default: null,
    },
    id: { type: 'int', default: 0 },
    is_edited: 'bool?',
    is_read: 'bool?',
    is_unsent: 'bool?',
    local_id: { type: 'int?', default: 0 },
    message_body: 'string?',
    msg_type: 'string?',
    reply_to: {
      type: 'object?',
      objectType: 'reply_to',
      default: null,
    },
    thumbnail: 'string?',
    to_user: {
      type: 'object?',
      objectType: 'conversation_user',
      default: null,
    },
    updated: 'string?',
  },
};

export const ChatConversationGroup = {
  name: 'chat_conversation_group',
  primaryKey: 'msg_id',
  properties: {
    msg_id: { type: 'int', default: 0 },
    sender_id: { type: 'int', default: 0 },
    group_id: { type: 'int', default: 0 },
    sender_username: 'string?',
    sender_display_name: 'string?',
    sender_picture: 'string?',
    message_body: {
      type: 'object?',
      objectType: 'message_body',
      default: null,
    },
    is_edited: 'bool?',
    is_unsent: 'bool?',
    timestamp: 'string?',
    reply_to: {
      type: 'object?',
      objectType: 'reply_to',
      default: null,
    },
    mentions:'string?[]',
    read_count: { type: 'int', default: 0 },
    created: 'string?',
  },
};

export const UserFriends = {
  name: 'user_friends',
  properties: {
    user_id: { type: 'int', default: 0 },
    friend: { type: 'int', default: 0 },
    unread_msg: { type: 'int?', default: 0 },
    last_msg_id: { type: 'int?' },
    username: 'string?',
    avatar: 'string?',
    profile_picture: 'string?',
    background_image: 'string?',
    last_msg: { type: 'string?', default: null },
    last_msg_type: 'string?',
    display_name: 'string?',
    isChecked: 'bool',
    is_online: 'bool',
    is_typing: 'bool',
    timestamp: 'string',
  },
};
