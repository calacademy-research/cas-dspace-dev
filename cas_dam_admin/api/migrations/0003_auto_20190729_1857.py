# Generated by Django 2.2.2 on 2019-07-29 18:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20190729_1854'),
    ]

    operations = [
        migrations.AlterField(
            model_name='submitteddata',
            name='upload_time',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
