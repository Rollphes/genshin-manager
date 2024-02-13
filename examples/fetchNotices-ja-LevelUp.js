const { Client, NoticeManager } = require('genshin-manager')

// イベント期間と参加条件・タイトル・バナーURLのみを取得するコード
// 日本語のみ正規表現を用いて作成している為、情報共有としてサンプルコードを提供します。

async function main() {
  const client = new Client()
  await client.deploy()

  const noticeManager = new NoticeManager('ja')
  await noticeManager.update()

  Array.from(noticeManager.notices.values())
    .filter(
      (notice) =>
        notice.type === 1 &&
        (/〓参加条件〓/g.test(notice.text) || notice.tag === 2),
    ) // 参加条件のあるイベントのみを抽出
    .forEach((event) => {
      const title = event.subtitle.replace(/\n/g, ' ・').replace(/\n.*?$/g, '')
      const eventDuration =
        event.eventStart && event.eventEnd
          ? event.eventStart.toLocaleString() +
            ' ~ ' +
            event.eventEnd.toLocaleString()
          : event.eventDuration
      const description = [
        `〓イベント期間〓\n${eventDuration.replace(/\n\s*?$/, '')}\n`,
        (event.text.match(/〓参加条件〓.*?(?=\n(〓|※))/gs) ?? [''])[0]
          .replace(/\n\s*?$/, '')
          .replace(/\n(かつ)?/g, '\n・')
          .replace(/\n・\s*\n/g, '\n\n'),
      ]
        .join('')

      console.log(title)
      console.log(`- Description:`)
      console.log(
        `  ${description.replace(/\n$/,'').replace(/\n/g, '\n  ')}`,
      )
      console.log(`- Banner URL: ${event.banner.url}`)
    })
  process.exit(0)
}
void main()

/** Sample output:
GenshinManager: Start update cache.
GenshinManager: No new Asset found. Set cache.
GenshinManager: Finish update cache and set cache.
イベント祈願 ・「雲府飛鶴」
- Description:
  〓イベント期間〓
  4.4バージョンアップ後 ~ 2024/02/20 18:59
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/6e851e93b38a5d19b66b6abf7781026e_7787062334840019369.png
イベント祈願 ・「叡智を恵む月見草」
- Description:
  〓イベント期間〓
  4.4バージョンアップ後 ~ 2024/02/20 18:59
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/441a81a5b5548a6e8af5129de425b6a9_8738236879416751651.png
イベント祈願 ・「神鋳賦形」
- Description:
  〓イベント期間〓
  4.4バージョンアップ後 ~ 2024/02/20 18:59
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/7fb6565094ed8012f6e5651da5479f63_4695639498311753105.png
イベント祈願 ・「灯宴の招き」
- Description:
  〓イベント期間〓
  2024/2/20 19:00:00 ~ 2024/3/12 15:59:00
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/a936ca46f605c5ef16af11e2bd039c0e_5559316671238417259.png
イベント祈願 ・「華紫櫻緋」
- Description:
  〓イベント期間〓
  2024/2/20 19:00:00 ~ 2024/3/12 15:59:00
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/abc7c87c1749b26d18f552db530a8a4b_3461056258051204290.png
イベント祈願 ・「神鋳賦形」
- Description:
  〓イベント期間〓
  2024/2/20 19:00:00 ~ 2024/3/12 15:59:00
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/1484382a8221a15adbdb4376b5aeadab_3484404333318902367.png
イベント ・「彩鳶紀行」
- Description:
  〓イベント期間〓
  4.4バージョンアップ後 ~ 2024/03/11 04:59
  〓参加条件〓
  ・冒険ランク20以上
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/d466b6cd3da9f7188849b687785df238_8838151479277291969.png
イベント ・「富貴登門」
- Description:
  〓イベント期間〓
  2024/2/3 5:00:00 ~ 2024/2/18 4:59:00
  〓参加条件〓
  ・冒険ランク5以上
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/094e4f7b4710e4c89ec408db53524907_6201050966958633925.png
イベント・「春立つ風を梳かす彩鳶」
- Description:
  〓イベント期間〓
  2024/2/5 11:00:00 ~ 2024/2/26 4:59:00
  〓参加条件〓
  ・冒険ランク20以上
  ・魔神任務 序章・第三幕「龍と自由の歌」をクリア
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/25/46a8dfd5f57d38c815f88d1784dac8a2_1237347557234047160.png
イベント ・「七聖召喚」鋳境の研鑽
- Description:
  〓イベント期間〓
  4.4バージョン期間中に開放
  〓参加条件〓
  ・冒険ランク32以上
  ・魔神任務 序章・第三幕「龍と自由の歌」をクリア
  ・世界任務「サイコロ、猫とカードの戦場」をクリア
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/4ed6401ce434f1d01816904d9a690c53_7895893197180355272.png
イベント ・「全力勝負！」
- Description:
  〓イベント期間〓
  2024/2/15 11:00:00 ~ 2024/2/26 4:59:00
  〓参加条件〓
  ・冒険ランク20以上
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/19/65971323b5728666930c01cf2da291a3_1293170039941161906.png
イベント ・「七聖召喚」熱闘モード
- Description:
  〓イベント期間〓
  2024/2/17 11:00:00 ~ 2024/3/4 4:59:00
  〓参加条件〓
  ・冒険ランク32以上
  ・魔神任務 序章・第三幕「龍と自由の歌」をクリア
  ・世界任務「サイコロ、猫とカードの戦場」をクリア
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/7d7789b164a7b2c52c53ab70c742b400_4587823398722354360.png
イベント ・「遠方より来たる朋友」
- Description:
  〓イベント期間〓
  2024/2/21 11:00:00 ~ 2024/3/4 4:59:00
  〓参加条件〓
  ・冒険ランク28以上
  ・魔神任務 第一章・第三幕「迫る客星」をクリア
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/5b0e7b3d72c9e3c61343647d49661928_6724364290610031180.png
イベント・「新たな紙鳶は照らされて」
- Description:
  〓イベント期間〓
  2024/02/24 01:00 からVer.4.4終了まで
  〓参加条件〓
  ・冒険ランク2以上
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/0b30d1f523ef6e47ce62079860340fa1_874015997566071739.png
イベント・「ナゾチャールの奇境探訪」
- Description:
  〓イベント期間〓
  2024/2/29 11:00:00 ~ 2024/3/11 4:59:00
  〓参加条件〓
  ・冒険ランク20以上
  ・魔神任務 序章・第三幕「龍と自由の歌」をクリア
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2024/01/18/58897e83c314e7b99d6835742478efce_6018407020016165229.png
イベント ・「熟知の奔流」
- Description:
  〓イベント期間〓
  2024/3/4 5:00:00 ~ 2024/3/11 4:59:00
  〓参加条件〓
  ・対応する天賦育成素材秘境を開放後
- Banner URL: https://sdk.hoyoverse.com/upload/ann/2023/09/27/eab84b2ccc588e84bb7da0ebedc2ebfe_3781426965600572755.jpg
*/
