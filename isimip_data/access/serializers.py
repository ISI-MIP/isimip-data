from rest_framework import serializers


class AccessSerializer(serializers.Serializer):

    sub = serializers.EmailField()
    paths = serializers.ListField()
