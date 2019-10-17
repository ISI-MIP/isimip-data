from django.db import models


class Layer(models.Model):
    title = models.CharField(max_length=32)
    attribute = models.CharField(max_length=32)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
