import express from 'express';
import routes from './routes/index.js';  // Import routes from index file in the routes folder
import connectDB from './config/connection.js';  // Import database connection


await connectDB();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(routes);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});