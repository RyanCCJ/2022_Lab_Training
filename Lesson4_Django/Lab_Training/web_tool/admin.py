from django.contrib import admin
from .models import Gene

class GeneAdmin(admin.ModelAdmin):
    list_display = ('gene_id','transcript_id','numbers')

admin.site.register(Gene, GeneAdmin)
