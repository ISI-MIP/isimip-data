import json

from .models import IndicatorValue


def import_indicator_values(indicator, fp):
    try:
        data = json.load(fp)
    except json.JSONDecodeError:
        return

    for row in data:
        indicator_value = IndicatorValue(
            value=row.pop('value', 0.0),
            indicator=indicator,
            version_after=row.pop('after', ''),
            version_before=row.pop('before', ''),
        )
        indicator_value.specifiers = row
        indicator_value.save()
