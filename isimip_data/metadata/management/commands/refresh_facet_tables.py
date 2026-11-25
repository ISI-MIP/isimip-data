from django.core.management.base import BaseCommand
from django.db import connections, transaction

# The tables replicate the semantics of the dataset histogram endpoint:
# restricted to public rows, grouped by specifier value, counting distinct
# root datasets (links are counted towards their target dataset via root_id).
# They allow serving histograms without the facet filter (from facet_count)
# and with exactly one identifier filter (from facet_pair) without scanning
# the datasets table on every request.

CREATE_STATEMENTS = [
    """
    CREATE TABLE IF NOT EXISTS facet_count (
        identifier text NOT NULL,
        specifier text NOT NULL,
        count bigint NOT NULL,
        PRIMARY KEY (identifier, specifier)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS facet_pair (
        identifier_1 text NOT NULL,
        specifier_1 text NOT NULL,
        identifier_2 text NOT NULL,
        specifier_2 text NOT NULL,
        count bigint NOT NULL,
        PRIMARY KEY (identifier_1, specifier_1, identifier_2, specifier_2)
    )
    """,
    # for the (common) lookups in which the filter identifier sorts after the facet identifier
    'CREATE INDEX IF NOT EXISTS facet_pair_reverse_idx '
    'ON facet_pair (identifier_2, specifier_2, identifier_1)',
]

REFRESH_STATEMENTS = [
    'TRUNCATE facet_count',
    """
    INSERT INTO facet_count (identifier, specifier, count)
    SELECT key, value, count(DISTINCT root_id)
    FROM datasets d, jsonb_each_text(d.specifiers) AS key
    WHERE d.public
    GROUP BY 1, 2
    """,
    'TRUNCATE facet_pair',
    """
    INSERT INTO facet_pair (identifier_1, specifier_1, identifier_2, specifier_2, count)
    SELECT a.key, a.value, b.key, b.value, count(DISTINCT d.root_id)
    FROM datasets d,
         jsonb_each_text(d.specifiers) AS a,
         jsonb_each_text(d.specifiers) AS b
    WHERE d.public AND a.key <= b.key
    GROUP BY 1, 2, 3, 4
    """,
]

ANALYZE_STATEMENTS = ['ANALYZE facet_count', 'ANALYZE facet_pair']


class Command(BaseCommand):
    help = """
        Create (if needed) and refill the precomputed facet tables facet_count and facet_pair
        in the metadata database.

        In production the metadata database is only writable by the metadata pipeline, which should
        run these statements after each ingest; on the application server the database user has read
        access only. In local development (and testing) this command can be run directly.
        """

    def handle(self, *args, **options):
        with connections['metadata'].cursor() as cursor:
            for statement in CREATE_STATEMENTS:
                cursor.execute(statement)

        with transaction.atomic(using='metadata'):
            with connections['metadata'].cursor() as cursor:
                for statement in REFRESH_STATEMENTS:
                    cursor.execute(statement)

        # update the planner statistics outside the transaction
        with connections['metadata'].cursor() as cursor:
            for statement in ANALYZE_STATEMENTS:
                cursor.execute(statement)

        self.stdout.write(self.style.SUCCESS('Refreshed the facet tables.'))
