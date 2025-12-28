/**
 * 定義された髪の毛領域のみを黒く塗りつぶす関数
 */
function colorHairBlack() {
    const img = document.getElementById('targetImage');
    const canvas = document.getElementById('skinCanvas');
    const ctx = canvas.getContext('2d');

    // Canvasサイズを画像に合わせる
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    // 元の画像データを取得
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const srcData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const oldData = srcData.data;
    
    // 加工後のデータを格納する箱
    const newData = ctx.createImageData(canvas.width, canvas.height);
    const dstData = newData.data;

    const w = canvas.width;
    const h = canvas.height;

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            const i = (y * w + x) * 4;

            // 周囲の輝度を取得するヘルパー関数
            const getLuma = (ox, oy) => {
                const idx = ((y + oy) * w + (x + ox)) * 4;
                return (oldData[idx] + oldData[idx + 1] + oldData[idx + 2]) / 3;
            };

            // ソーベルフィルタによるエッジ抽出
            const xEdge = (-1 * getLuma(-1, -1)) + (1 * getLuma(1, -1))
                        + (-2 * getLuma(-1, 0))  + (2 * getLuma(1, 0))
                        + (-1 * getLuma(-1, 1))  + (1 * getLuma(1, 1));

            const yEdge = (-1 * getLuma(-1, -1)) + (-2 * getLuma(0, -1)) + (-1 * getLuma(1, -1))
                        + (1 * getLuma(-1, 1))  + (2 * getLuma(0, 1))  + (1 * getLuma(1, 1));

            const edgeStrength = Math.sqrt(xEdge * xEdge + yEdge * yEdge);

            // --- 髪の毛の定義と着色 ---
            const threshold = 50; // 線状の反応の強さ（必要に応じて調整）

            if (edgeStrength > threshold) {
                // 髪の毛と判定された部分を「黒」にする
                dstData[i] = 0;     // R
                dstData[i + 1] = 0; // G
                dstData[i + 2] = 0; // B
                dstData[i + 3] = 255; // A (不透明)
            } else {
                // それ以外の場所は完全に透明にする
                dstData[i + 3] = 0;
            }
        }
    }

    // 結果をCanvasに描画
    ctx.putImageData(newData, 0, 0);
    document.getElementById('statusText').innerText = "髪の毛領域を黒く塗りつぶしました。";
}