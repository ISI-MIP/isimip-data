from isimip_data.annotations.models import Annotation, Download, Figure, Reference


def test_annotation_str(db):
    assert str(Annotation.objects.first()) == 'Annotation'


def test_annotation_save(db):
    annotation = Annotation.objects.first()
    annotation.save()
    assert len(annotation.datasets) == 2


def test_figure_str(db):
    assert str(Figure.objects.first()) == 'Figure'


def test_figure_image_name(db):
    assert Figure.objects.first().image_name == 'test.png'


def test_figure_image_type(db):
    assert Figure.objects.first().image_type == 'image/png'


def test_download_str(db):
    assert str(Download.objects.first()) == 'Download'


def test_reference_str(db):
    assert str(Reference.objects.first()) == 'Reference'
