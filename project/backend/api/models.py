from django.db import models


# Inventory Management - User, Products, Inventory, Session

class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=128)  # hashed password
    role = models.CharField(max_length=50, choices=[
        ('manager', 'Manager'),
        ('staff', 'Staff')
    ], default='manager')

    def __str__(self):
        return self.username


class Session(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.user.username} - {self.expires_at}"


class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name


class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.quantity} units"
