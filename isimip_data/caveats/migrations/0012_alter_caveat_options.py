# Generated by Django 3.2.11 on 2022-06-01 08:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('caveats', '0011_add_include_exclude'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='caveat',
            options={'ordering': ('-created',)},
        ),
    ]
