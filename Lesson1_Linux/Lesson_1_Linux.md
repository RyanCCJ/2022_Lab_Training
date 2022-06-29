# Lesson1 Linux 
2021/07/01
## Introduction
* Linux是一套作業系統，實驗室伺服器與外面公司伺服器多數都使用linux系統
* 可多工、多使用者 (有分一班使用者/管理員)
* 速度較快，穩定性、安全性高
* 較不耗資源
* 操作較複雜，需要花時間熟悉...

## Preparation

### tool
* 檔案傳輸：[FileZilla](https://filezilla-project.org/)
* SSH連線工具：[pietty](https://sites.google.com/view/pietty-project/download)

### basic command
* **ls**：列出檔案內資料
    * ls -l：列出詳細資料
    * ls -a：列出隱藏資料(ex: .bashrc)
* **mkdir** new_directory：建立目錄 (新增資料夾)
* **rm** (-r) filename(directory)：刪除檔案(-r：資料夾)
* **cd**：進入/退出資料夾
    * cd directory：進入某資料夾
    * cd . .：退回上一層
    * cd ~ or cd：退回至家目錄
* **cp** filename new_place：複製filename至new_place
* **mv** filename new_place：剪下filename至new_place or 重新命名
* **less** filename：查看檔案內容 (read only)
* **cat** filename：顯示檔案內容至終端機介面
* **htop**：查看伺服器的硬體使用情形，避免佔用過多資源影響其他使用者等
* **df**：確認硬碟空間
* **clear**：清除介面

### EXERCISE 1
從 ttyy66995/lab_training 中移exercise1.txt到自己的檔案下自己創建的資料夾中，並將其改名，查看內容或印在終端機上

### vim 文字編輯器
* vi/vim 後+filename 則可以直接創建並編寫文件/程式
* 滑鼠與數字鍵無法使用
* 三種模式：
    * 一般指令模式 (command mode)：以 vi 打開一個檔案就直接進入一般指令模式，可以進行刪除、複製、貼上等等的動作 (u:復原、ctrl+r:重作、G:到最底)
    * 編輯模式 (insert mode)：編輯文件內容，在一般模式按下i/o/a進入編輯模式，按下esc回到一般模式(選取即複製，右鍵為貼上)
    * 指令列命令模式 (command-line mode)：可以提供搜尋資料、讀取、存檔等等額外功能的動作，在一般模式按下對應指令(:q：離開、:wq/:x：儲存並離開、:w：儲存、/word:搜尋word、:數字：到第幾行)

* 推薦網站：[鳥哥的Linux私房菜](http://linux.vbird.org/)
## virtual environment 虛擬環境 (!!!)
如果在同一台伺服器有許多人使用，**每個人都有不同套件、版本需求**，可個別使用各自的虛擬環境建立符合自身需要，避免環境跟套件亂七八糟；若自己有好幾個project，也可以用不同的虛擬環境
* [virtualenvwrapper](https://www.itread01.com/content/1498915331.html)
* pip install package_name：安裝某套件
* python --version:查看python版本
* 加上 **--python=python數字** 可指定環境所使用的python版本
* python filename. py：執行某python

### EXERCISE 2
創建自己的虛擬環境，python版本為3.5，且安裝pandas套件，並撰寫python程式試著print出一段文字(print('文字'))並執行

## Anaconda
* python的懶人包，除了內建Spyder與Jupyter Notebook編輯器外，更包含了常用的模組，是初學者相當不錯的開發環境
* [anaconda](https://www.anaconda.com/products/individual)
* https://walker-a.com/archives/6260
* 常用python IDE：spyder、pycharm、vscode(需自己安裝)
* 數據分析常用：jupyter notebook
* 虛擬環境：conda create --name myenv python=3.5
* 安裝套件：conda install pandas
