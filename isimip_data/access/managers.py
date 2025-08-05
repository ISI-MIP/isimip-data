from django.db import models


class ResourceManager(models.Manager):

    def find_by_path(self, path):
        for resource in self.all():
            for resource_path in resource.paths:
                if path.startswith(resource_path):
                    return resource
