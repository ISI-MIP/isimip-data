import io
from xml.dom.minidom import parseString
from xml.sax.saxutils import XMLGenerator


class DataCiteRenderer(object):

    def __init__(self):
        self.stream = io.StringIO()
        self.xml = XMLGenerator(self.stream, 'utf-8')

    def render(self, data):
        self.data = data.datacite
        self.render_document()

        dom = parseString(self.stream.getvalue())
        return dom.toprettyxml(indent='    ')

    def render_node(self, tag, attrs, value):
        # remove None values from attrs
        attrs = dict((k, v) for k, v in attrs.items() if v)

        self.xml.startElement(tag, attrs)
        if value is not None:
            self.xml.characters(str(value))
        self.xml.endElement(tag)

    def render_document(self):
        self.xml.startDocument()
        self.render_resource()
        self.xml.endDocument()

    def render_resource(self):
        self.xml.startElement('resource', {
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'xmlns': 'http://datacite.org/schema/kernel-4',
            'xsi:schemaLocation': 'http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4.3/metadata.xsd'
        })

        # identifier
        identifier = next(item for item in self.data.get('identifiers', []) if item.get('identifierType') == 'DOI')
        self.render_node('identifier', {
            'identifierType': identifier.get('identifierType')
        }, identifier.get('identifier'))

        # creators
        self.xml.startElement('creators', {})
        for creator in self.data.get('creators', []):
            self.xml.startElement('creator', {})

            self.render_node('creatorName', {'nameType': 'Personal'}, creator.get('name'))

            if creator.get('givenName'):
                self.render_node('givenName', {}, creator.get('givenName'))

            if creator.get('familyName'):
                self.render_node('familyName', {}, creator.get('familyName'))

            if creator.get('nameIdentifier'):
                self.render_node('nameIdentifier', {
                    'nameIdentifierScheme': creator.get('nameIdentifierScheme', 'ORCID'),
                    'schemeURI': creator.get('schemeURI', 'https:/orcid.org')
                }, creator.get('nameIdentifier'))

            for affiliation in creator.get('affiliations', []):
                self.render_node('affiliation', {
                    'affiliationIdentifier': affiliation.get('affiliationIdentifier'),
                    'affiliationIdentifierScheme': affiliation.get('affiliationIdentifierScheme', 'ROR'),
                    'schemeURI': affiliation.get('schemeURI', 'https://ror.org')
                }, affiliation.get('affiliation'))

            self.xml.endElement('creator')
        self.xml.endElement('creators')

        # titles
        self.xml.startElement('titles', {})
        for title in self.data.get('titles', []):
            self.render_node('title', {
                'titleType': title.get('titleType', 'AlternativeTitle')
            }, title.get('title'))
        self.xml.endElement('titles')

        # publisher
        self.render_node('publisher', {}, self.data.get('publisher'))

        # publicationYear
        self.render_node('publicationYear', {}, self.data.get('publicationYear'))

        # subjects
        if 'subjects' in self.data:
            self.xml.startElement('subjects', {})
            for subject in self.data.get('subjects', []):
                self.render_node('subject', {
                    'subjectScheme': subject.get('subjectScheme'),
                    'schemeURI': subject.get('schemeURI')
                }, subject.get('subject'))
            self.xml.endElement('subjects')

        # contributors
        if 'contributors' in self.data:
            self.xml.startElement('contributors', {})
            for contributor in self.data.get('contributors', []):
                self.xml.startElement('contributor', {
                    'contributorType': contributor.get('contributorType')
                })

                self.render_node('contributorName', {
                    'nameType': contributor.get('nameType', 'Personal')
                }, contributor.get('name'))

                if contributor.get('givenName'):
                    self.render_node('givenName', {}, contributor.get('givenName'))

                if contributor.get('familyName'):
                    self.render_node('familyName', {}, contributor.get('familyName'))

                if contributor.get('nameIdentifier'):
                    self.render_node('nameIdentifier', {
                        'nameIdentifierScheme': contributor.get('nameIdentifierScheme', 'ORCID'),
                        'schemeURI': contributor.get('schemeURI', 'https:/orcid.org')
                    }, contributor.get('nameIdentifier'))

                for affiliation in contributor.get('affiliations', []):
                    self.render_node('affiliation', {
                        'affiliationIdentifier': affiliation.get('affiliationIdentifier'),
                        'affiliationIdentifierScheme': affiliation.get('affiliationIdentifierScheme', 'ROR'),
                        'schemeURI': affiliation.get('schemeURI', 'https://ror.org')
                    }, affiliation.get('affiliation'))

                self.xml.endElement('contributor')
            self.xml.endElement('contributors')

        # dates
        if 'dates' in self.data:
            self.xml.startElement('dates', {})
            for date in self.data.get('dates', {}):
                self.render_node('date', {
                    'dateType': date.get('dateType')
                }, date.get('date'))
            self.xml.endElement('dates')

        # language
        self.render_node('language', {}, self.data.get('language', 'eng'))

        # resourceType
        self.render_node('resourceType', {
            'resourceTypeGeneral': self.data.get('types', {}).get('resourceTypeGeneral', 'Dataset')
        }, self.data.get('types', {}).get('resourceType'))

        # alternateIdentifiers
        if 'alternateIdentifiers' in self.data:
            self.xml.startElement('alternateIdentifiers', {})
            for alternate_identifier in self.data.get('alternateIdentifiers', []):
                self.render_node('alternateIdentifier', {
                    'alternateIdentifierType': alternate_identifier.get('alternateIdentifierType')
                }, alternate_identifier.get('alternateIdentifier'))
            self.xml.endElement('alternateIdentifiers')

        # relatedIdentifiers
        if 'relatedIdentifiers' in self.data:
            self.xml.startElement('relatedIdentifiers', {})
            for related_identifier in self.data.get('relatedIdentifiers', []):
                self.render_node('relatedIdentifier', {
                    'relatedIdentifierType': related_identifier.get('relatedIdentifierType'),
                    'relationType': related_identifier.get('relationType')
                }, related_identifier.get('relatedIdentifier'))
            self.xml.endElement('relatedIdentifiers')

        # version
        if 'version' in self.data:
            self.render_node('version', {}, self.data.get('version'))

        # rightsList
        if 'rightsList' in self.data:
            self.xml.startElement('rightsList', {})
            for rights in self.data.get('rightsList', []):
                self.render_node('rights', {
                    'rightsURI': rights.get('rights_uri')
                }, rights.get('rights'))
            self.xml.endElement('rightsList')

        # descriptions
        if 'descriptions' in self.data:
            self.xml.startElement('descriptions', {})
            for description in self.data.get('descriptions', []):
                self.render_node('description', {
                    'descriptionType': description.get('descriptionType', 'Abstract')
                }, description.get('description'))
            self.xml.endElement('descriptions')

        # fundingReferences
        if 'fundingReferences' in self.data:
            self.xml.startElement('fundingReferences', {})
            for funding_reference in self.data.get('fundingReferences', []):
                self.xml.startElement('fundingReference', {})
                self.render_node('funderName', {}, funding_reference.get('name'))

                if 'funderIdentifier' in funding_reference:
                    self.render_node('funderIdentifier', {
                        'funderIdentifierType': affiliation.get('funderIdentifierType', 'ROR'),
                        'schemeURI': affiliation.get('schemeURI', 'https://ror.org')
                    }, funding_reference.get('funderIdentifier'))

                if 'awardNumber' in funding_reference:
                    self.render_node('awardNumber', {
                        'awardURI': funding_reference.get('awardURI')
                    }, funding_reference.get('awardNumber'))

                if 'awardTitle' in funding_reference:
                    self.render_node('awardTitle', {}, funding_reference.get('awardTitle'))

                self.xml.endElement('fundingReference')
            self.xml.endElement('fundingReferences')

        self.xml.endElement('resource')


class BibTexRenderer(object):

    def render(self, data):
        authors = ' and '.join([creator.get('creatorName') for creator in data.datacite.get('creators', [])])

        return '''
@misc{{{doi}}}
    authors = {{{authors}}},
    year = {{{year}}},
    title = {{{title}}},
    version = {{{version}}},
    publisher = {{{publisher}}},
    doi = {{{doi}}},
    url = {{{doi_url}}}
}}
'''.format(
            authors=authors,
            year=data.datacite.get('publicationYear'),
            title=data.title,
            version=data.major_version,
            publisher=data.datacite.get('publisher'),
            doi=data.doi,
            doi_url=data.doi_url
        ).strip()
