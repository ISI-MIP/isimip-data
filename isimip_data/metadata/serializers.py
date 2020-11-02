from rest_framework import serializers
from rest_framework.reverse import reverse

from .models import Dataset, File, Resource


class DatasetFileSerializer(serializers.ModelSerializer):

    metadata_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = (
            'id',
            'name',
            'version',
            'size',
            'checksum',
            'checksum_type',
            'url',
            'metadata_url',
            'download_url',
            'file_url',
            'rights'
        )

    def get_metadata_url(self, obj):
        return reverse('file', args=[obj.id], request=self.context['request'])

    def get_download_url(self, obj):
        return reverse('download', args=[obj.path], request=self.context['request'])


class DatasetResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resource
        fields = (
            'id',
            'doi',
            'version'
        )


class DatasetSerializer(serializers.ModelSerializer):

    files = DatasetFileSerializer(many=True)
    resources = DatasetResourceSerializer(many=True)
    search_rank = serializers.FloatField(required=False, default=0.0)
    metadata_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    filelist_url = serializers.SerializerMethodField()

    class Meta:
        model = Dataset
        fields = (
            'id',
            'name',
            'path',
            'version',
            'size',
            'specifiers',
            'identifiers',
            'search_rank',
            'public',
            'url',
            'metadata_url',
            'download_url',
            'filelist_url',
            'rights',
            'files',
            'resources'
        )

    def get_metadata_url(self, obj):
        return reverse('dataset', args=[obj.id], request=self.context['request'])

    def get_download_url(self, obj):
        return reverse('download', args=[obj.path], request=self.context['request'])

    def get_filelist_url(self, obj):
        return reverse('dataset-detail-filelist', args=[obj.id], request=self.context['request'])


class FileSerializer(serializers.ModelSerializer):

    search_rank = serializers.FloatField(required=False, default=0.0)
    metadata_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = (
            'id',
            'name',
            'version',
            'size',
            'checksum',
            'checksum_type',
            'specifiers',
            'identifiers',
            'search_rank',
            'url',
            'metadata_url',
            'download_url',
            'file_url',
            'rights'
        )

    def get_metadata_url(self, obj):
        return reverse('file', args=[obj.id], request=self.context['request'])

    def get_download_url(self, obj):
        return reverse('file', args=[obj.path], request=self.context['request'])


class ResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resource
        fields = (
            'id',
            'path',
            'version',
            'doi',
            'datacite',
            'title',
            'major_version',
            'doi_url',
            'creators_str'
        )
