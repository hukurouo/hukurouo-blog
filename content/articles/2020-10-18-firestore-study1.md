---
title: Firestore 勉強メモ
date: 2020-10-18
categories: 技術
tags: []
---

[実践Firestore](https://www.amazon.co.jp/dp/B0851BGDQG/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1) を読んだ。名著だと思います。以下メモ。

- #4 セキュリティルール
    - ユーザ認証
        - とりあえず request.auth のチェック
        - 公開ドキュメントは認証状態に関わらず読み書き可能か
        - 特定ユーザーと関連を持つドキュメントはユーザIDとドキュメントIDが関連付けられて読み書きが限定されているか
    - スキーマ検証
        - 意図しないフィールドが存在していないか
    - バリデーション
        - 不正な値が書き込めないようになっているか
        - 数値型には適切な上限下限、文字型には最大長が設定されているか
    - クエリ
        - 状態に応じて読み取りの可否を決定する性質を持つドキュメントでは、クエリに対してもセキュリティルールを設定すること
    - 不定形のリストやマップの書き込みはセキュリティルールで適切に制限できないので、信頼できるサーバサイドからAdminSDKを利用して更新しなければならない


- #5 データモデリング
    - ドキュメント設計の原則
        - フィールドの機密レベルを統一する
            - セキュリティの観点から、公開情報と非公開情報はドキュメントを分ける必要がある
            - 分割の結果ドキュメント間には1:1リレーションが生じる
        - 加工しなくてもよいモデル
            - 結合度を弱めるため、fsから取得したデータはなるべく無加工で利用できることが望ましい
            - コンポーネントを描画するのに必要なデータを１つのドキュメントに詰め込むように設計したい
            - データの重複をある程度許容し、アーキテクチャの高凝集・疎結合を保つ
        - タイムスタンプも必要なければ省いて良い
        - フラグを持つフィールドの代わりに、コレクションで分けると（usersコレクション、unsbscribed-usersコレクション）フラグ値は不必要になりクエリがシンプルになる
    - 1:1リレーションについて
        - リファレンス型で関連付ける
        - リファ型に加え重複データも置いとくと、結合処理を回避できたりもする
            - コスト減にもつながる
        - とはいえ、突飛な性能要求が無い限りは正規化して結合でやってあげるのがよい（セキュリティの兼ね合いや、更新対象が増えていくのは辛いため）
    - コレクショングループ
        - サブコレクション群をまとめて検索できる
            - ProductsのサブコレクションであるReviewsコレクションをuser_idで抽出したり
    - コマンドクエリ責務分離
        - ドキュメントが大きくなると、準じてセキュリティルールも肥大していき技術的負債の温床になりがち
        - そこで読み取りと書き込みでデータモデルを分離してみる
        - /users/{uid}/changelogs/{chengelog}　に更新情報を格納し、更新自体はバックグラウンド関数で行うという手法　
            - 履歴が残るというメリットもついてくるが、更新がリアルタイムではなくなるというデメリットも


- #6 Firestoreでユーザーを管理する
    - ユーザー管理機能
        - 基本的に Authentication アカウントに紐づけて管理する
        - データの保存先
            - Firestore
                - 更新履歴を管理したいデータ
                - アカウント所持者以外が参照するデータ
            - Authentication
                - セキュリティルールから参照したいデータ
                - メールアドレス
    - ユーザ作成・更新・退会処理のexampleが書いてある