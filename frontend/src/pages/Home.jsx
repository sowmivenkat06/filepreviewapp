import { useEffect, useState } from 'react';
import apiClient from '../api/api';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendBase = import.meta.env.VITE_BACKEND_URL?.replace(/\/api$/, '');

  // ✅ Fetch uploaded files on mount
  useEffect(() => {
    apiClient
      .get('/files')
      .then((res) => {
        setUploadedFiles(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('Error loading files:', err);
        setUploadedFiles([]);
      });
  }, []);

  // ✅ Handle preview
  const handlePreview = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (!selected) return;

    if (selected.type.startsWith('image/') || selected.type === 'application/pdf') {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview('');
    }
  };

  // ✅ Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await apiClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFiles((prev) => [...prev, res.data]);
      setFile(null);
      setPreview('');
      alert('File uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render preview of uploaded file
  const renderFilePreview = (f) => {
    const url = `${backendBase}/${f.path}`;
    const type = f.mimetype;

    if (type.startsWith('image/')) {
      return <img src={url} alt={f.filename} style={{ maxWidth: '200px' }} />;
    }

    if (type === 'application/pdf') {
      return (
        <iframe
          src={url}
          width="300"
          height="400"
          title={f.filename}
          style={{ border: '1px solid #ccc' }}
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

        {preview && file && (
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

        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Uploading...' : 'Upload'}
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
