from rest_framework import serializers
from django.utils import timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


# ─── CUSTOM JWT ───────────────────────────────────────────────────────────────
class CaseBoxTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Embed role + approval status in the JWT so the frontend can
    know the user's role immediately on decode — no extra /me/ call needed.
    """

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        # Block unapproved clients from logging in
        if user.role == "client" and not user.is_approved:
            raise serializers.ValidationError(
                {"detail": "Your account is pending admin approval. Please wait for confirmation."}
            )

        # Attach extra user info alongside the tokens
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "is_approved": user.is_approved,
            "phone": user.phone,
        }
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["is_approved"] = user.is_approved
        return token


# ─── USER SERIALIZERS ─────────────────────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    can_access = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "full_name", "role", "phone", "address",
            "is_approved", "approved_at", "can_access",
            "profile_note", "created_at",
        ]
        read_only_fields = ["id", "created_at", "approved_at", "can_access"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_can_access(self, obj):
        return obj.can_access


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "username", "email", "first_name", "last_name",
            "password", "role", "phone", "address",
        ]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        role = validated_data.get("role", "client")
        # Admins/advocates/judges are auto-approved; clients wait for manual approval
        is_approved = role in ("admin", "advocate", "judge")
        user = User(**validated_data, is_approved=is_approved)
        user.set_password(password)
        user.save()
        return user


class ClientApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["is_approved", "profile_note"]

    def update(self, instance, validated_data):
        request = self.context.get("request")
        if validated_data.get("is_approved") and not instance.is_approved:
            instance.approved_at = timezone.now()
            if request:
                instance.approved_by = request.user
        instance.is_approved = validated_data.get("is_approved", instance.is_approved)
        instance.profile_note = validated_data.get("profile_note", instance.profile_note)
        instance.save()
        return instance


class MeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    can_access = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "full_name", "role", "phone", "address",
            "is_approved", "can_access", "created_at",
        ]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_can_access(self, obj):
        return obj.can_access
