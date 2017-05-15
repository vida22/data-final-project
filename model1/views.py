from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist

from .models import Business, Recommendation

import csv
import json


# Create your views here.
def index(request):
	with open ('/home/ubuntu/data-final-project/data/Monday_0_Bars_with_locations.csv', 'r') as f:
		reader = csv.reader (f)
		my_list = list (reader)

	context = {
		'my_list': json.dumps (my_list)
	}

	return render (request, 'model1/mainPage.html', context)


def profile(request):
	return render (request, 'model1/personalProfile.html', {})


def search(request):
	weekday = request.GET['weekday']
	time = request.GET['time']
	category = request.GET['category']

	file_path = "data/" + weekday + "_" + time + "_" + category + "_with_locations.csv"

	with open (file_path, 'r') as f:
		reader = csv.reader (f)
		csv_list = list (reader)

	my_list = json.dumps (csv_list)

	return HttpResponse (my_list, content_type="application/json")


def heatSearch(request):
	weekday = request.GET['weekday']
	time = request.GET['time']
	category = request.GET['category']


def _preload_data():
	weekend_checkin_data = {}
	weekday_checkin_data = {}

	weekday_file_path = '/home/ubuntu/data-final-project/data/weekday_checkin.csv'
	weekend_file_path = '/home/ubuntu/data-final-project/data/weekday_checkin.csv'

	with open (weekday_file_path, 'r') as f:
		reader = csv.reader (f)
		next (reader)
		for row in reader:
			b_id = row.pop (0)
			weekday_checkin_data[b_id] = row
	with open (weekend_file_path, 'r') as f:
		reader = csv.reader (f)
		next (reader)
		for row in reader:
			b_id = row.pop (0)
			weekend_checkin_data[b_id] = row

	return weekend_checkin_data, weekday_checkin_data


weekend_checkin_data, weekday_checkin_data = _preload_data ()


def checkin_time(request):
	business_id = request.GET['business_id']
	weekday = request.GET['weekday']

	time_list = []

	data_list = weekday_checkin_data if weekday else weekend_checkin_data

	if business_id in data_list:
		time_list = data_list[business_id]

	json_version = json.dumps (time_list)

	return HttpResponse (json_version, content_type="application/json")


def heatmap_time(request):
	time = request.GET['time']
	is_weekend = request.GET['isWeekend']
	category = request.GET['category']

	if is_weekend:
		file_path = "/home/ubuntu/data-final-project/data/weekday_checkin_" + category + ".csv"
	else:
		file_path = "/home/ubuntu/data-final-project/data/weekday_checkin_" + category + ".csv"

	print (file_path)

	with open (file_path, 'r') as f:
		reader = csv.reader (f)
		next (reader)
		count_list = list ()
		i = 0

		for row in reader:
			b_id = row.pop (0)
			try:
				business = Business.objects.get (business_id=b_id)
			except ObjectDoesNotExist:
				continue

			latitude = business.latitude
			longitude = business.longitude
			count = row[int (time) + 1]

			dic = {
				'lat': latitude,
				'lng': longitude,
				'count': count
			}
			data = json.dumps (dic)
			count_list.append (data)

	json_data = json.dumps (count_list)

	return HttpResponse (json_data, content_type='application/json')


def login(request):
	username = request.POST['username']
	try:
		rec = Recommendation.objects.get (username=username)
	except ObjectDoesNotExist:
		rec = Recommendation.objects.get (username='Mike')

	cat1 = rec.rec_1.categories.split ('\"')[1]
	cat2 = rec.rec_2.categories.split ('\"')[1]
	cat3 = rec.rec_3.categories.split ('\"')[1]
	cat4 = rec.rec_4.categories.split ('\"')[1]
	cat5 = rec.rec_5.categories.split ('\"')[1]

	context = {
		'rec1': rec.rec_1, 'rec1_cate': cat1,
		'rec2': rec.rec_2, 'rec2_cate': cat2,
		'rec3': rec.rec_3, 'rec3_cate': cat3,
		'rec4': rec.rec_4, 'rec4_cate': cat4,
		'rec5': rec.rec_5, 'rec5_cate': cat5,
	}

	return render(request, 'model1/mainPage.html', context)


def about(request):
	return render (request, 'model1/about.html')


def data(request):
	return render (request, 'model1/data.html')


def process(request):
	return render (request, 'model1/process.html')

