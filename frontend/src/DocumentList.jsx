import { useEffect, useState } from "react";
import axios from "axios";

export default function DocumentList({ onSelect, selectedId }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/documents")
      .then((res) => {
        setDocs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching docs:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDocs();

    const handleDocSaved = () => fetchDocs();
    window.addEventListener('doc-saved', handleDocSaved);

    return () => {
      window.removeEventListener('doc-saved', handleDocSaved);
    };
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  if (docs.length === 0) {
    return <div className="p-8 text-center text-gray-400 italic">No documents yet.</div>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {docs.map((doc) => (
        <li key={doc.id}>
          <button
            onClick={() => onSelect(doc.id)}
            className={`w-full text-left p-4 hover:bg-blue-50 transition-colors focus:outline-none focus:bg-blue-50 ${
              selectedId === doc.id ? "bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"
            }`}
          >
            <div className={`font-medium mb-1 ${selectedId === doc.id ? "text-blue-700" : "text-gray-900"}`}>
              {doc.title}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(doc.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
