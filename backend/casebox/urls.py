from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT Auth
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # App routes
    path("api/accounts/", include("accounts.urls")),
    path("api/cases/", include("cases.urls")),
    path("api/documents/", include("documents.urls")),
    path("api/logs/", include("logs.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
