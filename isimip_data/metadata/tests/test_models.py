from isimip_data.metadata.models import Attribute, Dataset, File, Resource, Tree, Word


def test_attribute_str(db, client):
    attribute = Attribute.objects.using('metadata').first()
    assert str(attribute) == attribute.identifier


def test_dataset_str(db, client):
    dataset = Dataset.objects.using('metadata').first()
    assert str(dataset) == dataset.path


def test_file_str(db, client):
    file = File.objects.using('metadata').first()
    assert str(file) == file.path


def test_file_json_path(db, client):
    file = File.objects.using('metadata').filter(dataset__public=True).first()
    assert file.json_path == file.path.replace('.nc', '.json')


def test_resource_str(db, client):
    resource = Resource.objects.using('metadata').first()
    assert str(resource) == resource.doi


def test_tree_str(db, client):
    tree = Tree.objects.using('metadata').first()
    assert str(tree) == str(tree.id)


def test_word_str(db, client):
    word = Word.objects.using('metadata').first()
    assert str(word) == word.word
