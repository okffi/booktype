from tastypie.resources import ModelResource
from booki.editor.models import Book

class BookResource(ModelResource):
    class Meta:
        queryset = Book.objects.all()
        resource_name = 'book'
