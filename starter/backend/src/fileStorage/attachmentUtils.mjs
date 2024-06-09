import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl as getPreSignedUrl} from '@aws-sdk/s3-request-presigner'

const s3_bucket = process.env.ATTACHMENT_S3_BUCKET


export async function createPresignedUrl(imageId) {

    const s3Client = new S3Client()
    
    const putObjectCommand = new PutObjectCommand({
        Bucket: s3_bucket,
        Key: imageId
      })

      const imageUrl = await getPreSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 500
      })

      return imageUrl

}