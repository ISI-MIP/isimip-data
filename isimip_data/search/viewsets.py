from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import Facet
from .serializers import FacetSerializer


class FacetViewSet(ReadOnlyModelViewSet):

    serializer_class = FacetSerializer
    queryset = Facet.objects.all()
