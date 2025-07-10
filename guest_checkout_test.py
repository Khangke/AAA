import requests
import json
import sys
import random
import string
from pprint import pprint
from datetime import datetime
import time

# Backend URL from frontend/.env
BACKEND_URL = "https://2d965f2c-5f3c-404f-b87f-de65d4bd309b.preview.emergentagent.com"
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

# Helper function to make requests with retry logic
def make_request(method, url, **kwargs):
    """Make a request with retry logic for timeouts"""
    max_retries = 3
    timeout = 30  # seconds
    
    # Add timeout to kwargs if not already present
    if 'timeout' not in kwargs:
        kwargs['timeout'] = timeout
    
    for attempt in range(max_retries):
        try:
            response = requests.request(method, url, **kwargs)
            return response
        except requests.exceptions.Timeout:
            print(f"Request timed out (attempt {attempt+1}/{max_retries})")
            if attempt == max_retries - 1:  # Last attempt
                raise
            time.sleep(2)  # Wait before retrying
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            if attempt == max_retries - 1:  # Last attempt
                raise
            time.sleep(2)  # Wait before retrying

def test_seed_products():
    """Test POST /api/products/seed endpoint"""
    print("\n=== Testing POST /api/products/seed ===")
    
    url = f"{API_BASE_URL}/products/seed"
    response = make_request("POST", url)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    assert "message" in response.json(), "Response should contain 'message' field"
    
    return response.json()

def test_get_products():
    """Test GET /api/products endpoint"""
    print("\n=== Testing GET /api/products ===")
    
    url = f"{API_BASE_URL}/products"
    response = make_request("GET", url)
    
    print(f"Status Code: {response.status_code}")
    print(f"Total Products: {len(response.json())}")
    
    if response.json():
        print("Sample Product:")
        pprint(response.json()[0])
        
        # Store a product ID for later tests
        global TEST_PRODUCT_ID
        TEST_PRODUCT_ID = response.json()[0]["id"]
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert isinstance(response.json(), list), "Response should be a list of products"
    
    if response.json():
        product = response.json()[0]
        required_fields = ["id", "name", "description", "price", "category", "image_url", "featured"]
        for field in required_fields:
            assert field in product, f"Product should contain '{field}' field"
    
    return response.json()

def test_user_registration():
    """Test POST /api/auth/register endpoint"""
    print("\n=== Testing POST /api/auth/register ===")
    
    url = f"{API_BASE_URL}/auth/register"
    data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"],
        "phone": TEST_USER["phone"]
    }
    
    response = make_request("POST", url, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    assert "access_token" in response.json(), "Response should contain 'access_token' field"
    assert "token_type" in response.json(), "Response should contain 'token_type' field"
    assert response.json()["token_type"] == "bearer", "Token type should be 'bearer'"
    
    # Store the access token for subsequent tests
    global ACCESS_TOKEN
    ACCESS_TOKEN = response.json()["access_token"]
    
    return response.json()

def test_guest_order_creation():
    """Test creating an order as a guest (without authentication)"""
    print("\n=== Testing Guest Order Creation ===")
    
    # Create sample cart items directly
    cart_items = [
        {
            "product_id": TEST_PRODUCT_ID,
            "quantity": 2,
            "price": 2200000,  # Use price from a known product
            "name": "Vòng Trầm Hương Cao Cấp",  # Use name from a known product
            "image_url": "https://images.unsplash.com/photo-1662473217799-6e7288f19741"
        }
    ]
    
    # Create the order
    url = f"{API_BASE_URL}/orders"
    data = {
        "items": cart_items,
        "payment_method": "cod",
        "customer_info": {
            "full_name": "Khách Hàng",
            "email": "guest@example.com",
            "phone": "0987654321"
        },
        "shipping_address": {
            "address": "123 Đường Lê Lợi",
            "city": "Hồ Chí Minh",
            "district": "Quận 1",
            "ward": "Phường Bến Nghé",
            "zip_code": "70000"
        },
        "notes": "Đơn hàng khách không đăng nhập"
    }
    
    # Try to create order without authentication
    response = make_request("POST", url, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    # The API should now accept guest orders with verify_token_optional
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    
    # Verify all fields required by OrderSuccessPage
    order_data = response.json()
    
    # Required fields for OrderSuccessPage
    required_fields = [
        "id",
        "created_at",
        "total_amount",  # total
        "payment_method",
        "customer_info",  # or user
        "items",
        "subtotal",
        "shipping_fee"
    ]
    
    for field in required_fields:
        assert field in order_data, f"Order should contain '{field}' field for OrderSuccessPage"
    
    # Verify shipping fee is 30,000 VND
    assert order_data["shipping_fee"] == 30000, "Shipping fee should be 30,000 VND"
    
    # Verify user_id is None for guest orders
    assert order_data["user_id"] is None, "Guest order should have user_id set to None"
    
    return order_data

def test_authenticated_order_creation():
    """Test creating an order as an authenticated user"""
    print("\n=== Testing Authenticated Order Creation ===")
    
    # Create sample cart items directly
    cart_items = [
        {
            "product_id": TEST_PRODUCT_ID,
            "quantity": 2,
            "price": 2200000,
            "name": "Vòng Trầm Hương Cao Cấp",
            "image_url": "https://images.unsplash.com/photo-1662473217799-6e7288f19741"
        }
    ]
    
    # Create the order
    url = f"{API_BASE_URL}/orders"
    headers = get_auth_headers()
    data = {
        "items": cart_items,
        "payment_method": "cod",
        "customer_info": {
            "full_name": TEST_USER["full_name"],
            "email": TEST_USER["email"],
            "phone": TEST_USER["phone"]
        },
        "shipping_address": {
            "address": "456 Đường Nguyễn Huệ",
            "city": "Hồ Chí Minh",
            "district": "Quận 1",
            "ward": "Phường Bến Nghé",
            "zip_code": "70000"
        },
        "notes": "Đơn hàng có xác thực"
    }
    
    response = make_request("POST", url, headers=headers, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    
    # Verify all fields required by OrderSuccessPage
    order_data = response.json()
    
    # Required fields for OrderSuccessPage
    required_fields = [
        "id",
        "created_at",
        "total_amount",
        "payment_method",
        "customer_info",
        "items",
        "subtotal",
        "shipping_fee"
    ]
    
    for field in required_fields:
        assert field in order_data, f"Order should contain '{field}' field for OrderSuccessPage"
    
    # Verify shipping fee is 30,000 VND
    assert order_data["shipping_fee"] == 30000, "Shipping fee should be 30,000 VND"
    
    # Verify user_id is set for authenticated orders
    assert order_data["user_id"] is not None, "Authenticated order should have user_id set"
    
    return order_data

def test_compare_guest_and_authenticated_orders():
    """Test and compare order structures between guest and authenticated orders"""
    print("\n=== Testing and Comparing Guest vs Authenticated Orders ===")
    
    # 1. Create an authenticated order
    auth_order = test_authenticated_order_creation()
    
    # 2. Create a guest order
    guest_order = test_guest_order_creation()
    
    # 3. Compare the responses
    print("\nComparing order structures:")
    
    # 4. Verify both have the same structure
    required_fields = [
        "id", "order_number", "items", "subtotal", "shipping_fee", 
        "total_amount", "payment_method", "status", "customer_info", 
        "shipping_address", "created_at", "updated_at", "notes"
    ]
    
    for field in required_fields:
        assert field in auth_order, f"Authenticated order missing '{field}' field"
        assert field in guest_order, f"Guest order missing '{field}' field"
        print(f"Field '{field}' present in both orders ✓")
    
    # 5. Verify user_id differences
    assert auth_order["user_id"] is not None, "Authenticated order should have user_id set"
    assert guest_order["user_id"] is None, "Guest order should have user_id set to None"
    print("user_id correctly set in both orders ✓")
    
    # 6. Verify item structure is identical
    auth_item = auth_order["items"][0]
    guest_item = guest_order["items"][0]
    
    item_fields = ["product_id", "quantity", "price", "name", "image_url", "subtotal"]
    for field in item_fields:
        assert field in auth_item, f"Authenticated order item missing '{field}' field"
        assert field in guest_item, f"Guest order item missing '{field}' field"
    
    print("Item structure identical in both orders ✓")
    
    return {
        "authenticated_order": auth_order,
        "guest_order": guest_order
    }

def run_tests():
    """Run the tests for guest checkout functionality"""
    print("\n======= TESTING GUEST CHECKOUT FUNCTIONALITY =======\n")
    
    try:
        # First seed the products
        seed_result = test_seed_products()
        
        # Get products to have a product ID for testing
        products = test_get_products()
        
        # Register a user for authenticated order testing
        user_registration = test_user_registration()
        
        # Test guest order creation
        guest_order = test_guest_order_creation()
        print("Guest checkout is supported! ✓")
        
        # Test authenticated order creation
        auth_order = test_authenticated_order_creation()
        print("Authenticated checkout is working! ✓")
        
        # Compare guest and authenticated orders
        comparison = test_compare_guest_and_authenticated_orders()
        print("\nGuest and authenticated orders have the same structure! ✓")
        
        print("\n======= ALL TESTS PASSED SUCCESSFULLY =======")
        
        # Print summary
        print("\n=== TEST SUMMARY ===")
        print(f"Guest Checkout: Supported (user_id=None)")
        print(f"Authenticated Checkout: Working (user_id={comparison['authenticated_order']['user_id']})")
        print(f"Order Structure: Identical between guest and authenticated orders")
        print(f"Required Fields: All present for OrderSuccessPage")
        
        return True
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        return False
    except Exception as e:
        print(f"\n❌ ERROR DURING TESTING: {e}")
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)