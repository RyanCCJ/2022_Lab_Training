# %%
import getGmail_Class
import os, sys, logging
from tqdm import trange
from datetime import datetime
import pandas as pd
import re

# %%
gGC = getGmail_Class.gmailService()

# %%
Num, Name, investment_company, Date, Filename, ID, Recommend = [[] for i in range(7)]

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level = logging.INFO, filename = "/home/cosbi/桌面/financialData/gmailData/log/" + datetime.now().strftime("%Y_%m_%d") + '.log', filemode = 'w', format = FORMAT)
logging.info('Updating email start')

# request a list of all the messages
result = gGC.service.users().messages().list(userId = 'me', maxResults = 500, labelIds = ["INBOX"]).execute()
messages = result.get('messages')

if messages == None:
    logging.info('Inbox quantity is 0')
    logging.info('Updating email end')
    sys.exit(0)

# get mail ID from messages
for i in range(len(messages)):
    ID.append(messages[i]['id'])

# iterate through all the messages
for i in trange(len(ID)):
    # Get the message from its id
    txt = gGC.service.users().messages().get(userId = 'me', id = ID[i]).execute()
    payload = txt['payload']
    headers = payload['headers']
    date = gGC.getDate(headers)
    subject = gGC.getSubject(headers)
    stock_num = gGC.verifySubject(subject)

    if len(stock_num) != 0:
        tempNum, tempName, tempInvestment_company, tempFilename, tempRecommend = gGC.getResearch_report(subject, stock_num, payload, ID[i], date)
        
        if len(tempNum) != 0:
            for j in range(len(tempNum)):
                Num.append(tempNum[j])
                Name.append(tempName[j])
                Date.append(date)
                investment_company.append(tempInvestment_company)
                Filename.append(tempFilename[j])
                Recommend.append(tempRecommend[j])
                
        # Modify labels
        gGC.modifyLabels(ID[i], "Label2")
    else:
        # Modify labels
        gGC.modifyLabels(ID[i], "Label3")

df = pd.DataFrame({ "Number" : Num, "Name" : Name, "Investment company" : investment_company, "Date" : Date, "Filename" : Filename, "Recommend" : Recommend })

logging.info('Updating email end')

# %%
csvName = datetime.now().strftime("%Y_%m_%d") + ".csv"
df.to_csv("/home/cosbi/桌面/financialData/gmailData/dataFrame/" + csvName, index = False)


