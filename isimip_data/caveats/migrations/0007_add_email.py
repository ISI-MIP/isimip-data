# Generated by Django 3.0.6 on 2021-03-25 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('caveats', '0006_caveat_downloads'),
    ]

    operations = [
        migrations.AddField(
            model_name='caveat',
            name='email',
            field=models.BooleanField(default=False, help_text='Designates whether an announcement mail for this caveat has been send.'),
        ),
        migrations.AddField(
            model_name='comment',
            name='email',
            field=models.BooleanField(default=False, help_text='Designates whether an announcement mail for this comment has been send.'),
        ),
        migrations.AlterField(
            model_name='caveat',
            name='public',
            field=models.BooleanField(default=False, help_text='Designates whether this caveat is publicly visible.'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='public',
            field=models.BooleanField(default=False, help_text='Designates whether this comment is publicly visible.'),
        ),
    ]
