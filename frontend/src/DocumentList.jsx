import { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList = ({ onSelect }) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/all')
      .then(res => setDocs(res.data));
  }, []);

  const remove = async id => {
    await axios.delete(`http://localhost:5000/api/${id}`);
    setDocs(docs.filter(d => d.id !== id));
  };

  return (
    <div>
      {docs.map(d => (
        <div key={d.id}>
          Doc #{d.id}
          <button onClick={() => onSelect(d.id)}>Edit</button>
          <button onClick={() => remove(d.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
