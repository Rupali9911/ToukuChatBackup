
export function wSetChannelMode (userConfig, channelMode) {
   // let config = Object.assign({}, userConfig)
    let config = JSON.stringify(userConfig)
    config.channel_mode = channelMode
    return config
}
