from django.urls import path
from web_tool import views

urlpatterns = [
    path('hello/', views.hello_world),
    path('', views.index),
    path('form/', views.form),
    path('ajax_data/', views.ajax_data),
]