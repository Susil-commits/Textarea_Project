import { useState } from 'react';
import Editor from './Editor';
import DocumentList from './DocumentList';

function App() {
  const [docId, setDocId] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <DocumentList onSelect={setDocId} />
      <Editor docId={docId} />
    </div>
  );
}

export default App;
