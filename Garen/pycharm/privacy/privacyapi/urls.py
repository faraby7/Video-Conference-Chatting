from django.conf.urls import url
from django.urls import include
from . import views as vw
from rest_framework.authtoken import views

urlpatterns = [
    # url('login/', ExampleView, name='login')
    # url(r'^login/$', view=vw.login),
    url(r'^loginapi/$', view=views.obtain_auth_token),
    url('api/login/', vw.LoginView.as_view()),
    url('api/logout/', vw.LogoutView.as_view()),
    url('sampleapi/', vw.sample_api, name='hello'),
    url('accounts/', include('django.contrib.auth.urls')),
    url('hello/', vw.hello, name='hello'),
    url('logout/', vw.logout_view, name='logout'),
]
