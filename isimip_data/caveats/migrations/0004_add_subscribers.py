# Generated by Django 3.0.6 on 2021-02-23 11:24

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('caveats', '0003_comment'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='caveat',
            options={'ordering': ('-updated',)},
        ),
        migrations.AddField(
            model_name='caveat',
            name='subscribers',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
