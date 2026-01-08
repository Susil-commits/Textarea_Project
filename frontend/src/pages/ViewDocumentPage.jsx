import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Viewer from "../Viewer";

export default function ViewDocumentPage() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/documents/${id}`);
        setDoc(res.data);
      } catch (e) {
        console.error("Failed to load document:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">View Document</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/documents"
              className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              All Documents
            </Link>
            <Link
              to="/"
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Back to Editor
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : !doc ? (
            <div className="text-center text-gray-400 italic">Document not found.</div>
          ) : (
            <>
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{doc.title}</h1>
                <p className="text-sm text-gray-500">
                  Created at: {new Date(doc.created_at).toLocaleString()}
                </p>
              </div>
              <Viewer delta={doc.content} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
