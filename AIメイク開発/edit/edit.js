// edit.js
const img = document.getElementById('targetImage');
const canvas = document.getElementById('skinCanvas');
const ctx = canvas.getContext('2d');

// --- 変更点: lip_pathを格納する変数を用意 ---
let lipPathPoints = []; 

const lipColors = [
    [255, 0, 0], [255, 102, 102], [204, 0, 0], [255, 51, 153], [255, 153, 204],
    [120, 68, 200], [153, 51, 255], [102, 0, 204], [255, 102, 0], [255, 153, 102],
    [204, 51, 0], [255, 204, 204], [153, 0, 51], [102, 0, 0], [51, 0, 0]
];
let selectedRGB = [...lipColors[5]]; 

// --- 追加: lip_path.txt を読み込む処理 ---
async function loadLipPath() {
    try {
        const response = await fetch('../../lip_path.txt');
        if (!response.ok) throw new Error('File not found');
        const text = await response.text();
        lipPathPoints = text.trim().split('\n').map(line => {
            const [x, y] = line.trim().split(/\s+/).map(Number);
            return { x, y };
        });
        console.log("読み込み成功:", lipPathPoints.length, "個の座標");
        updateLips(); 
    } catch (error) {
        console.error("読み込みエラー:", error);
    }
}

function updateLips() {
    if (!img.complete || lipPathPoints.length === 0) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- 【重要】倍率の計算 ---
    // img.naturalWidth (元の画像サイズ) と img.width (画面表示サイズ) の比率を出す
    const scaleX = img.width / img.naturalWidth;
    const scaleY = img.height / img.naturalHeight;

    const b = parseInt(document.getElementById('brightnessSlider').value) * 15;
    const r = Math.min(255, Math.max(0, selectedRGB[0] + b));
    const g = Math.min(255, Math.max(0, selectedRGB[1] + b));
    const bl = Math.min(255, Math.max(0, selectedRGB[2] + b));

    ctx.save();
    ctx.beginPath();
    
    // 全ての座標に倍率をかけて描画
    ctx.moveTo(lipPathPoints[0].x * scaleX, lipPathPoints[0].y * scaleY);
    lipPathPoints.forEach(p => {
        ctx.lineTo(p.x * scaleX, p.y * scaleY);
    });
    
    ctx.closePath();

    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${r}, ${g}, ${bl}, 0.5)`;
    ctx.fillStyle = `rgba(${r}, ${g}, ${bl}, 0.6)`;
    ctx.fill();
    ctx.restore();

    document.getElementById('statusText').innerText = `反映中: RGB(${r}, ${g}, ${bl})`;
}

// パレット生成（既存のまま）
const palette = document.getElementById('colorPalette');
palette.innerHTML = ''; 
lipColors.forEach(rgb => {
    const chip = document.createElement('div');
    Object.assign(chip.style, {
        width: '32px', height: '32px', backgroundColor: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`,
        borderRadius: '50%', cursor: 'pointer', border: '2px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)', display: 'inline-block', margin: '5px'
    });
    chip.onclick = () => { selectedRGB = rgb; updateLips(); };
    palette.appendChild(chip);
});

img.onload = updateLips;
document.getElementById('brightnessSlider').oninput = updateLips;

// 起動時にロードを実行
loadLipPath();
