import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function DocumentsPage() {
  const [tab, setTab] = useState("documents");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filesItems, setFilesItems] = useState([]);
  const [filesPage, setFilesPage] = useState(1);
  const filesPageSize = 5;
  const [filesTotalPages, setFilesTotalPages] = useState(1);
  const [filesTotal, setFilesTotal] = useState(0);
  const [filesLoading, setFilesLoading] = useState(true);

  const fetchPage = async (p = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/documents?page=${p}&limit=${pageSize}`
      );
      setItems(res.data.items || []);
      setPage(res.data.page || p);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error("Failed to fetch documents:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (p = 1) => {
    setFilesLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/files?page=${p}&limit=${filesPageSize}`
      );
      setFilesItems(res.data.items || []);
      setFilesPage(res.data.page || p);
      setFilesTotalPages(res.data.totalPages || 1);
      setFilesTotal(res.data.total || 0);
    } catch (e) {
      console.error("Failed to fetch files:", e);
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
    fetchFiles(1);
  }, []);

  const goTo = (p) => {
    if (tab === "documents") {
      if (p < 1 || p > totalPages) return;
      fetchPage(p);
    } else {
      if (p < 1 || p > filesTotalPages) return;
      fetchFiles(p);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">All Documents</h1>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Back to Editor
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className={`px-3 py-1 rounded text-sm ${tab === "documents" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
                onClick={() => setTab("documents")}
              >
                Documents ({total})
              </button>
              <button
                className={`px-3 py-1 rounded text-sm ${tab === "files" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
                onClick={() => setTab("files")}
              >
                Files ({filesTotal})
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {tab === "documents"
                ? <>Total: {total} • Page {page} of {totalPages} • Page size {pageSize}</>
                : <>Total: {filesTotal} • Page {filesPage} of {filesTotalPages} • Page size {filesPageSize}</>}
            </div>
          </div>

          {tab === "documents" ? (
            loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : items.length === 0 ? (
              <div className="p-10 text-center text-gray-400 italic">
                No documents found.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {items.map((doc, idx) => (
                  <li key={doc.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs">
                        {(page - 1) * pageSize + idx + 1}
                      </span>
                      <div className="font-medium text-gray-900">{doc.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(doc.created_at).toLocaleString()}
                      </div>
                    </div>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )
          ) : filesLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : filesItems.length === 0 ? (
            <div className="p-10 text-center text-gray-400 italic">No files found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Preview</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Uploaded</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filesItems.map((f, idx) => (
                    <tr key={f.id || f.filename}>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {(filesPage - 1) * filesPageSize + idx + 1}
                      </td>
                      <td className="px-4 py-2">
                        {f.file_type?.startsWith("image") ? (
                          <img
                            src={f.file_url}
                            alt={f.original_name}
                            className="w-10 h-10 object-cover rounded border"
                          />
                        ) : (
                          <span className="w-10 h-10 inline-flex items-center justify-center rounded bg-gray-100 text-gray-600 text-xs border">
                            File
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {f.original_name || f.filename}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{f.file_type}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {new Date(f.uploaded_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <a
                          href={f.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Open
                        </a>
                        <button
                          onClick={async () => {
                            try {
                              if (f.id) {
                                await axios.delete(`http://localhost:5000/api/files/${f.id}`);
                              } else {
                                await axios.delete(`http://localhost:5000/api/files/by-filename/${encodeURIComponent(f.filename)}`);
                              }
                              fetchFiles(filesPage);
                            } catch (e) {
                              console.error("Delete failed", e);
                              alert("Delete failed");
                            }
                          }}
                          className="ml-3 text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t border-gray-200 flex items-center justify-center">
            <nav className="inline-flex items-center divide-x divide-gray-200 rounded-md border border-gray-200 bg-white">
              <button
                onClick={() => goTo((tab === "documents" ? page : filesPage) - 1)}
                disabled={(tab === "documents" ? page <= 1 : filesPage <= 1)}
                className={`px-3 py-1 text-sm ${ (tab === "documents" ? page <= 1 : filesPage <= 1) ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-700" }`}
              >
                Previous
              </button>
              {Array.from({ length: tab === "documents" ? totalPages : filesTotalPages }).map((_, i) => {
                const num = i + 1;
                const active = (tab === "documents" ? page : filesPage) === num;
                return (
                  <button
                    key={num}
                    onClick={() => goTo(num)}
                    className={`px-3 py-1 text-sm ${active ? "text-blue-700" : "text-gray-700 hover:text-blue-700"}`}
                  >
                    {num}
                  </button>
                );
              })}
              <button
                onClick={() => goTo((tab === "documents" ? page : filesPage) + 1)}
                disabled={(tab === "documents" ? page >= totalPages : filesPage >= filesTotalPages)}
                className={`px-3 py-1 text-sm ${ (tab === "documents" ? page >= totalPages : filesPage >= filesTotalPages) ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-700" }`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
