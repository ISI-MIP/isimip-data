from rest_framework import serializers


class FacetSerializer(serializers.Serializer):

    def to_representation(self, instance):
        return instance
