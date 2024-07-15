from django.db import models

# Create your models here.


class Record(models.Model):
    nat_lang_input = models.CharField(max_length=300)
    regex_pattern = models.CharField(max_length=100)
