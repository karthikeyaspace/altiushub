from django.test import TestCase, Client
from django.urls import reverse
from .models import User, Product
import json

class UserSignupTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('signup')
    
    def test_user_signup_success(self):
        """Test successful user signup"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username='testuser').exists())
        
        response_data = json.loads(response.content)
        self.assertEqual(response_data['username'], 'testuser')
        self.assertEqual(response_data['email'], 'test@example.com')
    
    def test_user_signup_missing_fields(self):
        """Test signup with missing fields"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com'
            # missing password
        }
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['error'], 'Missing fields')
    
    def test_user_signup_duplicate_username(self):
        """Test signup with existing username"""
        # Create a user first
        User.objects.create(username='testuser', email='first@example.com', password='pass123')
        
        data = {
            'username': 'testuser',
            'email': 'second@example.com',
            'password': 'testpassword123'
        }
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['error'], 'Username already exists')
