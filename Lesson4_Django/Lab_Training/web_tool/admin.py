from django.contrib import admin
from web_tool.models import Gene, User

class GeneAdmin(admin.ModelAdmin):
    list_display = ('gene_id','transcript_id','numbers')

class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id','user_pass','user_content')


admin.site.register(Gene, GeneAdmin)
admin.site.register(User, UserAdmin)
