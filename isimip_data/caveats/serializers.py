from rest_framework import serializers

from .models import Caveat


class CaveatSerializer(serializers.ModelSerializer):

    creator_display = serializers.SerializerMethodField()

    url = serializers.URLField(source='get_absolute_url')

    category_display = serializers.CharField(source='get_category_display')
    severity_display = serializers.CharField(source='get_severity_display')
    status_display = serializers.CharField(source='get_status_display')
    message_display = serializers.CharField(source='get_message_display')
    created_display = serializers.CharField(source='get_created_display')
    updated_display = serializers.CharField(source='get_updated_display')

    class Meta:
        model = Caveat
        fields = (
            'id',
            'url',
            'public',
            'title',
            'description',
            'creator',
            'creator_display',
            'created',
            'created_display',
            'updated',
            'updated_display',
            'category',
            'category_color',
            'category_display',
            'severity',
            'severity_color',
            'severity_display',
            'status',
            'status_color',
            'status_display',
            'message',
            'message_display',
            'specifiers',
            'include',
            'exclude',
            'datasets',
            'resources',
            'version_after',
            'version_before'
        )

    def get_creator_display(self, obj):
        return obj.get_creator_display()


class CaveatIndexSerializer(serializers.ModelSerializer):

    creator_display = serializers.SerializerMethodField()

    class Meta:
        model = Caveat
        fields = (
            'id',
            'public',
            'title',
            'creator',
            'creator_display',
            'created',
            'updated',
            'severity',
            'status'
        )

    def get_creator_display(self, obj):
        return obj.get_creator_display()


class CaveatChoicesSerializer(serializers.Serializer):

    value = serializers.CharField()
    display = serializers.CharField()
    color = serializers.CharField()
