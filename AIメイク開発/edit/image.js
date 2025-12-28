/**
 * 画像から色の境界線（エッジ）を抽出する関数
 */
function detectEdges() {
    const img = document.getElementById('targetImage');
    const canvas = document.getElementById('skinCanvas'); // edit.htmlにある既存のCanvasを利用
    const ctx = canvas.getContext('2d');

    // Canvasサイズを画像に合わせる
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    // 画像をCanvasに描画してピクセルデータを取得
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const srcData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const oldData = srcData.data;
    
    // 結果を格納するための新しいImageDataを作成
    const newData = ctx.createImageData(canvas.width, canvas.height);
    const dstData = newData.data;

    const w = canvas.width;
    const h = canvas.height;

    // ソーベルフィルタの計算
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            // 周囲のピクセルの輝度を取得して境界を判定
            // 簡易的に「横方向の差」と「縦方向の差」を計算
            const i = (y * w + x) * 4;

            // 周囲の輝度（グレースケール値）を簡易取得
            const getLuma = (ox, oy) => {
                const idx = ((y + oy) * w + (x + ox)) * 4;
                return (oldData[idx] + oldData[idx + 1] + oldData[idx + 2]) / 3;
            };

            // 横方向（X）の輝度差
            const xEdge = (-1 * getLuma(-1, -1)) + (1 * getLuma(1, -1))
                        + (-2 * getLuma(-1, 0))  + (2 * getLuma(1, 0))
                        + (-1 * getLuma(-1, 1))  + (1 * getLuma(1, 1));

            // 縦方向（Y）の輝度差
            const yEdge = (-1 * getLuma(-1, -1)) + (-2 * getLuma(0, -1)) + (-1 * getLuma(1, -1))
                        + (1 * getLuma(-1, 1))  + (2 * getLuma(0, 1))  + (1 * getLuma(1, 1));

            // 境界の強さを計算
            const edgeStrength = Math.sqrt(xEdge * xEdge + yEdge * yEdge);

            // 境界線として描画（強さに応じて白くする）
            dstData[i] = edgeStrength;     // R
            dstData[i + 1] = edgeStrength; // G
            dstData[i + 2] = edgeStrength; // B
            dstData[i + 3] = 255;          // A (不透明)
        }
    }

    // Canvasに結果を表示
    ctx.putImageData(newData, 0, 0);
}

// ボタンがクリックされた時に実行する設定（edit.htmlのボタンIDに合わせる場合）
document.getElementById('detectSkinBtn').addEventListener('click', detectEdges);