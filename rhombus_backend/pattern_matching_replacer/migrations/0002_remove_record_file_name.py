# Generated by Django 5.0.1 on 2024-07-15 12:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pattern_matching_replacer', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='record',
            name='file_name',
        ),
    ]