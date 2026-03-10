from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("users", views.UserViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),
    path("me/", views.me, name="me"),
    path("me/change-password/", views.change_password, name="change-password"),
    path("register/", views.RegisterView.as_view(), name="register"),
]
