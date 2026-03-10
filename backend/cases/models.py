from django.db import models
from django.conf import settings


class Case(models.Model):
    STATUS_CHOICES = (
        ("ongoing", "Ongoing"),
        ("adjourned", "Adjourned"),
        ("judgement_reserved", "Judgement Reserved"),
        ("closed", "Closed"),
        ("disposed", "Disposed"),
    )
    CASE_TYPE_CHOICES = (
        ("civil", "Civil"),
        ("criminal", "Criminal"),
        ("family", "Family"),
        ("property", "Property"),
        ("labour", "Labour"),
        ("commercial", "Commercial"),
        ("constitutional", "Constitutional"),
        ("other", "Other"),
    )
    PRIORITY_CHOICES = (
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("urgent", "Urgent"),
    )

    case_no = models.CharField(max_length=100, unique=True)
    case_title = models.CharField(max_length=255)
    case_type = models.CharField(max_length=30, choices=CASE_TYPE_CHOICES, default="civil")
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    tags = models.CharField(max_length=300, blank=True, help_text="Comma-separated tags")

    court_name = models.CharField(max_length=255)
    court_city = models.CharField(max_length=100, blank=True)

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="client_cases",
        on_delete=models.CASCADE,
    )
    judge = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="judge_cases",
        on_delete=models.SET_NULL,
        null=True, blank=True,
    )
    client_advocate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="advocate_cases",
        on_delete=models.SET_NULL,
        null=True, blank=True,
    )
    opposition_advocate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="opposition_cases",
        on_delete=models.SET_NULL,
        null=True, blank=True,
    )

    filing_date = models.DateField(null=True, blank=True)
    next_hearing_date = models.DateField(null=True, blank=True)
    last_hearing_date = models.DateField(null=True, blank=True)

    last_verdict = models.TextField(blank=True)
    final_verdict = models.TextField(blank=True)
    case_summary = models.TextField(blank=True)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="ongoing")
    progress = models.PositiveSmallIntegerField(default=0)

    is_visible_to_client = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.case_no} – {self.case_title}"


class HearingNote(models.Model):
    """Notes from each hearing session."""
    case = models.ForeignKey(Case, related_name="hearing_notes", on_delete=models.CASCADE)
    hearing_date = models.DateField()
    next_date = models.DateField(null=True, blank=True)
    note = models.TextField()
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-hearing_date"]

    def __str__(self):
        return f"{self.case.case_no} – {self.hearing_date}"


class CaseComment(models.Model):
    """
    Internal comments visible only to admin and advocates.
    Clients never see these.
    """
    case = models.ForeignKey(Case, related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.case.case_no} – comment by {self.author}"
