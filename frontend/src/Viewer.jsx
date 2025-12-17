import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

const Viewer = ({ delta }) => (
  <ReactQuill value={delta} readOnly theme="bubble" />
);

export default Viewer;
