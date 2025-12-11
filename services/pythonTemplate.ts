import { ScriptConfig } from '../types';

export const generatePythonScript = (config: ScriptConfig): string => {
  const { botToken, chatId, sourcePath, password, filename } = config;

  // Escape backslashes for Python strings if user is on Windows
  const safePath = sourcePath.replace(/\\/g, '/');

  return `import os
import time
import zipfile
import requests
from tqdm import tqdm
import pyzipper  # Needs: pip install pyzipper requests tqdm requests-toolbelt

# --- تنظیمات کاربر ---
BOT_TOKEN = "${botToken || 'YOUR_BOT_TOKEN'}"
CHAT_ID = "${chatId || 'YOUR_CHAT_ID'}"
SOURCE_FOLDER = r"${safePath || '~/sessions'}"
ZIP_PASSWORD = "${password || '12345'}"
OUTPUT_FILENAME = "${filename || 'backup.zip'}"
# ---------------------

def expand_path(path):
    """مسیرهای کاربری مثل ~ را باز می‌کند."""
    return os.path.expanduser(path)

def send_status(token, chat_id, text):
    """ارسال پیام وضعیت به کاربر و دریافت شناسه پیام"""
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        response = requests.post(url, json={'chat_id': chat_id, 'text': text})
        if response.status_code == 200:
            return response.json().get('result', {}).get('message_id')
    except Exception as e:
        print(f"⚠️ Warning: Could not send status message: {e}")
    return None

def delete_message(token, chat_id, message_id):
    """حذف پیام با شناسه مشخص"""
    url = f"https://api.telegram.org/bot{token}/deleteMessage"
    try:
        requests.post(url, json={'chat_id': chat_id, 'message_id': message_id})
    except Exception:
        pass

def zip_folder_encrypted(folder_path, output_path, password):
    """
    پوشه را با رمزنگاری AES زیپ می‌کند.
    """
    print(f"📦 در حال فشرده‌سازی {folder_path}...")
    folder_path = expand_path(folder_path)
    
    total_files = 0
    for root, dirs, files in os.walk(folder_path):
        total_files += len(files)

    with pyzipper.AESZipFile(output_path, 'w', compression=pyzipper.ZIP_LZMA, encryption=pyzipper.WZ_AES) as zf:
        zf.setpassword(password.encode('utf-8'))
        
        with tqdm(total=total_files, unit='file', desc="Zipping", colour='green') as pbar:
            for root, dirs, files in os.walk(folder_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, start=folder_path)
                    zf.write(file_path, arcname)
                    pbar.update(1)
    
    print(f"✅ فایل زیپ با موفقیت ساخته شد: {output_path}")

class ProgressUpload(object):
    """کلاسی برای مدیریت کال‌بک پیشرفت آپلود"""
    def __init__(self, filename, total_size):
        self.filename = filename
        self.pbar = tqdm(total=total_size, unit='B', unit_scale=True, desc=f"Uploading {filename}", colour='cyan')

    def __call__(self, monitor):
        self.pbar.update(monitor.bytes_read - self.pbar.n)

    def close(self):
        self.pbar.close()

def send_to_telegram(file_path, token, chat_id):
    """
    فایل را با نوار پیشرفت به تلگرام می‌فرستد.
    خروجی: True در صورت موفقیت، False در صورت شکست.
    """
    url = f"https://api.telegram.org/bot{token}/sendDocument"
    
    print(f"🚀 در حال آپلود به تلگرام...")
    
    success = False
    response = None

    try:
        from requests_toolbelt import MultipartEncoder, MultipartEncoderMonitor
        
        encoder = MultipartEncoder(
            fields={
                'chat_id': chat_id,
                'caption': f'🔒 **Backup Complete**\\n📂 Path: \`{SOURCE_FOLDER}\`\\n🔐 Encrypted Archive',
                'parse_mode': 'MarkdownV2',
                'document': (os.path.basename(file_path), open(file_path, 'rb'), 'application/zip')
            }
        )
        
        callback = ProgressUpload(os.path.basename(file_path), encoder.len)
        monitor = MultipartEncoderMonitor(encoder, callback)
        
        headers = {'Content-Type': monitor.content_type}
        response = requests.post(url, data=monitor, headers=headers)
        callback.close()
        
    except ImportError:
        print("⚠️ کتابخانه requests-toolbelt یافت نشد. پیشرفت آپلود نمایش داده نمی‌شود.")
        print("نصب کنید: pip install requests-toolbelt")
        with open(file_path, 'rb') as f:
            response = requests.post(url, data={'chat_id': chat_id}, files={'document': f})
    except Exception as e:
        print(f"❌ Error during upload: {e}")
        return False

    if response and response.status_code == 200:
        print("\\n✅ فایل با موفقیت به تلگرام ارسال شد!")
        success = True
    else:
        print(f"\\n❌ خطا در ارسال: {response.text if response else 'Unknown Error'}")
        success = False
        
    return success

if __name__ == "__main__":
    try:
        if not BOT_TOKEN or not CHAT_ID:
            print("❌ لطفاً توکن ربات و آیدی چت را در اسکریپت وارد کنید.")
            exit(1)

        output_zip = expand_path(OUTPUT_FILENAME)
        status_messages = []

        # 1. گزارش شروع عملیات
        print("📡 ارسال گزارش شروع به تلگرام...")
        msg_id = send_status(BOT_TOKEN, CHAT_ID, f"⏳ **Backup Started**\\n📂 Target: {SOURCE_FOLDER}\\n⚙️ Status: Compressing files...")
        if msg_id: status_messages.append(msg_id)
        
        # 2. زیپ کردن
        zip_folder_encrypted(SOURCE_FOLDER, output_zip, ZIP_PASSWORD)
        
        # 3. گزارش وضعیت آپلود
        msg_id = send_status(BOT_TOKEN, CHAT_ID, "📦 Compression done.\\n🚀 Uploading to Telegram...")
        if msg_id: status_messages.append(msg_id)

        # 4. ارسال به تلگرام
        is_sent = send_to_telegram(output_zip, BOT_TOKEN, CHAT_ID)
        
        # 5. مدیریت پیام‌های گزارش
        if is_sent:
            print("🧹 در حال پاکسازی پیام‌های وضعیت...")
            for mid in status_messages:
                delete_message(BOT_TOKEN, CHAT_ID, mid)
            
            # (اختیاری) حذف فایل لوکال بعد از ارسال موفق
            # os.remove(output_zip)
            # print("🗑 فایل موقت حذف شد.")
        
    except Exception as e:
        print(f"\\n❌ یک خطای غیرمنتظره رخ داد: {e}")
        # تلاش برای ارسال خطا به کاربر
        send_status(BOT_TOKEN, CHAT_ID, f"❌ **Backup Failed**\\nError: {str(e)}")
`;
};