from django import template

register = template.Library()


@register.inclusion_tag('core/tags/bootstrap_form_field.html')
def bootstrap_form_field(field):
    if not field.field.widget.attrs.get('placeholder'):
        field.field.widget.attrs['placeholder'] = field.label

    if field.field.widget.attrs.get('class'):
        field.field.widget.attrs['class'] += ' form-control'
    else:
        field.field.widget.attrs['class'] = 'form-control'

    try:
        if field.field.widget.input_type == 'checkbox':
            field.field.widget.attrs['class'] = 'form-check-input'
    except AttributeError:
        pass

    return {
        'field': field
    }


@register.inclusion_tag('core/tags/bootstrap_form_errors.html')
def bootstrap_form_errors(form):
    return {
        'errors': form.non_field_errors
    }
