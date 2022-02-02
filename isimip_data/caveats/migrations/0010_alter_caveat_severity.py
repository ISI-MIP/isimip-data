# Generated by Django 3.2.11 on 2022-01-31 15:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('caveats', '0009_data_migration'),
    ]

    operations = [
        migrations.AlterField(
            model_name='caveat',
            name='severity',
            field=models.TextField(choices=[('low', 'low'), ('high', 'high'), ('replaced', 'replaced')]),
        ),
    ]
