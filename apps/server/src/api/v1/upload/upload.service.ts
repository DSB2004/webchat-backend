import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
const imagekit = new ImageKit({
  publicKey: process.env.CLOUD_PUBLIC_KEY as string,
  privateKey: process.env.CLOUD_PRIVATE_KEY as string,
  urlEndpoint: process.env.CLOUD_URL as string,
});

@Injectable()
export class UploadService {
  async uploadFile(file: any, folder = '/') {
    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: file.buffer,
          fileName: file.originalname,
          folder,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
    });
  }
}
