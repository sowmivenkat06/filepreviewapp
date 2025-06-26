import { useEffect, useState } from 'react';
import apiClient from '../api/api';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch uploaded files on load
  useEffect(() => {
    apiClient.get('/files').then((res) => {
      setUploadedFiles(res.data);
    });
  }, []);

  const handlePreview = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post('/files/upload', formData);
      setUploadedFiles([...uploadedFiles, res.data]);
      setFile(null);
      setPreview('');
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="upload-box">
      <h2>Upload a File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handlePreview} accept="image/*,.pdf" />
        {preview && (
          <div>
            <p>Preview:</p>
            <img src={preview} alt="preview" style={{ maxWidth: '100%' }} />
          </div>
        )}
        <button type="submit">Upload</button>
      </form>

      <h3 style={{ marginTop: '2rem' }}>Uploaded Files</h3>
      <div>
        {uploadedFiles.map((f) => (
          <div key={f._id} className="file-item">
            {f.mimetype.startsWith('image/') ? (
              <img src={`/uploads/${f.filename}`} alt={f.filename} style={{ maxWidth: '100%' }} />
            ) : (
              <a href={`/uploads/${f.filename}`} target="_blank" rel="noopener noreferrer">
                {f.filename}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
