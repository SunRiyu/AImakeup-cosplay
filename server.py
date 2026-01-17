from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

# --- 環境に合わせて修正してください ---
# Fijiの本体がある場所
FIJI_PATH = r"C:\Fiji.app\ImageJ-win64.exe" 
# 先ほど作成したマクロの場所
MACRO_PATH = r"C:\Users\yukim\AImakeup-cosplay\AutoLip.ijm" 

@app.route('/run_fiji', methods=['POST'])
def run_fiji():
    data = request.json
    image_path = data.get('image_path')
    
    # パスの区切り文字をWindows形式に修正
    image_path = image_path.replace('/', '\\')

    if not os.path.exists(image_path):
        return jsonify({"status": "error", "message": f"Image not found: {image_path}"}), 400

    try:
        # Fijiを起動 (headlessモードでマクロを実行)
        print(f"Fijiを起動中... 対象画像: {image_path}")
        subprocess.run([FIJI_PATH, "--headless", "-macro", MACRO_PATH, image_path], check=True)
        return jsonify({"status": "success", "message": "分析が完了しました"})
    except Exception as e:
        print(f"エラー発生: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("Pythonサーバー起動中... ポート5000で待機しています。")
    app.run(port=5000)