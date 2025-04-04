from rest_framework import serializers
from rest_framework.reverse import reverse

from isimip_data.annotations.models import Annotation, Download, Figure, Reference
from isimip_data.caveats.models import Caveat
from isimip_data.core.utils import get_file_base_url

from .models import Dataset, File, Identifier, Resource


class DatasetFileSerializer(serializers.ModelSerializer):

    metadata_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    rights = serializers.JSONField(source='rights_dict')

    class Meta:
        model = File
        fields = (
            'id',
            'name',
            'path',
            'paths',
            'version',
            'size',
            'checksum',
            'checksum_type',
            'url',
            'metadata_url',
            'file_url',
            'rights',
            'terms_of_use'
        )

    def get_metadata_url(self, obj):
        return reverse('file', args=[obj.id], request=self.context['request'])

    def get_file_url(self, obj):
        if obj.dataset.public:
            return get_file_base_url(self.context['request']) + obj.path


class DatasetResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resource
        fields = (
            'id',
            'doi',
            'doi_url',
            'title',
            'citation',
            'new_version'
        )


class DatasetCaveatSerializer(serializers.ModelSerializer):

    url = serializers.CharField(source='get_absolute_url')
    category_display = serializers.CharField(source='get_category_display')
    severity_display = serializers.CharField(source='get_severity_display')
    status_display = serializers.CharField(source='get_status_display')
    message_display = serializers.CharField(source='get_message_display')

    class Meta:
        model = Caveat
        fields = (
            'id',
            'title',
            'url',
            'category',
            'category_display',
            'category_color',
            'category_symbol',
            'severity',
            'severity_display',
            'severity_level',
            'severity_color',
            'status',
            'status_display',
            'status_color',
            'message',
            'message_display',
            'message_color'
        )


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


class DatasetLinkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dataset
        fields = (
            'id',
            'name',
            'path',
            'specifiers',
            'identifiers'
        )


class DatasetSerializer(serializers.ModelSerializer):

    files = DatasetFileSerializer(many=True)
    links = DatasetLinkSerializer(many=True)
    resources = DatasetResourceSerializer(many=True)
    caveats = serializers.SerializerMethodField()
    caveats_versions = serializers.SerializerMethodField()
    annotations = serializers.SerializerMethodField()
    search_rank = serializers.FloatField(required=False, default=0.0)
    metadata_url = serializers.SerializerMethodField()
    filelist_url = serializers.SerializerMethodField()
    rights = serializers.JSONField(source='rights_dict')

    class Meta:
        model = Dataset
        fields = (
            'id',
            'name',
            'path',
            'paths',
            'version',
            'size',
            'specifiers',
            'identifiers',
            'search_rank',
            'public',
            'restricted',
            'merged_specifiers',
            'pretty_specifiers',
            'url',
            'metadata_url',
            'filelist_url',
            'rights',
            'files',
            'links',
            'resources',
            'caveats',
            'caveats_versions',
            'annotations',
            'terms_of_use',
            'is_global',
            'is_netcdf'
        )

    def get_metadata_url(self, obj):
        return reverse('dataset', args=[obj.id], request=self.context['request'])

    def get_filelist_url(self, obj):
        if obj.public:
            return reverse('dataset-detail-filelist', args=[obj.id], request=self.context['request'])

    def get_caveats(self, obj):
        if self.context.get('request').GET.get('caveats'):
            user = self.context['request'].user
            queryset = Caveat.objects.exclude(public=False) \
                                     .filter(datasets__contains=[obj.id]).public(user)
            serializer = DatasetCaveatSerializer(queryset, many=True)
            return serializer.data
        else:
            return []

    def get_caveats_versions(self, obj):
        if self.context.get('request').GET.get('caveats'):
            user = self.context['request'].user
            versions = Dataset.objects.using('metadata').filter(path=obj.path).exclude(id=obj.id)
            queryset = Caveat.objects.exclude(public=False) \
                                     .exclude(datasets__contains=[obj.id]) \
                                     .filter(datasets__overlap=[version.id for version in versions]).public(user)
            serializer = DatasetCaveatSerializer(queryset, many=True)
            return serializer.data
        else:
            return []

    def get_annotations(self, obj):
        if self.context.get('request').GET.get('annotations'):
            queryset = Annotation.objects.filter(datasets__contains=[obj.id])
            serializer = DatasetAnnotationSerializer(queryset, many=True)
            return serializer.data
        else:
            return []


class FileLinkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dataset
        fields = (
            'id',
            'name',
            'path',
            'specifiers',
            'identifiers'
        )


class FileSerializer(serializers.ModelSerializer):

    links = FileLinkSerializer(many=True)
    search_rank = serializers.FloatField(required=False, default=0.0)
    metadata_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    json_url = serializers.SerializerMethodField()
    rights = serializers.JSONField(source='rights_dict')

    class Meta:
        model = File
        fields = (
            'id',
            'name',
            'path',
            'paths',
            'version',
            'size',
            'checksum',
            'checksum_type',
            'specifiers',
            'identifiers',
            'merged_specifiers',
            'pretty_specifiers',
            'links',
            'search_rank',
            'url',
            'metadata_url',
            'file_url',
            'json_url',
            'rights',
            'terms_of_use',
        )

    def get_metadata_url(self, obj):
        return reverse('file', args=[obj.id], request=self.context['request'])

    def get_file_url(self, obj):
        if obj.dataset.public:
            return get_file_base_url(self.context['request']) + obj.path

    def get_json_url(self, obj):
        if obj.dataset.public:
            return get_file_base_url(self.context['request']) + obj.json_path


class ResourceIndexSerializer(serializers.ModelSerializer):

    resource_url = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = (
            'id',
            'doi',
            'title',
            'title_with_version',
            'version',
            'paths',
            'doi_url',
            'previous_version',
            'new_version',
            'is_external',
            'resource_url',
            'creators_str',
            'publication_date'
        )

    def get_resource_url(self, obj):
        return reverse('resource', args=[str(obj.doi)], request=self.context['request'])


class ResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resource
        fields = (
            'id',
            'doi',
            'doi_url',
            'title',
            'title_with_version',
            'version',
            'paths',
            'creators_str',
            'publication_year',
            'publication_date',
            'publisher',
            'citation',
            'previous_version',
            'new_version',
            'is_external',
            'datacite',
        )


class IdentifierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Identifier
        fields = (
            'identifier',
            'specifiers'
        )
