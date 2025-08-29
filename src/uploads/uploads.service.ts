import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { Express } from 'express';

@Injectable()
export class UploadsService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION, // e.g. eu-north-1
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  private bucket = process.env.S3_BUCKET!;

  async uploadImage(
    file: Express.Multer.File,
    params?: { folder?: string; makePublic?: boolean },
  ) {
    const folder = params?.folder ?? 'uploads';
    const ext = this.inferExtension(file.mimetype);
    const key = `${folder}/${randomUUID()}.${ext}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (e) {
      console.error('S3 upload error:', e); // 👈 log the actual AWS error
      throw new InternalServerErrorException('Failed to upload to S3');
    }

    const url = this.buildPublicUrl(key);
    return {
      success: true,
      message: 'Image uploaded successfully',
      key,
      url,
      contentType: file.mimetype,
      size: file.size,
    };
  }

  private inferExtension(mime: string) {
    if (mime === 'image/jpeg') return 'jpg';
    if (mime === 'image/png') return 'png';
    if (mime === 'image/webp') return 'webp';
    return 'bin';
  }

  private buildPublicUrl(key: string) {
    const cdn = process.env.CLOUDFRONT_DOMAIN;
    if (cdn) {
      return `https://${cdn}/${key}`;
    }
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
