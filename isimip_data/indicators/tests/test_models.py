from isimip_data.indicators.models import Indicator, IndicatorValue


def test_indicator_str(db):
    indicator = Indicator.objects.first()
    assert str(indicator) == indicator.title


def test_indicator_table(db):
    indicator = Indicator.objects.first()
    table = indicator.table
    assert table.get('identifiers') == []
    assert table.get('pretty_identifiers') == []
    assert len(table.get('rows')) == 2
    assert table.get('minimum') == -10.0
    assert table.get('maximum') == 10.0
    assert table.get('reverse') is True


# def test_annotation_save(db):
#     annotation = Annotation.objects.first()
#     annotation.save()
#     assert len(annotation.datasets) == 2


# def test_figure_str(db):
#     assert str(Figure.objects.first()) == 'Figure'


# def test_figure_image_name(db):
#     assert Figure.objects.first().image_name == 'test.png'


# def test_figure_image_type(db):
#     assert Figure.objects.first().image_type == 'image/png'


# def test_download_str(db):
#     assert str(Download.objects.first()) == 'Download'


def test_indicator_value_str(db):
    indicator_value = IndicatorValue.objects.first()
    assert str(indicator_value) == 'Lorem ipsum dolor sit amet []'
