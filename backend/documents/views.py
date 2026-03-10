from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from .models import Document
from .serializers import DocumentSerializer
from accounts.permissions import IsAdmin, IsApprovedClient
from logs.utils import log_action


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer

    def get_permissions(self):
        # Admins can do everything
        # Advocates can create and read; cannot delete or update
        # Clients/judges can only read
        if self.action == "destroy":
            return [IsAdmin()]
        if self.action in ("create", "update", "partial_update"):
            return [IsAuthenticated(), IsApprovedClient()]
        return [IsAuthenticated(), IsApprovedClient()]

    def create(self, request, *args, **kwargs):
        # Only admin and advocates can upload
        if request.user.role not in ("admin", "advocate"):
            return Response({"detail": "Only admins and advocates can upload documents."}, status=403)
        response = super().create(request, *args, **kwargs)
        log_action(request, "upload_document", f"Uploaded document: {request.data.get('title', '')}")
        return response

    def get_queryset(self):
        user = self.request.user
        case_id = self.request.query_params.get("case")

        if user.role == "admin":
            qs = Document.objects.all()
        elif user.role == "client":
            qs = Document.objects.filter(
                case__client=user,
                is_visible_to_client=True,
            )
        elif user.role == "advocate":
            qs = Document.objects.filter(
                Q(case__client_advocate=user) | Q(case__opposition_advocate=user)
            )
        elif user.role == "judge":
            qs = Document.objects.filter(case__judge=user)
        else:
            qs = Document.objects.none()

        if case_id:
            qs = qs.filter(case_id=case_id)

        return qs.select_related("case", "uploaded_by")

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        log_action(request, "view_document", f"Viewed document {kwargs.get('pk')}")
        return response

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx
