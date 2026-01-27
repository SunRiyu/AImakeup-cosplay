from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

# --- 環境に合わせて修正してください ---
# Fijiの本体がある場所
# --- server.py のここを修正 ---

# 1. Fijiの場所（ImageJ-win64.exe を右クリックして「パスをコピー」すると確実です）+
# 先頭に r を付けるのを忘れないでください
FIJI_PATH = r"C:\Users\yukim\fiji-windows-x64.exe"

# 2. マクロの場所
MACRO_PATH = r"C:\Users\yukim\AImakeup-cosplay\AutoLip.ijm" # ←実際のパスに！


@app.route('/run_fiji', methods=['POST'])
def run_fiji():
    data = request.json
    image_path = data.get('image_path').replace('/', '\\')

    # パスにスペースがあっても動くように引用符で囲む
    command = f'"{FIJI_PATH}" --headless -macro "{MACRO_PATH}" "{image_path}"'
    print(f"実行コマンド: {command}")

    try:
        # shell=True を追加することで WinError 2 を回避しやすくします
        subprocess.run(command, shell=True, check=True)
        return jsonify({"status": "success", "message": "分析に成功しました"})
    except Exception as e:
        print(f"エラー内容: {str(e)}")
        return jsonify({"status": "error", "message": f"WinError 2 回避失敗: {str(e)}"}), 500

if __name__ == '__main__':
    print("Pythonサーバー起動中...")
    app.run(port=5000)

