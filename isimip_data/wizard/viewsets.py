from django.db.models import Q

from rest_framework.viewsets import ReadOnlyModelViewSet

from isimip_data.metadata.models import Dataset

from .models import Layer
from .serializers import LayerSerializer

from rest_framework.decorators import action
from rest_framework.response import Response


class LayerViewSet(ReadOnlyModelViewSet):

    serializer_class = LayerSerializer
    queryset = Layer.objects.all()

    @action(detail=False)
    def wizard(self, request):
        # loop over layers from the queryset
        layers = []
        for current_layer in self.get_queryset():
            # create a Dataset queryset
            dataset_queryset = Dataset.objects.using('metadata')

            # loop over all privious layers and apply the filtering from the query params
            for previous_layer in layers:
                q = Q()
                for value in request.GET.getlist(previous_layer['attribute']):
                    q |= Q(attributes__contains={previous_layer['attribute']: value})
                dataset_queryset = dataset_queryset.filter(q)

            # append the current layer and the possible values in the Datesets
            layers.append({
                'title': current_layer.title,
                'attribute': current_layer.attribute,
                'values': dataset_queryset.attribute_values(current_layer.attribute)
            })

            # check if the current layer was in the query params, if not stop the iteration here
            # by this all layers in the query params (in order) and the first one not in the
            # query params are returned
            if current_layer.attribute not in request.GET:
                break

        serializer = self.get_serializer(layers, many=True)
        return Response(serializer.data)
