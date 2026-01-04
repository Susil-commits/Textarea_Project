import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "./quill-custom.css";

export default function Viewer({ delta }) {
  return (
    <div className="prose max-w-none">
      <ReactQuill 
        value={delta} 
        readOnly 
        theme="bubble"
        className="view-only-quill"
      />
    </div>
  );
}
