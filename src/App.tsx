// src/App.js
import ImageUpload from './controllers/ImageUpload.js';
import './App.css'; // Import a CSS file for styling

function App() {
  return (
	<div className="App">
	  <header className="App-header">
		<h1>PhotoTrace App</h1>
	  </header>
	  <main className="App-main">
		<ImageUpload />
	  </main>
	  <footer className="App-footer">
		<p>&copy; 2023 Photo Trace. All rights reserved.</p>
	  </footer>
	</div>
  );
}

export default App;
