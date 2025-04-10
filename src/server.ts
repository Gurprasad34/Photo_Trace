import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import routes from './routes/index.js';  // Import routes from index file in the routes folder
import authRoutes from './routes/auth.js';
import connectDB from './config/connection.js';  // Import database connection
import './config/passport.js';

await connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000',
  'https://photo-trace-client.onrender.com'
];

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI as string,
    ttl: 24 * 60 * 60 // 24 hours
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});