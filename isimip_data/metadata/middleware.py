from django.db.models import Max
from django.middleware.cache import CacheMiddleware

from .models import Dataset


class MetadataCacheMiddleware(CacheMiddleware):

    paths = (
        '/api/v1/datasets/',
        '/api/v1/files/'
    )

    def process_request(self, request):
        self.result = self.check_path_info(request.path_info)
        if self.result:
            self.update_cache()
            return super().process_request(request)
        else:
            return None

    def process_response(self, request, response):
        if self.result:
            return super().process_response(request, response)
        else:
            return response

    def check_path_info(self, path_info):
        return any(path_info.startswith(path) for path in self.paths)

    def update_cache(self):
        # get the cache_timestamp from the cache
        cache_timestamp = self.cache.get('timestamp')

        # get the latest timestamp from the datasets table
        timestamp_values = [
            value for value in Dataset.objects.using('metadata').aggregate(
                Max('created'),
                Max('updated'),
                Max('published'),
                Max('archived')
            ).values() if value is not None
        ]
        timestamp = max(timestamp_values) if timestamp_values else None

        # check if the timestamp is later than cache_timestamp
        if cache_timestamp is None or timestamp is None or timestamp > cache_timestamp:
            # the datasets table has changed, clear the cache and set a new timestamp
            self.cache.clear()
            self.cache.set('timestamp', timestamp, self.cache_timeout)
