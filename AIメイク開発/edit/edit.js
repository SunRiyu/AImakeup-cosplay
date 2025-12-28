document.getElementById('detectSkinBtn').addEventListener('click', function() {
    const img = document.getElementById('targetImage');
    const canvas = document.getElementById('skinCanvas');
    const ctx = canvas.getContext('2d');
    const status = document.getElementById('statusText');

    // Canvasのサイズを画像に合わせる
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    // Canvasに画像を描画してピクセルデータを取得
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    status.innerText = "解析中...";

    // ピクセルごとにループ（肌色の定義：簡易的なRGB/HSV判定）
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];     // Red
        const g = data[i + 1]; // Green
        const b = data[i + 2]; // Blue

        // 簡易的な肌色判定アルゴリズム (RGBベース)
        if (isSkin(r, g, b)) {
            // 肌と判定した場所を半透明の赤色で塗りつぶす（可視化用）
            data[i] = 255;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 128; // 透明度
        } else {
            // 肌ではない場所は透明にする
            data[i + 3] = 0;
        }
    }

    // 解析結果を描画
    ctx.putImageData(imageData, 0, 0);
    status.innerText = "肌の検出が完了しました。";
});

// 肌色の定義関数
function isSkin(r, g, b) {
    // 一般的な肌色の範囲を定義（照明条件に左右されます）
    const rGtG = r > g;
    const rGtB = r > b;
    const gGtB = g > b;
    return (r > 95 && g > 40 && b > 20 && (Math.max(r, g, b) - Math.min(r, g, b) > 15) && Math.abs(r - g) > 15 && rGtG && rGtB);
}