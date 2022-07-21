# Web Crawler

## 簡介
### 什麼是爬蟲

爬蟲英文叫做 web crawler，也可以叫 spider。其實就是模擬人類去做瀏覽網站的動作。當你在網站上看到一些文章、資料時，你想拿下來做一些資料分析或是其他運用時，就需要用到爬蟲。

### 靜態爬蟲 & 動態爬蟲

爬蟲的手段又分靜態以及動態，簡單來講就是有沒有加載網頁的概念。像是大部分論壇網站，HTML 就寫在那邊，所以就可以利用靜態爬蟲的作法直接獲取資源，但像是 Google Map 等利用 JavaScript 生成網頁內容的網站，靜態爬蟲是無法獲取資源的，這時候就要使用動態爬蟲。

動態爬蟲是利用 WebDriver 直接模擬使用者開啟網頁的動作，進而達到加載網頁生成資源的效果；又或者像是論壇需要登入或輸入資料、點擊按鈕等，都可以利用動態爬蟲配合 WebDriver 來做到。

### 基本流程

1. 連線到特定網址，抓取資料
2. 解析資料，取得實際想要的部分

## 靜態爬蟲


首先要安裝 BeautifulSoup4 (bs4)，它是專門用來做靜態爬蟲的套件：
```python
pip install bs4
```

引入：
```python
from bs4 import Berautifulsoup
```

再來我們需要做 HTTP 請求的套件，叫做 requests：
```python
pip install requests
```

引入：
```python
import requests
```

我們先用 request 來對指定的 URL（網址）送出請求，有點像是使用者連進網站時會對網站送出請求，網站同意後你才能連進去一樣。

- **範例：**

```python=1
import requests

# 台灣證券交易所>首頁 > 交易資訊 > 盤後資訊 > 每日收盤行情
URL = "https://www.twse.com.tw/zh/page/trading/exchange/MI_INDEX.html"
resp = requests.get(URL)
print('status_code: ', resp.status_code)
print('source_code: \n', resp.text)
```
- **結果：**
```
status_code:  200
source_code: 
 <!doctype html><!--[if IE]><html lang="zh" class="ie"><![endif]--><!--[if !IE]><!-->
<html lang="zh-hant"><!--<![endif]-->
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Cache-Control" content="no-cache">

  <title>每日收盤行情  - TWSE 臺灣證券交易所</title>
    
  <link rel="shortcut icon" href="/rsrc/img/favicon.ico">
  <link rel="apple-touch-icon" href="/rsrc/img/apple-touch-icon.png">
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/rsrc/img/apple-touch-icon-retina.png">
    
  <meta name="description" content="臺灣證券交易所全球資訊網介紹公司組織、沿革外，並分為「交易資訊」、「上市公司」、 「產品與服務」、「結算服務」、「市場公告」、「法令規章」、「投資人教育」、「統計報表」等，期能提供投資大眾即時完整之訊息，使投資大眾對本公司業務及市場動態有更深一層的瞭解。">
  <meta name="keywords" content="證券,上市,大盤,國際股市指數,匯率,個股行情等,年報,投資,期貨,台灣50,ETF">
  
  <meta name="author" content="TWSE">
  <!--[if lt IE 10]><script src="/rsrc/lib/html5shiv.min.js"></script><![endif]-->
  <!--[if IE]><script src="/rsrc/lib/es5-shim.min.js"></script><![endif]-->
  <meta name="Asset-Path" content="/rsrc/">
  <link href="/rsrc/css/main.css" rel="stylesheet">......
```
status code 為 200 意味著請求已成功完成。

我們使用了 requests.get 這個方法來對後面的網址送出請求，並且將這個事情存到 resp 這個變數中。

有些網站會專門擋自動化程式或機器人，所以通常在爬蟲時都會先偽裝成使用者，這時候就需要用到 headers 這個功能。我們需要放入 User-Agent（使用者代理），讓網站認為你是真人。在網站中按下 F12 可以取得網頁原始碼；同樣的，也可以取得 User-Agent：

```python=
response = requests.get(
    "https://ithelp.ithome.com.tw/articles?tab=tech",
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
    })
```

網址跟 headers 中間要有逗號，並且 headers 是用大括號包住。到這裡，HTTP 請求部分就好了。


<!-- 
在上面，我們閱讀文字響應並獲得網頁的HTML。 
如果是CSV或其他文字資料，我們可以在響應物件的text屬性中獲取它們。 例如，這就是我們從台灣證券交易所資料中讀取CSV的方式：
#### example 2 :
```python=
import io
import pandas as pd
import requests
 
URL = "https://www.twse.com.tw/exchangeReport/MI_INDEX?response=csv&date=20220719&type=MS"
resp = requests.get(URL)
if resp.status_code == 200:
   csvtext = resp.text
   csvbuffer = io.StringIO(csvtext)
   df = pd.read_csv(csvbuffer)
   print(df)
```
result:
```
           111年07月19日 大盤統計資訊
成交統計                                               成交金額(元)         成交股數(股)       成交筆數                     NaN
1.一般股票                                             188,052,075,610 3,006,668,621 1,563,980                NaN
2.台灣存託憑證                                           17,513,047      3,911,234     1,129                    NaN
3.受益憑證                                             0               0             0                        NaN
4.ETF                                              9,069,345,889   519,869,278   128,717                  NaN
5.受益證券                                             39,098,537      2,140,022     59                       NaN
6.變更交易股票                                           4,667,333       800,660       473                      NaN
7.認購(售)權證                                          2,121,787,850   1,838,029,000 65,073                   NaN
8.轉換公司債                                            0               0             0                        NaN
9.附認股權特別股                                          0               0             0                        NaN
10.附認股權公司債                                         0               0             0                        NaN
11.認股權憑證                                           0               0             0                        NaN
12.公司債                                             0               0             0                        NaN
13.ETN                                             7,558,840       1,767,000     342                      NaN
14.創新板股票                                           0               0             0                        NaN
15.創新板-變更交易方法股票                                    0               0             0                        NaN
證券合計(1+6+14+15)                                    188,056,742,943 3,007,469,281 1,564,453                NaN
總計(1~15)                                           199,312,047,106 5,373,185,815 1,759,773                NaN
漲跌證券數合計                                            NaN             NaN           NaN                      NaN
類型                                                 整體市場            股票            NaN                      NaN
上漲(漲停)                                             4,089(10)       594(9)        NaN                      NaN
下跌(跌停)                                             4,395(46)       260(0)        NaN                      NaN
持平                                                 637             89            NaN                      NaN
未成交                                                18,315          1             NaN                      NaN
無比價                                                2,034           21            NaN                      NaN
備註:                                                NaN             NaN           NaN                      NaN
漲跌價差"為當日收盤價與前一日收盤價比較。"                             NaN             NaN           NaN                      NaN
無比價"含前一日無收盤價、當日除權、除息、新上市、恢復交易者。"                   NaN             NaN           NaN                      NaN
外幣成交值係以本公司當日下午3時30分公告匯率換算後加入成交金額。<br>公告匯率請參考本公司... NaN             NaN           NaN                      NaN
``` -->
### 提取、解析資料

如果要取得網站上的特定資料，這時候就要出動 BeautifulSoup。首先，我們要先利用 html.parseer（HTML解析器）來解析網站。程式碼如下:

```python
soup = BeautifulSoup(response.text, "html.parser")
```
將剛剛的網站內容（已經存到變數 response 中）轉為 text 形式，再交由 html.parseer 解析並存到變數 soup 中。

最後，我們在網站文章上按右鍵，點選「檢查」來尋找特定元素。

```python=
import requests
from bs4 import BeautifulSoup

response = requests.get(
    "https://ithelp.ithome.com.tw/articles?tab=tech",
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
    })

soup = BeautifulSoup(response.text, "html.parser")
data = soup.select("h3.qa-list__title a")
print(data)
```

## 動態爬蟲
### 套件：

動態爬蟲的做法主要是用在動態網頁以及一些需要登入的網頁，藉由自動加載指定網頁，就可以獲得需要加載才能取得的資料。

Selenium 是 Python 針對動態網頁爬蟲的一個套件，可以藉由控制 WebDriver 來達成爬蟲的目的，我們可以先藉由 pip 指令安裝這個套件:

```python
pip install Selenium
```
WebDriver 操作瀏覽器的一個介面，使用程式可以自動化操控 WebDriver 來進行登入帳號、自動輸入或是捲動頁面等，來達成靜態爬蟲無法做到的功能，簡單來講它就是個可以被程式控制的瀏覽器。

所以我們的目標就是寫個程式控制 WebDriver 來開啟指定網頁，就能自動加載網頁來取得我們要的資源。

要下載 WebDriver 很簡單，我們可以先到各個瀏覽器的 WebDriver 網站上下載相對應的版本（版本記得要選跟自己瀏覽器相同的版本），像我是使用 Chrome，我就可以到這個網站下載 [ChromeDriver](https://chromedriver.chromium.org/)。

```python=
from selenium import webdriver

driver = webdriver.Chrome("./goolemapSpider/chromedriver.exe")
driver.get('https://www.google.com.tw')
```

執行後就可以看到跳出了一個新的 Chrome 視窗，上方顯示「Chrome目前受到自動測試軟體控制。」，並且開啟了 Google 頁面，這樣就代表你的 WebDriver 是正常運作的。

就像你平常加載網頁時都需要時間，用 WebDriver 也需要預留加載的時間，所以我們可以使用 `time.sleep(秒數)` :

```python=
from selenium import webdriver
import time

driver = webdriver.Chrome("./goolemapSpider/chromedriver.exe")
driver.get('https://twitter.com/login')

time.sleep(2)
```
### Selenium 選擇器：
Selenium 提供了下列幾種方法，分別使用不同的方法取得 HTML 標籤位置：

- find_element(By.ID, "id") : 利用 id 來選擇
- find_element(By.NAME, "name") : 利用 name 來選擇
- find_element(By.XPATH, "xpath") : 利用 xpath（節點位置）來選擇
- find_element(By.LINK_TEXT, "link text") : 利用文字來選擇
- find_element(By.PARTIAL_LINK_TEXT, "partial link text") : 利用部分文字來選擇
- find_element(By.TAG_NAME, "tag name") : 利用標籤元素來選擇
- find_element(By.CLASS_NAME, "class name") : 利用 class 來選擇
- find_element(By.CSS_SELECTOR, "css selector") : 利用 CSS 來選擇

### 常用功能：
取得標籤後就可以對標籤進行操作，常見的操作有：

- sendkeys()：可以用於在輸入欄位的輸入
```python=
email = driver.find_element_by_name('session[username_or_email]')
password = driver.find_element_by_name('session[password]')
email.send_keys('aaaa@gmail.com')
password.send_keys('aaaa')
```
- click()：點擊按鈕

```python=
button = driver.find_element_by_class_name('css-901oao.r-1awozwy.r-jwli3a.r-6koalj.r-18u37iz.r-16y2uox.r-37j5jr.r-a023e6.r-b88u0q.r-1777fci.r-rjixqe.r-bcqeeo.r-q4m81j.r-qvutc0')
button.click()
```
- execute_script()：
有時候，網頁沒有向下捲動時，一些內容不會加載被進來，所以我們需要讓 WebDriver 做向下滾動的功能。

```python=
for x in range(1, 3):
    chrome.execute_script("window.scrollTo(0,document.body.scrollHeight)")
    time.sleep(3)
```
中間那行就是滾動頁面的函式用法，每滾動一次就休息3秒，這樣才可以順利加載。

最後只要用 text 就可以將這些選擇器所選擇的內容呈現出來，這邊會建議使用 BS4。也就是說利用 WebDriver 以及 Selenium 動態爬蟲技術產生靜態網站，再用靜態爬蟲爬取資料，會是比較好的做法。

### 關鍵心法：讓程式模仿一個普通使用者的樣子

## 補充資料
1. [從Python的基礎到套件的使用 - 用30天帶大家認識 Python Day17-20](https://ithelp.ithome.com.tw/users/20138060/ironman/3885)
2. [Chromedriver ubuntu install](https://blog.csdn.net/shjsfx/article/details/106006255)

