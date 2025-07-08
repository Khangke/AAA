from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import hashlib
import jwt
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# JWT settings
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password


# Define Enums
class PaymentMethod(str, Enum):
    COD = "cod"
    BANK_TRANSFER = "bank_transfer"

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Contact Models
class ContactForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    subject: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactFormCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    subject: str
    message: str

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    phone: str = ""
    address: str = ""
    city: str = ""
    district: str = ""
    ward: str = ""
    zip_code: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str = ""
    address: str = ""
    city: str = ""
    district: str = ""
    ward: str = ""
    zip_code: str = ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: str = None
    phone: str = None
    address: str = None
    city: str = None
    district: str = None
    ward: str = None
    zip_code: str = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: str = None

# Cart Models
class CartItem(BaseModel):
    product_id: str
    quantity: int
    price: float
    name: str
    image_url: str

class Cart(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = None
    items: List[CartItem] = []
    total_amount: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CartItemAdd(BaseModel):
    product_id: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

# Order Models
class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float
    name: str
    image_url: str
    subtotal: float

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = None
    order_number: str
    items: List[OrderItem]
    subtotal: float
    shipping_fee: float = 30000  # Fixed 30k VND
    total_amount: float
    payment_method: PaymentMethod
    status: OrderStatus = OrderStatus.PENDING
    customer_info: Dict[str, str]
    shipping_address: Dict[str, str]
    notes: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    items: List[CartItem]
    payment_method: PaymentMethod
    customer_info: Dict[str, str]
    shipping_address: Dict[str, str]
    notes: str = ""

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    original_price: float = None
    category: str
    image_url: str
    images: List[str] = []
    in_stock: bool = True
    stock_quantity: int = 0
    featured: bool = False
    rating: float = 5.0
    reviews_count: int = 0
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    original_price: float = None
    category: str
    image_url: str
    images: List[str] = []
    in_stock: bool = True
    stock_quantity: int = 0
    featured: bool = False
    rating: float = 5.0
    reviews_count: int = 0
    tags: List[str] = []

class ProductUpdate(BaseModel):
    name: str = None
    description: str = None
    price: float = None
    original_price: float = None
    category: str = None
    image_url: str = None
    images: List[str] = None
    in_stock: bool = None
    stock_quantity: int = None
    featured: bool = None
    rating: float = None
    reviews_count: int = None
    tags: List[str] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Product endpoints
@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: str = None,
    featured: bool = None,
    search: str = None,
    skip: int = 0,
    limit: int = 20
):
    """Get products with optional filtering and pagination"""
    query = {}
    
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query).skip(skip).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a specific product by ID"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate):
    """Create a new product"""
    product_dict = product_data.dict()
    product_obj = Product(**product_dict)
    await db.products.insert_one(product_obj.dict())
    return product_obj

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductUpdate):
    """Update an existing product"""
    update_dict = {k: v for k, v in product_data.dict().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_dict["updated_at"] = datetime.utcnow()
    result = await db.products.update_one(
        {"id": product_id}, 
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product = await db.products.find_one({"id": product_id})
    return Product(**product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@api_router.get("/categories", response_model=dict)
async def get_all_categories():
    """Get all product categories (alternative endpoint)"""
    categories = await db.products.distinct("category")
    return {"categories": categories}

@api_router.get("/products/categories")
async def get_categories():
    """Get all product categories"""
    categories = await db.products.distinct("category")
    return {"categories": categories}

@api_router.post("/products/seed")
async def seed_products():
    """Seed database with sample products"""
    # Check if products already exist
    existing_count = await db.products.count_documents({})
    if existing_count > 0:
        return {"message": f"Database already has {existing_count} products"}
    
    sample_products = [
        {
            "name": "Vòng Trầm Hương Cao Cấp",
            "description": "Vòng tay trầm hương nguyên chất từ Khánh Hòa, mang lại may mắn và bình an. Được chế tác từ những cây trầm hương già nhất với hương thơm đặc trưng.",
            "price": 2500000,
            "original_price": 3000000,
            "category": "Vòng Tay",
            "image_url": "https://images.unsplash.com/photo-1662473217799-6e7288f19741",
            "images": ["https://images.unsplash.com/photo-1662473217799-6e7288f19741"],
            "in_stock": True,
            "stock_quantity": 15,
            "featured": True,
            "rating": 4.8,
            "reviews_count": 24,
            "tags": ["trầm hương", "vòng tay", "may mắn", "cao cấp"]
        },
        {
            "name": "Trầm Hương Nguyên Khối",
            "description": "Khối trầm hương tự nhiên 100% từ rừng Khánh Hòa, hương thơm nồng nàn, quý hiếm. Thích hợp cho thiền định và tâm linh.",
            "price": 5800000,
            "original_price": 6500000,
            "category": "Trầm Khối",
            "image_url": "https://images.unsplash.com/photo-1719611639294-f754d39a6bed",
            "images": ["https://images.unsplash.com/photo-1719611639294-f754d39a6bed"],
            "in_stock": True,
            "stock_quantity": 8,
            "featured": True,
            "rating": 4.9,
            "reviews_count": 18,
            "tags": ["trầm hương", "nguyên khối", "thiền định", "quý hiếm"]
        },
        {
            "name": "Nhang Trầm Hương Premium",
            "description": "Nhang trầm hương cao cấp, thích hợp cho không gian thiền định và thờ cúng. Mỗi que nhang cháy được 45-60 phút với hương thơm dịu nhẹ.",
            "price": 850000,
            "original_price": 1000000,
            "category": "Nhang Trầm",
            "image_url": "https://images.unsplash.com/photo-1652959889888-53d048374e35",
            "images": ["https://images.unsplash.com/photo-1652959889888-53d048374e35"],
            "in_stock": True,
            "stock_quantity": 25,
            "featured": True,
            "rating": 4.7,
            "reviews_count": 32,
            "tags": ["nhang trầm", "premium", "thiền định", "thờ cúng"]
        },
        {
            "name": "Trầm Hương Thiền Định",
            "description": "Trầm hương đặc biệt dành cho thiền định và tâm linh. Hương thơm thanh tịnh, giúp tâm trí được thư giãn và tập trung.",
            "price": 3200000,
            "original_price": 3800000,
            "category": "Trầm Khối",
            "image_url": "https://images.unsplash.com/photo-1589115324861-b757b1dd2247",
            "images": ["https://images.unsplash.com/photo-1589115324861-b757b1dd2247"],
            "in_stock": True,
            "stock_quantity": 12,
            "featured": True,
            "rating": 4.8,
            "reviews_count": 16,
            "tags": ["trầm hương", "thiền định", "tâm linh", "thư giãn"]
        },
        {
            "name": "Bộ Sưu Tập Luxury",
            "description": "Bộ sưu tập trầm hương cao cấp đặc biệt, phiên bản giới hạn. Bao gồm vòng tay, nhang và khối trầm hương trong hộp gỗ sang trọng.",
            "price": 12500000,
            "original_price": 15000000,
            "category": "Bộ Sưu Tập",
            "image_url": "https://images.pexels.com/photos/6998574/pexels-photo-6998574.jpeg",
            "images": ["https://images.pexels.com/photos/6998574/pexels-photo-6998574.jpeg"],
            "in_stock": True,
            "stock_quantity": 3,
            "featured": True,
            "rating": 5.0,
            "reviews_count": 8,
            "tags": ["bộ sưu tập", "luxury", "giới hạn", "hộp gỗ"]
        },
        {
            "name": "Vòng Trầm Hương Nữ",
            "description": "Vòng tay trầm hương nhỏ gọn dành cho nữ giới, thiết kế tinh tế với hạt trầm hương tròn đều. Thích hợp đeo hàng ngày.",
            "price": 1800000,
            "original_price": 2200000,
            "category": "Vòng Tay",
            "image_url": "https://images.unsplash.com/photo-1611652022419-a9419f74343d",
            "images": ["https://images.unsplash.com/photo-1611652022419-a9419f74343d"],
            "in_stock": True,
            "stock_quantity": 20,
            "featured": False,
            "rating": 4.6,
            "reviews_count": 28,
            "tags": ["vòng tay", "nữ giới", "tinh tế", "hàng ngày"]
        },
        {
            "name": "Trầm Hương Thơm Phòng",
            "description": "Trầm hương dạng bột thơm phòng, hương thơm dịu nhẹ kéo dài 4-6 giờ. Thích hợp cho không gian làm việc và nghỉ ngơi.",
            "price": 650000,
            "original_price": 800000,
            "category": "Trầm Bột",
            "image_url": "https://images.unsplash.com/photo-1603201667230-bd54a8b9d8b7",
            "images": ["https://images.unsplash.com/photo-1603201667230-bd54a8b9d8b7"],
            "in_stock": True,
            "stock_quantity": 30,
            "featured": False,
            "rating": 4.4,
            "reviews_count": 22,
            "tags": ["trầm bột", "thơm phòng", "làm việc", "nghỉ ngơi"]
        },
        {
            "name": "Vòng Trầm Hương Nam",
            "description": "Vòng tay trầm hương nam tính với hạt to, thiết kế mạnh mẽ. Phù hợp với phong cách lịch lãm và sang trọng.",
            "price": 3500000,
            "original_price": 4000000,
            "category": "Vòng Tay",
            "image_url": "https://images.unsplash.com/photo-1608828201317-ce72715cb12a",
            "images": ["https://images.unsplash.com/photo-1608828201317-ce72715cb12a"],
            "in_stock": True,
            "stock_quantity": 10,
            "featured": False,
            "rating": 4.7,
            "reviews_count": 15,
            "tags": ["vòng tay", "nam giới", "mạnh mẽ", "lịch lãm"]
        }
    ]
    
    # Insert sample products
    products_to_insert = []
    for product_data in sample_products:
        product_obj = Product(**product_data)
        products_to_insert.append(product_obj.dict())
    
    await db.products.insert_many(products_to_insert)
    return {"message": f"Successfully seeded {len(products_to_insert)} products"}

# Contact Form endpoints
@api_router.post("/contact", response_model=ContactForm)
async def submit_contact_form(form_data: ContactFormCreate):
    """Submit contact form"""
    contact_dict = form_data.dict()
    contact_obj = ContactForm(**contact_dict)
    await db.contacts.insert_one(contact_obj.dict())
    return contact_obj

@api_router.get("/contact", response_model=List[ContactForm])
async def get_contact_forms():
    """Get all contact form submissions (admin only)"""
    contacts = await db.contacts.find().sort("created_at", -1).to_list(100)
    return [ContactForm(**contact) for contact in contacts]

# User Authentication endpoints
@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_dict = user_data.dict()
    hashed_password = hash_password(user_dict.pop("password"))
    user_obj = User(**user_dict)
    user_in_db = UserInDB(**user_obj.dict(), hashed_password=hashed_password)
    
    await db.users.insert_one(user_in_db.dict())
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_obj.id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    """Login user"""
    # Find user
    user = await db.users.find_one({"email": user_credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user_in_db = UserInDB(**user)
    
    # Verify password
    if not verify_password(user_credentials.password, user_in_db.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_in_db.id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=User)
async def get_current_user(current_user_id: str = Depends(verify_token)):
    """Get current user info"""
    user = await db.users.find_one({"id": current_user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return User(**user)

@api_router.put("/auth/me", response_model=User)
async def update_current_user(user_update: UserUpdate, current_user_id: str = Depends(verify_token)):
    """Update current user info"""
    update_dict = {k: v for k, v in user_update.dict().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_dict["updated_at"] = datetime.utcnow()
    result = await db.users.update_one(
        {"id": current_user_id}, 
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = await db.users.find_one({"id": current_user_id})
    return User(**user)

# Cart endpoints
@api_router.post("/cart/add")
async def add_to_cart(cart_item: CartItemAdd, current_user_id: str = Depends(verify_token)):
    """Add item to cart"""
    # Get product details
    product = await db.products.find_one({"id": cart_item.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if cart exists for user
    cart = await db.carts.find_one({"user_id": current_user_id})
    
    if not cart:
        # Create new cart
        cart_obj = Cart(user_id=current_user_id)
        cart = cart_obj.dict()
    
    # Check if item already exists in cart
    existing_item = None
    for i, item in enumerate(cart["items"]):
        if item["product_id"] == cart_item.product_id:
            existing_item = i
            break
    
    if existing_item is not None:
        # Update quantity
        cart["items"][existing_item]["quantity"] += cart_item.quantity
    else:
        # Add new item
        new_item = CartItem(
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=product["price"],
            name=product["name"],
            image_url=product["image_url"]
        )
        cart["items"].append(new_item.dict())
    
    # Calculate total
    total = sum(item["price"] * item["quantity"] for item in cart["items"])
    cart["total_amount"] = total
    cart["updated_at"] = datetime.utcnow()
    
    # Save cart
    await db.carts.update_one(
        {"user_id": current_user_id},
        {"$set": cart},
        upsert=True
    )
    
    return {"message": "Item added to cart", "cart": cart}

@api_router.get("/cart", response_model=Cart)
async def get_cart(current_user_id: str = Depends(verify_token)):
    """Get user's cart"""
    cart = await db.carts.find_one({"user_id": current_user_id})
    if not cart:
        # Return empty cart
        cart_obj = Cart(user_id=current_user_id)
        return cart_obj
    
    return Cart(**cart)

@api_router.put("/cart/item/{product_id}")
async def update_cart_item(product_id: str, cart_update: CartItemUpdate, current_user_id: str = Depends(verify_token)):
    """Update cart item quantity"""
    cart = await db.carts.find_one({"user_id": current_user_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Find and update item
    item_found = False
    for item in cart["items"]:
        if item["product_id"] == product_id:
            if cart_update.quantity <= 0:
                cart["items"].remove(item)
            else:
                item["quantity"] = cart_update.quantity
            item_found = True
            break
    
    if not item_found:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    # Calculate total
    total = sum(item["price"] * item["quantity"] for item in cart["items"])
    cart["total_amount"] = total
    cart["updated_at"] = datetime.utcnow()
    
    # Save cart
    await db.carts.update_one(
        {"user_id": current_user_id},
        {"$set": cart}
    )
    
    return {"message": "Cart updated", "cart": cart}

@api_router.delete("/cart/item/{product_id}")
async def remove_from_cart(product_id: str, current_user_id: str = Depends(verify_token)):
    """Remove item from cart"""
    cart = await db.carts.find_one({"user_id": current_user_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Find and remove item
    item_found = False
    for item in cart["items"]:
        if item["product_id"] == product_id:
            cart["items"].remove(item)
            item_found = True
            break
    
    if not item_found:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    # Calculate total
    total = sum(item["price"] * item["quantity"] for item in cart["items"])
    cart["total_amount"] = total
    cart["updated_at"] = datetime.utcnow()
    
    # Save cart
    await db.carts.update_one(
        {"user_id": current_user_id},
        {"$set": cart}
    )
    
    return {"message": "Item removed from cart", "cart": cart}

@api_router.delete("/cart")
async def clear_cart(current_user_id: str = Depends(verify_token)):
    """Clear user's cart"""
    await db.carts.delete_one({"user_id": current_user_id})
    return {"message": "Cart cleared"}

# Order endpoints
@api_router.post("/orders", response_model=Order)
async def create_order(order_data: OrderCreate, current_user_id: str = Depends(verify_token)):
    """Create a new order"""
    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in order_data.items)
    total_amount = subtotal + 30000  # Fixed shipping fee
    
    # Generate order number
    order_number = f"ORD-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    # Create order items
    order_items = []
    for item in order_data.items:
        order_item = OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price,
            name=item.name,
            image_url=item.image_url,
            subtotal=item.price * item.quantity
        )
        order_items.append(order_item)
    
    # Create order
    order_obj = Order(
        user_id=current_user_id,
        order_number=order_number,
        items=order_items,
        subtotal=subtotal,
        total_amount=total_amount,
        payment_method=order_data.payment_method,
        customer_info=order_data.customer_info,
        shipping_address=order_data.shipping_address,
        notes=order_data.notes
    )
    
    await db.orders.insert_one(order_obj.dict())
    
    # Clear cart after successful order
    await db.carts.delete_one({"user_id": current_user_id})
    
    return order_obj

@api_router.get("/orders", response_model=List[Order])
async def get_user_orders(current_user_id: str = Depends(verify_token)):
    """Get user's orders"""
    orders = await db.orders.find({"user_id": current_user_id}).sort("created_at", -1).to_list(100)
    return [Order(**order) for order in orders]

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user_id: str = Depends(verify_token)):
    """Get specific order"""
    order = await db.orders.find_one({"id": order_id, "user_id": current_user_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**order)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
