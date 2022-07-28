from django.shortcuts import render
from django.http import HttpResponse
from datetime import datetime
import pandas as pd
import json

def hello_world(request):
    time = datetime.now()
    return render(request, 'hello_world.html', locals())


def index(request):

    df = pd.read_csv('data/hw1_output_ans.csv')
    df = df.head(10)
    df = df.rename(columns={"Gene_ID": "id",
                            "transcript_ID": "transcript",
                            "# of transcripts": "number",
                            })
    json_string = df.to_json(orient='records')
    print(df)
    genes = json.loads(json_string)

    return render(request, 'index.html', locals())