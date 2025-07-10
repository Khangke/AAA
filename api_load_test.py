import requests
import time
import statistics
import json
import sys
import concurrent.futures
from pprint import pprint
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://ee142728-bb35-45ab-a75b-854409c5898e.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

def make_request(url, method="GET", params=None, data=None, headers=None):
    """Make a request and measure response time"""
    start_time = time.time()
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, params=params, timeout=30)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        end_time = time.time()
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        
        return {
            "status_code": response.status_code,
            "response_time": response_time,
            "success": True
        }
    except Exception as e:
        end_time = time.time()
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        
        return {
            "status_code": None,
            "response_time": response_time,
            "success": False,
            "error": str(e)
        }

def test_concurrent_load(endpoint, method="GET", params=None, data=None, concurrent_users=20, iterations_per_user=5):
    """Test API performance under concurrent load"""
    print(f"\n=== Testing Concurrent Load for {method} {endpoint} ===")
    print(f"Simulating {concurrent_users} concurrent users, each making {iterations_per_user} requests")
    
    url = f"{API_BASE_URL}{endpoint}"
    all_results = []
    
    def user_session(user_id):
        """Simulate a user session with multiple requests"""
        user_results = []
        
        for i in range(iterations_per_user):
            result = make_request(url, method=method, params=params, data=data)
            result["user_id"] = user_id
            result["iteration"] = i + 1
            user_results.append(result)
            
            # Small random delay between requests
            time.sleep(0.1)
        
        return user_results
    
    # Execute concurrent user sessions
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_users) as executor:
        future_to_user = {executor.submit(user_session, i): i for i in range(concurrent_users)}
        
        for future in concurrent.futures.as_completed(future_to_user):
            user_id = future_to_user[future]
            try:
                results = future.result()
                all_results.extend(results)
                
                # Print summary for this user
                success_count = sum(1 for r in results if r["success"])
                avg_time = statistics.mean([r["response_time"] for r in results])
                print(f"User {user_id}: {success_count}/{iterations_per_user} successful requests, avg time: {avg_time:.2f} ms")
                
            except Exception as e:
                print(f"User {user_id}: Error - {e}")
    
    # Analyze results
    successful_results = [r for r in all_results if r["success"]]
    success_rate = len(successful_results) / len(all_results) if all_results else 0
    
    if successful_results:
        response_times = [r["response_time"] for r in successful_results]
        avg_time = statistics.mean(response_times)
        median_time = statistics.median(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        p95_time = sorted(response_times)[int(len(response_times) * 0.95)]
        
        print(f"\nLoad Test Results for {method} {endpoint}:")
        print(f"  Total Requests: {len(all_results)}")
        print(f"  Successful Requests: {len(successful_results)} ({success_rate:.2%})")
        print(f"  Average Response Time: {avg_time:.2f} ms")
        print(f"  Median Response Time: {median_time:.2f} ms")
        print(f"  Min Response Time: {min_time:.2f} ms")
        print(f"  Max Response Time: {max_time:.2f} ms")
        print(f"  95th Percentile Response Time: {p95_time:.2f} ms")
        
        # Evaluate performance
        if avg_time < 200:
            print(f"✅ Excellent performance under load (avg: {avg_time:.2f} ms)")
        elif avg_time < 500:
            print(f"✅ Good performance under load (avg: {avg_time:.2f} ms)")
        elif avg_time < 1000:
            print(f"ℹ️ Acceptable performance under load (avg: {avg_time:.2f} ms)")
        else:
            print(f"⚠️ Poor performance under load (avg: {avg_time:.2f} ms)")
        
        if success_rate < 0.95:
            print(f"⚠️ Low success rate under load ({success_rate:.2%})")
        else:
            print(f"✅ Good success rate under load ({success_rate:.2%})")
        
        return {
            "endpoint": endpoint,
            "method": method,
            "concurrent_users": concurrent_users,
            "iterations_per_user": iterations_per_user,
            "total_requests": len(all_results),
            "successful_requests": len(successful_results),
            "success_rate": success_rate,
            "avg_time": avg_time,
            "median_time": median_time,
            "min_time": min_time,
            "max_time": max_time,
            "p95_time": p95_time
        }
    else:
        print(f"❌ No successful responses for {method} {endpoint}")
        return None

def test_api_degradation(endpoint, method="GET", params=None, data=None, iterations=20):
    """Test if API performance degrades over multiple sequential requests"""
    print(f"\n=== Testing API Degradation for {method} {endpoint} ===")
    
    url = f"{API_BASE_URL}{endpoint}"
    results = []
    
    for i in range(iterations):
        result = make_request(url, method=method, params=params, data=data)
        results.append(result)
        
        if result["success"]:
            print(f"Request {i+1}: {result['response_time']:.2f} ms (Status: {result['status_code']})")
        else:
            print(f"Request {i+1}: Failed - {result.get('error', 'Unknown error')}")
        
        # Small delay between requests
        time.sleep(0.2)
    
    # Analyze for degradation
    successful_results = [r for r in results if r["success"]]
    
    if len(successful_results) >= 10:
        # Compare first half vs second half
        first_half = successful_results[:len(successful_results)//2]
        second_half = successful_results[len(successful_results)//2:]
        
        first_half_avg = statistics.mean([r["response_time"] for r in first_half])
        second_half_avg = statistics.mean([r["response_time"] for r in second_half])
        
        degradation = ((second_half_avg - first_half_avg) / first_half_avg) * 100 if first_half_avg > 0 else 0
        
        print(f"\nDegradation Analysis for {method} {endpoint}:")
        print(f"  First Half Average: {first_half_avg:.2f} ms")
        print(f"  Second Half Average: {second_half_avg:.2f} ms")
        print(f"  Change: {degradation:.2f}%")
        
        if degradation > 10:
            print(f"⚠️ Performance degradation detected ({degradation:.2f}%)")
        elif degradation > 0:
            print(f"ℹ️ Slight performance degradation detected ({degradation:.2f}%)")
        else:
            print(f"✅ No performance degradation detected ({degradation:.2f}%)")
        
        return {
            "endpoint": endpoint,
            "method": method,
            "iterations": iterations,
            "successful_requests": len(successful_results),
            "first_half_avg": first_half_avg,
            "second_half_avg": second_half_avg,
            "degradation": degradation
        }
    else:
        print(f"❌ Not enough successful responses for analysis")
        return None

def run_load_tests():
    """Run load tests to evaluate API performance under load"""
    print("\n======= STARTING API LOAD TESTS =======\n")
    
    results = {}
    
    # Test concurrent load for key endpoints
    results["products_load"] = test_concurrent_load("/products", concurrent_users=10, iterations_per_user=5)
    results["categories_load"] = test_concurrent_load("/categories", concurrent_users=10, iterations_per_user=5)
    
    # Get a product ID for testing product detail
    products_response = requests.get(f"{API_BASE_URL}/products")
    if products_response.status_code == 200 and products_response.json():
        product_id = products_response.json()[0]["id"]
        results["product_detail_load"] = test_concurrent_load(f"/products/{product_id}", concurrent_users=10, iterations_per_user=5)
    
    # Test for performance degradation
    results["products_degradation"] = test_api_degradation("/products", iterations=20)
    
    # Print summary
    print("\n======= API LOAD TEST SUMMARY =======")
    
    for test_name, result in results.items():
        if result and "avg_time" in result:
            status = "✅" if result["avg_time"] < 500 else "⚠️"
            print(f"{status} {test_name}: {result['avg_time']:.2f} ms avg, {result['success_rate']:.2%} success rate")
        elif result and "degradation" in result:
            status = "✅" if result["degradation"] <= 0 else "⚠️"
            print(f"{status} {test_name}: {result['degradation']:.2f}% degradation")
    
    print("\n======= API LOAD TESTS COMPLETED =======")
    return results

if __name__ == "__main__":
    run_load_tests()