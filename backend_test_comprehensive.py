import requests
import json
import sys
import random
import string
import time
import concurrent.futures
from pprint import pprint
from datetime import datetime
import statistics

# Backend URL from frontend/.env
BACKEND_URL = "https://ee142728-bb35-45ab-a75b-854409c5898e.preview.emergentagent.com"
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
            start_time = time.time()
            response = requests.request(method, url, **kwargs)
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            return response, response_time
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

# Performance testing function
def measure_api_performance(endpoint, method="GET", data=None, headers=None, params=None, num_requests=10):
    """Measure API performance by making multiple requests and calculating statistics"""
    url = f"{API_BASE_URL}/{endpoint}"
    response_times = []
    success_count = 0
    
    print(f"\n=== Performance Testing {method} {url} ===")
    print(f"Making {num_requests} requests...")
    
    for i in range(num_requests):
        try:
            start_time = time.time()
            if method == "GET":
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=10)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=data, timeout=10)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, timeout=10)
            
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            response_times.append(response_time)
            
            if response.status_code < 400:
                success_count += 1
                
            # Add a small delay between requests to avoid overwhelming the server
            time.sleep(0.1)
            
        except Exception as e:
            print(f"Request {i+1} failed: {e}")
    
    # Calculate statistics
    if response_times:
        avg_time = statistics.mean(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        median_time = statistics.median(response_times)
        success_rate = (success_count / num_requests) * 100
        
        print(f"Average response time: {avg_time:.2f} ms")
        print(f"Minimum response time: {min_time:.2f} ms")
        print(f"Maximum response time: {max_time:.2f} ms")
        print(f"Median response time: {median_time:.2f} ms")
        print(f"Success rate: {success_rate:.2f}%")
        
        return {
            "avg_time": avg_time,
            "min_time": min_time,
            "max_time": max_time,
            "median_time": median_time,
            "success_rate": success_rate
        }
    else:
        print("No successful responses to measure performance")
        return None

# Load testing function
def load_test_api(endpoint, method="GET", data=None, headers=None, params=None, concurrent_users=10):
    """Test API under load with concurrent requests"""
    url = f"{API_BASE_URL}/{endpoint}"
    response_times = []
    success_count = 0
    
    print(f"\n=== Load Testing {method} {url} with {concurrent_users} concurrent users ===")
    
    def make_single_request():
        try:
            start_time = time.time()
            if method == "GET":
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=30)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=data, timeout=30)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            return {
                "status_code": response.status_code,
                "response_time": response_time,
                "success": response.status_code < 400
            }
        except Exception as e:
            return {
                "status_code": 0,
                "response_time": 0,
                "success": False,
                "error": str(e)
            }
    
    # Use ThreadPoolExecutor to make concurrent requests
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_users) as executor:
        futures = [executor.submit(make_single_request) for _ in range(concurrent_users)]
        results = [future.result() for future in concurrent.futures.as_completed(futures)]
    
    # Process results
    for result in results:
        if result["success"]:
            response_times.append(result["response_time"])
            success_count += 1
        else:
            print(f"Request failed with status code {result['status_code']}")
            if "error" in result:
                print(f"Error: {result['error']}")
    
    # Calculate statistics
    if response_times:
        avg_time = statistics.mean(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        median_time = statistics.median(response_times)
        success_rate = (success_count / concurrent_users) * 100
        
        print(f"Average response time: {avg_time:.2f} ms")
        print(f"Minimum response time: {min_time:.2f} ms")
        print(f"Maximum response time: {max_time:.2f} ms")
        print(f"Median response time: {median_time:.2f} ms")
        print(f"Success rate: {success_rate:.2f}%")
        
        return {
            "avg_time": avg_time,
            "min_time": min_time,
            "max_time": max_time,
            "median_time": median_time,
            "success_rate": success_rate
        }
    else:
        print("No successful responses to measure performance")
        return None

# Test caching effectiveness
def test_caching_effectiveness(endpoint, params=None, num_requests=5):
    """Test if API responses are being cached effectively"""
    url = f"{API_BASE_URL}/{endpoint}"
    
    print(f"\n=== Testing Caching Effectiveness for {url} ===")
    
    # First request (cold cache)
    start_time = time.time()
    first_response = requests.get(url, params=params)
    first_response_time = (time.time() - start_time) * 1000
    
    print(f"First request (cold cache): {first_response_time:.2f} ms")
    
    # Subsequent requests (should use cache if implemented)
    subsequent_times = []
    for i in range(num_requests - 1):
        start_time = time.time()
        response = requests.get(url, params=params)
        response_time = (time.time() - start_time) * 1000
        subsequent_times.append(response_time)
        print(f"Request {i+2}: {response_time:.2f} ms")
    
    # Calculate average of subsequent requests
    avg_subsequent_time = statistics.mean(subsequent_times) if subsequent_times else 0
    
    # Calculate improvement percentage
    if first_response_time > 0:
        improvement = ((first_response_time - avg_subsequent_time) / first_response_time) * 100
        print(f"Average subsequent request time: {avg_subsequent_time:.2f} ms")
        print(f"Improvement: {improvement:.2f}%")
        
        # Check for cache headers
        cache_headers = [header for header in first_response.headers if "cache" in header.lower()]
        if cache_headers:
            print("Cache headers found:")
            for header in cache_headers:
                print(f"  {header}: {first_response.headers[header]}")
        else:
            print("No explicit cache headers found. Client-side caching may be in use.")
        
        return {
            "first_request_time": first_response_time,
            "avg_subsequent_time": avg_subsequent_time,
            "improvement_percentage": improvement,
            "cache_headers": cache_headers
        }
    else:
        print("First request failed or took 0 ms")
        return None

# Test API endpoints
def test_products_api():
    """Test all product-related API endpoints"""
    print("\n=== Testing Product API Endpoints ===")
    
    # Test GET /api/products
    products_response, response_time = make_request("GET", f"{API_BASE_URL}/products")
    print(f"GET /api/products - Status: {products_response.status_code}, Time: {response_time:.2f} ms")
    assert products_response.status_code == 200, f"Expected status code 200, got {products_response.status_code}"
    
    # Store a product ID for subsequent tests
    global TEST_PRODUCT_ID
    if products_response.json():
        TEST_PRODUCT_ID = products_response.json()[0]["id"]
    
    # Test GET /api/products/{id}
    if TEST_PRODUCT_ID:
        product_detail_response, response_time = make_request("GET", f"{API_BASE_URL}/products/{TEST_PRODUCT_ID}")
        print(f"GET /api/products/{TEST_PRODUCT_ID} - Status: {product_detail_response.status_code}, Time: {response_time:.2f} ms")
        assert product_detail_response.status_code == 200, f"Expected status code 200, got {product_detail_response.status_code}"
    
    # Test GET /api/products with filtering
    filter_response, response_time = make_request("GET", f"{API_BASE_URL}/products", params={"category": "Vòng Tay"})
    print(f"GET /api/products?category=Vòng Tay - Status: {filter_response.status_code}, Time: {response_time:.2f} ms")
    assert filter_response.status_code == 200, f"Expected status code 200, got {filter_response.status_code}"
    
    # Test GET /api/products with search
    search_response, response_time = make_request("GET", f"{API_BASE_URL}/products", params={"search": "trầm"})
    print(f"GET /api/products?search=trầm - Status: {search_response.status_code}, Time: {response_time:.2f} ms")
    assert search_response.status_code == 200, f"Expected status code 200, got {search_response.status_code}"
    
    # Test GET /api/categories
    categories_response, response_time = make_request("GET", f"{API_BASE_URL}/categories")
    print(f"GET /api/categories - Status: {categories_response.status_code}, Time: {response_time:.2f} ms")
    assert categories_response.status_code == 200, f"Expected status code 200, got {categories_response.status_code}"
    
    # Test POST /api/products/seed
    seed_response, response_time = make_request("POST", f"{API_BASE_URL}/products/seed")
    print(f"POST /api/products/seed - Status: {seed_response.status_code}, Time: {response_time:.2f} ms")
    assert seed_response.status_code == 200, f"Expected status code 200, got {seed_response.status_code}"
    
    return {
        "products": products_response.json() if products_response.status_code == 200 else None,
        "product_detail": product_detail_response.json() if TEST_PRODUCT_ID and product_detail_response.status_code == 200 else None,
        "filtered_products": filter_response.json() if filter_response.status_code == 200 else None,
        "search_results": search_response.json() if search_response.status_code == 200 else None,
        "categories": categories_response.json() if categories_response.status_code == 200 else None,
        "seed_result": seed_response.json() if seed_response.status_code == 200 else None
    }

def test_authentication_api():
    """Test all authentication-related API endpoints"""
    print("\n=== Testing Authentication API Endpoints ===")
    
    # Test POST /api/auth/register
    register_data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"],
        "phone": TEST_USER["phone"]
    }
    register_response, response_time = make_request("POST", f"{API_BASE_URL}/auth/register", json=register_data)
    print(f"POST /api/auth/register - Status: {register_response.status_code}, Time: {response_time:.2f} ms")
    
    if register_response.status_code in [200, 201]:
        global ACCESS_TOKEN
        ACCESS_TOKEN = register_response.json()["access_token"]
    else:
        # Try login if registration fails (user might already exist)
        login_data = {
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        }
        login_response, response_time = make_request("POST", f"{API_BASE_URL}/auth/login", json=login_data)
        print(f"POST /api/auth/login - Status: {login_response.status_code}, Time: {response_time:.2f} ms")
        
        if login_response.status_code == 200:
            ACCESS_TOKEN = login_response.json()["access_token"]
        else:
            # Generate a new user if login also fails
            TEST_USER["email"] = f"test.user.{random_string(8)}@example.com"
            register_data["email"] = TEST_USER["email"]
            register_response, response_time = make_request("POST", f"{API_BASE_URL}/auth/register", json=register_data)
            print(f"POST /api/auth/register (retry) - Status: {register_response.status_code}, Time: {response_time:.2f} ms")
            
            if register_response.status_code in [200, 201]:
                ACCESS_TOKEN = register_response.json()["access_token"]
    
    assert ACCESS_TOKEN is not None, "Failed to obtain access token"
    
    # Test GET /api/auth/me
    me_response, response_time = make_request("GET", f"{API_BASE_URL}/auth/me", headers=get_auth_headers())
    print(f"GET /api/auth/me - Status: {me_response.status_code}, Time: {response_time:.2f} ms")
    assert me_response.status_code == 200, f"Expected status code 200, got {me_response.status_code}"
    
    # Test PUT /api/auth/me
    update_data = {
        "full_name": f"{TEST_USER['full_name']} Updated",
        "phone": "0987654321",
        "address": "123 Đường Lê Lợi",
        "city": "Hồ Chí Minh",
        "district": "Quận 1",
        "ward": "Phường Bến Nghé",
        "zip_code": "70000"
    }
    update_response, response_time = make_request("PUT", f"{API_BASE_URL}/auth/me", headers=get_auth_headers(), json=update_data)
    print(f"PUT /api/auth/me - Status: {update_response.status_code}, Time: {response_time:.2f} ms")
    assert update_response.status_code == 200, f"Expected status code 200, got {update_response.status_code}"
    
    # Test invalid authentication scenarios
    # 1. Invalid token
    invalid_headers = {"Authorization": "Bearer invalidtoken12345"}
    invalid_response, response_time = make_request("GET", f"{API_BASE_URL}/auth/me", headers=invalid_headers)
    print(f"GET /api/auth/me (invalid token) - Status: {invalid_response.status_code}, Time: {response_time:.2f} ms")
    assert invalid_response.status_code == 401, f"Expected status code 401, got {invalid_response.status_code}"
    
    # 2. No token
    no_token_response, response_time = make_request("GET", f"{API_BASE_URL}/auth/me")
    print(f"GET /api/auth/me (no token) - Status: {no_token_response.status_code}, Time: {response_time:.2f} ms")
    assert no_token_response.status_code in [401, 403], f"Expected status code 401 or 403, got {no_token_response.status_code}"
    
    # 3. Invalid login credentials
    invalid_login_data = {
        "email": TEST_USER["email"],
        "password": "WrongPassword123"
    }
    invalid_login_response, response_time = make_request("POST", f"{API_BASE_URL}/auth/login", json=invalid_login_data)
    print(f"POST /api/auth/login (invalid credentials) - Status: {invalid_login_response.status_code}, Time: {response_time:.2f} ms")
    assert invalid_login_response.status_code == 401, f"Expected status code 401, got {invalid_login_response.status_code}"
    
    return {
        "register": register_response.json() if register_response.status_code in [200, 201] else None,
        "me": me_response.json() if me_response.status_code == 200 else None,
        "update": update_response.json() if update_response.status_code == 200 else None
    }

def test_cart_api():
    """Test all cart-related API endpoints"""
    print("\n=== Testing Cart API Endpoints ===")
    
    # Test POST /api/cart/add
    add_data = {
        "product_id": TEST_PRODUCT_ID,
        "quantity": 2
    }
    add_response, response_time = make_request("POST", f"{API_BASE_URL}/cart/add", headers=get_auth_headers(), json=add_data)
    print(f"POST /api/cart/add - Status: {add_response.status_code}, Time: {response_time:.2f} ms")
    assert add_response.status_code in [200, 201], f"Expected status code 200 or 201, got {add_response.status_code}"
    
    # Test GET /api/cart
    cart_response, response_time = make_request("GET", f"{API_BASE_URL}/cart", headers=get_auth_headers())
    print(f"GET /api/cart - Status: {cart_response.status_code}, Time: {response_time:.2f} ms")
    assert cart_response.status_code == 200, f"Expected status code 200, got {cart_response.status_code}"
    
    # Test PUT /api/cart/item/{product_id}
    update_data = {
        "quantity": 3
    }
    update_response, response_time = make_request("PUT", f"{API_BASE_URL}/cart/item/{TEST_PRODUCT_ID}", headers=get_auth_headers(), json=update_data)
    print(f"PUT /api/cart/item/{TEST_PRODUCT_ID} - Status: {update_response.status_code}, Time: {response_time:.2f} ms")
    assert update_response.status_code == 200, f"Expected status code 200, got {update_response.status_code}"
    
    # Test DELETE /api/cart/item/{product_id}
    delete_response, response_time = make_request("DELETE", f"{API_BASE_URL}/cart/item/{TEST_PRODUCT_ID}", headers=get_auth_headers())
    print(f"DELETE /api/cart/item/{TEST_PRODUCT_ID} - Status: {delete_response.status_code}, Time: {response_time:.2f} ms")
    assert delete_response.status_code == 200, f"Expected status code 200, got {delete_response.status_code}"
    
    # Add item back to cart for order tests
    add_response, _ = make_request("POST", f"{API_BASE_URL}/cart/add", headers=get_auth_headers(), json=add_data)
    
    # Test edge cases
    # 1. Update non-existent item
    non_existent_id = "non-existent-id"
    non_existent_response, response_time = make_request("PUT", f"{API_BASE_URL}/cart/item/{non_existent_id}", headers=get_auth_headers(), json=update_data)
    print(f"PUT /api/cart/item/{non_existent_id} (non-existent) - Status: {non_existent_response.status_code}, Time: {response_time:.2f} ms")
    assert non_existent_response.status_code == 404, f"Expected status code 404, got {non_existent_response.status_code}"
    
    # 2. Update with invalid quantity
    invalid_data = {
        "quantity": -1
    }
    invalid_response, response_time = make_request("PUT", f"{API_BASE_URL}/cart/item/{TEST_PRODUCT_ID}", headers=get_auth_headers(), json=invalid_data)
    print(f"PUT /api/cart/item/{TEST_PRODUCT_ID} (invalid quantity) - Status: {invalid_response.status_code}, Time: {response_time:.2f} ms")
    # This should either remove the item or return an error
    
    return {
        "add": add_response.json() if add_response.status_code in [200, 201] else None,
        "cart": cart_response.json() if cart_response.status_code == 200 else None,
        "update": update_response.json() if update_response.status_code == 200 else None,
        "delete": delete_response.json() if delete_response.status_code == 200 else None
    }

def test_order_api():
    """Test all order-related API endpoints"""
    print("\n=== Testing Order API Endpoints ===")
    
    # First, add an item to the cart
    add_data = {
        "product_id": TEST_PRODUCT_ID,
        "quantity": 2
    }
    make_request("POST", f"{API_BASE_URL}/cart/add", headers=get_auth_headers(), json=add_data)
    
    # Get the cart to use its items for the order
    cart_response, _ = make_request("GET", f"{API_BASE_URL}/cart", headers=get_auth_headers())
    cart_items = cart_response.json()["items"] if cart_response.status_code == 200 else []
    
    # Test POST /api/orders (COD payment)
    order_data = {
        "items": cart_items,
        "payment_method": "cod",
        "customer_info": {
            "full_name": TEST_USER["full_name"],
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
    order_response, response_time = make_request("POST", f"{API_BASE_URL}/orders", headers=get_auth_headers(), json=order_data)
    print(f"POST /api/orders (COD) - Status: {order_response.status_code}, Time: {response_time:.2f} ms")
    assert order_response.status_code in [200, 201], f"Expected status code 200 or 201, got {order_response.status_code}"
    
    # Store order ID for subsequent tests
    global TEST_ORDER_ID
    if order_response.status_code in [200, 201]:
        TEST_ORDER_ID = order_response.json()["id"]
    
    # Test GET /api/orders
    orders_response, response_time = make_request("GET", f"{API_BASE_URL}/orders", headers=get_auth_headers())
    print(f"GET /api/orders - Status: {orders_response.status_code}, Time: {response_time:.2f} ms")
    assert orders_response.status_code == 200, f"Expected status code 200, got {orders_response.status_code}"
    
    # Test GET /api/orders/{order_id}
    if TEST_ORDER_ID:
        order_detail_response, response_time = make_request("GET", f"{API_BASE_URL}/orders/{TEST_ORDER_ID}", headers=get_auth_headers())
        print(f"GET /api/orders/{TEST_ORDER_ID} - Status: {order_detail_response.status_code}, Time: {response_time:.2f} ms")
        assert order_detail_response.status_code == 200, f"Expected status code 200, got {order_detail_response.status_code}"
    
    # Test POST /api/orders (bank transfer payment)
    # First, add an item to the cart again
    make_request("POST", f"{API_BASE_URL}/cart/add", headers=get_auth_headers(), json=add_data)
    
    # Get the cart again
    cart_response, _ = make_request("GET", f"{API_BASE_URL}/cart", headers=get_auth_headers())
    cart_items = cart_response.json()["items"] if cart_response.status_code == 200 else []
    
    # Create order with bank transfer
    bank_order_data = {
        "items": cart_items,
        "payment_method": "bank_transfer",
        "customer_info": {
            "full_name": TEST_USER["full_name"],
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
    bank_order_response, response_time = make_request("POST", f"{API_BASE_URL}/orders", headers=get_auth_headers(), json=bank_order_data)
    print(f"POST /api/orders (bank transfer) - Status: {bank_order_response.status_code}, Time: {response_time:.2f} ms")
    assert bank_order_response.status_code in [200, 201], f"Expected status code 200 or 201, got {bank_order_response.status_code}"
    
    # Test guest order creation (without authentication)
    guest_order_data = {
        "items": [
            {
                "product_id": TEST_PRODUCT_ID,
                "quantity": 1,
                "price": 2200000,
                "name": "Vòng Trầm Hương Cao Cấp",
                "image_url": "https://images.unsplash.com/photo-1662473217799-6e7288f19741"
            }
        ],
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
    guest_order_response, response_time = make_request("POST", f"{API_BASE_URL}/orders", json=guest_order_data)
    print(f"POST /api/orders (guest) - Status: {guest_order_response.status_code}, Time: {response_time:.2f} ms")
    
    # Check if guest orders are supported
    guest_orders_supported = guest_order_response.status_code in [200, 201]
    print(f"Guest orders supported: {guest_orders_supported}")
    
    # Test edge cases
    # 1. Order with empty items
    empty_items_data = {
        "items": [],
        "payment_method": "cod",
        "customer_info": {
            "full_name": TEST_USER["full_name"],
            "email": TEST_USER["email"],
            "phone": "0987654321"
        },
        "shipping_address": {
            "address": "123 Đường Lê Lợi",
            "city": "Hồ Chí Minh",
            "district": "Quận 1",
            "ward": "Phường Bến Nghé",
            "zip_code": "70000"
        }
    }
    empty_items_response, response_time = make_request("POST", f"{API_BASE_URL}/orders", headers=get_auth_headers(), json=empty_items_data)
    print(f"POST /api/orders (empty items) - Status: {empty_items_response.status_code}, Time: {response_time:.2f} ms")
    
    # 2. Order with invalid payment method
    invalid_payment_data = {
        "items": cart_items,
        "payment_method": "invalid_method",
        "customer_info": {
            "full_name": TEST_USER["full_name"],
            "email": TEST_USER["email"],
            "phone": "0987654321"
        },
        "shipping_address": {
            "address": "123 Đường Lê Lợi",
            "city": "Hồ Chí Minh",
            "district": "Quận 1",
            "ward": "Phường Bến Nghé",
            "zip_code": "70000"
        }
    }
    invalid_payment_response, response_time = make_request("POST", f"{API_BASE_URL}/orders", headers=get_auth_headers(), json=invalid_payment_data)
    print(f"POST /api/orders (invalid payment) - Status: {invalid_payment_response.status_code}, Time: {response_time:.2f} ms")
    
    # 3. Get non-existent order
    non_existent_id = "non-existent-id"
    non_existent_response, response_time = make_request("GET", f"{API_BASE_URL}/orders/{non_existent_id}", headers=get_auth_headers())
    print(f"GET /api/orders/{non_existent_id} (non-existent) - Status: {non_existent_response.status_code}, Time: {response_time:.2f} ms")
    assert non_existent_response.status_code == 404, f"Expected status code 404, got {non_existent_response.status_code}"
    
    return {
        "order": order_response.json() if order_response.status_code in [200, 201] else None,
        "orders": orders_response.json() if orders_response.status_code == 200 else None,
        "order_detail": order_detail_response.json() if TEST_ORDER_ID and order_detail_response.status_code == 200 else None,
        "bank_order": bank_order_response.json() if bank_order_response.status_code in [200, 201] else None,
        "guest_order": guest_order_response.json() if guest_orders_supported else None,
        "guest_orders_supported": guest_orders_supported
    }

def test_contact_api():
    """Test all contact form API endpoints"""
    print("\n=== Testing Contact Form API Endpoints ===")
    
    # Test POST /api/contact
    contact_data = {
        "full_name": "Nguyễn Văn A",
        "email": f"contact.{random_string(8)}@example.com",
        "phone": "0987654321",
        "subject": "Yêu cầu thông tin sản phẩm",
        "message": "Tôi muốn biết thêm thông tin về sản phẩm Vòng Trầm Hương Cao Cấp. Cảm ơn!"
    }
    contact_response, response_time = make_request("POST", f"{API_BASE_URL}/contact", json=contact_data)
    print(f"POST /api/contact - Status: {contact_response.status_code}, Time: {response_time:.2f} ms")
    assert contact_response.status_code in [200, 201], f"Expected status code 200 or 201, got {contact_response.status_code}"
    
    # Test GET /api/contact
    contacts_response, response_time = make_request("GET", f"{API_BASE_URL}/contact")
    print(f"GET /api/contact - Status: {contacts_response.status_code}, Time: {response_time:.2f} ms")
    assert contacts_response.status_code == 200, f"Expected status code 200, got {contacts_response.status_code}"
    
    # Test edge cases
    # 1. Invalid email format
    invalid_email_data = {
        "full_name": "Nguyễn Văn A",
        "email": "invalid-email",
        "phone": "0987654321",
        "subject": "Yêu cầu thông tin sản phẩm",
        "message": "Tôi muốn biết thêm thông tin về sản phẩm Vòng Trầm Hương Cao Cấp. Cảm ơn!"
    }
    invalid_email_response, response_time = make_request("POST", f"{API_BASE_URL}/contact", json=invalid_email_data)
    print(f"POST /api/contact (invalid email) - Status: {invalid_email_response.status_code}, Time: {response_time:.2f} ms")
    
    # 2. Missing required fields
    missing_fields_data = {
        "full_name": "Nguyễn Văn A",
        "email": "contact@example.com"
        # Missing phone, subject, message
    }
    missing_fields_response, response_time = make_request("POST", f"{API_BASE_URL}/contact", json=missing_fields_data)
    print(f"POST /api/contact (missing fields) - Status: {missing_fields_response.status_code}, Time: {response_time:.2f} ms")
    
    return {
        "contact": contact_response.json() if contact_response.status_code in [200, 201] else None,
        "contacts": contacts_response.json() if contacts_response.status_code == 200 else None
    }

def run_comprehensive_tests():
    """Run comprehensive tests on all API endpoints"""
    print("\n======= STARTING COMPREHENSIVE BACKEND API TESTS =======\n")
    
    results = {}
    
    try:
        # Test product API endpoints
        results["products"] = test_products_api()
        
        # Test authentication API endpoints
        results["authentication"] = test_authentication_api()
        
        # Test cart API endpoints
        results["cart"] = test_cart_api()
        
        # Test order API endpoints
        results["orders"] = test_order_api()
        
        # Test contact form API endpoints
        results["contact"] = test_contact_api()
        
        # Performance testing
        print("\n=== Performance Testing ===")
        
        # Test product listing performance
        results["performance"] = {}
        results["performance"]["products"] = measure_api_performance("products")
        
        # Test product detail performance
        if TEST_PRODUCT_ID:
            results["performance"]["product_detail"] = measure_api_performance(f"products/{TEST_PRODUCT_ID}")
        
        # Test categories performance
        results["performance"]["categories"] = measure_api_performance("categories")
        
        # Test search performance
        results["performance"]["search"] = measure_api_performance("products", params={"search": "trầm"})
        
        # Test category filtering performance
        results["performance"]["category_filter"] = measure_api_performance("products", params={"category": "Vòng Tay"})
        
        # Load testing
        print("\n=== Load Testing ===")
        
        # Test product listing under load
        results["load_testing"] = {}
        results["load_testing"]["products"] = load_test_api("products")
        
        # Test product detail under load
        if TEST_PRODUCT_ID:
            results["load_testing"]["product_detail"] = load_test_api(f"products/{TEST_PRODUCT_ID}")
        
        # Test categories under load
        results["load_testing"]["categories"] = load_test_api("categories")
        
        # Caching effectiveness
        print("\n=== Caching Effectiveness Testing ===")
        
        # Test product listing caching
        results["caching"] = {}
        results["caching"]["products"] = test_caching_effectiveness("products")
        
        # Test product detail caching
        if TEST_PRODUCT_ID:
            results["caching"]["product_detail"] = test_caching_effectiveness(f"products/{TEST_PRODUCT_ID}")
        
        # Test categories caching
        results["caching"]["categories"] = test_caching_effectiveness("categories")
        
        print("\n======= ALL COMPREHENSIVE TESTS COMPLETED =======")
        
        # Print summary
        print("\n=== TEST SUMMARY ===")
        
        # API Functionality
        print("\nAPI Functionality:")
        print(f"Products API: {'✅ Working' if results['products'] else '❌ Failed'}")
        print(f"Authentication API: {'✅ Working' if results['authentication'] else '❌ Failed'}")
        print(f"Cart API: {'✅ Working' if results['cart'] else '❌ Failed'}")
        print(f"Orders API: {'✅ Working' if results['orders'] else '❌ Failed'}")
        print(f"Contact API: {'✅ Working' if results['contact'] else '❌ Failed'}")
        
        # Performance
        print("\nPerformance (Average Response Times):")
        if "performance" in results:
            for endpoint, metrics in results["performance"].items():
                if metrics:
                    print(f"{endpoint}: {metrics['avg_time']:.2f} ms")
        
        # Load Testing
        print("\nLoad Testing (10 Concurrent Users):")
        if "load_testing" in results:
            for endpoint, metrics in results["load_testing"].items():
                if metrics:
                    print(f"{endpoint}: {metrics['avg_time']:.2f} ms, Success Rate: {metrics['success_rate']:.2f}%")
        
        # Caching
        print("\nCaching Effectiveness:")
        if "caching" in results:
            for endpoint, metrics in results["caching"].items():
                if metrics:
                    print(f"{endpoint}: {metrics['improvement_percentage']:.2f}% improvement")
        
        # Guest Checkout
        if "orders" in results and "guest_orders_supported" in results["orders"]:
            print(f"\nGuest Checkout: {'✅ Supported' if results['orders']['guest_orders_supported'] else '❌ Not Supported'}")
        
        return results, True
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        return results, False
    except Exception as e:
        print(f"\n❌ ERROR DURING TESTING: {e}")
        return results, False

if __name__ == "__main__":
    results, success = run_comprehensive_tests()
    sys.exit(0 if success else 1)