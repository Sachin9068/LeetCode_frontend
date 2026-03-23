import Editor from '@monaco-editor/react';

function MyEditor() {
  const [code, setCode] = useState('');

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div style={{ height: '90vh' }}>
      <Editor
        height="100%"           // By default, it fits the parent container
        language="javascript"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"         // Optional: 'vs-dark', 'light', 'hc-black'
      />
    </div>
  );
}

export default MyEditor;