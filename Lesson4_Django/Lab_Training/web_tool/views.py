from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db import connection
from web_tool import models, forms
from datetime import datetime
import pandas as pd
import json

def hello_world(request):
    time = datetime.now()
    return render(request, 'hello_world.html', locals())


def index(request):

    '''
    df = pd.read_csv('data/hw1_output_ans.csv')
    df = df.head(10)
    df = df.rename(columns={"Gene_ID": "gene_id",
                            "transcript_ID": "transcript_id",
                            "# of transcripts": "numbers",
                            })
    json_string = df.to_json(orient='records')
    genes = json.loads(json_string)
    '''

    genes = models.Gene.objects.all()[:10]
    return render(request, 'index.html', locals())


def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def form(request):

    # SQL Test (GET)
    try:
        id = request.GET['user_id']
        password = request.GET['user_pass']
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM web_tool_user WHERE user_id='{}' AND user_pass='{}'".format(id,password))
        user = dictfetchall(cursor)
            
        if user:
            message = user[0]['user_content']
        else:
            message = "ID or Password not found."
            
    except:
        pass

    # ORM Test (POST)
    try:
        id2 = request.POST['user_id2']
        password2 = request.POST['user_pass2']
        user2 = models.User.objects.filter(user_id=id2, user_pass=password2)

        if user2:
            message2 = user2[0].user_content
        else:
            message2 = "ID or Password not found."
            
    except:
        pass

    # ModelForm
    if request.method == 'POST':
        user_form = forms.UserForm(request.POST)
        if user_form.is_valid():
            user_form.save()
            message3 = 'Saved successfully.'
        else:
            message3 = 'Something wrong, please check again.'
    else:
        user_form = forms.UserForm()
    
    return render(request, 'form.html', locals())


def ajax_data(request):

    gene_id = request.POST['gene_id']
    
    try:
        gene = models.Gene.objects.get(gene_id=gene_id)
        transcript = gene.transcript_id
        numbers = gene.numbers
        message = 'Transcript ID: ' + transcript + '<br>Numbers: ' + str(numbers)
        
    except:
        message = 'Something wrong, please check again.'
    
    response = {
        'message': message
    }
    return JsonResponse(response)
    