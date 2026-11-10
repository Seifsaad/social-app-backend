import 'dotenv/config'
export const env = {
    db:{
        url: process.env.DB_URL as string,
    }
}