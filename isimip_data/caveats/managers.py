from django.db import models


class ModerationQuerySet(models.QuerySet):

    def public(self, user):
        q = models.Q(public=True)
        if user.is_authenticated:
            q |= models.Q(creator=user)

        return self.filter(q)


class ModerationManager(models.Manager):

    def get_queryset(self):
        return ModerationQuerySet(self.model, using=self._db)
