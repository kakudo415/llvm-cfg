# Project Brief: LLVM IR to CFG Visualizer

## 概要
LLVM IRコードを入力すると、対応するControl Flow Graph (CFG)を視覚的に表示するWebアプリケーションを開発します。このツールは、コンパイラの中間表現を理解しやすくするための教育・開発支援ツールとして機能します。

## 主要機能
1. **LLVM IR入力**: ページの左半分にLLVM IRコードを入力できるテキストエリアを提供
2. **シンタックスハイライト**: LLVM IRコードに適切なシンタックスハイライトを適用
3. **CFG描画**: ページの右半分に入力されたLLVM IRに対応するCFGをリアルタイムで描画
4. **インタラクティブ操作**: ズーム、パン、ノード選択などの基本的な操作をサポート

## 技術スタック
- **フレームワーク**: Next.js
- **言語**: TypeScript
- **グラフ描画**: D3.js + dagre-d3
- **シンタックスハイライト**: Prism.js
- **デプロイ**: GitHub Pages (GitHub Actionsによるビルド)

## 制約条件
- クライアントサイドでの処理に限定（サーバーサイド処理なし）
- 静的サイトとしてデプロイ可能であること
- モバイルデバイスを含む様々な画面サイズに対応

## 成功基準
- 基本的なLLVM IR構文を正しく解析できること
- 解析結果からCFGを正確に生成できること
- 視覚的に分かりやすいグラフレイアウトを提供すること
- GitHub Pagesで正常に動作すること
