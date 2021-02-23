from django.db import models


class ModerationQuerySet(models.QuerySet):

    def public(self, user):
        if user.is_authenticated and user.is_staff:
            return self.all()
        else:
            q = models.Q(public=True)
            if user.is_authenticated:
                q |= models.Q(creator=user)

            return self.filter(q)


class ModerationManager(models.Manager):

    def public(self, user):
        return self.get_queryset().public(user)

    def get_queryset(self):
        return ModerationQuerySet(self.model, using=self._db)
