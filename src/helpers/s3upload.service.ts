import * as S3 from 'aws-sdk/clients/s3';
import {
  NgxPicaResizeOptionsInterface,
  NgxPicaService,
} from '@digitalascetic/ngx-pica';
import {BehaviorSubject} from 'rxjs';

import * as moment from 'moment';
import {environment} from '../constants';

export class S3uploadService {
  bucket = new S3(environment.s3BucketConfig);

  private progressSource = new BehaviorSubject('');
  currentProgress = this.progressSource.asObservable();

  constructor(private _ngxPicaService: NgxPicaService) {}

  uploadFile(file: any, fileName: string) {
    const nameRegEx = /(?:\.([^.]+))?$/;
    const ext = nameRegEx.exec(file.name)[1] || '';

    const params = {
      Bucket: 'angelium-media',
      Key: `${fileName}.${ext}`,
      Body: file,
      ACL: 'public-read',
      ContentType: file.type,
    };
    return this.bucket
      .upload(params)
      .on('httpUploadProgress', (evt) => {
        const uploaded = Math.round((evt.loaded / evt.total) * 100);
        this.changeCount(uploaded);
      })
      .promise();
  }

  changeCount(message: any) {
    this.progressSource.next(message);
  }

  getImageDimension(file: any) {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        const img = new Image();
        img.onload = () => {
          resolve({width: img.width, height: img.height});
        };
        img.src = reader.result.toString(); // The data URL
      });
      reader.readAsDataURL(file);
    });
  }

  async resizeImage(file: any, width: number, height: number) {
    const diemnsions: any = await this.getImageDimension(file);
    const options: NgxPicaResizeOptionsInterface = {
      aspectRatio: {keepAspectRatio: true},
      alpha: true,
    };
    const imageResized: any = await this._ngxPicaService
      .resizeImages(
        [file],
        Math.min(width, diemnsions.width),
        Math.min(height, diemnsions.height),
        options,
      )
      .toPromise();
    return imageResized;
  }

  async uploadImage(
    file: any,
    fileName: string,
    width: number,
    height: number,
  ) {
    const imageFile: any = await this.resizeImage(file, width, height);
    return await this.uploadFile(imageFile, fileName);
  }

  async uploadImagesOnS3Bucket(files) {
    const imagesFiles = {image: []};
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `image_${moment().valueOf()}_${i + 1}`;
      const originResizedImage: any = await this.uploadImage(
        file,
        fileName,
        1280,
        1200,
      );
      const originResizedImage_2: any = await this.uploadImage(
        file,
        `thumb_${fileName}`,
        360,
        360,
      );
      imagesFiles.image.push({
        image: originResizedImage.Location,
        thumbnail: originResizedImage_2.Location,
      });
    }
    return imagesFiles;
  }

  async multipleImageUploadOnS3Bucket(file, index) {
    const fileName = `image_${moment().valueOf()}_${index + 1}`;
    const originResizedImage: any = await this.uploadImage(
      file,
      fileName,
      1280,
      1200,
    );
    const originResizedImage_2: any = await this.uploadImage(
      file,
      `thumb_${fileName}`,
      360,
      360,
    );
    return {
      type: 'image',
      text: originResizedImage.Location,
      thumbnail: originResizedImage_2.Location,
    };
  }

  async uploadAudioOnS3Bucket(files) {
    const audioFiles = {
      audio: [],
    };
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const originResizedImage_2: any = await this.uploadFile(
          file,
          `audio_${moment().valueOf()}_${i + 1}`,
        );
        const audio: any = {
          audio: originResizedImage_2.Location,
        };
        audioFiles.audio.push(audio);
      }
      return audioFiles;
    }
  }

  async multipleAudioVideoUploadOnS3Bucket(
    file: any,
    type: string,
    index: number,
  ) {
    // audio/video both
    const originResizedImage_2: any = await this.uploadFile(
      file,
      `${type}_${moment().valueOf()}_${index + 1}`,
    );
    return {
      type: type,
      text: originResizedImage_2.Location,
      thumbnail: '',
    };
  }

  async uploadVideoOnS3Bucket(files) {
    const videoFiles = {
      video: [],
    };
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const originResizedImage_2: any = await this.uploadFile(
          file,
          `video_${moment().valueOf()}_${i + 1}`,
        );
        const video: any = {
          video: originResizedImage_2.Location,
        };
        videoFiles.video.push(video);
      }
      return videoFiles;
    }
  }

  async uploadDocumentsOnS3Bucket(files) {
    const documentFiles = {
      doc: [],
    };
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const originResizedImage_2: any = await this.uploadFile(
          file,
          `doc_${moment().valueOf()}_${i + 1}`,
        );
        const doc: any = {
          doc: originResizedImage_2.Location,
        };
        documentFiles.doc.push(doc);
      }
      return documentFiles;
    }
  }
}
