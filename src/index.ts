import express from 'express';
import './common/db/connection'

const app = express();

app.listen(3000,()=>console.log('Server running on port 3000'));