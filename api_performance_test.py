import requests
import time
import statistics
import json
import concurrent.futures
import sys
from pprint import pprint
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://dbe62f8b-cea5-4002-8cff-0cd7ed98eb8a.preview.emergentagent.com"
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

# Helper function to get authorization headers
def get_auth_headers():
    if not ACCESS_TOKEN:
        raise Exception("No access token available. Please run authentication tests first.")
    return {"Authorization": f"Bearer {ACCESS_TOKEN}"}

def test_api_response_time(endpoint, method="GET", params=None, data=None, headers=None, iterations=5, description=""):
    """Test API response time for a specific endpoint"""
    print(f"\n=== Testing {method} {endpoint} Response Time ({description}) ===")
    
    url = f"{API_BASE_URL}{endpoint}"
    response_times = []
    
    for i in range(iterations):
        try:
            response, response_time = make_request(method, url, params=params, json=data, headers=headers)
            response_times.append(response_time)
            
            print(f"Iteration {i+1}: {response_time:.2f} ms (Status: {response.status_code})")
            
            # Store the first product ID for later tests if this is the products endpoint
            if endpoint == "/products" and i == 0 and response.status_code == 200 and response.json():
                global TEST_PRODUCT_ID
                TEST_PRODUCT_ID = response.json()[0]["id"]
                
        except Exception as e:
            print(f"Error in iteration {i+1}: {e}")
    
    if response_times:
        avg_time = statistics.mean(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        median_time = statistics.median(response_times)
        
        print(f"\nResults for {method} {endpoint}:")
        print(f"  Average: {avg_time:.2f} ms")
        print(f"  Minimum: {min_time:.2f} ms")
        print(f"  Maximum: {max_time:.2f} ms")
        print(f"  Median: {median_time:.2f} ms")
        
        # Check if response time is acceptable (under 500ms)
        if avg_time > 500:
            print(f"⚠️ WARNING: Average response time ({avg_time:.2f} ms) exceeds 500ms threshold")
        else:
            print(f"✅ Average response time ({avg_time:.2f} ms) is under 500ms threshold")
        
        return {
            "endpoint": endpoint,
            "method": method,
            "description": description,
            "avg_time": avg_time,
            "min_time": min_time,
            "max_time": max_time,
            "median_time": median_time,
            "iterations": iterations,
            "all_times": response_times
        }
    else:
        print(f"❌ No successful responses for {method} {endpoint}")
        return None

def test_caching_effectiveness(endpoint, method="GET", params=None, data=None, headers=None, iterations=5, description=""):
    """Test if caching is effective by comparing first request to subsequent requests"""
    print(f"\n=== Testing Caching Effectiveness for {method} {endpoint} ({description}) ===")
    
    url = f"{API_BASE_URL}{endpoint}"
    response_times = []
    
    for i in range(iterations):
        try:
            response, response_time = make_request(method, url, params=params, json=data, headers=headers)
            response_times.append(response_time)
            
            print(f"Iteration {i+1}: {response_time:.2f} ms (Status: {response.status_code})")
            
            # Check for cache headers
            cache_headers = {k: v for k, v in response.headers.items() if 'cache' in k.lower()}
            if cache_headers:
                print(f"  Cache Headers: {cache_headers}")
            
        except Exception as e:
            print(f"Error in iteration {i+1}: {e}")
    
    if len(response_times) >= 2:
        first_request = response_times[0]
        subsequent_requests = response_times[1:]
        avg_subsequent = statistics.mean(subsequent_requests)
        
        improvement = ((first_request - avg_subsequent) / first_request) * 100
        
        print(f"\nCaching Results for {method} {endpoint}:")
        print(f"  First Request: {first_request:.2f} ms")
        print(f"  Average of Subsequent Requests: {avg_subsequent:.2f} ms")
        print(f"  Improvement: {improvement:.2f}%")
        
        if improvement > 20:
            print(f"✅ Significant caching improvement detected ({improvement:.2f}%)")
        elif improvement > 0:
            print(f"ℹ️ Slight caching improvement detected ({improvement:.2f}%)")
        else:
            print(f"⚠️ No caching improvement detected ({improvement:.2f}%)")
        
        return {
            "endpoint": endpoint,
            "method": method,
            "description": description,
            "first_request": first_request,
            "avg_subsequent": avg_subsequent,
            "improvement_percent": improvement,
            "all_times": response_times
        }
    else:
        print(f"❌ Not enough successful responses for {method} {endpoint}")
        return None

def test_concurrent_requests(endpoint, method="GET", params=None, data=None, headers=None, concurrent_users=10, description=""):
    """Test API performance under concurrent load"""
    print(f"\n=== Testing Concurrent Requests for {method} {endpoint} ({description}) ===")
    print(f"Simulating {concurrent_users} concurrent users")
    
    url = f"{API_BASE_URL}{endpoint}"
    response_times = []
    
    def make_single_request():
        try:
            response, response_time = make_request(method, url, params=params, json=data, headers=headers)
            return {
                "status_code": response.status_code,
                "response_time": response_time
            }
        except Exception as e:
            return {
                "status_code": None,
                "response_time": None,
                "error": str(e)
            }
    
    # Execute concurrent requests
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_users) as executor:
        future_to_user = {executor.submit(make_single_request): i for i in range(concurrent_users)}
        
        for future in concurrent.futures.as_completed(future_to_user):
            user_id = future_to_user[future]
            try:
                result = future.result()
                if result["response_time"] is not None:
                    response_times.append(result["response_time"])
                    print(f"User {user_id+1}: {result['response_time']:.2f} ms (Status: {result['status_code']})")
                else:
                    print(f"User {user_id+1}: Error - {result.get('error', 'Unknown error')}")
            except Exception as e:
                print(f"User {user_id+1}: Exception - {e}")
    
    if response_times:
        avg_time = statistics.mean(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        median_time = statistics.median(response_times)
        
        print(f"\nConcurrent Results for {method} {endpoint}:")
        print(f"  Average: {avg_time:.2f} ms")
        print(f"  Minimum: {min_time:.2f} ms")
        print(f"  Maximum: {max_time:.2f} ms")
        print(f"  Median: {median_time:.2f} ms")
        print(f"  Successful Requests: {len(response_times)}/{concurrent_users}")
        
        # Check if response time is acceptable under load (under 1000ms)
        if avg_time > 1000:
            print(f"⚠️ WARNING: Average response time under load ({avg_time:.2f} ms) exceeds 1000ms threshold")
        else:
            print(f"✅ Average response time under load ({avg_time:.2f} ms) is under 1000ms threshold")
        
        return {
            "endpoint": endpoint,
            "method": method,
            "description": description,
            "concurrent_users": concurrent_users,
            "successful_requests": len(response_times),
            "avg_time": avg_time,
            "min_time": min_time,
            "max_time": max_time,
            "median_time": median_time,
            "all_times": response_times
        }
    else:
        print(f"❌ No successful responses for concurrent {method} {endpoint}")
        return None

def test_query_performance(endpoint, query_params_list, method="GET", headers=None, description=""):
    """Test API performance with different query parameters"""
    print(f"\n=== Testing Query Performance for {method} {endpoint} ({description}) ===")
    
    results = []
    
    for params in query_params_list:
        param_desc = ", ".join([f"{k}={v}" for k, v in params.items()])
        print(f"\nTesting with parameters: {param_desc}")
        
        result = test_api_response_time(
            endpoint=endpoint,
            method=method,
            params=params,
            headers=headers,
            iterations=3,
            description=f"Query: {param_desc}"
        )
        
        if result:
            results.append(result)
    
    if results:
        # Compare the performance of different queries
        print("\nQuery Performance Comparison:")
        for result in sorted(results, key=lambda x: x["avg_time"]):
            print(f"  {result['description']}: {result['avg_time']:.2f} ms")
        
        return results
    else:
        print(f"❌ No successful query performance results for {method} {endpoint}")
        return None

def test_error_handling(endpoint, error_scenarios, method="GET", description=""):
    """Test API error handling performance and consistency"""
    print(f"\n=== Testing Error Handling for {method} {endpoint} ({description}) ===")
    
    results = []
    
    for scenario in error_scenarios:
        print(f"\nTesting error scenario: {scenario['description']}")
        
        url = f"{API_BASE_URL}{endpoint}"
        
        try:
            start_time = time.time()
            response = requests.request(
                method, 
                url, 
                params=scenario.get('params'), 
                json=scenario.get('data'), 
                headers=scenario.get('headers'),
                timeout=30
            )
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            print(f"Response Time: {response_time:.2f} ms")
            print(f"Status Code: {response.status_code}")
            
            try:
                response_data = response.json()
                print(f"Response: {response_data}")
                
                # Check if error response contains expected fields
                if 'detail' in response_data or 'message' in response_data:
                    print("✅ Error response contains expected fields")
                else:
                    print("⚠️ Error response missing expected fields")
                
            except ValueError:
                print(f"Response is not JSON: {response.text[:100]}...")
            
            results.append({
                "scenario": scenario['description'],
                "status_code": response.status_code,
                "response_time": response_time,
                "expected_status": scenario.get('expected_status'),
                "status_match": response.status_code == scenario.get('expected_status', 0)
            })
            
        except Exception as e:
            print(f"Error during request: {e}")
            results.append({
                "scenario": scenario['description'],
                "error": str(e),
                "expected_status": scenario.get('expected_status')
            })
    
    if results:
        print("\nError Handling Results:")
        for result in results:
            status_match = result.get("status_match", False)
            status_indicator = "✅" if status_match else "❌"
            
            if "error" in result:
                print(f"  {status_indicator} {result['scenario']}: Error - {result['error']}")
            else:
                print(f"  {status_indicator} {result['scenario']}: {result['status_code']} in {result['response_time']:.2f} ms")
        
        return results
    else:
        print(f"❌ No error handling results for {method} {endpoint}")
        return None

def register_test_user():
    """Register a test user and get access token"""
    print("\n=== Registering Test User ===")
    
    url = f"{API_BASE_URL}/auth/register"
    data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"],
        "full_name": TEST_USER["full_name"],
        "phone": TEST_USER["phone"]
    }
    
    try:
        response, response_time = make_request("POST", url, json=data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {response_time:.2f} ms")
        
        if response.status_code in [200, 201]:
            global ACCESS_TOKEN
            ACCESS_TOKEN = response.json()["access_token"]
            print(f"✅ Successfully registered user and obtained access token")
            return True
        else:
            print(f"❌ Failed to register user: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error registering user: {e}")
        return False

def run_performance_tests():
    """Run all API performance tests"""
    print("\n======= STARTING API PERFORMANCE TESTS =======\n")
    
    all_results = {}
    
    try:
        # Register test user for authenticated endpoints
        register_test_user()
        
        # 1. Test GET /api/products response time
        all_results["products_response_time"] = test_api_response_time(
            endpoint="/products",
            method="GET",
            iterations=5,
            description="All Products"
        )
        
        # 2. Test GET /api/products/{id} response time
        if TEST_PRODUCT_ID:
            all_results["product_detail_response_time"] = test_api_response_time(
                endpoint=f"/products/{TEST_PRODUCT_ID}",
                method="GET",
                iterations=5,
                description="Single Product Detail"
            )
        
        # 3. Test GET /api/categories response time
        all_results["categories_response_time"] = test_api_response_time(
            endpoint="/categories",
            method="GET",
            iterations=5,
            description="All Categories"
        )
        
        # 4. Test POST /api/products/seed response time
        all_results["seed_products_response_time"] = test_api_response_time(
            endpoint="/products/seed",
            method="POST",
            iterations=2,  # Fewer iterations for this endpoint
            description="Seed Products"
        )
        
        # 5. Test caching effectiveness for GET /api/products
        all_results["products_caching"] = test_caching_effectiveness(
            endpoint="/products",
            method="GET",
            iterations=5,
            description="All Products"
        )
        
        # 6. Test caching effectiveness for GET /api/products/{id}
        if TEST_PRODUCT_ID:
            all_results["product_detail_caching"] = test_caching_effectiveness(
                endpoint=f"/products/{TEST_PRODUCT_ID}",
                method="GET",
                iterations=5,
                description="Single Product Detail"
            )
        
        # 7. Test caching effectiveness for GET /api/categories
        all_results["categories_caching"] = test_caching_effectiveness(
            endpoint="/categories",
            method="GET",
            iterations=5,
            description="All Categories"
        )
        
        # 8. Test concurrent requests for GET /api/products
        all_results["products_concurrent"] = test_concurrent_requests(
            endpoint="/products",
            method="GET",
            concurrent_users=10,
            description="All Products"
        )
        
        # 9. Test query performance for GET /api/products with different parameters
        query_params_list = [
            {},  # No parameters
            {"category": "Vòng Tay"},  # Filter by category
            {"featured": "true"},  # Filter featured products
            {"search": "trầm"},  # Search products
            {"limit": "5"},  # Limit results
            {"category": "Vòng Tay", "featured": "true"}  # Multiple filters
        ]
        
        all_results["products_query_performance"] = test_query_performance(
            endpoint="/products",
            method="GET",
            query_params_list=query_params_list,
            description="Different Query Parameters"
        )
        
        # 10. Test error handling for GET /api/products/{id}
        error_scenarios = [
            {
                "description": "Non-existent product ID",
                "params": {},
                "expected_status": 404
            },
            {
                "description": "Invalid product ID format",
                "params": {},
                "expected_status": 404
            }
        ]
        
        all_results["product_detail_error_handling"] = test_error_handling(
            endpoint="/products/nonexistent-id",
            method="GET",
            error_scenarios=error_scenarios,
            description="Product Detail Errors"
        )
        
        # Print overall summary
        print("\n======= API PERFORMANCE TEST SUMMARY =======")
        
        # Summarize response times
        print("\n=== Response Time Summary ===")
        response_time_results = [
            result for result in all_results.values() 
            if isinstance(result, dict) and "avg_time" in result
        ]
        
        for result in sorted(response_time_results, key=lambda x: x["avg_time"]):
            status = "✅" if result["avg_time"] <= 500 else "⚠️"
            print(f"{status} {result['method']} {result['endpoint']} ({result['description']}): {result['avg_time']:.2f} ms")
        
        # Summarize caching effectiveness
        print("\n=== Caching Effectiveness Summary ===")
        caching_results = [
            result for result in all_results.values() 
            if isinstance(result, dict) and "improvement_percent" in result
        ]
        
        for result in sorted(caching_results, key=lambda x: x["improvement_percent"], reverse=True):
            if result["improvement_percent"] > 20:
                status = "✅"
            elif result["improvement_percent"] > 0:
                status = "ℹ️"
            else:
                status = "⚠️"
            
            print(f"{status} {result['method']} {result['endpoint']} ({result['description']}): {result['improvement_percent']:.2f}% improvement")
        
        print("\n======= API PERFORMANCE TESTS COMPLETED =======")
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR DURING PERFORMANCE TESTING: {e}")
        return False

if __name__ == "__main__":
    success = run_performance_tests()
    sys.exit(0 if success else 1)