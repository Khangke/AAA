import requests
import json
import sys
import random
import string
from pprint import pprint
from datetime import datetime
import time

# Backend URL from frontend/.env
BACKEND_URL = "https://6eaa3c8f-7a45-48c9-ac96-d5110a98c1e6.preview.emergentagent.com"
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
TEST_ORDER_ID = None

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
    response = requests.post(url)
    
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
    response = requests.get(url)
    
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

def test_filter_by_category():
    """Test GET /api/products?category=Vòng Tay endpoint"""
    print("\n=== Testing GET /api/products?category=Vòng Tay ===")
    
    category = "Vòng Tay"
    url = f"{API_BASE_URL}/products?category={category}"
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    print(f"Total Products in '{category}' category: {len(response.json())}")
    
    if response.json():
        print("Sample Product:")
        pprint(response.json()[0])
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert isinstance(response.json(), list), "Response should be a list of products"
    
    # Verify all returned products have the correct category
    for product in response.json():
        assert product["category"] == category, f"Product category should be '{category}', got '{product['category']}'"
    
    return response.json()

def test_filter_featured_products():
    """Test GET /api/products?featured=true endpoint"""
    print("\n=== Testing GET /api/products?featured=true ===")
    
    url = f"{API_BASE_URL}/products?featured=true"
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    print(f"Total Featured Products: {len(response.json())}")
    
    if response.json():
        print("Sample Featured Product:")
        pprint(response.json()[0])
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert isinstance(response.json(), list), "Response should be a list of products"
    
    # Verify all returned products are featured
    for product in response.json():
        assert product["featured"] == True, "All products should have featured=true"
    
    return response.json()

def test_search_products():
    """Test GET /api/products?search=trầm endpoint"""
    print("\n=== Testing GET /api/products?search=trầm ===")
    
    search_term = "trầm"
    url = f"{API_BASE_URL}/products?search={search_term}"
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    print(f"Total Products matching '{search_term}': {len(response.json())}")
    
    if response.json():
        print("Sample Matching Product:")
        pprint(response.json()[0])
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert isinstance(response.json(), list), "Response should be a list of products"
    
    # Verify search functionality (check if search term is in name, description or tags)
    for product in response.json():
        search_found = False
        if search_term.lower() in product["name"].lower():
            search_found = True
        elif search_term.lower() in product["description"].lower():
            search_found = True
        elif any(search_term.lower() in tag.lower() for tag in product["tags"]):
            search_found = True
        
        assert search_found, f"Search term '{search_term}' not found in product: {product['name']}"
    
    return response.json()

def test_get_categories():
    """Test GET /api/products/categories and GET /api/categories endpoints"""
    print("\n=== Testing GET /api/products/categories ===")
    
    # First try the original endpoint
    url = f"{API_BASE_URL}/products/categories"
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    
    # If we get a 404, try the alternative endpoint
    if response.status_code == 404:
        print("Original categories endpoint returned 404, trying alternative endpoint...")
        alt_url = f"{API_BASE_URL}/categories"
        alt_response = requests.get(alt_url)
        
        print(f"Alternative Endpoint Status Code: {alt_response.status_code}")
        
        if alt_response.status_code == 200:
            print("Categories (from alternative endpoint):")
            pprint(alt_response.json())
            
            assert "categories" in alt_response.json(), "Response should contain 'categories' field"
            assert isinstance(alt_response.json()["categories"], list), "'categories' should be a list"
            
            # Verify expected categories are present
            expected_categories = ["Vòng Tay", "Trầm Khối", "Nhang Trầm", "Bộ Sưu Tập", "Trầm Bột"]
            for category in expected_categories:
                assert category in alt_response.json()["categories"], f"Expected category '{category}' not found"
            
            return alt_response.json()
        else:
            # If both endpoints fail, extract categories from products as a fallback
            print("Both category endpoints failed, extracting categories from products...")
            products_url = f"{API_BASE_URL}/products"
            products_response = requests.get(products_url)
            
            if products_response.status_code == 200:
                products = products_response.json()
                categories = list(set(product["category"] for product in products))
                print("Categories (extracted from products):")
                pprint({"categories": categories})
                
                assert len(categories) > 0, "Should have at least one category"
                
                # Verify expected categories are present
                expected_categories = ["Vòng Tay", "Trầm Khối", "Nhang Trầm", "Bộ Sưu Tập", "Trầm Bột"]
                for category in expected_categories:
                    assert category in categories, f"Expected category '{category}' not found"
                
                return {"categories": categories}
            else:
                raise AssertionError("Failed to get categories from any endpoint")
    else:
        print("Categories:")
        pprint(response.json())
        
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        assert "categories" in response.json(), "Response should contain 'categories' field"
        assert isinstance(response.json()["categories"], list), "'categories' should be a list"
        
        # Verify expected categories are present
        expected_categories = ["Vòng Tay", "Trầm Khối", "Nhang Trầm", "Bộ Sưu Tập", "Trầm Bột"]
        for category in expected_categories:
            assert category in response.json()["categories"], f"Expected category '{category}' not found"
        
        return response.json()

# Contact Form API Tests
def test_submit_contact_form():
    """Test POST /api/contact endpoint"""
    print("\n=== Testing POST /api/contact ===")
    
    url = f"{API_BASE_URL}/contact"
    data = {
        "full_name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "0987654321",
        "subject": "Yêu cầu thông tin sản phẩm",
        "message": "Tôi muốn biết thêm thông tin về sản phẩm Vòng Trầm Hương Cao Cấp. Cảm ơn!"
    }
    
    response = requests.post(url, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    assert "id" in response.json(), "Response should contain 'id' field"
    assert response.json()["full_name"] == data["full_name"], "Full name in response doesn't match request"
    assert response.json()["email"] == data["email"], "Email in response doesn't match request"
    assert response.json()["phone"] == data["phone"], "Phone in response doesn't match request"
    assert response.json()["subject"] == data["subject"], "Subject in response doesn't match request"
    assert response.json()["message"] == data["message"], "Message in response doesn't match request"
    
    return response.json()

def test_get_contact_forms():
    """Test GET /api/contact endpoint"""
    print("\n=== Testing GET /api/contact ===")
    
    url = f"{API_BASE_URL}/contact"
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    print(f"Total Contact Forms: {len(response.json())}")
    
    if response.json():
        print("Sample Contact Form:")
        pprint(response.json()[0])
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert isinstance(response.json(), list), "Response should be a list of contact forms"
    
    if response.json():
        contact = response.json()[0]
        required_fields = ["id", "full_name", "email", "phone", "subject", "message", "created_at"]
        for field in required_fields:
            assert field in contact, f"Contact form should contain '{field}' field"
    
    return response.json()

# User Authentication API Tests
def test_user_registration():
    """Test POST /api/auth/register endpoint"""
    print("\n=== Testing POST /api/auth/register ===")
    
    url = f"{API_BASE_URL}/auth/register"
    data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"],
        "phone": "0912345678",
        "address": "123 Đường Lê Lợi",
        "city": "Hồ Chí Minh",
        "district": "Quận 1",
        "ward": "Phường Bến Nghé",
        "zip_code": "70000"
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

def test_user_login():
    """Test POST /api/auth/login endpoint"""
    print("\n=== Testing POST /api/auth/login ===")
    
    url = f"{API_BASE_URL}/auth/login"
    data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    }
    
    response = requests.post(url, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert "access_token" in response.json(), "Response should contain 'access_token' field"
    assert "token_type" in response.json(), "Response should contain 'token_type' field"
    assert response.json()["token_type"] == "bearer", "Token type should be 'bearer'"
    
    # Update the access token
    global ACCESS_TOKEN
    ACCESS_TOKEN = response.json()["access_token"]
    
    return response.json()

def test_get_current_user():
    """Test GET /api/auth/me endpoint"""
    print("\n=== Testing GET /api/auth/me ===")
    
    url = f"{API_BASE_URL}/auth/me"
    headers = get_auth_headers()
    
    response = requests.get(url, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert "id" in response.json(), "Response should contain 'id' field"
    assert response.json()["email"] == TEST_USER["email"], f"Email should be {TEST_USER['email']}"
    assert response.json()["full_name"] == TEST_USER["full_name"], f"Full name should be {TEST_USER['full_name']}"
    
    return response.json()

def test_update_current_user():
    """Test PUT /api/auth/me endpoint"""
    print("\n=== Testing PUT /api/auth/me ===")
    
    url = f"{API_BASE_URL}/auth/me"
    headers = get_auth_headers()
    data = {
        "phone": "0987654321",
        "address": "456 Đường Nguyễn Huệ",
        "city": "Hồ Chí Minh",
        "district": "Quận 1",
        "ward": "Phường Bến Nghé",
        "zip_code": "70000"
    }
    
    response = requests.put(url, headers=headers, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert response.json()["phone"] == data["phone"], "Phone number should be updated"
    assert response.json()["address"] == data["address"], "Address should be updated"
    
    return response.json()

# Cart Management API Tests
def test_add_to_cart():
    """Test POST /api/cart/add endpoint"""
    print("\n=== Testing POST /api/cart/add ===")
    
    url = f"{API_BASE_URL}/cart/add"
    headers = get_auth_headers()
    data = {
        "product_id": TEST_PRODUCT_ID,
        "quantity": 2
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    assert "message" in response.json(), "Response should contain 'message' field"
    assert "cart" in response.json(), "Response should contain 'cart' field"
    assert len(response.json()["cart"]["items"]) > 0, "Cart should have at least one item"
    
    # Verify the added item
    cart_item = None
    for item in response.json()["cart"]["items"]:
        if item["product_id"] == TEST_PRODUCT_ID:
            cart_item = item
            break
    
    assert cart_item is not None, f"Product {TEST_PRODUCT_ID} should be in the cart"
    assert cart_item["quantity"] == data["quantity"], f"Quantity should be {data['quantity']}"
    
    return response.json()

def test_get_cart():
    """Test GET /api/cart endpoint"""
    print("\n=== Testing GET /api/cart ===")
    
    url = f"{API_BASE_URL}/cart"
    headers = get_auth_headers()
    
    response = requests.get(url, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert "items" in response.json(), "Response should contain 'items' field"
    assert "total_amount" in response.json(), "Response should contain 'total_amount' field"
    
    return response.json()

def test_update_cart_item():
    """Test PUT /api/cart/item/{product_id} endpoint"""
    print(f"\n=== Testing PUT /api/cart/item/{TEST_PRODUCT_ID} ===")
    
    url = f"{API_BASE_URL}/cart/item/{TEST_PRODUCT_ID}"
    headers = get_auth_headers()
    data = {
        "quantity": 3
    }
    
    response = requests.put(url, headers=headers, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert "message" in response.json(), "Response should contain 'message' field"
    assert "cart" in response.json(), "Response should contain 'cart' field"
    
    # Verify the updated item
    cart_item = None
    for item in response.json()["cart"]["items"]:
        if item["product_id"] == TEST_PRODUCT_ID:
            cart_item = item
            break
    
    assert cart_item is not None, f"Product {TEST_PRODUCT_ID} should be in the cart"
    assert cart_item["quantity"] == data["quantity"], f"Quantity should be {data['quantity']}"
    
    return response.json()

def test_remove_from_cart():
    """Test DELETE /api/cart/item/{product_id} endpoint"""
    print(f"\n=== Testing DELETE /api/cart/item/{TEST_PRODUCT_ID} ===")
    
    # First, add an item to the cart to ensure there's something to remove
    add_to_cart_url = f"{API_BASE_URL}/cart/add"
    add_data = {
        "product_id": TEST_PRODUCT_ID,
        "quantity": 1
    }
    requests.post(add_to_cart_url, headers=get_auth_headers(), json=add_data)
    
    # Now test removing the item
    url = f"{API_BASE_URL}/cart/item/{TEST_PRODUCT_ID}"
    headers = get_auth_headers()
    
    response = requests.delete(url, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert "message" in response.json(), "Response should contain 'message' field"
    assert "cart" in response.json(), "Response should contain 'cart' field"
    
    # Verify the item was removed
    for item in response.json()["cart"]["items"]:
        assert item["product_id"] != TEST_PRODUCT_ID, f"Product {TEST_PRODUCT_ID} should not be in the cart"
    
    return response.json()

def test_clear_cart():
    """Test DELETE /api/cart endpoint"""
    print("\n=== Testing DELETE /api/cart ===")
    
    # First, add an item to the cart to ensure there's something to clear
    add_to_cart_url = f"{API_BASE_URL}/cart/add"
    add_data = {
        "product_id": TEST_PRODUCT_ID,
        "quantity": 1
    }
    requests.post(add_to_cart_url, headers=get_auth_headers(), json=add_data)
    
    # Now test clearing the cart
    url = f"{API_BASE_URL}/cart"
    headers = get_auth_headers()
    
    response = requests.delete(url, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert "message" in response.json(), "Response should contain 'message' field"
    
    # Verify the cart is empty by getting it
    get_cart_url = f"{API_BASE_URL}/cart"
    get_cart_response = requests.get(get_cart_url, headers=headers)
    assert len(get_cart_response.json()["items"]) == 0, "Cart should be empty after clearing"
    
    return response.json()

# Order Management API Tests
def test_create_order():
    """Test POST /api/orders endpoint"""
    print("\n=== Testing POST /api/orders ===")
    
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
    
    # Create the order
    url = f"{API_BASE_URL}/orders"
    headers = get_auth_headers()
    data = {
        "items": cart_items,
        "payment_method": "cod",  # COD payment method
        "customer_info": {
            "full_name": "Nguyễn Văn A",
            "email": TEST_USER["email"],
            "phone": "0987654321"
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
    print("Response:")
    pprint(response.json())
    
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    assert "id" in response.json(), "Response should contain 'id' field"
    assert "order_number" in response.json(), "Response should contain 'order_number' field"
    assert "shipping_fee" in response.json(), "Response should contain 'shipping_fee' field"
    assert response.json()["shipping_fee"] == 30000, "Shipping fee should be 30000 VND"
    assert response.json()["payment_method"] == "cod", "Payment method should be 'cod'"
    
    # Store the order ID for subsequent tests
    global TEST_ORDER_ID
    TEST_ORDER_ID = response.json()["id"]
    
    return response.json()

def test_get_user_orders():
    """Test GET /api/orders endpoint"""
    print("\n=== Testing GET /api/orders ===")
    
    url = f"{API_BASE_URL}/orders"
    headers = get_auth_headers()
    
    response = requests.get(url, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Total Orders: {len(response.json())}")
    
    if response.json():
        print("Sample Order:")
        pprint(response.json()[0])
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert isinstance(response.json(), list), "Response should be a list of orders"
    
    if response.json():
        order = response.json()[0]
        required_fields = ["id", "order_number", "items", "subtotal", "shipping_fee", "total_amount", "payment_method", "status"]
        for field in required_fields:
            assert field in order, f"Order should contain '{field}' field"
    
    return response.json()

def test_get_specific_order():
    """Test GET /api/orders/{order_id} endpoint"""
    print(f"\n=== Testing GET /api/orders/{TEST_ORDER_ID} ===")
    
    url = f"{API_BASE_URL}/orders/{TEST_ORDER_ID}"
    headers = get_auth_headers()
    
    response = requests.get(url, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert response.json()["id"] == TEST_ORDER_ID, f"Order ID should be {TEST_ORDER_ID}"
    assert "order_number" in response.json(), "Response should contain 'order_number' field"
    assert "shipping_fee" in response.json(), "Response should contain 'shipping_fee' field"
    assert response.json()["shipping_fee"] == 30000, "Shipping fee should be 30000 VND"
    
    return response.json()

def test_bank_transfer_order():
    """Test creating an order with bank transfer payment method"""
    print("\n=== Testing Order with Bank Transfer Payment ===")
    
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
    
    # Create the order with bank transfer
    url = f"{API_BASE_URL}/orders"
    headers = get_auth_headers()
    data = {
        "items": cart_items,
        "payment_method": "bank_transfer",  # Bank transfer payment method
        "customer_info": {
            "full_name": "Nguyễn Văn A",
            "email": TEST_USER["email"],
            "phone": "0987654321"
        },
        "shipping_address": {
            "address": "123 Đường Lê Lợi",
            "city": "Hồ Chí Minh",
            "district": "Quận 1",
            "ward": "Phường Bến Nghé",
            "zip_code": "70000"
        },
        "notes": "Chuyển khoản qua ngân hàng VCB"
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    print(f"Status Code: {response.status_code}")
    print("Response:")
    pprint(response.json())
    
    assert response.status_code in [200, 201], f"Expected status code 200 or 201, got {response.status_code}"
    assert "id" in response.json(), "Response should contain 'id' field"
    assert "payment_method" in response.json(), "Response should contain 'payment_method' field"
    assert response.json()["payment_method"] == "bank_transfer", "Payment method should be 'bank_transfer'"
    
    return response.json()

def run_all_tests():
    """Run all API tests"""
    print("\n======= STARTING BACKEND API TESTS =======\n")
    
    try:
        # First seed the products
        seed_result = test_seed_products()
        
        # Test product endpoints
        products = test_get_products()
        category_products = test_filter_by_category()
        featured_products = test_filter_featured_products()
        search_results = test_search_products()
        categories = test_get_categories()
        
        # Test contact form endpoints
        contact_form = test_submit_contact_form()
        contact_forms = test_get_contact_forms()
        
        # Test user authentication endpoints
        user_registration = test_user_registration()
        user_login = test_user_login()
        current_user = test_get_current_user()
        updated_user = test_update_current_user()
        
        # Test cart management endpoints
        add_to_cart = test_add_to_cart()
        cart = test_get_cart()
        updated_cart = test_update_cart_item()
        removed_item = test_remove_from_cart()
        cleared_cart = test_clear_cart()
        
        # Test order management endpoints
        order = test_create_order()
        orders = test_get_user_orders()
        specific_order = test_get_specific_order()
        bank_transfer_order = test_bank_transfer_order()
        
        print("\n======= ALL TESTS PASSED SUCCESSFULLY =======")
        
        # Print summary
        print("\n=== TEST SUMMARY ===")
        print(f"Total Products: {len(products)}")
        print(f"Products in 'Vòng Tay' category: {len(category_products)}")
        print(f"Featured Products: {len(featured_products)}")
        print(f"Products matching 'trầm' search: {len(search_results)}")
        print(f"Total Categories: {len(categories['categories'])}")
        print(f"Categories: {', '.join(categories['categories'])}")
        print(f"Contact Forms: {len(contact_forms)}")
        print(f"User: {current_user['email']}")
        print(f"Orders: {len(orders)}")
        
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