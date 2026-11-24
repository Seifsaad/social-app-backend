import {z} from "zod";
import {config} from "dotenv";

config()
const schema = z.object({
    PORT: z.string().default('3000'),
    MONGODB_URL: z.string(),
    JWT_SECRET: z.string(),
    MAIL_USER: z.string().trim().toLowerCase(),
    MAIL_PASSWORD: z.string(),
    GOOGLE_WEB_OAUTH_CLIENT_ID: z.string(),
    REDIS_PORT: z.string().default('6379'),
    REDIS_HOST: z.string(),
    REDIS_PASSWORD: z.string(),
    MAILJET_API_KEY: z.string(),
    MAILJET_API_SECRET: z.string(),
    MAILJET_FROM_EMAIL: z.string(),
    MAILJET_FROM_NAME: z.string(),
    S3_REGION: z.string(),
    S3_BUCKET_NAME:z.string(),
    S3_SECRET_KEY:z.string(),
    S3_ACCESS_KEY:z.string(),

})

const parsed = schema.parse(process.env);


export const env = {
    port: Number(parsed.PORT),
    db: {
        url: parsed.MONGODB_URL,
    },
    google: {
        webClientId: parsed.GOOGLE_WEB_OAUTH_CLIENT_ID,
    },
    redis: {
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD,
    },
    nodemailer: {
        user: parsed.MAIL_USER,
        password: parsed.MAIL_PASSWORD,
    },
    mailjet: {
        apiKey: parsed.MAILJET_API_KEY,
        apiSecret: parsed.MAILJET_API_SECRET,
        fromEmail: parsed.MAILJET_FROM_EMAIL,
        fromName: parsed.MAILJET_FROM_NAME,
    },
    jwt: {
        secret: parsed.JWT_SECRET,
    },
    payments:{},
    aws:{
        secretKey: parsed.S3_SECRET_KEY,
        accessKey: parsed.S3_ACCESS_KEY,
        region: parsed.S3_REGION,
        bucketName: parsed.S3_BUCKET_NAME,
    },
}