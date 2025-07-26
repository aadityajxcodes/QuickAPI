import React, { useState } from 'react';
import './App.css';

const methodColors = {
  GET: '#4CAF50',
  POST: '#2196F3',
  PUT: '#FF9800',
  DELETE: '#F44336',
  PATCH: '#9C27B0',
};

function App() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');

  const sendRequest = async () => {
    try {
      const options = {
        method,
        headers: {},
      };

      // Attach headers
      headers.forEach(({ key, value }) => {
        if (key && value) {
          options.headers[key] = value;
        }
      });

      // Attach body if needed
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        options.body = body;
        if (!options.headers['Content-Type']) {
          options.headers['Content-Type'] = 'application/json';
        }
      }

      const res = await fetch(url, options);
      const contentType = res.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
      } else {
        data = await res.text();
        setResponse(data);
      }
    } catch (err) {
      setResponse('Error: ' + err.message);
    }
  };

  const updateHeader = (index, field, value) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  const addHeaderField = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  return (
    <div className="app">
      <h1 className="title">🧪QuickAPI</h1>

      <div className="row">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{ backgroundColor: methodColors[method] || 'white' }}
        >
          {Object.keys(methodColors).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter API URL"
          className="url-input"
        />

        <button onClick={sendRequest}>Send</button>
      </div>

      <div className="headers">
        <h3>Headers</h3>
        {headers.map((header, idx) => (
          <div key={idx} className="header-pair">
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              onChange={(e) => updateHeader(idx, 'key', e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              value={header.value}
              onChange={(e) => updateHeader(idx, 'value', e.target.value)}
            />
          </div>
        ))}
        <button onClick={addHeaderField} className="add-header-btn">+ Add Header</button>
      </div>

      {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
        <div className="body-input">
          <h3>Request Body (raw JSON)</h3>
          <textarea
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
          />
        </div>
      )}

      <div className="response-section">
        <h3>Response</h3>
        <pre>{response}</pre>
      </div>
    </div>
  );
}

export default App;
