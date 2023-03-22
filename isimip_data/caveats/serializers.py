from rest_framework import serializers

from .models import Caveat


class CaveatSerializer(serializers.ModelSerializer):

    creator_display = serializers.SerializerMethodField()

    class Meta:
        model = Caveat
        fields = (
            'id',
            'public',
            'title',
            'description',
            'creator',
            'creator_display',
            'created',
            'updated',
            'severity',
            'status',
            'message',
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
