import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Download } from 'lucide-react';
import { CopyState } from '../types';

interface CodePreviewProps {
  code: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const [copyState, setCopyState] = useState<CopyState>(CopyState.IDLE);

  useEffect(() => {
    if (copyState === CopyState.COPIED) {
      const timer = setTimeout(() => setCopyState(CopyState.IDLE), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyState]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopyState(CopyState.COPIED);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/x-python'});
    element.href = URL.createObjectURL(file);
    element.download = "backup_sender.py";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-3 text-slate-400 text-sm font-mono flex items-center gap-1">
             <Terminal className="w-3 h-3" /> backup_sender.py
          </span>
        </div>
        <div className="flex items-center gap-2">
             <button
            onClick={handleDownload}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs"
            title="دانلود فایل .py"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">دانلود</span>
          </button>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-medium border ${
              copyState === CopyState.COPIED
                ? 'bg-green-500/10 text-green-400 border-green-500/50'
                : 'hover:bg-slate-700 text-slate-400 hover:text-white border-transparent'
            }`}
          >
            {copyState === CopyState.COPIED ? (
              <>
                <Check className="w-4 h-4" />
                کپی شد!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                کپی کد
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto relative group">
        <pre className="p-4 text-sm font-mono text-slate-300 leading-relaxed tab-4">
          <code>{code}</code>
        </pre>
      </div>
      
      {/* Footer Instructions */}
      <div className="bg-slate-950 p-4 border-t border-slate-800">
         <h4 className="text-brand-400 text-xs font-bold uppercase mb-2">دستور نصب پیشنیازها:</h4>
         <code className="block bg-black/50 p-2 rounded text-green-400 font-mono text-xs select-all">
            pip install pyzipper requests tqdm requests-toolbelt
         </code>
      </div>
    </div>
  );
};