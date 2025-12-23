// ====================================
// 1. 要素の取得と変数
// ====================================

// 左側の要素
const inputLeft = document.getElementById('uploadInputLeft');
const previewLeft = document.getElementById('previewImageLeft');
// 右側の要素
const inputRight = document.getElementById('uploadInputRight');
const previewRight = document.getElementById('previewImageRight');
// ボタン要素 (今回は画像が選択されていない場合の制御は行いません)
// const editButton = document.getElementById('editButton'); 

// メモリ解放のための変数
let currentObjectUrlLeft = null; 
let currentObjectUrlRight = null; 

// ====================================
// 2. 汎用的な画像処理関数
// ====================================

/**
 * 画像ファイルの選択とプレビュー処理を行う関数
 * @param {HTMLInputElement} inputElement - file input要素
 * @param {HTMLImageElement} previewElement - img要素
 * @param {string | null} oldUrl - 以前のオブジェクトURL
 * @returns {string | null} 新しいオブジェクトURL、またはファイルがない場合は null
 */
function handleImageUpload(inputElement, previewElement, oldUrl) {
    
    // 以前のオブジェクトURLを解放
    if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
    }
    
    const file = inputElement.files[0];

    if (file) {
        // ブラウザ内部で使える一時的なURLを作成
        const newUrl = URL.createObjectURL(file);
        
        // srcにセットし、画像を表示
        previewElement.src = newUrl;
        previewElement.style.display = 'block';
        return newUrl; // 新しいURLを返す
    } else {
        // ファイル選択がキャンセルまたはクリアされた場合、画像を非表示にする
        previewElement.src = '';
        previewElement.style.display = 'none';
        return null;
    }
}

// ====================================
// 3. イベントリスナー
// ====================================

// ★ 左パネルのリスナー ★
inputLeft.addEventListener('change', () => {
     // 処理を呼び出し、新しいURLを取得して保持
    const newUrl = handleImageUpload(inputLeft, previewLeft, currentObjectUrlLeft);
    currentObjectUrlLeft = newUrl;
});

// ★ 右パネルのリスナー ★
inputRight.addEventListener('change', () => {
    // 処理を呼び出し、新しいURLを取得して保持
    const newUrl = handleImageUpload(inputRight, previewRight, currentObjectUrlRight);
    currentObjectUrlRight = newUrl;
});