// ======================================================
// メイク分析用自動計測マクロ（安定版）
// ======================================================

// 1. 設定項目（パスは必ず "" で囲み、最後にファイル名 .model を入れる）
modelPath = "C:/Users/yukim/AImakeup-cosplay/cosplay_makeup.model"; 
outputDir = "C:/Users/yukim/AImakeup-cosplay/"; 

// 2. 準備
run("Clear Results");
inputName = getTitle();

// 3. Weka Segmentationを実行してモデルをロード
run("Trainable Weka Segmentation");
wait(2000); // 起動待ち
call("trainableSegmentation.Weka_Segmentation.loadClassifier", modelPath);

// 4. 確率マップ生成を開始
print("解析を開始します。これには時間がかかる場合があります...");
call("trainableSegmentation.Weka_Segmentation.getProbability");

// ★修正ポイント：Probability maps ウィンドウが出るまで最大60秒待機する
i = 0;
while (!isOpen("Probability maps") && i < 60) {
    wait(1000);
    i++;
}

if (!isOpen("Probability maps")) {
    exit("エラー：解析がタイムアウトしました。手動で Get probability を押してみてください。");
}

// 5. 各パーツの計測
probMapName = "Probability maps";
labels = newArray("eyes", "lips", "eyebrows", "mouth", "hair", "backgrond");

for (i = 0; i < labels.length; i++) {
    selectWindow(probMapName);
    setSlice(i + 1);
    
    run("Duplicate...", "title=temp_mask");
    imageCalculator("Multiply create 32-bit", inputName, "temp_mask");
    
    run("Measure");
    setResult("Part", nResults-1, labels[i]); // 結果の最後尾にラベルを追加
    
    close(); // Result of ...
    selectWindow("temp_mask");
    close();
}

// 6. 保存
saveAs("Results", outputDir + inputName + "_analysis.csv");
print("解析完了！保存先: " + outputDir + inputName + "_analysis.csv");