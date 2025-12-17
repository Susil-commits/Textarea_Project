import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const Editor = ({ docId }) => {
  const quillRef = useRef(null);
  const [theme, setTheme] = useState('snow');
  const [initialDelta, setInitialDelta] = useState(null);

  /* ---------- Load document ONCE ---------- */
  useEffect(() => {
    if (!docId) return;

    axios.get(`http://localhost:5000/api/${docId}`)
      .then(res => {
        setInitialDelta(JSON.parse(res.data.content));
      });
  }, [docId]);

  /* ---------- Image Upload ---------- */
  const imageHandler = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post(
        'http://localhost:5000/api/upload',
        formData
      );

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);

      quill.insertEmbed(range.index, 'image', res.data.url);
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  };

  /* ---------- Save (manual read) ---------- */
  const save = async () => {
    const quill = quillRef.current.getEditor();
    const delta = quill.getContents();

    await axios.post('http://localhost:5000/api/save', {
      content: JSON.stringify(delta)
    });

    alert('Saved');
  };

  return (
    <div style={{ width: '75%', margin: 'auto' }}>
      <select onChange={e => setTheme(e.target.value)}>
        <option value="snow">Snow</option>
        <option value="bubble">Bubble</option>
      </select>

      <ReactQuill
        ref={quillRef}
        theme={theme}
        defaultValue={initialDelta}
        modules={modules}
      />

      <button onClick={save} style={{ marginTop: '10px' }}>Save</button>
    </div>
  );
};

export default Editor;
