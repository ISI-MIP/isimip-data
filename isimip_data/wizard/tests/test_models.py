def test_layer(client, layers):
    for instance in layers:
        assert str(instance) == instance.title
