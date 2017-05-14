from . import views

from django.conf.urls import url

app_name = 'model1'

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^search/$', views.search, name="search"),
	url(r'^profile/$', views.profile, name='profile'),
	url(r'^heatmap$', views.heatmap_time, name='heatmap'),
	url(r'^login/$', views.login, name='login'),

	url(r'^about/$', views.about, name='about'),
	url(r'^process/$', views.process, name='process'),
	url(r'^data/$', views.data, name='data'),

	url(r'^checkin_time/$', views.checkin_time, name='checkin_time'),
]
