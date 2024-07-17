import re

from django.db.models import Max
from django.middleware.cache import CacheMiddleware
from django.utils.cache import learn_cache_key
from django.utils.timezone import make_aware, utc

from .models import Dataset, Resource


class MetadataCacheMiddleware(CacheMiddleware):

    # paths where it only needs to be checked if the cache needs to be updated
    update_patterns = (
        re.compile(r'^/$'),
    )

    # paths which are actually cached (completely)
    path_patterns = (
        re.compile(r'^/api/v1/datasets/'),
        re.compile(r'^/api/v1/files/')
    )

    def process_request(self, request):
        self.update = self.check_path_info(request.path_info, self.update_patterns)
        self.path = self.check_path_info(request.path_info, self.path_patterns)

        if self.update or self.path:
            self.update_cache()

        if self.path:
            return super().process_request(request)
        else:
            return None

    def process_response(self, request, response):
        if self.path:
            # this is a limited version of process_response in UpdateCacheMiddleware
            # which does not set the headers to let the client cache the response as well
            if not self._should_update_cache(request, response):
                return response

            timeout = self.cache_timeout
            if timeout and response.status_code == 200:
                cache_key = learn_cache_key(request, response, timeout, self.key_prefix, cache=self.cache)
                response.add_post_render_callback(lambda r: self.cache.set(cache_key, r, timeout))

        return response

    def check_path_info(self, path_info, patterns):
        return any(pattern.search(path_info) for pattern in patterns)

    def update_cache(self):
        # get the cache_timestamp from the cache
        cache_timestamp = self.cache.get('timestamp')

        # get the latest timestamp from the datasets and resources table
        timestamp_values = [
            make_aware(value, utc) for value in Dataset.objects.using('metadata').aggregate(
                Max('created'),
                Max('updated'),
                Max('published'),
                Max('archived')
            ).values() if value is not None
        ] + [
            make_aware(value, utc) for value in Resource.objects.using('metadata').aggregate(
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
