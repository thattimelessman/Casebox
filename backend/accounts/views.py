from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer, UserCreateSerializer,
    ClientApprovalSerializer, MeSerializer,
)
from .permissions import IsAdmin

User = get_user_model()


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def me(request):
    """Return or update the current user's own profile."""
    if request.method == "GET":
        return Response(MeSerializer(request.user).data)

    # PATCH — allow user to update own non-sensitive fields
    allowed = ["first_name", "last_name", "phone", "address"]
    data = {k: v for k, v in request.data.items() if k in allowed}
    for field, value in data.items():
        setattr(request.user, field, value)
    request.user.save()
    return Response(MeSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change current user's own password."""
    old = request.data.get("old_password", "")
    new = request.data.get("new_password", "")
    if not request.user.check_password(old):
        return Response({"detail": "Current password is incorrect."}, status=400)
    if len(new) < 8:
        return Response({"detail": "New password must be at least 8 characters."}, status=400)
    request.user.set_password(new)
    request.user.save()
    return Response({"detail": "Password updated successfully."})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-created_at")
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=["get"], url_path="pending-clients")
    def pending_clients(self, request):
        """Admin: list clients waiting for approval."""
        pending = User.objects.filter(role="client", is_approved=False).order_by("-created_at")
        return Response(UserSerializer(pending, many=True).data)

    @action(detail=True, methods=["patch"], url_path="approve")
    def approve(self, request, pk=None):
        """Admin: approve or revoke a client account."""
        user = self.get_object()
        serializer = ClientApprovalSerializer(
            user, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Log the action
        from logs.utils import log_action
        action_type = "approve_client" if user.is_approved else "revoke_client"
        log_action(request, action_type, f"{user.username} {'approved' if user.is_approved else 'revoked'}")

        return Response(UserSerializer(user).data)

    @action(detail=True, methods=["patch"], url_path="role")
    def change_role(self, request, pk=None):
        """Admin: change a user's role."""
        user = self.get_object()
        new_role = request.data.get("role")
        valid_roles = ["admin", "advocate", "judge", "client"]
        if new_role not in valid_roles:
            return Response({"detail": f"Invalid role. Choose from: {', '.join(valid_roles)}"}, status=400)

        # Advocates/judges/admins are auto-approved
        if new_role in ("admin", "advocate", "judge"):
            user.is_approved = True
        user.role = new_role
        user.save()
        return Response(UserSerializer(user).data)

    @action(detail=False, methods=["get"], url_path="by-role")
    def by_role(self, request):
        """Admin: get users filtered by role — useful for case form dropdowns."""
        role = request.query_params.get("role")
        if not role:
            return Response({"detail": "role query param required."}, status=400)
        users = User.objects.filter(role=role, is_approved=True)
        return Response(UserSerializer(users, many=True).data)


class RegisterView(generics.CreateAPIView):
    """Public endpoint: clients self-register (pending admin approval)."""
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data["role"] = "client"  # Force client role on self-registration
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Registration successful. An admin will review and approve your account."},
            status=status.HTTP_201_CREATED,
        )
