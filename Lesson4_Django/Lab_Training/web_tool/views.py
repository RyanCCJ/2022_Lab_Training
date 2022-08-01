from django.shortcuts import render
from django.http import HttpResponse
from web_tool.models import Gene
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

    genes = Gene.objects.all()[:10]

    return render(request, 'index.html', locals())
