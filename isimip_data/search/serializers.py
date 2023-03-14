from rest_framework import serializers

from .models import Facet


class FacetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Facet
        fields = (
            'id',
            'title',
            'identifier',
            'order'
        )
