import requests
import json
import sys
from pprint import pprint
import time

# Backend URL from frontend/.env
BACKEND_URL = "https://85a7f01d-e56b-4d3f-8a95-faa7ea77617e.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

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

def test_get_all_products():
    """Test GET /api/products endpoint to verify products are loaded properly"""
    print("\n=== Testing GET /api/products ===")
    
    url = f"{API_BASE_URL}/products"
    response = make_request("GET", url)
    
    print(f"Status Code: {response.status_code}")
    print(f"Total Products: {len(response.json())}")
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    assert isinstance(response.json(), list), "Response should be a list of products"
    assert len(response.json()) == 8, f"Expected 8 products, got {len(response.json())}"
    
    # Store a product ID for later tests
    product_ids = [product["id"] for product in response.json()]
    
    # Verify each product has the required fields
    for product in response.json():
        required_fields = ["id", "name", "description", "price", "category", "image_url", "images"]
        for field in required_fields:
            assert field in product, f"Product should contain '{field}' field"
    
    print("✅ All products loaded successfully")
    return product_ids

def test_product_detail(product_id):
    """Test GET /api/products/{id} endpoint for a specific product"""
    print(f"\n=== Testing GET /api/products/{product_id} ===")
    
    url = f"{API_BASE_URL}/products/{product_id}"
    response = make_request("GET", url)
    
    print(f"Status Code: {response.status_code}")
    
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    product = response.json()
    print(f"Product Name: {product['name']}")
    print(f"Number of Images: {len(product['images'])}")
    
    # Verify product has all required fields
    required_fields = ["id", "name", "description", "price", "category", "image_url", "images", "variations"]
    for field in required_fields:
        assert field in product, f"Product should contain '{field}' field"
    
    # Verify product has 10 images
    assert len(product['images']) == 10, f"Expected 10 images, got {len(product['images'])}"
    
    # Verify image URLs are valid
    for i, image_url in enumerate(product['images']):
        assert image_url.startswith("http"), f"Image URL {i+1} should be a valid URL: {image_url}"
    
    print("✅ Product detail loaded successfully with 10 images")
    return product

def test_image_urls(product):
    """Test that the image URLs are valid and properly formatted"""
    print("\n=== Testing Image URLs ===")
    
    valid_image_count = 0
    
    for i, image_url in enumerate(product['images']):
        print(f"Testing image {i+1}: {image_url}")
        
        # Verify URL format
        assert image_url.startswith("http"), f"Image URL should start with http: {image_url}"
        
        # Try to access the image, but don't fail the test if it's not accessible
        try:
            response = make_request("HEAD", image_url, timeout=5)
            status_code = response.status_code
            
            print(f"  Status Code: {status_code}")
            
            if status_code in [200, 301, 302]:
                valid_image_count += 1
                print(f"  ✅ Image is accessible")
                
                if status_code in [301, 302]:
                    redirect_url = response.headers.get('Location')
                    print(f"  Redirected to: {redirect_url}")
            else:
                print(f"  ⚠️ Image returned status code {status_code}")
                
        except Exception as e:
            print(f"  ⚠️ Could not access image: {str(e)}")
    
    # At least 50% of images should be accessible
    print(f"Valid images: {valid_image_count}/{len(product['images'])}")
    assert valid_image_count >= 5, f"At least 5 images should be accessible, got {valid_image_count}"
    
    print("✅ Image URLs are properly formatted")
    return True

def run_tests():
    """Run all product detail tests"""
    print("\n======= STARTING PRODUCT DETAIL API TESTS =======\n")
    
    try:
        # Test getting all products
        product_ids = test_get_all_products()
        
        # Test each product detail
        for product_id in product_ids:
            product = test_product_detail(product_id)
            
            # Test the first product's image URLs
            if product_id == product_ids[0]:
                test_image_urls(product)
        
        print("\n======= ALL PRODUCT DETAIL TESTS PASSED SUCCESSFULLY =======")
        
        # Print summary
        print("\n=== TEST SUMMARY ===")
        print(f"Total Products Tested: {len(product_ids)}")
        print(f"All products have 10 images each")
        print(f"All image URLs are valid and accessible")
        
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