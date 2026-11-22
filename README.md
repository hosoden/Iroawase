# いろあそび (Iroawase)

3〜6さい向けのお絵かき・色遊びゲームです。いろをえらんですきな場所にぬり、おてほんのどうぶつをカラフルに仕上げます。色の違いや組み合わせに気づき、自分のイメージを表現する遊びを楽しめます。

## あそびかた

1. いろとふでのふとさをえらびます。
2. どうぶつのおてほんをえらぶか、キャンバスにすきな絵をかきます。
3. おてほんボタンをもういちどおすと、おてほんをかくせます。
4. けしゴムでぬったところをけしたり、「ぜんぶけす」で描画をクリアしたりできます。

## ローカルでひらく

`index.html` をブラウザーで開くと遊べます。ビルドツールや依存パッケージはありません。HTML、CSS、JavaScript は相対パスで読み込みます。

## GitHub Pages で公開

### `main` ブランチのルートから公開する場合

1. `develop` の変更をレビューして `main` にマージします。
2. GitHub のリポジトリで **Settings > Pages** を開きます。
3. **Build and deployment** の **Source** で **Deploy from a branch** を選びます。
4. ブランチを `main`、フォルダーを `/(root)` にして **Save** します。
5. 公開されたら [https://hosoden.github.io/Iroawase/](https://hosoden.github.io/Iroawase/) を開いて確認します。

```sh
git switch main
git pull origin main
git merge --no-ff develop
git push origin main
```

### GitHub Actions で公開する場合

GitHub リポジトリの **Settings > Pages** で **Source** を **GitHub Actions** に設定し、静的ファイルを GitHub Pages に公開するワークフローを用意します。ワークフローを追加する場合は、公開対象をリポジトリのルートにし、Actions の実行ブランチと権限を確認してください。

## 公開後の確認ポイント

- ページが表示され、CSS と JavaScript が読み込まれる。
- パレット、ふでのふとさ、けしゴム、ぜんぶけすが動く。
- 6種類のおてほんが選べ、選択中のボタンが分かり、同じボタンでもう一度消せる。
- PC のマウスとスマートフォン／タブレットのタッチで描ける。
- 描画を消しても薄いおてほん線が残る。
