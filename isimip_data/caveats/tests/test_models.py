from isimip_data.caveats.models import Caveat, Comment


def test_caveat_str(db):
    assert str(Caveat.objects.first()) == 'Caveat'


def test_comment_str(db):
    comment = Comment.objects.first()
    assert str(comment) == f'{comment.caveat} {comment.creator} {comment.created}'
