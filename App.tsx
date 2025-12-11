import React, { useState } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { CodePreview } from './components/CodePreview';
import { generatePythonScript } from './services/pythonTemplate';
import { ScriptConfig } from './types';
import { Zap, ShieldCheck, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ScriptConfig>({
    botToken: '',
    chatId: '',
    sourcePath: '~/sessions',
    password: '',
    filename: 'sessions_backup.zip'
  });

  const handleConfigChange = (key: keyof ScriptConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const pythonCode = generatePythonScript(config);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20">
      {/* Header Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-900/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        
        {/* Header */}
        <header className="mb-12 text-center md:text-right">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300 mb-2">
                TeleZip Gen
              </h1>
              <p className="text-slate-400 text-lg">
                ساخت اسکریپت پایتون برای بکاپ‌گیری امن و ارسال به تلگرام
              </p>
            </div>
            
            {/* Feature Badges */}
            <div className="flex gap-3">
                <div className="bg-slate-800/80 backdrop-blur border border-slate-700 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>رمزنگاری AES</span>
                </div>
                <div className="bg-slate-800/80 backdrop-blur border border-slate-700 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium text-cyan-400">
                    <Activity className="w-4 h-4" />
                    <span>نوار پیشرفت</span>
                </div>
                <div className="bg-slate-800/80 backdrop-blur border border-slate-700 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium text-yellow-400">
                    <Zap className="w-4 h-4" />
                    <span>سرعت بالا</span>
                </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <ConfigPanel config={config} onChange={handleConfigChange} />
            
            {/* Info Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl p-6">
                <h3 className="font-bold text-indigo-300 mb-2">چگونه استفاده کنیم؟</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-indigo-100/80">
                    <li>اطلاعات ربات تلگرام خود را وارد کنید.</li>
                    <li>مسیر پوشه‌ای که می‌خواهید زیپ شود را تعیین کنید (مثلا <code>~/sessions</code>).</li>
                    <li>یک رمز عبور قوی برای فایل زیپ تعیین کنید.</li>
                    <li>کد سمت چپ (یا پایین) را کپی کنید و در فایلی با پسوند <code>.py</code> ذخیره کنید.</li>
                    <li>پیشنیازها را نصب کنید و فایل را اجرا کنید.</li>
                </ol>
            </div>
          </div>

          {/* Right Column: Code Preview */}
          <div className="lg:col-span-7 h-[600px] lg:h-auto sticky top-8">
            <CodePreview code={pythonCode} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;