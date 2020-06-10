from urllib.request import HTTPError


class MockResponse(object):

    def __init__(self, read_data='', http_error=False):
        self.read_data = read_data
        self.http_error = http_error

    def read(self):
        if self.http_error:
            raise HTTPError('http://example.com', 404, 'Not found', {}, None)
        return self.read_data

    def __call__(self, *args, **kwargs):
        return self

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        pass
