"""
Seed the database with demo products and test users
"""
from database import init_database, execute_insert
from auth import hash_password

# Demo products data
PRODUCTS = [
    {
        "name": "Premium Olive Oil",
        "category": "Food Commodities",
        "base_price": 45.0,
        "unit": "kg",
        "stock": 5000,
        "description": "Extra virgin olive oil from Mediterranean groves. Ideal for restaurants and food service.",
        "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"
    },
    {
        "name": "Basmati Rice",
        "category": "Food Commodities",
        "base_price": 0.3,
        "unit": "kg",
        "stock": 15000,
        "description": "Premium long-grain basmati rice. Perfect for hotels and restaurant chains.",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"
    },
    {
        "name": "Industrial Coffee Beans",
        "category": "Food Commodities",
        "base_price": 28.0,
        "unit": "kg",
        "stock": 8000,
        "description": "Premium Arabica coffee beans sourced from sustainable farms worldwide.",
        "image_url": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
    },
    {
        "name": "Disposable Gloves",
        "category": "Durable Consumables",
        "base_price": 18.0,
        "unit": "box",
        "stock": 20000,
        "description": "Nitrile gloves for food service and hospitality industry. FDA approved.",
        "image_url": "https://images.unsplash.com/photo-1584930330451-7ff79da88cfd?w=800&q=80"
    },
    {
        "name": "Cleaning Supplies Kit",
        "category": "Durable Consumables",
        "base_price": 35.0,
        "unit": "kit",
        "stock": 3000,
        "description": "Commercial-grade cleaning supplies for hospitality and food service operations.",
        "image_url": "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&q=80"
    },
    {
        "name": "Organic Pasta",
        "category": "Food Commodities",
        "base_price": 8.0,
        "unit": "kg",
        "stock": 12000,
        "description": "Italian organic durum wheat pasta. Bulk quantities for restaurant supply.",
        "image_url": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80"
    },
    {
        "name": "Paper Towels",
        "category": "Durable Consumables",
        "base_price": 22.0,
        "unit": "case",
        "stock": 8500,
        "description": "Industrial paper towels for commercial kitchens and hospitality.",
        "image_url": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80"
    },
    {
        "name": "Sea Salt",
        "category": "Food Commodities",
        "base_price": 15.0,
        "unit": "kg",
        "stock": 6000,
        "description": "Natural sea salt from Atlantic coast. Food-grade for culinary use.",
        "image_url": "https://images.unsplash.com/photo-1583954369783-07df0e2c6fa7?w=800&q=80"
    }
]

# Demo users
USERS = [
    {
        "email": "demo@restaurant.com",
        "password": "demo123",
        "company_name": "Demo Restaurant Chain",
        "country": "Germany",
        "region": "EU"
    },
    {
        "email": "test@hotel.com",
        "password": "test123",
        "company_name": "Test Hotel Group",
        "country": "France",
        "region": "EU"
    }
]


def seed_database():
    """Seed the database with demo data"""
    print("🌱 Seeding database...")
    
    # Seed products
    for product in PRODUCTS:
        execute_insert(
            """INSERT INTO products (name, category, base_price, unit, stock, description, image_url)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                product["name"],
                product["category"],
                product["base_price"],
                product["unit"],
                product["stock"],
                product["description"],
                product["image_url"]
            )
        )
    print(f"✅ Seeded {len(PRODUCTS)} products")
    
    # Seed users
    for user in USERS:
        password_hash = hash_password(user["password"])
        execute_insert(
            """INSERT INTO users (email, password_hash, company_name, country, region)
               VALUES (?, ?, ?, ?, ?)""",
            (
                user["email"],
                password_hash,
                user["company_name"],
                user["country"],
                user["region"]
            )
        )
    print(f"✅ Seeded {len(USERS)} demo users")
    print("\n📝 Demo Credentials:")
    for user in USERS:
        print(f"   Email: {user['email']} | Password: {user['password']}")
    print("\n✅ Database seeding complete!")


if __name__ == "__main__":
    # Initialize database first
    init_database()
    # Seed with data
    seed_database()
