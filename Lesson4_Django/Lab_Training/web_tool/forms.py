from django.forms import ModelForm
from web_tool import models

class UserForm(ModelForm):
    class Meta:
        model = models.User
        fields = ['user_id', 'user_pass', 'user_content']
        labels = {
            'user_id': '帳號',
            'user_pass': '密碼',
            'user_content': '內容',
        }
