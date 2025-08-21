import json
from datetime import datetime, timedelta

from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils import timezone

from .models import User, Product, Inventory, Session

import environ

env = environ.Env(
    DEBUG=(bool, False)
)

HASH_KEY = 'altiushubcoding'


@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({"detail": "CSRF cookie set"})


@csrf_exempt
def signup_view(request):
    # Endpoint for both login and signup
    # If user doesnot exist, create one, create session, validate user and passowrd with hash etc
    # If user exists, check username, password, existing role, create session

    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        password = data.get('password')
        role = data.get('role')

        if not (username and role and password):
            return JsonResponse({'error': 'Missing fields'}, status=400)

        if User.objects.filter(username=username).exists():
            # validate existing user
            present_user = User.objects.get(username=username)
            if present_user.password != password + HASH_KEY:
                return JsonResponse({'success': False, 'message': 'Wrong password'})
            if present_user.role != role:
                return JsonResponse({'success': False, 'message': 'Incorrect role selected'})

            Session.objects.filter(user=present_user).delete()
            Session.objects.create(
                user=present_user, expires_at=timezone.now() + timedelta(hours=1)
            )
            return JsonResponse({'success': True, 'id': present_user.id, 'username': present_user.username})
        else:
            user = User.objects.create(
                username=username, role=role, password=password + HASH_KEY)
            Session.objects.create(
                user=user, expires_at=timezone.now() + timedelta(hours=1)
            )
            return JsonResponse({'success': True, 'id': user.id, 'username': user.username})
    else:
        return HttpResponseNotAllowed(['POST'])


def users_view(request):
    if request.method == 'GET':
        users = User.objects.all()
        users_data = []
        for user in users:
            users_data.append({
                'id': user.id,
                'username': user.username,
                'role': user.role
            })
        return JsonResponse({'success': True, 'users': users_data})
    else:
        return HttpResponseNotAllowed(['GET'])


def products_view(request):
    if request.method == 'GET':
        products = Product.objects.all()
        products_data = []
        for product in products:
            products_data.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price
            })
        return JsonResponse({'success': True, 'products': products_data})
    else:
        return HttpResponseNotAllowed(['GET'])


def add_product_view(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get('user_id')
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')

        if not all([user_id, name, description, price]):
            return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

        # only manager can create product
        if not User.objects.filter(id=user_id, role='manager').exists():
            return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

        if not check_session(user_id):
            return JsonResponse({'success': False, 'message': 'No active session'})

        product = Product.objects.create(
            name=name, description=description, price=price
        )

        # update inventory
        Inventory.objects.create(product=product, quantity=0)

        return JsonResponse({'success': True, 'id': product.id, 'name': product.name})

    else:
        return HttpResponseNotAllowed(['POST'])


def delete_product_view(request):
    if request.method == 'DELETE':
        data = json.loads(request.body.decode('utf-8'))
        product_id = data.get('id')
        user_id = data.get('user_id')

        # only manager can delete product
        if not User.objects.filter(id=user_id, role='manager').exists():
            return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

        if not check_session(user_id):
            return JsonResponse({'success': False, 'message': 'No active session'})

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Product not found'}, status=404)

        product.delete()

        return JsonResponse({'success': True})
    else:
        return HttpResponseNotAllowed(['DELETE'])


def inventory_view(request):
    if request.method == 'GET':
        inventory = Inventory.objects.all()
        products = []
        for item in inventory:
            product = item.product
            products.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'qnty': item.quantity
            })
        return JsonResponse({'success': True, 'inventory': products})
    else:
        return HttpResponseNotAllowed(['GET'])


def update_inventory_view(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        product_id = data.get('product_id')
        quantity = data.get('quantity')
        user_id = data.get('user_id')

        if not check_session(user_id):
            return JsonResponse({'success': False, 'message': 'No active session'})

        # only manager can do this
        if not User.objects.filter(id=user_id, role='manager').exists():
            return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

        inventory_item = Inventory.objects.filter(
            product_id=product_id).first()

        if not inventory_item:
            return JsonResponse({'success': False, 'error': 'Product not found in inventory'}, status=404)

        inventory_item.quantity = quantity
        inventory_item.save()

        return JsonResponse({'success': True, 'id': inventory_item.id, 'quantity': inventory_item.quantity})

    else:
        return HttpResponseNotAllowed(['POST'])


def session_view(request):
    if request.method == 'GET':
        # get user session for user auth
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get('user_id')
        session = Session.objects.filter(user_id=user_id).first()
        if not session:
            return JsonResponse({'success': False, 'error': 'Session not found'}, status=404)

        return JsonResponse({'success': True, 'session': {
            'id': session.id,
            'user_id': session.user.id,
            'expires_at': session.expires_at
        }})
    else:
        return HttpResponseNotAllowed(['GET'])


def all_sessions_view(request):
    if request.method == 'GET':
        sessions = Session.objects.all()
        session_list = []
        for session in sessions:
            session_list.append({
                'id': session.id,
                'user_id': session.user.id,
                'expires_at': session.expires_at
            })
        return JsonResponse({'success': True, 'sessions': session_list})
    else:
        return HttpResponseNotAllowed(['GET'])


def check_session(user_id) -> bool:
    session = Session.objects.filter(user_id=user_id).first()
    if not session:
        return False

    return session.expires_at > timezone.now()
