# Generated by Django 3.2.15 on 2023-03-21 12:49

from django.db import migrations, models


def run_data_migration(apps, schema_editor):
    Caveat = apps.get_model('caveats', 'Caveat')

    for caveat in Caveat.objects.all():
        if caveat.severity == 'low':
            caveat.message = 'can_be_used'
        elif caveat.severity == 'high':
            caveat.message = 'do_not_use'
        elif caveat.severity == 'replaced':
            caveat.message = 'replaced'
        caveat.save()


class Migration(migrations.Migration):

    dependencies = [
        ('caveats', '0013_caveat_resources'),
    ]

    operations = [
        migrations.AddField(
            model_name='caveat',
            name='message',
            field=models.TextField(blank=True, choices=[('can be used', 'Affected datasets can still be used for simulations or research.'), ('do not use', 'Affected datasets should not be used until this caveat is resolved.'), ('replaced', 'Please use the replaced datasets for new simulations or research.')]),
        ),
        migrations.RunPython(run_data_migration),
    ]
