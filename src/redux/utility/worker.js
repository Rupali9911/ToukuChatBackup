
export function wSetChannelMode (userConfig, channelMode) {
    let config = Object.assign({}, userConfig)
    config.channel_mode = channelMode
    return config
}
