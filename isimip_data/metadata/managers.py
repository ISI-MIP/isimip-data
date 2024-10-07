from django.contrib.postgres.aggregates import ArrayAgg
from django.db import models


class DatasetQuerySet(models.QuerySet):

    def histogram(self, identifier):
        field = f'specifiers__{identifier}'
        return self.values_list(field).annotate(count=models.Count(field)).order_by(field)


class DatasetManager(models.Manager):

    def get_queryset(self):
        return DatasetQuerySet(self.model, using=self._db)


class IdentifierQuerySet(models.QuerySet):

    def identifiers(self):
        return self.distinct().values_list('identifier', flat=True)


class IdentifierManager(models.Manager):

    def get_queryset(self):
        return IdentifierQuerySet(self.model, using=self._db)


class ResourceQuerySet(models.QuerySet):

    def filter_by_tree(self, tree, product=None):
        if tree:
            if product is not None:
                # get all tree_path for the product and construct a Q object for all resources
                q = models.Q()
                for simulation_round in tree.tree_dict.keys():
                    q |= models.Q(paths_agg__icontains=f'{simulation_round}/{product}/')

            return self.annotate(paths_agg=ArrayAgg('paths')).filter(q).order_by('paths')


class ResourceManager(models.Manager):

    def get_queryset(self):
        return ResourceQuerySet(self.model, using=self._db)
