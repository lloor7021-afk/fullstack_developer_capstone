"""Django URL configuration for the full stack capstone."""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from djangoapp import views as capstone_views
from django.conf import settings

urlpatterns = [
    path('fetchDealers', capstone_views.get_dealerships),
    path('fetchDealers/<str:state>', capstone_views.get_dealerships),
    path('analyze/<path:text>', capstone_views.analyze_review),
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),
    path('about', TemplateView.as_view(template_name='About.html')),
    path('contact', TemplateView.as_view(template_name='Contact.html')),
    path('', TemplateView.as_view(template_name="index.html")),
    re_path(r'^(login|register|dealer/[0-9]+|review/[0-9]+|postreview/[0-9]+)/?$', TemplateView.as_view(template_name='index.html')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
