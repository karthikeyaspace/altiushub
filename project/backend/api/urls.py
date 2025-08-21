from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.csrf_token_view, name='get_csrf_token'),

    path('signup/', views.signup_view, name='signup'),
    path('users/', views.users_view, name='users'),

    path('products/', views.products_view, name='products'),
    path('product/', views.add_product_view, name='add_product'),
    path('delete-product/', views.delete_product_view, name='delete_product'),

    path('inventory/', views.inventory_view, name='inventory'),
    path('update-inventory/', views.update_inventory_view, name='update_inventory'),

    path('session/', views.session_view, name='session')
]

# end points

# /signup
# /products -> GET products
# /product -> POST products -> only manager
# /delete-product -> DELETE product -> only manager
# /inventory -> GET inventory
# /update-inventory -> POST inventory -> only manager
# /session -> GET session
