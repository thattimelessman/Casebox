from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta

from .models import Case, HearingNote, CaseComment
from .serializers import (
    CaseListSerializer, CaseDetailSerializer,
    HearingNoteSerializer, CaseCommentSerializer,
)
from accounts.permissions import IsAdmin, IsApprovedClient
from logs.utils import log_action


class CaseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsApprovedClient]
    search_fields = ["case_no", "case_title", "court_name", "tags"]
    ordering_fields = ["created_at", "next_hearing_date", "status", "priority"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CaseDetailSerializer
        return CaseListSerializer

    def get_queryset(self):
        user = self.request.user
        q = self.request.query_params.get("search", "")
        status_filter = self.request.query_params.get("status", "")
        type_filter = self.request.query_params.get("case_type", "")
        priority_filter = self.request.query_params.get("priority", "")

        if user.role == "admin":
            qs = Case.objects.all()
        elif user.role == "client":
            qs = Case.objects.filter(client=user, is_visible_to_client=True)
        elif user.role == "advocate":
            qs = Case.objects.filter(
                Q(client_advocate=user) | Q(opposition_advocate=user)
            )
        elif user.role == "judge":
            qs = Case.objects.filter(judge=user)
        else:
            qs = Case.objects.none()

        if q:
            qs = qs.filter(
                Q(case_no__icontains=q) |
                Q(case_title__icontains=q) |
                Q(court_name__icontains=q) |
                Q(tags__icontains=q)
            )
        if status_filter:
            qs = qs.filter(status=status_filter)
        if type_filter:
            qs = qs.filter(case_type=type_filter)
        if priority_filter:
            qs = qs.filter(priority=priority_filter)

        return qs.select_related(
            "client", "judge", "client_advocate", "opposition_advocate"
        ).prefetch_related("documents", "hearing_notes")

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdmin()]
        return [IsAuthenticated(), IsApprovedClient()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        log_action(request, "view_case", f"Viewed case {instance.case_no}")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # ── Hearing Notes ────────────────────────────────────────────────────────
    @action(detail=True, methods=["get", "post"], url_path="hearing-notes")
    def hearing_notes(self, request, pk=None):
        case = self.get_object()
        if request.method == "GET":
            notes = case.hearing_notes.all()
            return Response(HearingNoteSerializer(notes, many=True).data)
        if request.user.role not in ("admin", "advocate"):
            return Response({"detail": "Only admin or advocates can add hearing notes."}, status=403)
        serializer = HearingNoteSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(case=case)
        log_action(request, "edit_case", f"Added hearing note to {case.case_no}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ── Comments (admin + advocate only) ─────────────────────────────────────
    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        case = self.get_object()
        if request.user.role not in ("admin", "advocate"):
            return Response({"detail": "Not permitted."}, status=403)
        if request.method == "GET":
            return Response(CaseCommentSerializer(case.comments.all(), many=True).data)
        serializer = CaseCommentSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(case=case)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ── Progress update ───────────────────────────────────────────────────────
    @action(detail=True, methods=["patch"], url_path="progress", permission_classes=[IsAdmin])
    def update_progress(self, request, pk=None):
        case = self.get_object()
        try:
            progress = int(request.data.get("progress", -1))
        except (TypeError, ValueError):
            return Response({"detail": "Progress must be a number 0–100."}, status=400)
        if not (0 <= progress <= 100):
            return Response({"detail": "Progress must be between 0 and 100."}, status=400)
        case.progress = progress
        case.save()
        log_action(request, "edit_case", f"Updated progress for {case.case_no} to {progress}%")
        return Response({"progress": case.progress})

    # ── Toggle client visibility ──────────────────────────────────────────────
    @action(detail=True, methods=["patch"], url_path="visibility", permission_classes=[IsAdmin])
    def toggle_visibility(self, request, pk=None):
        case = self.get_object()
        case.is_visible_to_client = not case.is_visible_to_client
        case.save()
        return Response({"is_visible_to_client": case.is_visible_to_client})

    # ── Dashboard stats (admin only) ──────────────────────────────────────────
    @action(detail=False, methods=["get"], url_path="dashboard", permission_classes=[IsAdmin])
    def dashboard(self, request):
        from accounts.models import User

        total_cases = Case.objects.count()
        by_status = {}
        for s, _ in Case.STATUS_CHOICES:
            by_status[s] = Case.objects.filter(status=s).count()

        by_type = {}
        for t, _ in Case.CASE_TYPE_CHOICES:
            count = Case.objects.filter(case_type=t).count()
            if count:
                by_type[t] = count

        today = timezone.now().date()
        upcoming = Case.objects.filter(
            next_hearing_date__gte=today,
            next_hearing_date__lte=today + timedelta(days=30)
        ).order_by("next_hearing_date").select_related("client", "client_advocate")[:8]

        pending_clients = User.objects.filter(role="client", is_approved=False).count()
        total_users = User.objects.count()

        return Response({
            "total_cases": total_cases,
            "by_status": by_status,
            "by_type": by_type,
            "pending_clients": pending_clients,
            "total_users": total_users,
            "upcoming_hearings": CaseListSerializer(upcoming, many=True).data,
        })
