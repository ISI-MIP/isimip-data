import re

from django.db.models import Max
from django.middleware.cache import CacheMiddleware
from django.utils.cache import learn_cache_key

from .models import Dataset, File, Resource


class MetadataCacheMiddleware(CacheMiddleware):

    # paths where it only needs to be checked if the cache needs to be updated
    update_patterns = ()

    # paths which are actually cached (completely)
    path_patterns = (
        re.compile(r'^/$'),
        re.compile(r'^/sitemap'),
        re.compile(r'^/api/v1/datasets/'),
        re.compile(r'^/api/v1/files/')
    )

    def process_request(self, request):
        request._in_update_patterns = self._check_path_info(request.path_info, self.update_patterns)
        request._in_path_patterns = self._check_path_info(request.path_info, self.path_patterns)

        if request._in_update_patterns or request._in_path_patterns:
            self._check_cache_invalidation()

        if request._in_path_patterns:
            return super().process_request(request)
        else:
            return None

    def process_response(self, request, response):
        if getattr(request, '_in_path_patterns', False):
            # this is a limited version of process_response in UpdateCacheMiddleware
            # which does not set the headers to let the client cache the response as well
            if not self._should_update_cache(request, response):
                return response

            timeout = self.cache_timeout
            if timeout and response.status_code == 200:
                cache_key = learn_cache_key(request, response, timeout, self.key_prefix, cache=self.cache)
                response.add_post_render_callback(lambda r: self.cache.set(cache_key, r, timeout))

        return response

    def _check_path_info(self, path_info, patterns):
        return any(pattern.search(path_info) for pattern in patterns)

    def _check_cache_invalidation(self):
        # skip check if we checked recently
        if self.cache.get('invalidation_checked'):
            return

        # get the cache_timestamp from the cache
        cache_timestamp = self.cache.get('timestamp')

        # get the latest timestamp from the datasets and resources table
        timestamps = [
            Dataset.objects.using('metadata').aggregate(latest=Max('last_changed'))['latest'],
            File.objects.using('metadata').aggregate(latest=Max('last_changed'))['latest'],
            Resource.objects.using('metadata').aggregate(latest=Max('last_changed'))['latest'],
        ]
        timestamp = max(t for t in timestamps if t is not None)

        # check if the timestamp is later than cache_timestamp
        if cache_timestamp is None or timestamp > cache_timestamp:
            # the datasets table has changed, clear the cache and set a new timestamp
            self.cache.clear()
            self.cache.set('timestamp', timestamp, self.cache_timeout)

        # mark that we just checked, regardless of whether we invalidated
        self.cache.set('invalidation_checked', True, 30)
