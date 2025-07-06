import { useEffect, useState } from 'react';
import apiClient from '../api/api';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch all uploaded files on load
  useEffect(() => {
    apiClient.get('/files')
      .then((res) => setUploadedFiles(res.data))
      .catch((err) => console.error('Error loading files:', err));
  }, []);

  // Handle file input + preview
  const handlePreview = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected && selected.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selected));
    } else if (selected && selected.type === 'application/pdf') {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview('');
    }
  };

  // Upload file to server
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file first.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post('/files/upload', formData);
      setUploadedFiles([...uploadedFiles, res.data]);
      setFile(null);
      setPreview('');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('File upload failed');
    }
  };

  // Render preview based on mimetype
  const renderFilePreview = (f) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/${f.path}`;
  const type = f.mimetype;

    if (type.startsWith('image/')) {
      return <img src={url} alt={f.filename} style={{ maxWidth: '200px', marginBottom: '10px' }} />;
    }

    if (type === 'application/pdf') {
      return (
        <iframe
          src={url}
          width="300"
          height="400"
          title={f.filename}
          style={{ border: '1px solid #ccc', marginBottom: '10px' }}
        />
      );
    }

    if (
      type === 'application/vnd.ms-powerpoint' ||
      type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          🔗 View PPT: {f.filename}
        </a>
      );
    }

    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        📎 {f.filename}
      </a>
    );
  };

  return (
    <div className="upload-box" style={{ padding: '2rem' }}>
      <h2>📤 Upload a File</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={handlePreview}
          accept="image/*,.pdf,.ppt,.pptx"
          required
        />
        {preview && (
          <div style={{ margin: '1rem 0' }}>
            <p>Preview:</p>
            {file.type.startsWith('image/') && (
              <img src={preview} alt="preview" style={{ maxWidth: '300px' }} />
            )}
            {file.type === 'application/pdf' && (
              <iframe
                src={preview}
                width="300"
                height="400"
                title="PDF Preview"
                style={{ border: '1px solid #ccc' }}
              />
            )}
          </div>
        )}
        <button type="submit" style={{ marginTop: '1rem' }}>
          Upload
        </button>
      </form>

      <h3 style={{ marginTop: '3rem' }}>📁 Uploaded Files</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {uploadedFiles.map((f) => (
          <div key={f._id} className="file-item">
            {renderFilePreview(f)}
          </div>
        ))}
      </div>
    </div>
  );
}
