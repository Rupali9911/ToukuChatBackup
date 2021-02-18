import React, {Component} from 'react';
import {View, Text} from 'react-native';
import * as S3 from 'aws-sdk/clients/s3';
import moment from 'moment';
import {environment} from '../constants';
import ImageResizer from 'react-native-image-resizer';
import {RNS3} from 'react-native-aws3';

export default class S3uploadService extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async uploadImagesOnS3Bucket(files, onProgress) {
    const imagesFiles = {image: []};
    for (let i = 0; i < files.length; i++) {
      const file = files[i].uri;
      // const fileName = `image_${moment().valueOf()}_${i + 1}`;
      console.log('file_name',files[i].name);
      const fileName = files[i].name;
      const originResizedImage = await this.uploadImage(
        file,
        fileName,
        800,
        800,
        onProgress,
        files[i].type,
      );
      const originResizedImage_2 = await this.uploadImage(
        file,
        `thumb_${fileName}`,
        360,
        360,
        onProgress,
        files[i].type,
      );

      imagesFiles.image.push({
        image: originResizedImage.body.postResponse.location,
        thumbnail: originResizedImage_2.body.postResponse.location,
      });
    }
    return imagesFiles;
  }

  async uploadImage(file, fileName, width, height, onProgress, type) {
    let imageFile = file;
    if (type != 'image/gif') {
      imageFile = await this.resizeImage(file, width, height, type);
    }
    return await this.uploadFile(imageFile, fileName, 'image/png', onProgress);
  }

  async uploadAudioOnS3Bucket(files, fileType, onProgress) {
    let audio;
    for (let i = 0; i < files.length; i++) {
      const file = files[i].uri;
      // const fileName = `audio_${moment().valueOf()}_${i + 1}.${fileType
      //   .split('/')
      //   .pop()}`;
        console.log('fileName',files[i].name);
      const fileName = files[i].name;
      audio = await this.uploadFile(file, fileName, fileType, onProgress);
    }
    return audio.body.postResponse.location;
  }

  async uploadApplicationOnS3Bucket(files, fileType, onProgress, name) {
    let application;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // const fileName = `doc_${moment().valueOf()}_${i + 1}.${name
      //   .split('.')
      //   .pop()}`;
      const fileName = name;
      application = await this.uploadFile(file, fileName, fileType, onProgress);
    }
    return application.body.postResponse.location;
  }

  async uploadVideoOnS3Bucket(files, type, onProgress) {
    let video;
    for (let i = 0; i < files.length; i++) {
      const file = files[i].uri;
      // const fileName = `video_${moment().valueOf()}_${i + 1}`;
      console.log('file_name',files[i].name);
      const fileName = files[i].name;
      video = await this.uploadFile(file, fileName, type, onProgress);
    }

    return video.body.postResponse.location;
  }

  async uploadFile(file, fileName, fileType, onProgress) {
    const File = {
      uri: file,
      name: moment().valueOf()+"/"+fileName,
      type: fileType,
    };

    const options = {
      keyPrefix: '',
      bucket: 'angelium-media',
      region: environment.s3BucketConfig.region,
      accessKey: environment.s3BucketConfig.accessKeyId,
      secretKey: environment.s3BucketConfig.secretAccessKey,
      successActionStatus: 201,
    };

    return await RNS3.put(File, options)
      .progress((e) => {
        onProgress && onProgress(e);
      })
      .then(async (response) => {
        return await response;
      });
  }

  async resizeImage(file, width, height) {
    // const resizedImage =
    return await ImageResizer.createResizedImage(
      file,
      width,
      height,
      'JPEG',
      10,
    )
      .then(async ({uri}) => {
        console.log('Image resizer1')
        return uri;
      })
      .catch((err) => {
        console.log(err);
        // return err;
      });
    // return await resizedImage;
  }

  // uploadFile(file, fileName) {
  //   const nameRegEx = /(?:\.([^.]+))?$/;
  //   const ext = nameRegEx.exec(file.name)[1] || '';

  //   const params = {
  //     Bucket: 'angelium-media',
  //     Key: `${fileName}.${ext}`,
  //     Body: file,
  //     ACL: 'public-read',
  //     ContentType: file.type,
  //   };
  //   return this.bucket
  //     .upload(params)
  //     .on('httpUploadProgress', (evt) => {
  //       const uploaded = Math.round((evt.loaded / evt.total) * 100);
  //       this.changeCount(uploaded);
  //     })
  //     .promise();
  // }

  render() {
    return <View />;
  }
}
