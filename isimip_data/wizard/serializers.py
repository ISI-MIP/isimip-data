from rest_framework import serializers

from .models import Layer


class LayerSerializer(serializers.ModelSerializer):

    values = serializers.ListField(required=False)

    class Meta:
        model = Layer
        fields = (
            'id',
            'title',
            'attribute',
            'order',
            'values'
        )
