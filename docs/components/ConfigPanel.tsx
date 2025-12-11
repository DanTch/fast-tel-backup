import React from 'react';
import { ScriptConfig } from '../types';
import { Settings, Key, Folder, FileArchive, MessageCircle } from 'lucide-react';

interface ConfigPanelProps {
  config: ScriptConfig;
  onChange: (key: keyof ScriptConfig, value: string) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-center gap-3 mb-6 text-brand-500 border-b border-slate-700 pb-4">
        <Settings className="w-6 h-6" />
        <h2 className="text-xl font-bold">تنظیمات اسکریپت</h2>
      </div>

      <div className="space-y-5">
        
        {/* Telegram Config */}
        <div className="space-y-3">
          <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            توکن ربات تلگرام (Bot Token)
          </label>
          <input
            type="text"
            dir="ltr"
            placeholder="123456789:ABCdefGHIjklMNO..."
            className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 font-mono text-sm"
            value={config.botToken}
            onChange={(e) => onChange('botToken', e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            آیدی عددی چت (Chat ID)
          </label>
          <input
            type="text"
            dir="ltr"
            placeholder="12345678"
            className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 font-mono text-sm"
            value={config.chatId}
            onChange={(e) => onChange('chatId', e.target.value)}
          />
        </div>

        <hr className="border-slate-700 my-4" />

        {/* File Config */}
        <div className="space-y-3">
          <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
            <Folder className="w-4 h-4" />
            مسیر پوشه هدف
          </label>
          <input
            type="text"
            dir="ltr"
            placeholder="~/sessions"
            className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 font-mono text-sm"
            value={config.sourcePath}
            onChange={(e) => onChange('sourcePath', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
            <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <Key className="w-4 h-4" />
                رمز فایل زیپ
            </label>
            <input
                type="text"
                dir="ltr"
                placeholder="MySecretPass123"
                className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 font-mono text-sm"
                value={config.password}
                onChange={(e) => onChange('password', e.target.value)}
            />
            </div>

            <div className="space-y-3">
            <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <FileArchive className="w-4 h-4" />
                نام فایل خروجی
            </label>
            <input
                type="text"
                dir="ltr"
                placeholder="sessions_backup.zip"
                className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 font-mono text-sm"
                value={config.filename}
                onChange={(e) => onChange('filename', e.target.value)}
            />
            </div>
        </div>

      </div>
      
      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-yellow-200 text-xs leading-relaxed">
          توجه: این ابزار یک اسکریپت پایتون امن برای شما تولید می‌کند. برای اجرا، شما باید پایتون را روی سیستم خود نصب داشته باشید.
        </p>
      </div>
    </div>
  );
};