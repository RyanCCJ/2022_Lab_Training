# %%
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path
import base64
import email
from tqdm import trange
from bs4 import BeautifulSoup
import pandas as pd
import lxml
from apiclient import errors
import re
from datetime import datetime
import logging
import requests
import urllib

# %%
class gmailService:
    def __init__(self):
        # Define the SCOPES. If modifying it, delete the token.pickle file.
        self.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify']
        self.creds = self.getCreds()
        # Connect to the Gmail API
        self.service = build('gmail', 'v1', credentials = self.creds)
        self.df_stock_num2name = pd.read_excel("./src/24932_個股代號及券商名稱.xlsx", index_col = 0, names = ['name'] , sheet_name = 0)
        self.df_investment_company = pd.read_excel("./src/24932_個股代號及券商名稱.xlsx", index_col = 0, names = ['name'], sheet_name = 1)
        self.dict_stock_num2name = self.df_stock_num2name.to_dict(orient = 'dict')['name']
        self.dict_investment_company = self.df_investment_company.to_dict(orient = 'dict')['name']
        self.rootPath = "/home/cosbi/桌面/financialData/gmailData/data/"
    
    def getCreds(self):
        """Get the token from google api before accesing gmail api
            
            Return:
                (String) creds
        """
        # Variable creds will store the user access token.
        # If no valid token found, we will create one.
        creds = None
        
        # The file token.pickle contains the user access token.
        # Check if it exists
        if os.path.exists('token.pickle'):

            # Read the token from the file and store it in the variable creds
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)

        # If credentials are not available or are invalid, ask the user to log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file('credentials.json', self.SCOPES)
                creds = flow.run_local_server(port=0)

            # Save the access token in token.pickle file for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)
        return creds
    
    def getMessages(self, encodedData):
        """Get the mail messages
        
            Args:
                encodedData: (String) Encoded message data
            
            Return:
                If success
                    (html.parser) decoded_data
                If failed
                    (string) Null
        """

        try:
            data = encodedData.replace("-","+").replace("_","/")
            decoded_data = base64.b64decode(data)
            decoded_data = decoded_data.decode("utf-8")
            decoded_data = BeautifulSoup(decoded_data, 'html.parser')

            return decoded_data
        except:
            return "Null"
        
    def check_pdf_dir(self, dirName):
        """Create the file dir
        
        """
        if not os.path.isdir(self.rootPath + dirName):
            os.mkdir(self.rootPath + dirName)
    
    def getAttachments(self, encodedFile, ID, stock_num_name, investment_company_res, date, recommend):
        """Get the mail attachments already existed in mail 
        
            Args:
                encodedFile: (dictionary) dictionary contains file base64
                stock_num_name: (dictionary) key is stock numbers and value is stock name
                investment_company_res: (list) investment_company
                date: (string) mail date
            
            Return:
                If success
                    (string) Stock numbers, (string) Stock name, (string) File path
                If failed
                    (string) Null, (string) Null, (string) Null
        """
        numList, nameList, filenameList, recommendList = [[] for i in range(4)]
        i = 0
        
        for num, name in stock_num_name:
            try:
                att = self.service.users().messages().attachments().get(userId = 'me', messageId = ID, id = encodedFile['body']['attachmentId']).execute()
                file = att['data']
                file_data = base64.urlsafe_b64decode(file.encode('UTF-8'))

                if investment_company_res != "":
                    self.check_pdf_dir(num)

                    with open(self.rootPath + num + "/" + num + "-" + name + "-" + date + "-" + investment_company_res + "-" + recommend[i] + ".pdf", 'wb') as f:
                        f.write(file_data)
                    
                    numList.append(num)
                    nameList.append(name)
                    filenameList.append(num + "-" + name + "-" + date + "-" + investment_company_res + "-" + recommend[i] + ".pdf")
                    recommendList.append(recommend[i])
                    i += 1
                else:
                    self.check_pdf_dir(num)
                    with open(self.rootPath + num + "/" + num + "-" + name + "-" + date + "-NULL-" + recommend[i] + ".pdf", 'wb') as f:
                        f.write(file_data)
                        
                    numList.append(num)
                    nameList.append(name)
                    filenameList.append(num + "-" + name + "-" + date + "-NULL-" + recommend[i] + ".pdf")
                    recommendList.append(recommend[i])
                    i += 1

            except errors.HttpError:
                numList.append("null")
                nameList.append("null")
                filenameList.append("null")
                recommendList.append("null")
                
        return numList, nameList, filenameList, recommendList
    
    def getAttachmentsURL(self, content, stock_num_name, date, recommend):
        """Get the attachments from url
        
            Args:
                content: (html.parser) Decoded message data
                stock_num_name: (dictionary) Key is stock numbers and value is stock name
                date: (string) mail date
            
            Return:
                If success
                    (string) Stock numbers, (string) Stock name, (string) File path
                If failed
                    (string) Null, (string) Null, (string) Null
        """

        a_tags = content.find_all('a')

        for a in range(len(a_tags)):
            if re.findall(r"https://report.yuanta-consulting.com.tw/DL.aspx\?r\=\d{6}", a_tags[a].getText()):
                try:
                    url = re.findall(r"https://report.yuanta-consulting.com.tw/DL.aspx\?r\=\d{6}", a_tags[a].getText())
                    # 取得url的response 並解析 filename
                    pdfurl = requests.get(url[0], allow_redirects = True).url

                    for num, name in stock_num_name:
                        self.check_pdf_dir(num)
                        file_rename = self.rootPath + num + "/" + num + "-" + name + "-" + date + "-元大-" + recommend[0] + ".pdf"
                        urllib.request.urlretrieve(pdfurl, file_rename)
                        return num, name,  num + "-" + name + "-" + date + "-元大-" + recommend[0] + ".pdf", recommend
                except:
                    return "null", "null", "null", "null"
                
        return "null", "null", "null", "null"
    
    def verifySubject(self, subject):
        """Get the mail subject
        
            Args:
                subject: (string) Mail title
            
            Return:
                (list) temp1 || temp2 || []
        """
        
        # \d{4}(?=\.[A-Z] 4個數字(\d{4})但後面是 .加英文 EX:5288.TT
        # (?<=[^\d])\d{4}(?=[^\d\/]) 4個數字(\d{4}) 前面為非數字(?<=[^\d]) 後面不能接數字(\d) or/ or 年 or .
        
        temp1 = re.findall(r'\d{4}(?=\.[A-Z])', subject)
        temp2 = re.findall(r'(?<=[^\d])\d{4}(?=[^\d\/\年\.])', subject)
        
        if len(temp1) != 0 and len(temp2) == 0:
            return temp1
        
        elif len(temp1) == 0 and len(temp2) != 0:
            return temp2
        
        else:
            return []
            
    def getDate(self, header, display = False):
        """Get the mail date
        
            Args:
                header: (list) Header of the Message
                display: (bool) print date or not
            
            Return:
                (String) Date
        """
        
        monthMap = { "Jan" : 1, "Feb" : 2, "Mar" : 3, "Apr" : 4, "May" : 5, "Jun" : 6,
           "Jul" : 7, "Aug" : 8, "Sep" : 9, "Oct" : 10, "Nov" : 11, "Dec" : 12 }
        
        for d in header:
            if d['name'] == 'Date':
                date = d['value'][5:]
                date = date.replace(" ", ",")
                temp = date.split(",")
                day = temp[0].zfill(2)
                month = str(monthMap[temp[1]]).zfill(2)
                year = temp[2]

                date = year + "_" + month + "_" + day
                
                if display:
                    print("Date: ", date)
                    print("-----" * 20)
                return date
            
    def getSubject(self, header, display = False):
        for d in header:
            if d['name'] == 'Subject':
                if display:
                    print("Subject: ", d['value'])
                    print("-----" * 20)
                subject = d['value']
                return subject
    
    def getResearch_report(self, subject, stock_num, payload, ID, date):
        """Get the research report
        
            Args:
                subject: (string) mail title
                stock_num: (list) stock number
                payload: (string) mail payload
                ID: (string) mail ID
                date: (string) mail date

            Return:
                (list)Num, Name, Path
        """     
        Num, Name, Path, mimeType, Recommend, stock_num_name, _stock_num, _stock_name = [[] for i in range(8)]
        investment_company_res = [key for key, value in self.dict_investment_company.items() if key in subject]
        
        for i in range(len(stock_num)):
            if int(stock_num[i]) in self.dict_stock_num2name.keys():
                stock_num_name.append([stock_num[i], self.dict_stock_num2name[int(stock_num[i])]])
                _stock_num.append(stock_num[i])
                _stock_name.append(self.dict_stock_num2name[int(stock_num[i])])
         
        investment_company_res = [x for x in investment_company_res if x not in _stock_name]

        temp_recommendResult = self.recommend(subject, _stock_num)
        
        if len(investment_company_res) == 0:
            investment_company_res = ""
        else:
            investment_company_res = investment_company_res[0]
        
        # Get email attachment
        try:
            for j in range(1, len(payload['parts'])):
                mimeType.append(payload['parts'][j]['mimeType'])
        except:
            return Num, Name, investment_company_res, Path, Recommend
        
        if 'application/pdf' in mimeType:
            for i in range(len(mimeType)):
                if mimeType[i] == 'application/pdf':
                    num, name, path, recommend = self.getAttachments(payload['parts'][i + 1], ID, stock_num_name, investment_company_res, date, temp_recommendResult)
                    
                    if path != "null":
                        Num.extend(num)
                        Name.extend(name)
                        Path.extend(path)
                        Recommend.extend(recommend)
                
        else:
            for i in range(len(mimeType)):
                if mimeType[i] == 'text/html':
                    try:
                        content = self.getMessages(payload['parts'][i + 1]['body']['data'])
                    except:
                        content = self.getMessages(payload["body"]["data"])
                        
                    num, name, path, recommend = self.getAttachmentsURL(content, stock_num_name, date, temp_recommendResult)

                    if path != "null":
                        Num.append(num)
                        Name.append(name)
                        Path.append(path)
                        Recommend.extend(recommend)
        
        return Num, Name, investment_company_res, Path, Recommend
    
    def modifyLabels(self, ID, formats):
        """Modify mail from INBOX to label2 or label3
        
          Args:
            ID: (String) The ID of the Message required
            formats: (String) modify from INBOX to label
        """
        
        if formats == "Label2":
            Body = { "addLabelIds": ["Label_2"], "removeLabelIds" : ["INBOX"] }
        
        elif formats == "Label3":
            Body = { "addLabelIds": ["Label_3"], "removeLabelIds" : ["INBOX"] }
            
        self.service.users().messages().modify(userId = 'me', id = ID, body = Body).execute()
    
    def recommend(self, subject, stockNum):
        result = []
        
        for i in stockNum:
            offset = subject.find(i + ".TT")
            
            if offset != -1:
                start = offset + 8
                end = start + 2
                
                while(subject[end] != ")"):
                    if end == len(subject) - 1:
                        result.append("Null")
                        break

                    end += 1
                    
                result.append(subject[start:end])
            else:
                result.append("Null")
        return result


