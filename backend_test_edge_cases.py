import requests
import json
import sys
import random
import string
from pprint import pprint
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://138bbf90-bc9d-4fea-8acf-237c94a42c48.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

# Global variables to store test data
TEST_USER = {
    "email": f"test.user.{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com",
    "password": "Test@123456",
    "full_name": "Nguyễn Văn Test",
    "phone": "0912345678"
}
ACCESS_TOKEN = None
TEST_PRODUCT_ID = None

# Helper function to generate random string
def random_string(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# Helper function to get authorization headers
def get_auth_headers():
    if not ACCESS_TOKEN:
        raise Exception("No access token available. Please run authentication tests first.")
    return {"Authorization": f"Bearer {ACCESS_TOKEN}"}

def test_edge_cases():
    """Test edge cases and error handling for all API endpoints"""
    print("\n======= TESTING EDGE CASES AND ERROR HANDLING =======\n")
    
    # First, get a product ID for testing
    products_response = requests.get(f"{API_BASE_URL}/products")
    if products_response.status_code == 200 and products_response.json():
        global TEST_PRODUCT_ID
        TEST_PRODUCT_ID = products_response.json()[0]["id"]
    
    # Register a test user to get access token
    register_data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"],
        "phone": TEST_USER["phone"]
    }
    register_response = requests.post(f"{API_BASE_URL}/auth/register", json=register_data)
    if register_response.status_code in [200, 201]:
        global ACCESS_TOKEN
        ACCESS_TOKEN = register_response.json()["access_token"]
    else:
        # Try login if registration fails (user might already exist)
        login_data = {
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        }
        login_response = requests.post(f"{API_BASE_URL}/auth/login", json=login_data)
        if login_response.status_code == 200:
            ACCESS_TOKEN = login_response.json()["access_token"]
        else:
            # Generate a new user if login also fails
            TEST_USER["email"] = f"test.user.{random_string(8)}@example.com"
            register_data["email"] = TEST_USER["email"]
            register_response = requests.post(f"{API_BASE_URL}/auth/register", json=register_data)
            if register_response.status_code in [200, 201]:
                ACCESS_TOKEN = register_response.json()["access_token"]
    
    # Test edge cases for product API
    print("\n=== Product API Edge Cases ===")
    
    # 1. Non-existent product ID
    non_existent_id = "non-existent-id"
    response = requests.get(f"{API_BASE_URL}/products/{non_existent_id}")
    print(f"GET /api/products/{non_existent_id} - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # 2. Invalid category filter
    response = requests.get(f"{API_BASE_URL}/products", params={"category": "NonExistentCategory"})
    print(f"GET /api/products?category=NonExistentCategory - Status: {response.status_code}")
    print(f"Response length: {len(response.json())}")
    
    # 3. Invalid search query
    response = requests.get(f"{API_BASE_URL}/products", params={"search": "!@#$%^&*"})
    print(f"GET /api/products?search=!@#$%^&* - Status: {response.status_code}")
    print(f"Response length: {len(response.json())}")
    
    # 4. Invalid pagination parameters
    response = requests.get(f"{API_BASE_URL}/products", params={"skip": "invalid", "limit": "invalid"})
    print(f"GET /api/products?skip=invalid&limit=invalid - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response length: {len(response.json())}")
    else:
        print(f"Response: {response.json()}")
    
    # Test edge cases for authentication API
    print("\n=== Authentication API Edge Cases ===")
    
    # 1. Register with invalid email
    invalid_email_data = {
        "email": "invalid-email",
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"],
        "phone": TEST_USER["phone"]
    }
    response = requests.post(f"{API_BASE_URL}/auth/register", json=invalid_email_data)
    print(f"POST /api/auth/register (invalid email) - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # 2. Register with missing required fields
    missing_fields_data = {
        "email": f"test.{random_string(8)}@example.com",
        "password": TEST_USER["password"]
        # Missing full_name and phone
    }
    response = requests.post(f"{API_BASE_URL}/auth/register", json=missing_fields_data)
    print(f"POST /api/auth/register (missing fields) - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # 3. Login with non-existent user
    non_existent_user_data = {
        "email": f"nonexistent.{random_string(8)}@example.com",
        "password": "password123"
    }
    response = requests.post(f"{API_BASE_URL}/auth/login", json=non_existent_user_data)
    print(f"POST /api/auth/login (non-existent user) - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # 4. Update user with invalid token
    invalid_token_headers = {"Authorization": "Bearer invalid-token"}
    update_data = {
        "full_name": "Updated Name"
    }
    response = requests.put(f"{API_BASE_URL}/auth/me", headers=invalid_token_headers, json=update_data)
    print(f"PUT /api/auth/me (invalid token) - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test edge cases for cart API
    print("\n=== Cart API Edge Cases ===")
    
    # 1. Add non-existent product to cart
    add_data = {
        "product_id": "non-existent-id",
        "quantity": 1
    }
    response = requests.post(f"{API_BASE_URL}/cart/add", headers=get_auth_headers(), json=add_data)
    print(f"POST /api/cart/add (non-existent product) - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # 2. Add product with invalid quantity
    if TEST_PRODUCT_ID:
        add_data = {
            "product_id": TEST_PRODUCT_ID,
            "quantity": -1
        }
        response = requests.post(f"{API_BASE_URL}/cart/add", headers=get_auth_headers(), json=add_data)
        print(f"POST /api/cart/add (invalid quantity) - Status: {response.status_code}")
        print(f"Response: {response.json()}")
    
    # 3. Update non-existent cart item
    update_data = {
        "quantity": 5
    }
    response = requests.put(f"{API_BASE_URL}/cart/item/non-existent-id", headers=get_auth_headers(), json=update_data)
    print(f"PUT /api/cart/item/non-existent-id - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # 4. Delete non-existent cart item
    response = requests.delete(f"{API_BASE_URL}/cart/item/non-existent-id", headers=get_auth_headers())
    print(f"DELETE /api/cart/item/non-existent-id - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test edge cases for order API
    print("\n=== Order API Edge Cases ===")
    
    # 1. Create order with empty items
    order_data = {
        "items": [],
        "payment_method": "cod",
        "customer_info": {
            "full_name": TEST_USER["full_name"],
            "email": TEST_USER["email"],
            "phone": TEST_USER["phone"]
        },
        "shipping_address": {
            "address": "123 Đường Lê Lợi",
            "city": "Hồ Chí Minh",
            "district": "Quận 1",
            "ward": "Phường Bến Nghé",
            "zip_code": "70000"
        }
    }
    response = requests.post(f"{API_BASE_URL}/orders", headers=get_auth_headers(), json=order_data)
    print(f"POST /api/orders (empty items) - Status: {response.status_code}")
    if response.status_code < 300:
        print(f"Response: Order created with ID {response.json().get('id')}")
    else:
        print(f"Response: {response.json()}")
    
    # 2. Create order with invalid payment method
    if TEST_PRODUCT_ID:
        # First add a product to cart
        add_data = {
            "product_id": TEST_PRODUCT_ID,
            "quantity": 1
        }
        requests.post(f"{API_BASE_URL}/cart/add", headers=get_auth_headers(), json=add_data)
        
        # Get cart items
        cart_response = requests.get(f"{API_BASE_URL}/cart", headers=get_auth_headers())
        if cart_response.status_code == 200 and cart_response.json().get("items"):
            cart_items = cart_response.json()["items"]
            
            # Create order with invalid payment method
            order_data = {
                "items": cart_items,
                "payment_method": "invalid_method",
                "customer_info": {
                    "full_name": TEST_USER["full_name"],
                    "email": TEST_USER["email"],
                    "phone": TEST_USER["phone"]
                },
                "shipping_address": {
                    "address": "123 Đường Lê Lợi",
                    "city": "Hồ Chí Minh",
                    "district": "Quận 1",
                    "ward": "Phường Bến Nghé",
                    "zip_code": "70000"
                }
            }
            response = requests.post(f"{API_BASE_URL}/orders", headers=get_auth_headers(), json=order_data)
            print(f"POST /api/orders (invalid payment method) - Status: {response.status_code}")
            print(f"Response: {response.json()}")
    
    # 3. Get non-existent order
    response = requests.get(f"{API_BASE_URL}/orders/non-existent-id", headers=get_auth_headers())
    print(f"GET /api/orders/non-existent-id - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test edge cases for contact API
    print("\n=== Contact API Edge Cases ===")
    
    # 1. Submit contact form with invalid email
    contact_data = {
        "full_name": "Nguyễn Văn A",
        "email": "invalid-email",
        "phone": "0987654321",
        "subject": "Yêu cầu thông tin sản phẩm",
        "message": "Tôi muốn biết thêm thông tin về sản phẩm Vòng Trầm Hương Cao Cấp. Cảm ơn!"
    }
    response = requests.post(f"{API_BASE_URL}/contact", json=contact_data)
    print(f"POST /api/contact (invalid email) - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # 2. Submit contact form with missing required fields
    contact_data = {
        "full_name": "Nguyễn Văn A",
        "email": "contact@example.com"
        # Missing phone, subject, message
    }
    response = requests.post(f"{API_BASE_URL}/contact", json=contact_data)
    print(f"POST /api/contact (missing fields) - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    print("\n======= EDGE CASE TESTING COMPLETED =======")

if __name__ == "__main__":
    test_edge_cases()