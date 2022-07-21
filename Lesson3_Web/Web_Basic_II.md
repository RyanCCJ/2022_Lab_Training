# Web Basic II

除了基本 HTML、CSS、JavaScript 之外，我們還可以透過一些套件或框架來提升網頁開發的效率。以下會介紹兩種套件，一種是針對 CSS 開發的 Bootstrap，另一種是針對 JavaScript 開發的 jQuery。

## Bootstrap 

當我們想做出美麗的網頁外觀，除了手刻 CSS，更簡便的做法是使用前端 CSS 框架，透過預先寫好的 class 樣式，大幅降低開發門檻。使用框架的缺點是，容易跟其他網站長得很像、不容易做出創新的設計、不容易彈性修改程式碼。但對於我們實驗室這種非設計取向的網站來說，CSS 框架非常實用。

![](https://i.imgur.com/8pMM38E.png)

目前市面上最主流的 CSS 框架是由 Twitter 開發的 [Bootstrap](https://getbootstrap.com)，且經由六角學院翻譯完整份 [中文文件](https://bootstrap5.hexschool.com)，非常適合新手入門。其他知名的框架像是 [Semantic UI](https://semantic-ui.com)、[Tailwind](https://tailwindcss.com) ，也有許多人選擇使用。

### 使用方法

引入 Bootstrap 最簡單的方法是將以下兩行放進 HTML \<head> 內，就可以透過 Content Delivery Network (CDN) 的方式載入 Bootstrap 5，節省 Server 端流量。
```htmlembedded
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>
```

然而，此連結有可能因為時代更迭而消失，所以更保險的作法是將整套檔案下載到伺服器上，再透過路徑連結給 HTML 取用。

如果今天有能力透過 Sass 重新編寫 Bootstrap 程式，也需要下載或安裝原始碼才能修改內容。

一旦引入 Bootstrap，就可以至文件尋找自己需要的元素。舉凡：按鈕、標籤、導覽列、進度條，或是排版、表單控制、微調間距等，大部分常用功能都可以很簡單的完成。

- **範例(一）：** Outline 按鈕樣式

![](https://i.imgur.com/zx61VzY.png)

```htmlembedded
<!-- HTML body -->
<button type="button" class="btn btn-outline-primary">Primary</button>
<button type="button" class="btn btn-outline-secondary">Secondary</button>
<button type="button" class="btn btn-outline-success">Success</button>
<button type="button" class="btn btn-outline-danger">Danger</button>
<button type="button" class="btn btn-outline-warning">Warning</button>
<button type="button" class="btn btn-outline-info">Info</button>
<button type="button" class="btn btn-outline-light">Light</button>
<button type="button" class="btn btn-outline-dark">Dark</button>
```

- **範例(二)：** 十二欄系統

![](https://i.imgur.com/nDY0FAA.png)

```htmlembedded
<!-- HTML body -->
<div class="container">
  <div class="row">
    <div class="col">col</div>
    <div class="col">col</div>
    <div class="col">col</div>
    <div class="col">col</div>
  </div>
  <div class="row">
    <div class="col-8">col-8</div>
    <div class="col-4">col-4</div>
  </div>
</div>
```

### 響應式網頁

響應式設計 Responsive Web Design (RWD)，指的是網頁可因應不同裝置寬度（eg. 電腦、平版、手機），自動調整版面變化，讓網頁在不同的裝置間保持正常運作。

傳統要做響應式網頁，必須要先偵測瀏覽器寬度，再設計好幾種 CSS 版面；有些網站（eg. Facebook、Mobile01）甚至會直接設計兩個頁面，給手機與電腦版不同網址。

Bootstrap 已經預先設計好 RWD 框架，只不過是以手機為出發視角，只要將特定修飾詞放進 class 內，就可以針對螢幕寬度自動排版。


| xs | sm | md | lg | xl | xxl |
| -- | -- | -- | -- | -- | --- |
| <576px | ≥576px | ≥768px | ≥992px | ≥1200px | ≥1400px |
| `.col-` | `.col-sm` | `.col-md` | `.col-lg` | `.col-xl` | `.col-xxl` |

若要檢查 RWD 效果，可以開啟 Chrome DevTools，按下左上角「 Toggle device toolbar 」，就可以切換不同手機或平板型號。

## jQuery

[jQuery](https://jquery.com) 是一個由 JavaScript 所寫成的函式庫，整合了許多常見的功能，並將 JavaScript 本身的語法變得更加簡潔。

傳統上在開發網頁前端，許多人會將 jQuery 配合著 JavaScript 一起使用；但是隨著時代演進，許多公司開始選擇使用前端框架（eg. React、Vue.js）來取代 jQuery。然而，jQuery 在台灣前端軟體業依然佔有極高的比重，且學習門檻較低，適合基本的學術網站使用。網頁技術日新月異，卻只有 jQuery 歷久不衰。

![](https://i.imgur.com/TbCw4gc.png)

有些人認為 jQuery 檔案較肥大，往往為了特定某些功能，就必須下載整包 jQuery 檔案，拖慢網頁執行時間。實際上最新的 `jquery-3.6.0.min.js` 才約 90KB，遠比不上一張圖片。

關於 jQuery 的教學資源，一樣可以去 [W3Schools](https://www.w3schools.com/jquery/default.asp) 學習。

### 使用方法
使用 CDN 方式讀取，或直接下載整份 js 文件再讀取：
```htmlembedded
<!-- 使用 Google CDN -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

<!-- 下載 min 版較輕量 -->
<script src="jquery-3.6.0.min.js"></script>
```
備註：如果你有某些自己寫的特效或功能是與其他套件衝突的，「放在後面」讀入的檔案原則上會取代「放在前面」的檔案。

### DOM

開始寫 jQuery 前，要注意所有的 jQuery 程式都會習慣放在 ready() 內，等整個頁面 loading 完才會執行：

```javascript
$(document).ready(function(){

  // jQuery methods go here...

});
```

jQuery 使用類似 CSS 選擇器的語法來操作 DOM 元件，如以下範例：
- **Basic syntax:** $(selector).action()
```javascript
// class = test
$(".test").hide();

// id = test
$("#test").hide();
```
在傳統 JavaScript 裡，你可能要這樣寫：
```javascript
// class = test
document.getElementsByClassName("test").style.display = 'none';

// id = test
document.getElementsById("test").style.display = 'none';
```

### Event Handling

```javascript
// jQuery
$("#toggle_button").on( "click", function(){
  $("#test").show();
});

// JavaScript
var x = document.getElementById("toggle_button");
var y = document.getElementById("test");
x.addEventListener("click", function(){
  y.style.display = 'block';
});
```

### AJAX

Ajax 全名 Asynchronous JavaScript and XML，是一種透過非同步方式，與網頁後端互動的技術。使用者在前端按下 Submit 後，可以繼續瀏覽、操作網頁，不影響後端資料的傳輸與運算。

![](https://i.imgur.com/LAiZBTz.png)

jQuery 很棒的一點是將 Ajax 語法簡化，相當易於使用：
```javascript
$.ajax({
  url: "/api_url",
  data: {
    input_seq: "ATCG"
  },
  success: function(result) {
    $("#test").html( "<p>" + result + "</p>" );
  },
  error: function() {
    alert('something error');
  }
});
```
本次僅先簡單帶過，待架設 Django 後端後再詳細介紹。

### User Interface
jQuery 除了基本的 hide()、show()，也有一些類似 Bootstrap 的好用 UI 元素或功能，例如日期選擇：

```javascript
$("#test").datepicker();
```
![](https://i.imgur.com/Kxt5vgA.png)

## Exercise
- 試著在自我介紹頁面中加入一點 Bootstrap 元件
- 試著引入並使用 jQuery 語法
