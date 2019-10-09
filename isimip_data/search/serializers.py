from django.conf import settings

from rest_framework import serializers

from isimip_data.metadata.models import Dataset, File

from .models import Facet


class DatasetFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = File
        fields = (
            'id',
            'name',
            'version',
            'url',
            'checksum',
            'checksum_type'
        )


class DatasetSerializer(serializers.ModelSerializer):

    files = DatasetFileSerializer(many=True)
    search_rank = serializers.FloatField(required=False, default=0.0)

    class Meta:
        model = Dataset
        fields = (
            'id',
            'name',
            'path',
            'version',
            'attributes',
            'files',
            'search_rank',
        )


class FileSerializer(serializers.ModelSerializer):

    search_rank = serializers.FloatField(required=False, default=0.0)

    class Meta:
        model = File
        fields = (
            'id',
            'name',
            'version',
            'url',
            'checksum',
            'checksum_type',
            'attributes',
            'search_rank',
        )


class FacetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Facet
        fields = (
            'id',
            'title',
            'attribute',
            'order'
        )
