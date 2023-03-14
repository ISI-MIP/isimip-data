from django.db import models


class Facet(models.Model):
    title = models.CharField(max_length=32)
    identifier = models.CharField(max_length=32)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
