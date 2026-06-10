const fetch = require('node-fetch');

const testPayload = {
  dataUri: 'data:text/plain;base64,SGVsbG8gV29ybGQ=',
  analysisType: 'plagiarism',
  paperId: 'test'
};

fetch('http://localhost:3001/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testPayload)
})
  .then(res => {
    console.log('Status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('Response:', JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
