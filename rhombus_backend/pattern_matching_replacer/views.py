
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Record
from .serializers import RecordSerializer

# Create your views here.


class RegexGenerationView(APIView):
    def post(self, request):
        serializer = RecordSerializer(data=request.data)
        if serializer.is_valid():
            nat_lang_input = serializer.validated_data['nat_lang_input']
            print(
                f"Natural Language Input: {nat_lang_input}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
