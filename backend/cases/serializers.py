from rest_framework import serializers
from .models import Case, HearingNote, CaseComment
from accounts.serializers import UserSerializer


class HearingNoteSerializer(serializers.ModelSerializer):
    added_by_name = serializers.SerializerMethodField()

    class Meta:
        model = HearingNote
        fields = [
            "id", "hearing_date", "next_date",
            "note", "added_by", "added_by_name", "created_at",
        ]
        read_only_fields = ["id", "created_at", "added_by"]

    def get_added_by_name(self, obj):
        if obj.added_by:
            return obj.added_by.get_full_name() or obj.added_by.username
        return None

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["added_by"] = request.user
        return super().create(validated_data)


class CaseCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = CaseComment
        fields = ["id", "text", "author", "author_name", "created_at"]
        read_only_fields = ["id", "author", "created_at"]

    def get_author_name(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.username
        return None

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["author"] = request.user
        return super().create(validated_data)


class CaseListSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    advocate_name = serializers.SerializerMethodField()
    judge_name = serializers.SerializerMethodField()
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = Case
        fields = [
            "id", "case_no", "case_title", "case_type", "priority",
            "court_name", "court_city", "status", "progress", "tags",
            "next_hearing_date", "last_hearing_date", "filing_date",
            "client_name", "advocate_name", "judge_name",
            "document_count", "is_visible_to_client", "updated_at",
        ]

    def get_client_name(self, obj):
        return obj.client.get_full_name() or obj.client.username if obj.client else "—"

    def get_advocate_name(self, obj):
        if obj.client_advocate:
            return obj.client_advocate.get_full_name() or obj.client_advocate.username
        return None

    def get_judge_name(self, obj):
        if obj.judge:
            return obj.judge.get_full_name() or obj.judge.username
        return None

    def get_document_count(self, obj):
        return obj.documents.count()


class CaseDetailSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    advocate_name = serializers.SerializerMethodField()
    judge_name = serializers.SerializerMethodField()
    opposition_advocate_name = serializers.SerializerMethodField()
    hearing_notes = HearingNoteSerializer(many=True, read_only=True)
    comments = CaseCommentSerializer(many=True, read_only=True)
    documents = serializers.SerializerMethodField()

    class Meta:
        model = Case
        fields = "__all__"

    def get_client_name(self, obj):
        return obj.client.get_full_name() or obj.client.username if obj.client else "—"

    def get_advocate_name(self, obj):
        if obj.client_advocate:
            return obj.client_advocate.get_full_name() or obj.client_advocate.username
        return None

    def get_judge_name(self, obj):
        if obj.judge:
            return obj.judge.get_full_name() or obj.judge.username
        return None

    def get_opposition_advocate_name(self, obj):
        if obj.opposition_advocate:
            return obj.opposition_advocate.get_full_name() or obj.opposition_advocate.username
        return None

    def get_documents(self, obj):
        from documents.serializers import DocumentSerializer
        request = self.context.get("request")
        user = request.user if request else None
        docs = obj.documents.all()
        if user and user.role == "client":
            docs = docs.filter(is_visible_to_client=True)
        return DocumentSerializer(docs, many=True, context=self.context).data
