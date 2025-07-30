import express from 'express';
import emailRoutes from './routes/emailRoutes'; 
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 


app.use('/emails', emailRoutes);


app.get('/', (req, res) => {
  res.send('Email API is running!');
});

export default app;
