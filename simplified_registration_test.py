import requests
import json
import sys
import random
import string
from pprint import pprint
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://32677e99-6a93-465b-862c-73ecc5e745f7.preview.emergentagent.com"
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

def test_get_product_for_testing():
    """Get a product ID for testing orders"""
    print("\n=== Getting a product for testing ===")
    
    url = f"{API_BASE_URL}/products"
    response = requests.get(url)
    
    if response.status_code == 200 and len(response.json()) > 0:
        global TEST_PRODUCT_ID
        TEST_PRODUCT_ID = response.json()[0]["id"]
        print(f"Using product ID: {TEST_PRODUCT_ID}")
        return TEST_PRODUCT_ID
    else:
        raise Exception("Failed to get a product for testing")

def test_simplified_registration():
    """Test POST /api/auth/register with simplified fields"""
    print("\n=== Testing POST /api/auth/register with simplified fields ===")
    
    url = f"{API_BASE_URL}/auth/register"
    data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"],
        "phone": TEST_USER["phone"]
    }
    
    response = requests.post(url, json=data)
    
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

def test_registration_validation():
    """Test validation for required fields in registration"""
    print("\n=== Testing validation for required fields in registration ===")
    
    url = f"{API_BASE_URL}/auth/register"
    
    # Test missing email
    data = {
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"],
        "phone": TEST_USER["phone"]
    }
    response = requests.post(url, json=data)
    print(f"Missing email - Status Code: {response.status_code}")
    assert response.status_code == 422, f"Expected status code 422 for missing email, got {response.status_code}"
    
    # Test missing password
    data = {
        "email": f"missing.password.{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com",
        "full_name": TEST_USER["full_name"],
        "phone": TEST_USER["phone"]
    }
    response = requests.post(url, json=data)
    print(f"Missing password - Status Code: {response.status_code}")
    assert response.status_code == 422, f"Expected status code 422 for missing password, got {response.status_code}"
    
    # Test missing full_name
    data = {
        "email": f"missing.name.{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com",
        "password": TEST_USER["password"],
        "phone": TEST_USER["phone"]
    }
    response = requests.post(url, json=data)
    print(f"Missing full_name - Status Code: {response.status_code}")
    assert response.status_code == 422, f"Expected status code 422 for missing full_name, got {response.status_code}"
    
    # Test missing phone
    data = {
        "email": f"missing.phone.{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com",
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"]
    }
    response = requests.post(url, json=data)
    print(f"Missing phone - Status Code: {response.status_code}")
    assert response.status_code == 422, f"Expected status code 422 for missing phone, got {response.status_code}"
    
    print("All validation tests passed")
    return True

def test_get_user_profile_before_order():
    """Test GET /api/auth/me to check user profile before order"""
    print("\n=== Testing GET /api/auth/me before order ===")
    
    url = f"{API_BASE_URL}/auth/me"
    headers = get_auth_headers()
    
    response = requests.get(url, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print("User Profile Before Order:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert response.json()["email"] == TEST_USER["email"], f"Email should be {TEST_USER['email']}"
    assert response.json()["full_name"] == TEST_USER["full_name"], f"Full name should be {TEST_USER['full_name']}"
    assert response.json()["phone"] == TEST_USER["phone"], f"Phone should be {TEST_USER['phone']}"
    
    # Verify address fields are empty
    assert response.json()["address"] == "", "Address should be empty"
    assert response.json()["city"] == "", "City should be empty"
    assert response.json()["district"] == "", "District should be empty"
    assert response.json()["ward"] == "", "Ward should be empty"
    assert response.json()["zip_code"] == "", "Zip code should be empty"
    
    return response.json()

def test_create_order_with_address():
    """Test POST /api/orders with address information"""
    print("\n=== Testing POST /api/orders with address information ===")
    
    # First, add an item to the cart
    add_to_cart_url = f"{API_BASE_URL}/cart/add"
    add_data = {
        "product_id": TEST_PRODUCT_ID,
        "quantity": 2
    }
    requests.post(add_to_cart_url, headers=get_auth_headers(), json=add_data)
    
    # Get the cart to use its items for the order
    get_cart_url = f"{API_BASE_URL}/cart"
    cart_response = requests.get(get_cart_url, headers=get_auth_headers())
    cart_items = cart_response.json()["items"]
    
    # Create the order with address information
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
            "address": "123 Đường Lê Lợi",
            "city": "Hồ Chí Minh",
            "district": "Quận 1",
            "ward": "Phường Bến Nghé",
            "zip_code": "70000"
        },
        "notes": "Giao hàng trong giờ hành chính"
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Order Response:")
    pprint(response.json())
    
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    assert "id" in response.json(), "Response should contain 'id' field"
    assert "shipping_address" in response.json(), "Response should contain 'shipping_address' field"
    assert response.json()["shipping_address"]["address"] == data["shipping_address"]["address"], "Address should match"
    assert response.json()["shipping_address"]["city"] == data["shipping_address"]["city"], "City should match"
    
    return response.json()

def test_get_user_profile_after_order():
    """Test GET /api/auth/me to check if address was saved from order"""
    print("\n=== Testing GET /api/auth/me after order ===")
    
    url = f"{API_BASE_URL}/auth/me"
    headers = get_auth_headers()
    
    response = requests.get(url, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print("User Profile After Order:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    # Verify address fields are now populated from the order
    assert response.json()["address"] == "123 Đường Lê Lợi", "Address should be saved from order"
    assert response.json()["city"] == "Hồ Chí Minh", "City should be saved from order"
    assert response.json()["district"] == "Quận 1", "District should be saved from order"
    assert response.json()["ward"] == "Phường Bến Nghé", "Ward should be saved from order"
    assert response.json()["zip_code"] == "70000", "Zip code should be saved from order"
    
    return response.json()

def test_create_second_order_with_different_address():
    """Test that second order doesn't overwrite existing address"""
    print("\n=== Testing second order with different address ===")
    
    # First, add an item to the cart
    add_to_cart_url = f"{API_BASE_URL}/cart/add"
    add_data = {
        "product_id": TEST_PRODUCT_ID,
        "quantity": 1
    }
    requests.post(add_to_cart_url, headers=get_auth_headers(), json=add_data)
    
    # Get the cart to use its items for the order
    get_cart_url = f"{API_BASE_URL}/cart"
    cart_response = requests.get(get_cart_url, headers=get_auth_headers())
    cart_items = cart_response.json()["items"]
    
    # Create a second order with different address
    url = f"{API_BASE_URL}/orders"
    headers = get_auth_headers()
    data = {
        "items": cart_items,
        "payment_method": "bank_transfer",
        "customer_info": {
            "full_name": TEST_USER["full_name"],
            "email": TEST_USER["email"],
            "phone": TEST_USER["phone"]
        },
        "shipping_address": {
            "address": "456 Đường Nguyễn Huệ",
            "city": "Đà Nẵng",
            "district": "Quận Hải Châu",
            "ward": "Phường Thạch Thang",
            "zip_code": "50000"
        },
        "notes": "Đơn hàng thứ hai với địa chỉ khác"
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Second Order Response:")
    pprint(response.json())
    
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    
    return response.json()

def test_get_user_profile_after_second_order():
    """Test GET /api/auth/me to check if address was NOT overwritten by second order"""
    print("\n=== Testing GET /api/auth/me after second order ===")
    
    url = f"{API_BASE_URL}/auth/me"
    headers = get_auth_headers()
    
    response = requests.get(url, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print("User Profile After Second Order:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    # Verify address fields are still from the first order (not overwritten)
    assert response.json()["address"] == "123 Đường Lê Lợi", "Address should not be overwritten by second order"
    assert response.json()["city"] == "Hồ Chí Minh", "City should not be overwritten by second order"
    assert response.json()["district"] == "Quận 1", "District should not be overwritten by second order"
    assert response.json()["ward"] == "Phường Bến Nghé", "Ward should not be overwritten by second order"
    assert response.json()["zip_code"] == "70000", "Zip code should not be overwritten by second order"
    
    return response.json()

def run_all_tests():
    """Run all tests for simplified registration and order address auto-save"""
    print("\n======= STARTING SIMPLIFIED REGISTRATION AND ORDER ADDRESS AUTO-SAVE TESTS =======\n")
    
    try:
        # Get a product for testing
        test_get_product_for_testing()
        
        # Test simplified registration
        test_simplified_registration()
        test_registration_validation()
        
        # Test user profile before order
        user_before_order = test_get_user_profile_before_order()
        
        # Test order creation with address
        first_order = test_create_order_with_address()
        
        # Test user profile after order to verify address was saved
        user_after_order = test_get_user_profile_after_order()
        
        # Test second order with different address
        second_order = test_create_second_order_with_different_address()
        
        # Test user profile after second order to verify address was not overwritten
        user_after_second_order = test_get_user_profile_after_second_order()
        
        print("\n======= ALL TESTS PASSED SUCCESSFULLY =======")
        
        # Print summary
        print("\n=== TEST SUMMARY ===")
        print("1. Simplified Registration: ✅ PASSED")
        print("   - Registration with only 4 required fields works correctly")
        print("   - Validation for required fields works correctly")
        print("   - JWT token is returned correctly")
        print("2. Order Address Auto-Save: ✅ PASSED")
        print("   - User profile initially has no address information")
        print("   - Address from first order is automatically saved to user profile")
        print("   - Subsequent orders don't overwrite existing address information")
        
        return True
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        return False
    except Exception as e:
        print(f"\n❌ ERROR DURING TESTING: {e}")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)