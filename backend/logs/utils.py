# logs/utils.py
from .models import AccessLog


def log_action(request, action, description=""):
    """Helper to create an access log entry. Safe to call anywhere."""
    try:
        user = request.user if request and request.user.is_authenticated else None
        ip = _get_client_ip(request)
        AccessLog.objects.create(
            user=user,
            action=action,
            description=description,
            ip_address=ip,
        )
    except Exception:
        pass  # Never let logging crash the actual request


def _get_client_ip(request):
    if not request:
        return None
    x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded:
        return x_forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")
