import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp = require("sharp");

@Injectable()
export class UploaderService {
  private client: S3Client;
  private bucketName: string;
  private endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>("MINIO_BUCKET_NAME") || " ";
    this.endpoint = this.configService.get<string>("MINIO_ENDPOINT") || "";
    const s3_region = "us-east-1";
    const accessKey = this.configService.get<string>("MINIO_ACCESS_KEY");
    const secretAccessKey = this.configService.get<string>("MINIO_SECRET_KEY");
    if (!s3_region || !accessKey || !secretAccessKey)
      throw new Error("not found");
    this.client = new S3Client({
      region: s3_region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadPostFile(file: Express.Multer.File) {
    const uuid = uuidv4();
    const key = `post_pictures/${uuid}`;
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
        Metadata: {
          originalName: file.originalname,
        },
      });
      await this.client.send(command);
      return {
        url: `${this.endpoint}/${this.bucketName}/${key}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async resizeImage(
    fileBuffer: Buffer,
    width: number,
    height: number,
    quality = 80,
  ): Promise<Buffer> {
    try {
      return await sharp(fileBuffer)
        .resize(width, height, { fit: "cover" })
        .jpeg({ quality })
        .toBuffer();
    } catch (err) {
      Logger.log(err);
      throw new InternalServerErrorException(
        "Failed to resize/convert image to JPEG",
      );
    }
  }

  async resizePFP(fileBuffer: Buffer) {
    return {
      small: await this.resizeImage(fileBuffer, 32, 32),
      big: await this.resizeImage(fileBuffer, 256, 256),
    };
  }

  async uploadProfilePhoto({
    file,
  }: {
    file: Express.Multer.File;
    isPublic: boolean;
  }) {
    try {
      const uuid = uuidv4();
      const resized = await this.resizePFP(file.buffer);

      await Promise.all([
        this.client.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: `profile_pictures/32x32_${uuid}.jpeg`,
            Body: resized.small,
            ContentType: "image/jpeg",
            ACL: "public-read",
            Metadata: { originalName: file.originalname },
          }),
        ),
        this.client.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: `profile_pictures/256x256_${uuid}.jpeg`,
            Body: resized.big,
            ContentType: "image/jpeg",
            ACL: "public-read",
            Metadata: { originalName: file.originalname },
          }),
        ),
      ]);

      return {
        url: uuid,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  getPfpUrl(key: string) {
    return {
      url: `${this.endpoint}/${this.bucketName}/${key}`,
    };
  }

  getFileUrl(key: string) {
    return { url: `${this.endpoint}/${this.bucketName}/${key}` };
  }

  async getPresignedSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });

      return { url };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);

      return { message: "File deleted successfully" };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
