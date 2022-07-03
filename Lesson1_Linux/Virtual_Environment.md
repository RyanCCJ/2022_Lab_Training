# 虛擬環境 Virtual Environment

為什麼要建立虛擬環境？有那麼重要嗎？讓我們來看看以下案例：

<div style="border-style:double;">
 - **案例一**：在你的電腦上開發專案

    假設今天你有習慣使用的公司電腦或個人筆電，且同時維護數個專案。

    專案A可能需要 Python 2.7，或是 Pandas、Matplotlib 等相關套件；專案B可能需要 Python 3.8 以及 Django 等其他套件；專案C可能需要 TensorFlow 或其他 ML 套件...

    一旦日子久了，你的電腦就會安裝無數個套件與不同的版本，三不五時就要去檢查這個專案用的是哪種，偶爾還需要解決衝突，搞得整個電腦亂的跟大雜燴一樣，看得非常痛苦。

 - **案例二**：一群人共同開發一個專案
 
    如果今天是一群人開發，大家都不用虛擬環境，那就更精彩了。你永遠不會知道他的電腦裝了什麼？需要用到什麼？個人的痛苦直接放大 N 倍。
    
    雖然也有其他解決辦法（像是寫一個 requirements.txt，告訴其他人要用到什麼套件），但是每次交接時都必須檢查自己的電腦有沒有安裝相應套件，還必須小心不要與舊專案衝突，仔細設定好路徑。
</div>

有沒有一個一勞永逸的方法，能夠快速知道自己需要什麼、快速做好路徑設定，且不會影響其他開發中專案呢？

有的，你要的 **「虛擬環境」** 來了。

> 虛擬環境就是「專門為了這個專案開發的環境」，包含各種需要的套件版本與設定。

實務上，你不可能擁有整個工作站伺服器的管理權限，否則工作站很快就亂成一團。比較好的做法是每個人都根據自己的開發需求建立虛擬環境、安裝套件、寫好 requirements，這樣在專案維護與交接上都清楚許多。

## 方法一：建立在專案內

有時候，我們想直接在專案內部設定好環境，方便打成一整包，這時就可以在專案內建一個虛擬環境專用的資料夾。

請利用以下步驟操作 (Linux/Mac)：
``` bash
$ pip install virtualenv #安裝虛擬環境
$ cd "<YOUR PROJECT DIR>" #進入專案資料夾內
$ virtualenv "<YOUR VENV NAME>" #建立虛擬環境，以下假設是VENV
$ source VENV/bin/activate #啟動虛擬環境
(VENV)$ pip list #可以看到目前乾淨的環境！
(VENV)$ ...
(VENV)$ deactivate #離開虛擬環境
$ ...
$ rm -rf VENV #刪除虛擬環境
```
以上步驟會使用系統預設的 python 版本來安裝虛擬環境，若要使用其他版本的 python 環境，則可加上**版本**或**路徑**描述。
以 python3 舉例如下（二選一即可）：
``` bash
$ virtualenv -p python3 "<YOUR VENV NAME>" #python版本
$ virtualenv -p /usr/bin/python3 "<YOUR VENV NAME>" #python路徑
```
若是不知道特定版本的路徑，則可使用 which 指令來尋找：
``` bash
$ which python3  #/usr/bin/python3
```
若是 Windows 系統，則使用以下方式啟動虛擬環境：
``` bash
C:\> .\VENV\Scripts\activate  #啟動虛擬環境
(VENV) C:\> ...
(VENV) C:\> .\VENV\Scripts\deactivate #離開虛擬環境
C:\> ...
```
若是不知道路徑，則可使用 where 指令來尋找：
``` bash
C:\> where python  #C:\Users\<username>\AppData\Local\Programs\Python\Python3X\python.exe
```

## 方法二：在 Global 設定虛擬環境

雖然「方法一」的虛擬環境資料夾不一定要在專案內部（意即，你可以在電腦任何地方設定虛擬環境，需要時再去啟動），但有時候，我們想在任何地方都能隨意的打開、切換虛擬環境，這樣進進出出就顯得很麻煩。

這時可以使用一個叫 **Virtualenvwrapper** 的工具，方便我們直接用指令快速打開需要的環境。

請利用以下步驟操作 (Linux/Mac)：
``` bash
$ pip install virtualenvwrapper
$ mkdir ~/.virtualenvs #在home或其他地方建立虛擬環境資料夾，這裡預設是隱藏的
$ vim ~/.bashrc #打開bash設定檔（或是.zshrc，看你用的是哪種）
>> #末尾添加下列兩行（vim操作請自行查閱）
export WORKON_HOME=~/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
>>
$ source ~/.bashrc #重啟bash（或是重啟zsh）
```
若是使用 Windows 系統，則需安裝 win 版本。虛擬環境預設會在 C:\Users\\<username>\Envs 中，不須額外修改設定檔：
``` bash
C:\> pip install virtualenvwrapper-win #注意不要裝錯，會不能正常使用
```
之後在任何位置，都可以打以下指令，非常方便：
``` bash
$ mkvirtualenv "<YOUR VENV NAME>" #建立虛擬環境
$ workon #列出可用的虛擬環境
$ workon "<YOUR VENV NAME>" #開啟或切換特定虛擬環境，以下假設是VENV
(VENV)$ ...
(VENV)$ deactivate #離開虛擬環境
$ ...
$ rmvirtualenv VENV #刪除虛擬環境
```
如果要安裝特定版本的 python 環境，一樣可以加上版本或路徑描述：
``` bash
$ mkvirtualenv -p python3 "<YOUR VENV NAME>"
```

## 方法三：利用 Anaconda 建立虛擬環境

Anaconda 是許多 python 使用者都會安裝的一個工具，包含常用的 Jupyter Notebook、PyCharm...，當然也可以透過它設定虛擬環境。

在 Anaconda Navigator，可以很直觀地在介面左上方點選「Environments」，直接安裝與管理所需要的環境和套件，非常方便。
![Anaconda ENV](https://i.imgur.com/RgZyKNL.png)

若是要使用 Terminal 操作，則可輸入以下指令：

``` bash
$ conda create -n "<YOUR VENV NAME>" #建立虛擬環境
$ conda env list #列出可用的虛擬環境
$ conda activate/deactivate "<YOUR VENV NAME>" #開啟或關閉特定虛擬環境
$ conda list #列出該環境下所有套件
$ conda remove -n "<YOUR VENV NAME>" --all #刪除虛擬環境
```
如果要安裝特定版本的 python 環境，則可加上版本描述：
``` bash
$ conda create -n "<YOUR VENV NAME>" python=3.X
```
### 補充
當我們安裝完 Anaconda 後，會發現 Terminal 被預設加入 conda 的 (base) 環境。如果我們利用 which python 來檢查，會發現它的 python 路徑與作業系統預設的 /usr/bin/python 是不同的。
如果不想每次打開 Terminal 都要先做 conda deactivate，可以輸入以下指令，將 conda 的設定檔改掉：
``` bash
$ conda config --set auto_activate_base false
```
此設定檔位置應該會在 ~/.condarc

## 其他

還記得前面提到過可以寫一個 requirements 文件來協助管理我們的套件內容嗎？這依然是一個常用的作法：
``` bash
$ pip freeze > requirements.txt #自動產生該環境下的所有套件版本
```
這樣就可以將 requirements.txt 放在專案中，確保所有人版本一致。當其他人要複製專案時，則可以打以下指令：
``` bash
$ pip install -r requirements.txt #安裝文件內所有套件版本
```
若今天是使用 Anaconda 的人，則可以利用以下指令：
``` bash
$ conda list --explicit > requirements.txt #產生套件列表
$ conda install -f requirements.txt #安裝套件
```
完成各個環境的無痛轉移。

## 相關資料

1. [virtualenv doc](https://virtualenv.pypa.io/en/latest/)
2. [virtualenvwrapper doc](https://virtualenvwrapper.readthedocs.io/en/latest/)
3. [conda doc](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html)

## Exercise
- 創建自己的虛擬環境，python 版本為 3 以上，且安裝 pandas 套件
- 試著撰寫一段 python 程式列印出「 hello world! 」
