import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';  // Import routes from index file in the routes folder
import connectDB from './config/connection.js';  // Import database connection


await connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000',
  'https://photo-trace-client.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(routes);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});