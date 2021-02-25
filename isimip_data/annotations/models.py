from django.db import models


class Figure(models.Model):
    title = models.CharField(max_length=128)
    image = models.ImageField(upload_to='figures')
    caption = models.TextField(blank=True)
    credits = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('title', )

    def __str__(self):
        return self.title


class Download(models.Model):
    title = models.CharField(max_length=128)
    file = models.FileField(upload_to='files')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('title', )

    def __str__(self):
        return self.title
