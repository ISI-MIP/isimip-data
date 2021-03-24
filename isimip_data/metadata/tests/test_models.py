def test_dataset_str(client, datasets):
    for instance in datasets:
        assert str(instance) == instance.path


def test_file_str(client, files):
    for instance in files:
        assert str(instance) == instance.path


def test_file_json_url(client, files):
    for instance in files:
        if instance.dataset.public:
            assert instance.json_url == 'http://isimip/' + instance.path.replace('.nc', '.json')
        else:
            assert instance.json_url is None


def test_word_str(client, words):
    for instance in words:
        assert str(instance) == instance.word


def test_attribute_str(client, attributes):
    for instance in attributes:
        assert str(instance) == instance.key
