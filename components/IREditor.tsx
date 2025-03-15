import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-llvm';
import 'prismjs/themes/prism-tomorrow.css'; // シンタックスハイライトのテーマをインポート

interface IREditorProps {
  code: string;
  onChange: (code: string) => void;
}

const IREditor: React.FC<IREditorProps> = ({ code, onChange }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLPreElement>(null);

  // クライアントサイドでのみ実行されるようにする
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Prism.jsの初期化
      Prism.highlightAll();
    }
  }, [code, isMounted]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (previewRef.current && editorRef.current) {
      previewRef.current.scrollTop = editorRef.current.scrollTop;
      previewRef.current.scrollLeft = editorRef.current.scrollLeft;
    }
  };

  return (
    <div className="relative border border-gray-300 rounded h-[calc(100vh-200px)] min-h-[400px]">
      <textarea
        ref={editorRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className="absolute inset-0 w-full h-full p-4 font-mono text-transparent bg-transparent resize-none z-10 caret-black dark:caret-white text-[14px] leading-[1.5]"
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        style={{ fontFamily: "'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace" }}
      />
      <pre
        ref={previewRef}
        className="absolute inset-0 w-full h-full p-4 font-mono overflow-auto pointer-events-none text-[14px] leading-[1.5]"
        style={{ fontFamily: "'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace" }}
      >
        <code className={isMounted ? "language-llvm" : ""}>{code || ' '}</code>
      </pre>
    </div>
  );
};

export default IREditor;
