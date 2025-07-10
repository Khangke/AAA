import requests
import time
import statistics
import json
import sys
from pprint import pprint
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://138bbf90-bc9d-4fea-8acf-237c94a42c48.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

def measure_response_time(url, method="GET", headers=None, data=None, params=None):
    """Measure response time for a request"""
    start_time = time.time()
    if method == "GET":
        response = requests.get(url, headers=headers, params=params)
    elif method == "POST":
        response = requests.post(url, headers=headers, json=data)
    elif method == "PUT":
        response = requests.put(url, headers=headers, json=data)
    elif method == "DELETE":
        response = requests.delete(url, headers=headers)
    else:
        raise ValueError(f"Unsupported method: {method}")
    
    end_time = time.time()
    response_time = (end_time - start_time) * 1000  # Convert to milliseconds
    
    return response, response_time

def test_endpoint_caching(endpoint, iterations=10, params=None):
    """Test if an endpoint is properly cached by measuring response times over multiple requests"""
    print(f"\n=== Testing Caching for {endpoint} ===")
    url = f"{API_BASE_URL}{endpoint}"
    
    response_times = []
    cache_headers = []
    
    for i in range(iterations):
        response, response_time = measure_response_time(url, params=params)
        response_times.append(response_time)
        
        # Check for cache headers
        cache_related_headers = {k: v for k, v in response.headers.items() if 'cache' in k.lower()}
        cache_headers.append(cache_related_headers)
        
        print(f"Request {i+1}: {response_time:.2f} ms (Status: {response.status_code})")
        if cache_related_headers:
            print(f"  Cache Headers: {cache_related_headers}")
        
        # Small delay to simulate real user behavior
        time.sleep(0.2)
    
    # Analyze results
    first_request = response_times[0]
    subsequent_requests = response_times[1:]
    
    if subsequent_requests:
        avg_subsequent = statistics.mean(subsequent_requests)
        improvement = ((first_request - avg_subsequent) / first_request) * 100 if first_request > 0 else 0
        
        print(f"\nCaching Analysis for {endpoint}:")
        print(f"  First Request: {first_request:.2f} ms")
        print(f"  Average of Subsequent Requests: {avg_subsequent:.2f} ms")
        print(f"  Improvement: {improvement:.2f}%")
        
        if improvement > 20:
            print(f"✅ Strong caching effect detected ({improvement:.2f}%)")
        elif improvement > 5:
            print(f"ℹ️ Moderate caching effect detected ({improvement:.2f}%)")
        elif improvement > 0:
            print(f"⚠️ Weak caching effect detected ({improvement:.2f}%)")
        else:
            print(f"❌ No caching effect detected ({improvement:.2f}%)")
        
        # Check for cache headers
        if any(cache_headers):
            print("✅ Cache headers detected")
            for i, headers in enumerate(cache_headers):
                if headers:
                    print(f"  Request {i+1}: {headers}")
        else:
            print("⚠️ No cache headers detected")
    
    return {
        "endpoint": endpoint,
        "first_request": first_request,
        "subsequent_requests": subsequent_requests,
        "avg_subsequent": avg_subsequent if subsequent_requests else None,
        "improvement": improvement if subsequent_requests else None,
        "cache_headers": cache_headers
    }

def test_query_performance(endpoint, query_params_list, description=""):
    """Test API performance with different query parameters"""
    print(f"\n=== Testing Query Performance for {endpoint} ({description}) ===")
    
    results = []
    
    for params in query_params_list:
        param_desc = ", ".join([f"{k}={v}" for k, v in params.items()]) if params else "No parameters"
        print(f"\nTesting with parameters: {param_desc}")
        
        url = f"{API_BASE_URL}{endpoint}"
        response_times = []
        
        # Make 3 requests for each parameter set
        for i in range(3):
            response, response_time = measure_response_time(url, params=params)
            response_times.append(response_time)
            print(f"  Request {i+1}: {response_time:.2f} ms (Status: {response.status_code})")
        
        avg_time = statistics.mean(response_times)
        results.append({
            "params": params,
            "param_desc": param_desc,
            "avg_time": avg_time,
            "response_times": response_times
        })
    
    # Compare the performance of different queries
    print("\nQuery Performance Comparison:")
    for result in sorted(results, key=lambda x: x["avg_time"]):
        print(f"  {result['param_desc']}: {result['avg_time']:.2f} ms")
    
    return results

def run_caching_tests():
    """Run tests to evaluate API caching effectiveness"""
    print("\n======= STARTING API CACHING TESTS =======\n")
    
    results = {}
    
    # Test caching for key endpoints
    results["products"] = test_endpoint_caching("/products", iterations=10)
    results["categories"] = test_endpoint_caching("/categories", iterations=10)
    
    # Get a product ID for testing product detail caching
    products_response = requests.get(f"{API_BASE_URL}/products")
    if products_response.status_code == 200 and products_response.json():
        product_id = products_response.json()[0]["id"]
        results["product_detail"] = test_endpoint_caching(f"/products/{product_id}", iterations=10)
    
    # Test query parameter caching
    query_params_list = [
        {"category": "Vòng Tay"},
        {"featured": "true"},
        {"search": "trầm"},
        {"category": "Vòng Tay", "featured": "true"}
    ]
    
    results["query_performance"] = test_query_performance("/products", query_params_list, "Different Query Parameters")
    
    # Print summary
    print("\n======= API CACHING TEST SUMMARY =======")
    
    for endpoint, result in results.items():
        if endpoint != "query_performance" and "improvement" in result:
            status = "✅" if result["improvement"] > 5 else "⚠️"
            print(f"{status} {endpoint}: {result['improvement']:.2f}% improvement")
    
    print("\n======= API CACHING TESTS COMPLETED =======")
    return results

if __name__ == "__main__":
    run_caching_tests()