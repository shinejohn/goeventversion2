import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class R2StorageService {
  private static client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  
  /**
   * Upload event image to R2
   */
  static async uploadEventImage(file: File, eventId: string): Promise<string> {
    const key = `events/${eventId}/${Date.now()}-${file.name}`;
    
    await this.client.send(new PutObjectCommand({
      Bucket: 'wtf-images',
      Key: key,
      Body: file,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    }));
    
    // Return public URL (via Cloudflare CDN)
    return `https://images.whensthefun.com/${key}`;
  }
  
  /**
   * Upload venue image to R2
   */
  static async uploadVenueImage(file: File, venueId: string): Promise<string> {
    const key = `venues/${venueId}/${Date.now()}-${file.name}`;
    
    await this.client.send(new PutObjectCommand({
      Bucket: 'wtf-images',
      Key: key,
      Body: file,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000',
    }));
    
    return `https://images.whensthefun.com/${key}`;
  }
  
  /**
   * Upload user avatar to R2
   */
  static async uploadUserAvatar(file: File, userId: string): Promise<string> {
    const key = `avatars/${userId}/${Date.now()}-${file.name}`;
    
    await this.client.send(new PutObjectCommand({
      Bucket: 'wtf-images',
      Key: key,
      Body: file,
      ContentType: file.type,
      CacheControl: 'public, max-age=604800', // 1 week cache
    }));
    
    return `https://images.whensthefun.com/${key}`;
  }
  
  /**
   * Delete an object from R2
   */
  static async deleteObject(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({
      Bucket: 'wtf-images',
      Key: key,
    }));
  }
  
  /**
   * Generate a presigned URL for direct uploads
   */
  static async getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: 'wtf-images',
      Key: key,
      ContentType: contentType,
    });
    
    // URL expires in 5 minutes
    return await getSignedUrl(this.client, command, { expiresIn: 300 });
  }
  
  /**
   * Generate a presigned URL for private downloads
   */
  static async getPresignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: 'wtf-images',
      Key: key,
    });
    
    // URL expires in 1 hour
    return await getSignedUrl(this.client, command, { expiresIn: 3600 });
  }
}