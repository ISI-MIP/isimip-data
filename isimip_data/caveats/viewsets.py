from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin
from rest_framework.pagination import PageNumberPagination
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ReadOnlyModelViewSet

from isimip_data.core.utils import get_file_base_url
from isimip_data.metadata.models import Dataset, File

from .models import Caveat
from .serializers import CaveatChoicesSerializer, CaveatIndexSerializer, CaveatSerializer


class CaveatViewSet(ReadOnlyModelViewSet):

    serializer_class = CaveatSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return Caveat.objects.public(self.request.user) \
                             .select_related('creator')

    @action(detail=False)
    def index(self, request):
        queryset = self.get_queryset()
        serializer = CaveatIndexSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, url_path='datasets', renderer_classes=[JSONRenderer])
    def detail_datasets(self, request, pk):
        caveat = self.get_object()
        metadata_url_template = request.build_absolute_uri('/datasets/') + '{}/'
        datasets = [
            dict(**dataset, metadata_url=metadata_url_template.format(dataset['id']))
            for dataset in Dataset.objects.using('metadata').filter(id__in=caveat.datasets)
                                                            .values('id', 'path', 'version', 'public')
        ]

        response = Response(datasets)
        response['Content-Disposition'] = f'attachment; filename=caveat-{caveat.id}.datasets.json'
        return response

    @action(detail=True, url_path='files', renderer_classes=[JSONRenderer])
    def detail_files(self, request, pk):
        caveat = self.get_object()
        metadata_url_template = request.build_absolute_uri('/files/') + '{}/'
        file_url_template = get_file_base_url(request)
        datasets = [
            dict(
                **file,
                metadata_url=metadata_url_template.format(file['id']),
                file_url=file_url_template + file['path']
            )
            for file in File.objects.using('metadata').filter(dataset__id__in=caveat.datasets)
                                                      .values('id', 'dataset_id', 'path', 'version')
        ]

        response = Response(datasets)
        response['Content-Disposition'] = f'attachment; filename=caveat-{caveat.id}.files.json'
        return response

    @action(detail=True, url_path='filelist', renderer_classes=[TemplateHTMLRenderer])
    def detail_filelist(self, request, pk):
        caveat = self.get_object()

        response = Response({
            'file_base_url': get_file_base_url(request),
            'files': File.objects.using('metadata').filter(dataset__id__in=caveat.datasets, dataset__public=True)
        }, template_name='metadata/filelist.txt', content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename=caveat-{caveat.id}.txt'
        return response


class CategoryViewSet(ListModelMixin, GenericViewSet):

    serializer_class = CaveatChoicesSerializer

    def get_queryset(self):
        return [
            {
                'value': category,
                'display': category_display,
                'color': Caveat.CATEGORY_COLOR.get(category)
            } for category, category_display in Caveat.CATEGORY_CHOICES
        ]


class SeverityViewSet(ListModelMixin, GenericViewSet):

    serializer_class = CaveatChoicesSerializer

    def get_queryset(self):
        return [
            {
                'value': severity,
                'display': severity_display,
                'color': Caveat.SEVERITY_COLOR.get(severity)
            } for severity, severity_display in Caveat.SEVERITY_CHOICES
        ]


class StatusViewSet(ListModelMixin, GenericViewSet):

    serializer_class = CaveatChoicesSerializer

    def get_queryset(self):
        return [
            {
                'value': status,
                'display': status_display,
                'color': Caveat.STATUS_COLOR.get(status),
            } for status, status_display in Caveat.STATUS_CHOICES
        ]
