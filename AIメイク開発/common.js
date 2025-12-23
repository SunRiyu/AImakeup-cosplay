/**
 * 指定されたHTMLファイルの内容を読み込み、指定されたIDの要素に挿入する関数
 * @param {string} includeId - 挿入先の要素のID ('header-placeholder' または 'footer-placeholder')
 * @param {string} filePath - 読み込むHTMLファイルのパス
 */
function includeHtml(includeId, filePath) {
    const element = document.getElementById(includeId);
    if (!element) return;

    // ファイルの内容を取得
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`ファイルが見つかりません: ${filePath} (Status: ${response.status})`);
            }
            return response.text();
        })
        .then(data => {
            // プレースホルダーのdivをヘッダー/フッターのHTML全体に置き換える
            element.outerHTML = data; 
        })
        .catch(error => {
            console.error('HTMLインクルードエラー:', error);
            element.innerHTML = `<div style="color: red; text-align: center; padding: 10px;">[${includeId}]の読み込みエラー</div>`;
        });
}