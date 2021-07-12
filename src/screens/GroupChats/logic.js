import { translate } from "../../redux/reducers/languageReducer";
import { getUser_ActionFromUpdateText, getUserName, getAvatar } from "../../utils";

export const getRenderMessageData = (chats,userData) => {
    let result = [];
    chats.map((item)=>{
        result.push(getGroupMessageObject(item,userData));
    });
    return result;
}

// function that generate message object to render from relam object
export const getGroupMessageObject = (message, userData) => {
    const result = {};
    result['id'] = message.msg_id;
    result['text'] = getMessagetext(message,userData);
    result['type'] = getMessageType(message);
    result['time'] = getTime(message);
    result['isMyMessage'] = message.sender_id === userData.id;
    result['user_by'] = {
        name: getUserName(message.sender_id) || message.sender_display_name,
        user_name: message.sender_username,
        picture: getAvatar(message.sender_picture),
        id: message.sender_id
    };
    result['mentions'] = message.mentions;
    result['reply_to'] = message.reply_to && message.reply_to.message ? message.reply_to : null;
    result['media'] = getNoteMedia(message);
    result['translated'] = message.translated;
    result['read_count'] = message.read_count;
    result['is_unsent'] = message.is_unsent;
    result['timestamp'] = message.timestamp;
    return result;
}

export const getMessagetext = (message,userData) => {
    let text = '';
    if(message.message_body){
        if(message.message_body.type){
            if(message.message_body.type === 'update' && !message.message_body.text.includes('add a memo')){
                text = renderGroupInfoText(message,userData);
            }else if(message.message_body.type === 'update'){
                text = renderNoteData(message,userData).update_text;
            }else {
                text = message.message_body.text
            }
        }
    }
    return text;
}

export const renderGroupInfoText = (message,userData) => {
    let update_text = '';
    if (message && message.message_body.type === 'update') {
      let update_obj = getUser_ActionFromUpdateText(message.message_body.text);
      let update_by =
        message.sender_id === userData.id
          ? translate('pages.xchat.you')
          : getUserName(message.sender_id) ||
            message.sender_display_name ||
            message.sender_username;
      let update_to =
        update_obj.user_id === userData.id
          ? translate('pages.xchat.you')
          : getUserName(update_obj.user_id) || update_obj.user_name;
      // console.log('update_to',update_obj);
      if (update_obj.action === 'left') {
        update_text = translate('common.leftGroup', {username: update_by});
      } else if (update_obj.action === 'added') {
        if (update_by === update_to) {
          update_text = translate('pages.xchat.userJoinedGroup', {
            displayName: update_by,
          });
        } else {
          update_text = translate('common.addedInGroup', {
            username: update_by,
            toUsername: update_to,
          });
        }
      } else if (update_obj.action === 'removed') {
        update_text = translate('common.removedToGroup', {
          username: update_by,
          toUsername: update_to,
        });
      } else if (message.message_body.text.includes('liked the memo')) {
        update_text = translate('common.likedTheMemo', {
          username: update_by,
          toUsername: update_to,
        });
      } else if (message.message_body.text.includes('commented on the memo')) {
        update_text = translate('common.commentonMemo', {
          username: update_by,
          toUsername: update_to,
        });
      }
      return update_text;
    }
  };

export const renderNoteData = (message,userData) => {
    let update_text = '';
    if (message && message.message_body.type === 'update') {
      let text = '';

      let split_txt = message.message_body.text.split(',');
      if (split_txt.length > 0) {
        text = split_txt[2].trim();
      }

      let update_by =
        message.sender_id === userData.id
          ? translate('pages.xchat.you')
          : getUserName(message.sender_id) ||
          message.sender_display_name ||
          message.sender_username;

      update_text = text;

      return { update_text, update_by };
    }
  };

export const getMessageType = (message) => {
    let type = '';
    if(message && message.message_body && message.message_body.type){
        if(message.message_body.type === 'update' && message.message_body.text.includes('add a memo')){
            type = 'note';
        }else {
            type = message.message_body.type;
        }
    }
    return type;
}

export const getTime = (message) => {
    let time = '';
    let date = message.created ? new Date(message.created) : new Date(message.timestamp);
    time = `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
    return time;
}

export const getNoteMedia = (message) => {
  let media = [];
  if (message && message.message_body && message.message_body.type) {
    if (message.message_body.type === 'update' && message.message_body.text.includes('add a memo')) {
      media = message.message_body.media;
    }
  }
  return media;
}