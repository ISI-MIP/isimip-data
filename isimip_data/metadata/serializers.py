from rest_framework import serializers
from rest_framework.reverse import reverse

from isimip_data.annotations.models import (Annotation, Download, Figure,
                                            Reference)
from isimip_data.caveats.models import Caveat

from .models import Dataset, File, Resource


class DatasetFileSerializer(serializers.ModelSerializer):

    metadata_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    rights = serializers.JSONField(source='rights_dict')

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
            'rights',
            'terms_of_use'
        )

    def get_metadata_url(self, obj):
        return reverse('file', args=[obj.id], request=self.context['request'])

    def get_download_url(self, obj):
        if obj.dataset.public:
            return reverse('download', args=[obj.path], request=self.context['request'])


class DatasetResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resource
        fields = (
            'id',
            'doi',
            'doi_url'
        )


class DatasetCaveatSerializer(serializers.ModelSerializer):

    url = serializers.SerializerMethodField()
    severity_display = serializers.CharField(source='get_severity_display')
    status_display = serializers.CharField(source='get_status_display')

    class Meta:
        model = Caveat
        fields = (
            'id',
            'title',
            'url',
            'severity',
            'severity_display',
            'severity_color',
            'status',
            'status_display',
            'status_color'
        )

    def get_url(self, obj):
        return reverse('caveat', args=[obj.id])


class DatasetAnnotationFigureSerializer(serializers.ModelSerializer):

    class Meta:
        model = Figure
        fields = (
            'id',
            'title',
            'image',
            'caption',
            'credits'
        )


class DatasetAnnotationDownloadSerializer(serializers.ModelSerializer):

    file_url = serializers.CharField(source='file.url')

    class Meta:
        model = Download
        fields = (
            'id',
            'title',
            'file_url'
        )


class DatasetAnnotationReferenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reference
        fields = (
            'id',
            'title',
            'identifier',
            'identifier_type',
            'reference_type'
        )


class DatasetAnnotationSerializer(serializers.ModelSerializer):

    figures = DatasetAnnotationFigureSerializer(many=True)
    downloads = DatasetAnnotationDownloadSerializer(many=True)
    references = DatasetAnnotationReferenceSerializer(many=True)

    class Meta:
        model = Annotation
        fields = (
            'id',
            'title',
            'figures',
            'downloads',
            'references'
        )


class DatasetSerializer(serializers.ModelSerializer):

    files = DatasetFileSerializer(many=True)
    resources = DatasetResourceSerializer(many=True)
    caveats = serializers.SerializerMethodField()
    annotations = serializers.SerializerMethodField()
    search_rank = serializers.FloatField(required=False, default=0.0)
    metadata_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    filelist_url = serializers.SerializerMethodField()
    rights = serializers.JSONField(source='rights_dict')

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
            'resources',
            'caveats',
            'annotations',
            'terms_of_use'
        )

    def get_metadata_url(self, obj):
        return reverse('dataset', args=[obj.id], request=self.context['request'])

    def get_download_url(self, obj):
        if obj.public:
            return reverse('download', args=[obj.path], request=self.context['request'])

    def get_filelist_url(self, obj):
        if obj.public:
            return reverse('dataset-detail-filelist', args=[obj.id], request=self.context['request'])

    def get_caveats(self, obj):
        if self.context.get('request').GET.get('caveats'):
            queryset = Caveat.objects.filter(datasets__contains=[obj.id])
            serializer = DatasetCaveatSerializer(queryset, many=True)
            return serializer.data

    def get_annotations(self, obj):
        if self.context.get('request').GET.get('annotations'):
            queryset = Annotation.objects.filter(datasets__contains=[obj.id])
            serializer = DatasetAnnotationSerializer(queryset, many=True)
            return serializer.data


class FileSerializer(serializers.ModelSerializer):

    search_rank = serializers.FloatField(required=False, default=0.0)
    metadata_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    rights = serializers.JSONField(source='rights_dict')

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
            'rights',
            'terms_of_use'
        )

    def get_metadata_url(self, obj):
        return reverse('file', args=[obj.id], request=self.context['request'])

    def get_download_url(self, obj):
        if obj.dataset.public:
            return reverse('file', args=[obj.path], request=self.context['request'])


class ResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resource
        fields = (
            'id',
            'doi',
            'datacite',
            'title',
            'major_version',
            'doi_url',
            'creators_str'
        )
