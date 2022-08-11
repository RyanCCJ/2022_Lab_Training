#!/usr/bin/env python
# coding: utf-8

# In[1]:


import MySQLdb
import pandas as pd
from datetime import datetime
import os, sys, logging
from tqdm import trange


# In[2]:


FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level = logging.INFO, filename = "/home/cosbi/桌面/financialData/gmailData/log/" + datetime.now().strftime("%Y_%m_%d") + '_SQL.log', filemode = 'w', format = FORMAT)
logging.info('Updating gmail data to sql')


# In[3]:


try:
    csvName = datetime.now().strftime("%Y_%m_%d") + ".csv"
    df = pd.read_csv("/home/cosbi/桌面/financialData/gmailData/dataFrame/" + csvName)
    df = df.fillna("NULL")
    df.drop_duplicates(inplace = True)
    df.reset_index(drop = True, inplace = True) 

    db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint",
                     passwd = "CEMj8ptYHraxNxFt", db = "financial", charset = "utf8")

    cursor = db.cursor()

    for i in trange(len(df)):
        cursor.execute('INSERT INTO financialData (stockNum, stockName, date, investmentCompany, filename, recommend) '
                'VALUES (%s, %s, %s, %s, %s, %s);', (str(df.iloc[i]["Number"]), df.iloc[i]["Name"], df.iloc[i]["Date"], df.iloc[i]["Investment company"], df.iloc[i]["Filename"], df.iloc[i]["Recommend"]))
        db.commit()

    db.close()
    logging.info('Updating complete')
except Exception as e:
    logging.info(e)
    logging.info('Updating failed')

