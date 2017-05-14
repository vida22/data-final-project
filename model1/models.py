from __future__ import unicode_literals

from django.db import models

# Create your models here.


class Business(models.Model):
	business_id = models.CharField(max_length=30, primary_key=True)
	name = models.CharField(max_length=30, null=False)
	categories = models.CharField(max_length=100)
	address = models.CharField(max_length=100)
	longitude = models.CharField(max_length=20, null=False)
	latitude = models.CharField(max_length=20, null=False)
	stars = models.PositiveIntegerField(default=0)

	def __str__(self):
		return self.name


class Recommendation(models.Model):
	user_id = models.CharField(max_length=20)
	username = models.CharField(max_length=20)
	rec_1 = models.ForeignKey(Business, related_name='rec1')
	rec_2 = models.ForeignKey(Business, related_name='rec2')
	rec_3 = models.ForeignKey(Business, related_name='rec3')
	rec_4 = models.ForeignKey(Business, related_name='rec4')
	rec_5 = models.ForeignKey(Business, related_name='rec5')

	def __str__(self):
		return self.username
