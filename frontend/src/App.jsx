import { useState } from "react";
import Editor from "./Editor";
import DocumentList from "./DocumentList";
import Viewer from "./Viewer";
import axios from "axios";

export default function App() {
  const [viewMode, setViewMode] = useState("editor"); // 'editor' | 'viewer'
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleSelectDoc = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/documents/${id}`);
      setSelectedDoc(res.data);
      setViewMode("viewer");
    } catch (err) {
      console.error("Error fetching document:", err);
      alert("Failed to load document");
    }
  };

  const handleCreateNew = () => {
    setSelectedDoc(null);
    setViewMode("editor");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900">DocManager</h1>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Document
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar / Document List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Saved Documents</h2>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <DocumentList onSelect={handleSelectDoc} selectedId={selectedDoc?.id} />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
              {viewMode === "editor" ? (
                <Editor onSaveSuccess={() => {
                  // Refresh list (we might need to lift state up or trigger a reload)
                  // For now, we can just switch to 'viewer' if we had the ID, but newly created doesn't return ID easily in the current Editor logic without changes.
                  // Let's just reset to create new.
                  handleCreateNew();
                  // Ideally we want to refresh the list.
                  // We can pass a refresh trigger to DocumentList.
                  window.dispatchEvent(new Event('doc-saved')); // Simple event bus for now
                }} />
              ) : (
                <div className="p-6">
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedDoc?.title}</h1>
                    <p className="text-sm text-gray-500">
                      Created at: {new Date(selectedDoc?.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Viewer delta={selectedDoc?.content} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
