from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework import exceptions
from django.contrib.auth.models import User
from .models import Room


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        self.username = data.get("username", "")
        self.password = data.get("password", "")

        if self.username and self.password:
            user = authenticate(username=self.username, password=self.password)
            if user:
                if user.is_active:
                    data["user"] = user
                else:
                    msg = "User is desactivated."
                    raise exceptions.ValidationError(msg)
            else:
                msg = "Unable to login with the given credentials."
                exceptions.ValidationError(msg)
        else:
            msg = "Must provide username and password both"
            raise exceptions.ValidationError(msg)
        return data



