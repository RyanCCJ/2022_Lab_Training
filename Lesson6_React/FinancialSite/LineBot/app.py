from __future__ import unicode_literals
import os
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, FollowEvent, TextMessage, TextSendMessage
import configparser
import json
import subprocess

app = Flask(__name__)

config = configparser.ConfigParser()
config.read('config.ini')

line_bot_api = LineBotApi(config.get('line-bot', 'channel_access_token'))
handler = WebhookHandler(config.get('line-bot', 'channel_secret'))

@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature']

    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)
    
    try:
        print(body, signature)
        handler.handle(body, signature)
        
    except InvalidSignatureError:
        abort(400)

    return 'OK'

@handler.add(FollowEvent)
def init_message(event):
    _userID = event.source.user_id

    with open('/home/cosbi/crypto/userID.json','r+') as file:
        file_data = json.load(file)
        num = file_data["num"]
        ID = file_data["ID"]

        if _userID not in ID:
            file_data["num"].append(len(num) + 1)
            file_data["ID"].append(_userID)
            file.seek(0)
            json.dump(file_data, file, indent = 4)

    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text = "Add userID success")
    )

@handler.add(MessageEvent, M)

if __name__ == "__main__":
    app.run()