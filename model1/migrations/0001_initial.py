# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-13 21:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Business',
            fields=[
                ('business_id', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('longitude', models.CharField(max_length=20)),
                ('latitude', models.CharField(max_length=20)),
                ('stars', models.PositiveIntegerField(default=0)),
            ],
        ),
    ]
