from pathlib import Path

from django.core.management.base import BaseCommand

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

WEIGHTS = [400]

SYMBOLS = [
    'block',
    'check',
    'chevron_right',
    'close',
    'content_copy',
    'description',
    'download',
    'draft',
    'edit_square',
    'exit_to_app',
    'expand_less',
    'expand_more',
    'file_copy',
    'file_copy',
    'local_library',
    'quick_reference_all',
    'search',
    'task_alt',
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        src = Path('node_modules/material-symbols/material-symbols-rounded.woff2')

        print(f'Subsetting symbols from {src}:')
        for symbol in SYMBOLS:
            print(f'    {symbol}')

        for weight in WEIGHTS:
            dest = Path(f'isimip_data/core/assets/fonts/material-symbols-rounded-{weight}-subset.woff2')

            font = TTFont(src)
            font = instancer.instantiateVariableFont(
                font,
                {
                    'wght': weight,
                    'FILL': 0,
                    'GRAD': 0,
                    'opsz': 24,
                },
            )

            options = Options()
            options.flavor = 'woff2'
            options.layout_features = ['liga', 'rlig', 'dlig']
            options.desubroutinize = True
            options.hinting = False

            text = ' '.join(SYMBOLS)

            subsetter = Subsetter(options=options)
            subsetter.populate(text=text)
            subsetter.subset(font)

            dest.parent.mkdir(parents=True, exist_ok=True)
            font.save(dest)

            print(f'Wrote {dest.stat().st_size} bytes to {dest}')
