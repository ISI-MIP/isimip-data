# Generated by Django 3.0.6 on 2021-03-24 17:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('caveats', '0006_caveat_downloads'),
    ]

    operations = [
        migrations.AddField(
            model_name='caveat',
            name='email',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='comment',
            name='email',
            field=models.BooleanField(default=False),
        ),
    ]
