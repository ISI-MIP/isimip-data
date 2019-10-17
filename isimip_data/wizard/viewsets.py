from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import Layer
from .serializers import LayerSerializer


class LayerViewSet(ReadOnlyModelViewSet):

    serializer_class = LayerSerializer
    queryset = Layer.objects.all()
