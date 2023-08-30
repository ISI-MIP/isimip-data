def get_full_name(user):
    if user.first_name and user.last_name:
        return f'{user.first_name} {user.last_name}'
    else:
        return user.username
