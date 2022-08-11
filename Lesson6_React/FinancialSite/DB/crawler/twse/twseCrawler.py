#!/usr/bin/env python
# coding: utf-8

# In[1]:


from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from tqdm import trange
import pandas as pd
import requests
import os, sys
from typing import Any, List
import MySQLdb
import time
import datetime

sys.stderr = open("/home/cosbi/桌面/financialData/twse/log/" + str(datetime.date.today()) + '.log', 'w')

# In[2]:


class TwseSelenium():
    
    def __init__(self) -> None:
        _options = webdriver.ChromeOptions()
        _options.add_argument('--headless')
        _s = Service(ChromeDriverManager().install())
        
        self.driver = webdriver.Chrome(options = _options, service = _s)

    def driver_find(self, month:int) -> Any:
        self.driver.get("https://mops.twse.com.tw/mops/web/t100sb02_1")
        
        select_element = self.driver.find_element(by = By.NAME, value = "month")
        select_object = Select(select_element)
        select_object.select_by_index(month)
        
        self.driver.find_elements(by = By.XPATH, value = "//input[@type='button']")[1].click()
        time.sleep(3)
        
        soup = BeautifulSoup(self.driver.page_source, 'html.parser')
        
        return soup


# In[3]:


class MySQL():
    
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint",
                                   passwd = "CEMj8ptYHraxNxFt", db = "financial", charset = "utf8")
        self._cursor = self._db.cursor()
        
    def search(self, stockNum:str, date:str) -> List:        
        sql = "SELECT * from calender WHERE `stockNum`='%s' AND `date`='%s';" % (stockNum, date)

        self._cursor.execute(sql)
        self._db.commit()
        
        return self._cursor.fetchall()
    
    def insert(self, stockNum, stockName, Date, Time, Form, Message, chPDF, enPDF, More_information, Video_address, Attention) -> None:
        self._cursor.execute("INSERT INTO calender (`stockNum`, `stockName`, `Date`, `Time`, `Form`, `Message`, `chPDF`, `enPDF`, `More information`, `Video address`, `Attention`)"
                        " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);", (stockNum.encode('utf-8'), stockName.encode('utf-8'), Date.encode('utf-8'), Time.encode('utf-8'), Form.encode('utf-8'), Message.encode('utf-8'), chPDF.encode('utf-8'), enPDF.encode('utf-8'), More_information.encode('utf-8'), Video_address.encode('utf-8'), Attention.encode('utf-8')))
        self._db.commit()
        
    def update(self, stockNum, Date, Time, Form, Message, chPDF, enPDF, More_information, Video_address, Attention) -> None:
        sql = "UPDATE calender SET `Time`='%s', `Form`='%s', `Message`='%s', `chPDF`='%s', `enPDF`='%s', `More information`='%s', `Video address`='%s', `Attention`='%s' WHERE `stockNum`='%s' AND `Date`='%s';" % (Time, Form, Message, chPDF, enPDF, More_information, Video_address, Attention, stockNum, Date)
        
        self._cursor.execute(sql)
        self._db.commit()
        
    def close(self) -> None:
        _db.close()


# In[9]:


class Twse(TwseSelenium, MySQL):
    
    def __init__(self):
        TwseSelenium.__init__(self)
        MySQL.__init__(self)
        
    def _download_pdf(self, lang:str, stockNum:str, fileName:str) -> None:
        if (".pdf" in fileName) and (os.path.exists("/home/cosbi/桌面/financialData/twseData/data/" + lang + "/" + stockNum + "/" + fileName) == False):
            
            download_payload = {
                "step": "9",
                "filePath": "/home/html/nas/STR/",
                "fileName": fileName,
                "functionName": "t100sb02_1"
            }

            while(True):
                try:
                    download_response = requests.post("https://mops.twse.com.tw/server-java/FileDownLoad",
                                        data = download_payload,
                                        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',"Content-Type": "application/json"}
                                        )

                    data = download_response.content
                except:
                    pass
                
                time.sleep(0.5)

                if(len(data) > 1000):
                    break

            with open("/home/cosbi/桌面/financialData/twseData/data/" + lang + "/" + stockNum + "/" + fileName, 'wb') as s:
                s.write(data)
    
    def crawler(self, month:str) -> None:
        soup = self.driver_find(month)
        
        result_even = soup.find_all("tr", class_ = "even")
        result_odd = soup.find_all("tr", class_ = "odd")
        result_total = result_even + result_odd

        for i in trange(len(result_total)):
            data_td = result_total[i].find_all("td")
            
            row_date = data_td[2].getText().replace("/", "-")
            newYear = str(int(row_date.split("-")[0]) + 1911)
            row_date = row_date.replace(row_date.split("-")[0], "")
            row_date = newYear + row_date
            
            sql_result = list(self.search(data_td[0].getText(), row_date))
            
            if(len(sql_result) == 0):
                self._download_pdf("ch", data_td[0].getText(), data_td[6].getText())
                self._download_pdf("en", data_td[0].getText(), data_td[7].getText())
                
                self.insert(data_td[0].getText(), data_td[1].getText(), row_date, data_td[3].getText(),
                           data_td[4].getText(), data_td[5].getText(), data_td[6].getText(), data_td[7].getText(),
                           data_td[8].getText(), data_td[9].getText(), data_td[10].getText())
                
            else:
                self._download_pdf("ch", data_td[0].getText(), data_td[6].getText())
                self._download_pdf("en", data_td[0].getText(), data_td[7].getText())
                
                self.update(data_td[0].getText(), row_date, data_td[3].getText(),
                           data_td[4].getText(), data_td[5].getText(), data_td[6].getText(), data_td[7].getText(),
                           data_td[8].getText(), data_td[9].getText(), data_td[10].getText())


# In[ ]:


def run():
    today = datetime.datetime.now()
    twse = Twse()
    
    if str(today.day) == "28":
        if str(today.month) == "1":
            twse.crawler(month = "12")
            twse.crawler(month = "1")
        else:
            twse.crawler(month = str(today.month))
            twse.crawler(month = str(int(today.month) - 1))
    else:
        twse.crawler(month = str(today.month))


# In[ ]:

if __name__ == "__main__":
    run()




