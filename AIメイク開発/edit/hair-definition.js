/**
 * エッジ（線状の反応）を基に髪の毛領域を定義・可視化する関数
 */
function defineHairArea() {
    const img = document.getElementById('targetImage');
    const canvas = document.getElementById('skinCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    // 画像を描画してデータを取得
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const srcData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const oldData = srcData.data;
    
    const newData = ctx.createImageData(canvas.width, canvas.height);
    const dstData = newData.data;

    const w = canvas.width;
    const h = canvas.height;

    // 1. まずグレースケールとエッジ検出を同時に行う
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            const i = (y * w + x) * 4;

            const getLuma = (ox, oy) => {
                const idx = ((y + oy) * w + (x + ox)) * 4;
                return (oldData[idx] + oldData[idx + 1] + oldData[idx + 2]) / 3;
            };

            // ソーベルフィルタ（エッジ抽出）
            const xEdge = (-1 * getLuma(-1, -1)) + (1 * getLuma(1, -1))
                        + (-2 * getLuma(-1, 0))  + (2 * getLuma(1, 0))
                        + (-1 * getLuma(-1, 1))  + (1 * getLuma(1, 1));

            const yEdge = (-1 * getLuma(-1, -1)) + (-2 * getLuma(0, -1)) + (-1 * getLuma(1, -1))
                        + (1 * getLuma(-1, 1))  + (2 * getLuma(0, 1))  + (1 * getLuma(1, 1));

            const edgeStrength = Math.sqrt(xEdge * xEdge + yEdge * yEdge);

            // --- 2. 条件分岐：髪の毛の定義 ---
            // エッジの強さが「閾値（しきいち）」を超えている場合を髪の毛（線状の密集地）とみなす
            // 閾値（ここでは50）は画像の明るさによって調整が必要です
            const threshold = 50; 

            if (edgeStrength > threshold) {
                // 髪の毛と定義した場所を青色で表示（可視化用）
                dstData[i] = 0;       // R
                dstData[i + 1] = 0;   // G
                dstData[i + 2] = 255; // B
                dstData[i + 3] = 200; // A
            } else {
                // それ以外（平坦な部分）は透明
                dstData[i + 3] = 0;
            }
        }
    }

    // Canvasに反映
    ctx.putImageData(newData, 0, 0);
    console.log("線状の反応から髪の毛領域を定義しました。");
}

// 既存のボタンなどにイベントを紐付け
document.getElementById('detectSkinBtn').addEventListener('click', defineHairArea);