import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as S3 from 'aws-sdk/clients/s3';
import moment from 'moment';
import { environment } from '../constants';
import ImageResizer from 'react-native-image-resizer';
import { RNS3 } from 'react-native-aws3';

export default class S3uploadService extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async uploadImagesOnS3Bucket(files) {
    const imagesFiles = { image: [] };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `image_${moment().valueOf()}_${i + 1}`;
      const originResizedImage = await this.uploadImage(
        file,
        fileName,
        1280,
        1200
      );
      const originResizedImage_2 = await this.uploadImage(
        file,
        `thumb_${fileName}`,
        360,
        360
      );
      imagesFiles.image.push({
        image: originResizedImage.body.postResponse.location,
        thumbnail: originResizedImage_2.body.postResponse.location,
      });
    }
    return imagesFiles;
  }

  async uploadImage(file, fileName, width, height) {
    const imageFile = await this.resizeImage(file, width, height);
    return await this.uploadFile(imageFile, fileName, 'image/png');
  }

  async uploadAudioOnS3Bucket(files, fileName, fileType) {
    let audio;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      audio = await this.uploadFile(file, fileName, fileType);
    }
    return audio.body.postResponse.location;
  }

  async uploadApplicationOnS3Bucket(files, fileName, fileType) {
    let application;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      application = await this.uploadFile(file, fileName, fileType);
    }
    return application.body.postResponse.location;
  }

  async uploadVideoOnS3Bucket(files) {
    let video;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `video_${moment().valueOf()}_${i + 1}`;
      video = await this.uploadFile(file, fileName, 'video/mp4');
    }
    return video;
  }

  async uploadFile(file, fileName, fileType) {
    const File = {
      uri: file,
      name: fileName,
      type: fileType,
    };

    const options = {
      keyPrefix: '/',
      bucket: 'angelium-media',
      region: environment.s3BucketConfig.region,
      accessKey: environment.s3BucketConfig.accessKeyId,
      secretKey: environment.s3BucketConfig.secretAccessKey,
      successActionStatus: 201,
    };

    return await RNS3.put(File, options).then(async (response) => {
      return await response;
    });
  }

  async resizeImage(file, width, height) {
    const resizedImage = await ImageResizer.createResizedImage(
      file,
      width,
      height,
      'PNG',
      100
    )
      .then(async ({ uri }) => {
        return await uri;
      })
      .catch((err) => {
        // return err;
      });
    return await resizedImage;
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
