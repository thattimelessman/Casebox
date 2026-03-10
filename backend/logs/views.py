from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import serializers
from accounts.permissions import IsAdmin
from .models import AccessLog


class AccessLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = AccessLog
        fields = ["id", "user", "user_name", "action", "description", "ip_address", "timestamp"]

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return "System"


@api_view(["GET"])
@permission_classes([IsAdmin])
def log_list(request):
    action_filter = request.query_params.get("action", "")
    user_filter = request.query_params.get("user", "")

    qs = AccessLog.objects.all().select_related("user")
    if action_filter:
        qs = qs.filter(action=action_filter)
    if user_filter:
        qs = qs.filter(user__username__icontains=user_filter)

    # Paginate: last 200 logs
    qs = qs[:200]
    return Response(AccessLogSerializer(qs, many=True).data)
