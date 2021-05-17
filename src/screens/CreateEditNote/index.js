import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import {globalStyles} from '../../styles';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import {Colors, Icons} from '../../constants';
import Button from '../../components/Button';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import { NoteHeader } from '../../components/Headers';
import VideoPreview from '../../components/VideoPreview';
import S3uploadService from '../../helpers/S3uploadService';
import Toast from '../../components/Toast';
import {
  editGroupNotes,
  getUserGroups,
  postGroupNotes,
} from '../../redux/reducers/groupReducer';
import {
  postFriendNotes,
  editFriendNotes,
} from '../../redux/reducers/friendReducer';
import { UploadProgressModal } from '../../components/Modals';


class CreateEditNote extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      text: this.props.navigation.state.params.note && this.props.navigation.state.params.note.text || '',
      uploadedFiles: this.props.navigation.state.params.uploadedFiles || [],
      progressModalVisible: false,
      uploadProgress: 0,
      note_media: this.props.navigation.state.params.note && this.props.navigation.state.params.note.media || null,
    };
    this.S3uploadService = new S3uploadService();
    this.isUploading = false;
  }


  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  removeUploadData = (index) => {
    let newArray = this.state.uploadedFiles.filter((item, itemIndex) => {
      if (index !== itemIndex) {
        return item;
      }
    });
    this.setState({
      uploadedFiles: newArray,
    });
  };

  onCameraPress = () => {
    ImagePicker.openCamera({
      includeBase64: true,
      mediaType: 'photo',
    }).then((image) => {
      let source = {uri: 'data:image/jpeg;base64,' + image.data};
      this.setState({
        uploadedFiles: [...this.state.uploadedFiles,image],
        uploadFile: source,
        sentMessageType: 'image',
        sendingMedia: true,
      });
    });
  };

  onGalleryPress = async () => {
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 30,
      mediaType: 'any',
      includeBase64: true,
    }).then(async (images) => {
      // console.log('Images', images)
      this.setState({
        uploadedFiles: [...this.state.uploadedFiles, ...images],
      });
    });
  };

  uploadAndSend = async () => {
    // this.toggleGalleryModal(false);
    this.setState({sendingMedia: true, progressModalVisible: true});
    let mediaToSend = [];
    for (const file of this.state.uploadedFiles) {
      let fileType = file.mime;
      if (fileType.includes('image')) {
        let source = {
          uri:
            file.mime === 'image/gif'
              ? 'data:image/gif;base64,' + file.data
              : 'data:image/jpeg;base64,' + file.data,
          type: file.mime,
          name: file.filename,
        };
        mediaToSend.push({
          source: source,
          type: 'image'
        });
      } else {
        let source = {
          uri: file.path,
          type: file.mime,
          name: file.filename,
          isUrl: file.isUrl,
        };
        mediaToSend.push({
          source: source,
          type: 'video'
        });
      }
    }
    // this.setState({uploadedFiles: []});
    this.postNoteWithMedia(mediaToSend);
  };

  postNoteWithMedia = async (mediaToSend) => {
    let videos = [];
    let media_url = [];
    let media_type = [];
    if(mediaToSend && mediaToSend.length>0){
      let index = 0;
      for(const item of mediaToSend){
        if (item.type === 'image') {
          let file = item.source;
          let files = [file];
          const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
            files,
            (e) => {
              console.log('progress_bar_percentage', e);
              // this.setState({ uploadProgress: e.percent });
              this.calculateProgress(mediaToSend.length,index,e.percent);
            },
          );
          media_url.push(uploadedImages.image[0].image);
          media_type.push('image');
          // images.push(uploadedImages.image[0].image);
          // console.log('image_url',uploadedImages.image[0].image);
        } else if (item.type === 'video') {
          let file = item.source;
          let files = [file];
          if (item.source.isUrl) {
            videos.push(item.source.uri);
          } else {
            const uploadedVideo = await this.S3uploadService.uploadVideoOnS3Bucket(
              files,
              item.source.type,
              (e) => {
                console.log('progress_bar_percentage', e);
                // this.setState({ uploadProgress: e.percent });
                this.calculateProgress(mediaToSend.length,index,e.percent);
              },
            );
            media_url.push(uploadedVideo);
            media_type.push('video');
            // videos.push(uploadedVideo);
          }
        }
        index++;
      }
      console.log('media_url:',media_url);
      console.log('media_type:',media_type);
      this.onPostNote(this.state.text,media_url,media_type);
    }
  }

  onPostNote = (text, media_url, media_type) => {
    if(this.props.navigation.state.params.isGroup){
      this.onPostGroupNote(text, media_url, media_type);
    }else{
      this.onPostFriendNote(text, media_url, media_type);
    }
  }

  onPostGroupNote = (text, media_url, media_type) => {
    const {currentGroup} = this.props;
    const note = this.props.navigation.state.params.note;
    const {note_media} = this.state;
    if (note) {
      const payload = {
        group_id: currentGroup.group_id,
        text: text,
        created_by: note.created_by,
        id: note.id,
      };

      let note_media_url = [];
      let note_media_type = [];
      for(const item of note_media){
        note_media_url.push(item.media_url);
        note_media_type.push(item.media_type);
      }

      if(note_media.length > 0){
        if(media_url && media_url.length>0){
          payload['media_url'] = [...note_media_url, ...media_url];
        }else{
          payload['media_url'] = [...note_media_url];
        }
        if(media_type && media_type.length>0){
          payload['media_type'] = [...note_media_type, ...media_type];
        }else{
          payload['media_type'] = [...note_media_type];
        }
      }else{
        if(media_url && media_url.length>0){
          payload['media_url'] = [,...media_url];
        }

        if(media_type && media_type.length>0){
          payload['media_type'] = [,...media_type];
        }
      }

      this.props
        .editGroupNotes(payload)
        .then((res) => {
          console.log('onPostNote -> edit notes res', res);
          Toast.show({
            title: translate('pages.xchat.groupDetails'),
            text: translate('pages.xchat.toastr.noteUpdated'),
            type: 'positive',
          });
          this.setState({
            text: '',
            uploadedFiles: [],
            progressModalVisible: false,
            uploadProgress: 0,
          });
          this.isUploading = false;
          this.props.navigation.goBack();
          return;
        })
        .catch((err) => {
          console.error(err);
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
      return;
    }

    const payload = {group: currentGroup.group_id, text: text};

    if(media_url && media_url.length>0){
      payload['media_url'] = media_url;
    }
    if(media_type && media_type.length>0){
      payload['media_type'] = media_type;
    }

    console.log('payload',payload);

    this.props
      .postGroupNotes(payload)
      .then((res) => {
        this.setState({
          progressModalVisible: false,
          uploadProgress: 0,
          uploadedFiles: [],
          text: ''
        });
        this.isUploading = false;
        this.props.navigation.goBack();
        Toast.show({
          title: translate('pages.xchat.groupDetails'),
          text: translate('pages.xchat.toastr.notePosted'),
          type: 'positive',
        });
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
      });
  };

  onPostFriendNote = (text, media_url, media_type) => {
    const { currentFriend } = this.props;
    const note = this.props.navigation.state.params.note;
    const {note_media} = this.state;
    if (note) {
      const payload = {
        note_id: note.id,
        text: text,
      };

      let note_media_url = [];
      let note_media_type = [];
      for(const item of note_media){
        note_media_url.push(item.media_url);
        note_media_type.push(item.media_type);
      }

      if(note_media.length > 0){
        if(media_url && media_url.length>0){
          payload['media_url'] = [...note_media_url, ...media_url];
        }else{
          payload['media_url'] = [...note_media_url];
        }
        if(media_type && media_type.length>0){
          payload['media_type'] = [...note_media_type, ...media_type];
        }else{
          payload['media_type'] = [...note_media_type];
        }
      }else{
        if(media_url && media_url.length>0){
          payload['media_url'] = [,...media_url];
        }

        if(media_type && media_type.length>0){
          payload['media_type'] = [,...media_type];
        }
      }

      this.props
        .editFriendNotes(payload)
        .then((res) => {
          this.setState({
            text: '',
            uploadedFiles: [],
            progressModalVisible: false,
            uploadProgress: 0,
          });
          this.isUploading = false;
          this.props.navigation.goBack();
          Toast.show({
            title: translate('pages.xchat.notes'),
            text: translate('pages.xchat.toastr.noteUpdated'),
            type: 'positive',
          });
          return;
        })
        .catch((err) => {
          console.error(err);
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
      return;
    }

    const payload = { friend: currentFriend.friend, text: text };

    if(media_url && media_url.length>0){
      payload['media_url'] = media_url;
    }
    if(media_type && media_type.length>0){
      payload['media_type'] = media_type;
    }

    this.props
      .postFriendNotes(payload)
      .then((res) => {
        this.setState({
          text: '',
          uploadedFiles: [],
          progressModalVisible: false,
          uploadProgress: 0,
        });
        this.isUploading = false;
        this.props.navigation.goBack();
        Toast.show({
          title: translate('pages.xchat.notes'),
          text: translate('pages.xchat.toastr.notePosted'),
          type: 'positive',
        });
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
      });
  };

  calculateProgress = (totalItem,currentIndex,progress) => {
    let result = 0;
    let eachTotalPercent = 1/totalItem;
    result = (currentIndex + progress) * eachTotalPercent;
    this.setState({uploadProgress: parseFloat(result.toFixed(2))});
  }

  renderMedia = ({item, index}) => {
    console.log('renderMedia', item)
    let media_type = '';
    let media_url = '';
    if(item.mime){
      if(item.mime.includes('image')){
        media_type = 'image';
      }else {
        media_type = 'video';
      }
      media_url = item.path;
    } else if(item.media_type) {
      media_type = item.media_type;
      media_url = item.media_url;
    }
    return (
      <View style={{ flex: 1, margin: 5 }}>
        <View style={{}}>
          {media_type === 'image' ? (
            <Image
              source={{
                uri: media_url,
              }}
              style={{ width: '100%', height: 200 }}
              resizeMode={'cover'}
            />
          ) : media_type === 'video' ? (
              <View style={{ width: '100%', height: 200, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <VideoPreview
                  url={media_url}
                  customImageView
                  hideLink
                />
                <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#00000040', position: 'absolute', bottom: 0 }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FontAwesome name="play" size={20} color={Colors.white} />
                  </View>
                </View>
              </View>
            ) : null}
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#00000040', position: 'absolute', top: 0, right: 0 }}
          onPress={()=>{
            if(item.media_type){
              let note_media = this.state.note_media.filter((i)=>i.media_url !== item.media_url);
              this.setState({note_media});
            }else{
              if(this.state.note){
                let i = index - this.state.note_media.length;
                this.removeUploadData(i);
              }else {
                this.removeUploadData(index);
              }
            }
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome name="close" size={20} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {
      progressModalVisible,
      text,
      uploadProgress,
      note_media
    } = this.state;
    return (
      <View style={globalStyles.container}>
          <NoteHeader
            onBackPress={() => {
              this.props.navigation.goBack()
            }}
            title={this.props.navigation.state.params.note ? translate('pages.xchat.editNote') : translate('pages.xchat.addNote')}
            // actionText={translate('pages.xchat.post')}
          />
          <KeyboardAwareScrollView
            scrollEnabled
            // enableOnAndroid={true}
            keyboardShouldPersistTaps={'handled'}
            // extraScrollHeight={100}
            extraHeight={100}
            behavior={'position'}
            contentContainerStyle={styles.mainContainer}
            showsVerticalScrollIndicator={false}>

            <TextAreaWithTitle
              onChangeText={(note) => this.setState({ text: note })}
              value={text}
              rightTitle={`${text.length}/300`}
              maxLength={300}
              placeholder={translate('pages.xchat.addNewNote')}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity style={{paddingHorizontal:10}} onPress={this.onCameraPress}>
                <Image
                  source={Icons.icon_camera_outline}
                  style={{
                    width:30,
                    height:30,
                  }}/>
              </TouchableOpacity>
              <TouchableOpacity style={{paddingHorizontal:10}} onPress={this.onGalleryPress}>
                <Image
                  source={Icons.gallery_icon_select}
                  style={{
                    width:30,
                    height:30,
                  }}/>
              </TouchableOpacity>
            </View>

            <View style={{flex:1}}>
              <FlatList
                data={note_media ? [...note_media,...this.state.uploadedFiles] : this.state.uploadedFiles}
                renderItem={this.renderMedia}
                numColumns={2}/>
            </View>

            <View style={{padding: 10}}>
              <Button
                title={translate('pages.xchat.post')}
                type={'primary'}
                onPress={() => {
                  if (this.isUploading) {
                    return;
                  }
                  this.isUploading = true;
                  if(this.state.uploadedFiles.length > 0){
                    this.uploadAndSend()
                  }else if(this.state.text.trim().length > 0){
                    this.forceUpdate();
                    this.onPostNote(this.state.text,null,null);
                  } else if(this.props.navigation.state.params.note && this.props.navigation.state.params.note.media.length > note_media.length){
                    this.forceUpdate();
                    this.onPostNote(this.state.text,null,null);
                  }
                }}
                isRounded={false}
                loading={this.isUploading}
              />
              <Button
                title={translate('common.cancel')}
                type={'secondary'}
                onPress={() => {
                  this.props.navigation.goBack()
                }}
                isRounded={false}
              />
            </View>
          </KeyboardAwareScrollView>

          <UploadProgressModal
            visible={progressModalVisible}
            progress={uploadProgress}
            title={translate('pages.xchat.uploading')}/>

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    currentGroupDetail: state.groupReducer.currentGroupDetail,
    currentGroup: state.groupReducer.currentGroup,
    currentFriend: state.friendReducer.currentFriend,
  };
};

const mapDispatchToProps = {
  postGroupNotes,
  editGroupNotes,
  postFriendNotes,
  editFriendNotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditNote);
