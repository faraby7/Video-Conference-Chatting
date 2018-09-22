from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse, request
from django.shortcuts import render, redirect

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import logout
from .serializers import LoginSerializer
from .serializers import RoomSerializer
from .serializers import UserSerializer
from django.contrib.auth import login as django_login, logout as django_logout
from django.contrib.auth.models import User
from .models import Room


class ExampleView(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        content = {
            'user': str(request.user),  # `django.contrib.auth.User` instance.
            'auth': str(request.auth),  # None
        }
        return Response(content)


@login_required
def hello(request):
    return HttpResponse('<h2>Hello World Mr ' + request.user.username + ' </h2>')


def logout_view(request):
    logout(request)
    return redirect('login')


@csrf_exempt
@api_view(["GET"])
def sample_api(request):
    data = {'sample_data': 123}
    return Response(data, status=HTTP_200_OK)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        django_login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=200)


class LogoutView(APIView):
    authentication_classes = (TokenAuthentication,)

    def post(self, request):
        django_logout(request)
        return Response(status=204)


class SignUpView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = User.objects.create_user(username, email, password)
        user.save()
        token = Token.objects.create(user=user)
        return Response({'detail': 'User Has been Created With Token:' + token.key})


def rooms(request,username):
    if request.method == 'GET':
        room_list = Room.objects.filter(username=username)
        serializer = RoomSerializer(room_list, many=True)
        return JsonResponse(serializer.data, safe=False)


def users(request):
    if request.method == 'GET':
        user_list = User.objects.all()
        serializer = UserSerializer(user_list, many=True)
        return JsonResponse(serializer.data, safe=False)


class roomsCreate(APIView):
    def post(self, request, *args, **kwargs):
        username = request.POST.get('username')
        _room = request.POST.get('Room')
        mroom = Room(username=username, room=_room)
        mroom.save()
        return Response({'detail': 'Room Has been Created With Token:'})
