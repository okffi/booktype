from django import forms
from booki.editor.models import Book
from django.utils.translation import ugettext_lazy as _

from booktype.apps.core.forms import BaseBooktypeForm

from taggit.forms import TagField
from taggit.utils import edit_string_for_tags


class EditBookInfoForm(BaseBooktypeForm, forms.ModelForm):

    description = forms.CharField(
            label=_("Book description"), 
            required=False, 
            widget=forms.Textarea(attrs={'style': "width: 100%; height: 210px;"})
        )
    book_cover = forms.ImageField(
            label=_("Book image"),
            required=False            
        )
    hidden = forms.BooleanField(
            label=_('Initially hide from others'), 
            required=False
        )

    class Meta:
        model = Book
        exclude = [
            'url_title', 'title',
            'status', 'language',
            'version', 'group',
            'created', 'published',
            'permission', 'cover'
        ]

        fields = [
            'description', 'book_cover',
            'owner', 'license', 'hidden'
        ]

    def __init__(self, user, *args, **kwargs):
        super(EditBookInfoForm, self).__init__(*args, **kwargs)

        if not user.is_superuser:
            del self.fields['owner']

class TagBookForm(TagObjectForm):
    resource_name = 'book'

class TagObjectForm(forms.Form):
    def __init__(self, obj, *args, **kwargs):
        self.obj = obj
        if obj is None:
            tags = kwargs.pop('tags')
        else:
            tags = obj.tags.all()

        if kwargs.get('resource_name'):
            self.resource_name = kwargs.pop('resource_name')

        kwargs['initial'] = {'tags': edit_string_for_tags([o for o in tags])}
        super(TagObjectForm, self).__init__(*args, **kwargs)

        self.fields['tags'] = TagField(label=_("Tags"),
            widget=TagAutocompleteTagIt(
                attrs={'placeholder': _('Tags')},
                autocomplete_url=reverse('api_get_tags_autocomplete', kwargs={
                    'api_name': 'v1',
                    'resource_name': self.resource_name}
                )),
            help_text=_("Comma separated and quoted"))

    def save(self):
        self.obj.tags.set(*self.cleaned_data['tags'])
        self.obj.save()
