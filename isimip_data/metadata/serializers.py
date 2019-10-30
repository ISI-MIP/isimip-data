from rest_framework import serializers

from .models import Dataset, File


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
