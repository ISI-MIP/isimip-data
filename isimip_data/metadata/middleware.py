from django.db.models import Max
from django.middleware.cache import CacheMiddleware
from django.utils.cache import learn_cache_key, get_max_age

from .models import Dataset, Resource


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
            # this is a limited version of process_response in UpdateCacheMiddleware
            # which does not set the headers to let the client cache the response as well
            if not self._should_update_cache(request, response):
                return response

            timeout = self.cache_timeout
            if timeout and response.status_code == 200:
                cache_key = learn_cache_key(request, response, timeout, self.key_prefix, cache=self.cache)
                response.add_post_render_callback(lambda r: self.cache.set(cache_key, r, timeout))

        return response

    def check_path_info(self, path_info):
        return any(path_info.startswith(path) for path in self.paths)

    def update_cache(self):
        # get the cache_timestamp from the cache
        cache_timestamp = self.cache.get('timestamp')

        # get the latest timestamp from the datasets and resources table
        timestamp_values = [
            value for value in Dataset.objects.using('metadata').aggregate(
                Max('created'),
                Max('updated'),
                Max('published'),
                Max('archived')
            ).values() if value is not None
        ] + [
            value for value in Resource.objects.using('metadata').aggregate(
                Max('created'),
                Max('updated')
            ).values() if value is not None
        ]
        timestamp = max(timestamp_values) if timestamp_values else None

        # check if the timestamp is later than cache_timestamp
        if cache_timestamp is None or timestamp is None or timestamp > cache_timestamp:
            # the datasets table has changed, clear the cache and set a new timestamp
            self.cache.clear()
            self.cache.set('timestamp', timestamp, self.cache_timeout)
