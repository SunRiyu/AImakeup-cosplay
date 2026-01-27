// ======================================================
// 全自動リップ座標抽出マクロ (AutoLip.ijm)
// ======================================================

// --- 設定エリア ---
modelPath = "C:/Users/yukim/AImakeup-cosplay/classifier.model"; 
outputDir = "C:/Users/yukim/AImakeup-cosplay/"; 

// --- 画像取得ロジック ---
arg = getArgument();
if (arg == "") {
    // 引数がない場合（手動実行時）は、現在開いている画像を使用
    if (nImages == 0) {
        exit("画像が開かれていません。画像を開いてから実行してください。");
    }
    title = getTitle();
} else {
    // 引数がある場合（Python等からの実行時）は画像を開く
    open(arg);
    title = getTitle();
}

// --- Weka分析 ---
run("Trainable Weka Segmentation");
wait(2000); // 起動待ち

// モデルのロード
print("Loading model...");
call("trainableSegmentation.Weka_Segmentation.loadClassifier", modelPath);

// 確率マップ生成（唇の特定開始）
print("Analyzing...");
call("trainableSegmentation.Weka_Segmentation.getProbability");

// ウィンドウが出るまで待機
while (!isOpen("Probability maps")) {
    wait(1000);
}

// --- 座標抽出ロジック ---
selectWindow("Probability maps");
setSlice(2); // 唇クラス（lips）が2番目の場合
run("Duplicate...", "title=lip_mask");

// 二値化
setThreshold(0.5, 1.0);
run("Convert to Mask");

// 粒子解析（一番大きな赤い塊＝唇をROI登録）
run("Analyze Particles...", "size=500-Infinity show=Nothing add");

if (roiManager("count") > 0) {
    roiManager("select", 0);
    run("List Coordinates");
    
    // 保存名の設定 (例: lip_path_answer.png.txt)
    savePath = outputDir + "lip_path_" + title + ".txt";
    saveAs("Text", savePath);
    print("Success: " + savePath);
} else {
    print("Error: 唇の領域が見つかりませんでした。");
}

// --- 終了処理 ---
// 手動テスト時はFijiを閉じないように、引数がある時だけ終了させる
if (arg != "") {
    eval("script", "System.exit(0);");
}