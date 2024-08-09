from django.urls import reverse


def get_home_links(tree, product, category_sector_resource):
    links = []

    for simulation_round, simulation_round_tree in tree.tree_dict.items():
        category_sector_resource_tree = simulation_round_tree.get('items', {}).get(product, {}).get('items', {})
        if isinstance(category_sector_resource, str):
            # this is a category or a sector
            if category_sector_resource_tree.get(category_sector_resource):
                links.append(
                    (
                        simulation_round,
                        reverse('search', args=[
                            f'tree/{simulation_round}/{product}/{category_sector_resource}'
                        ])
                    )
                )
        else:
            # this is a resource
            for resource_path in category_sector_resource.paths:
                resource_simulation_round, resource_product, resource_publication = resource_path.split('/')
                if resource_simulation_round == simulation_round and resource_product == product:
                    tree_publication = category_sector_resource_tree.get(resource_publication) or \
                                       category_sector_resource_tree.get(resource_publication.lower())
                    if tree_publication:
                        links.append(
                            (
                                simulation_round,
                                reverse('search', args=[
                                    f'tree/{simulation_round}/{product}/{tree_publication}'
                                ])
                            )
                        )

    return links
