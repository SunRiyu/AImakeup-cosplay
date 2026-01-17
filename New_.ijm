// ======================================================
// 全自動リップ座標抽出マクロ (修正版)
// ======================================================

// パス設定（ここを自分のPC環境に合わせて再確認してください）
modelPath = "C:/Users/yukim/AImakeup-cosplay/classifier.model"; 
outputDir = "C:/Users/yukim/AImakeup-cosplay/"; 

// Weka Segmentationの起動
run("Trainable Weka Segmentation");
wait(2000); // 起動待ち

// モデルのロード
call("trainableSegmentation.Weka_Segmentation.loadClassifier", modelPath);
print("Model loaded.");

// 分析実行（確率マップの生成）
call("trainableSegmentation.Weka_Segmentation.getProbability");

// 「Probability maps」ウィンドウが表示されるまでループで待機
while (!isOpen("Probability maps")) {
    wait(500);
}
print("Analysis finished.");

// 唇のレイヤーを抽出
selectWindow("Probability maps");
// lipsがどのクラスかによって1か2か決まります。唇が赤く表示されるスライスを選んでください
setSlice(2); 
run("Duplicate...", "title=lip_mask");

// 二値化（唇を白、背景を黒にする）
setThreshold(0.5, 1.0); 
run("Convert to Mask");

// ノイズ除去（小さい点は無視する）
run("Analyze Particles...", "size=500-Infinity show=Nothing add");

// 座標の書き出し
if (roiManager("count") > 0) {
    roiManager("select", 0);
    run("List Coordinates");
    // ファイル名に元画像の名前を含めるように改良
    origName = getTitle();
    saveAs("Text", outputDir + "lip_path_" + origName + ".txt");
    print("Coordinates saved for " + origName);
} else {
    print("Error: No lip area detected.");
}

// 整理
run("Clear Results");
roiManager("Delete");