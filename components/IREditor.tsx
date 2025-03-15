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

  // 共通のスタイル定義
  const commonStyles = {
    fontFamily: "'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace",
    fontSize: "14px",
    lineHeight: 1.5,
    padding: "4px",
    margin: 0,
    border: "none",
    boxSizing: "border-box" as const,
    whiteSpace: "pre" as const,
    tabSize: 2,
    letterSpacing: "normal",
    wordSpacing: "normal",
    textRendering: "auto" as const
  };

  // 行番号を生成
  const lines = code.split('\n');
  const lineNumbers = lines.map((_, i) => i + 1);

  return (
    <div className="relative border border-gray-300 rounded h-[calc(100vh-200px)] min-h-[400px] flex">
      {/* 行番号表示エリア */}
      <div className="w-10 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 overflow-hidden">
        <div className="p-4 text-right text-gray-500 dark:text-gray-400 select-none" style={commonStyles}>
          {lineNumbers.map(num => (
            <div key={num} style={{ lineHeight: 1.5 }}>{num}</div>
          ))}
        </div>
      </div>

      {/* エディタエリア */}
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="absolute inset-0 w-full h-full font-mono text-transparent bg-transparent resize-none z-10 caret-black dark:caret-white pl-4"
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          style={commonStyles}
        />
        <pre
          ref={previewRef}
          className="absolute inset-0 w-full h-full font-mono overflow-auto pointer-events-none pl-4"
          style={commonStyles}
        >
          <code
            className={isMounted ? "language-llvm" : ""}
            style={{
              ...commonStyles,
              display: "block",
              padding: 0,
              margin: 0
            }}
          >{code || ' '}</code>
        </pre>
      </div>
    </div>
  );
};

export default IREditor;
