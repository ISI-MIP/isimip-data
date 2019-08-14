from django.conf import settings

from rest_framework import serializers

from isimip_data.metadata.models import Dataset, File


class DatasetSerializer(serializers.ModelSerializer):

    search_rank = serializers.FloatField(required=False, default=0.0)

    class Meta:
        model = Dataset
        fields = (
            'id',
            'name',
            'version',
            'attributes',
            'search_rank',
        )


class FileSerializer(serializers.ModelSerializer):

    search_rank = serializers.FloatField(required=False, default=0.0)
    url = serializers.SerializerMethodField()

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

    def get_url(self, obj):
        return settings.FILES_BASE_URL % obj.attributes + obj.path
