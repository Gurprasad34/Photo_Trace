// src/components/ImageUpload.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
	if (event.target.files) {
	  setImage(event.target.files[0]);
	}
  };

  const handleSubmit = async (event: FormEvent) => {
	event.preventDefault();
	if (!image) return;

	const formData = new FormData();
	formData.append('image', image);

	try {
	  const response = await axios.post('/api/analyze-image', formData, {
		headers: {
		  'Content-Type': 'multipart/form-data',
		},
	  });
	  setResult(response.data.result);
	} catch (error) {
	  console.error('Error analyzing image:', error);
	}
  };

  return (
	<div>
	  <h1>Upload an Image</h1>
	  <form onSubmit={handleSubmit}>
		<input type="file" accept="image/*" onChange={handleImageUpload} />
		<button type="submit">Analyze Image</button>
	  </form>
	  {result && (
		<div>
		  <h2>Result:</h2>
		  <p>{result}</p>
		</div>
	  )}
	</div>
  );
};

export default ImageUpload;
