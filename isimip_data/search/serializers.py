from rest_framework import serializers

from isimip_data.metadata.models import Dataset


class DatasetSerializer(serializers.ModelSerializer):

    rank = serializers.FloatField()

    class Meta:
        model = Dataset
        fields = (
            'id',
            'name',
            'version',
            'attributes',
            'rank',
        )
