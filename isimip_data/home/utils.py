from django.urls import reverse


def get_home_links(tree, product, category_sector_publication):
    links = []
    for simulation_round, simulation_round_tree in tree.tree_dict.items():
        if simulation_round_tree.get('items', {}).get(product, {}) \
                                .get('items', {}).get(category_sector_publication, {}):
            links.append(
                (
                    simulation_round,
                    reverse('search', args=[
                        f'tree/{simulation_round}/{product}/{category_sector_publication}'
                    ])
                )
            )

    return links
