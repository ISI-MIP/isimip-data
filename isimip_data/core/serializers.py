from rest_framework import serializers


class SettingsSerializer(serializers.Serializer):

    key = serializers.CharField()
    value = serializers.JSONField()
