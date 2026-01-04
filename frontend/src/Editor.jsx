import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import "./quill-custom.css"; // We might need some custom CSS for Quill height

export default function Editor({ onSaveSuccess }) {
  const quillRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const uploadAndInsert = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection() || { index: 0 };

      if (file.type.startsWith("image")) {
        quill.insertEmbed(range.index, "image", res.data.file_url);
      } else {
        quill.insertText(range.index, file.name, "link", res.data.file_url);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("File upload failed");
    }
  };

  const saveDocument = async () => {
    if (!title.trim()) {
      alert("Document title is required");
      return;
    }

    setSaving(true);
    const delta = quillRef.current.getEditor().getContents();

    try {
      await axios.post("http://localhost:5000/api/documents", {
        title: title.trim(),
        content: delta,
      });

      // reset editor
      setTitle("");
      setContent("");
      quillRef.current.getEditor().setText("");
      
      if (onSaveSuccess) onSaveSuccess();
      
      // alert("Document saved successfully"); // Optional, maybe notification is better
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Untitled Document"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-2xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-400 text-gray-900 px-0"
        />
        <button 
          onClick={saveDocument}
          disabled={saving}
          className={`px-6 py-2 rounded-md font-medium text-white shadow-sm transition-colors ${
            saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          theme="snow"
          className="h-full flex flex-col"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean']
            ],
          }}
        />
        
        {/* Custom Toolbar Extension for File Upload if needed, or just keep it simple */}
        <div className="absolute bottom-4 right-4 z-10">
           <label className="cursor-pointer bg-white border border-gray-300 shadow-sm rounded-full p-3 hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600" title="Upload File/Image">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <input
                type="file"
                className="hidden"
                onChange={(e) => uploadAndInsert(e.target.files[0])}
              />
           </label>
        </div>
      </div>
    </div>
  );
}
