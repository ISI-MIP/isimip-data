def test_layer(client, facets):
    for instance in facets:
        assert str(instance) == instance.title
