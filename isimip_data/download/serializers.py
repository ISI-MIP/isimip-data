from rest_framework import serializers


class CountrySerializer(serializers.Serializer):

    key = serializers.CharField()
    long_name = serializers.CharField()
