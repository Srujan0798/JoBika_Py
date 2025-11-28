#!/usr/bin/env python3
"""
Test Supabase connection with different formats
This will help us find the CORRECT connection string
"""
import psycopg2
from psycopg2.extras import RealDictCursor

# Your Supabase details
PROJECT_REF = "eabkwiklxjbqbfxcdlkk"
PASSWORD = "23110081aiiTgn"
REGION = "aws-0-ap-south-1"

# Different connection string formats to try
connection_strings = {
    "Direct Connection": f"postgresql://postgres:{PASSWORD}@db.{PROJECT_REF}.supabase.co:5432/postgres",
    
    "Session Pooler (postgres user)": f"postgresql://postgres:{PASSWORD}@{REGION}.pooler.supabase.com:5432/postgres",
    
    "Session Pooler (postgres.ref user)": f"postgresql://postgres.{PROJECT_REF}:{PASSWORD}@{REGION}.pooler.supabase.com:5432/postgres",
    
    "Transaction Pooler (postgres user)": f"postgresql://postgres:{PASSWORD}@{REGION}.pooler.supabase.com:6543/postgres",
    
    "Transaction Pooler (postgres.ref user)": f"postgresql://postgres.{PROJECT_REF}:{PASSWORD}@{REGION}.pooler.supabase.com:6543/postgres",
}

print("=" * 70)
print("Testing Supabase Connection Strings")
print("=" * 70)
print()

working_connections = []

for name, conn_string in connection_strings.items():
    print(f"Testing: {name}")
    print(f"String: {conn_string[:50]}...")
    
    try:
        conn = psycopg2.connect(conn_string, sslmode='require', cursor_factory=RealDictCursor, connect_timeout=5)
        cursor = conn.cursor()
        
        # Test query
        cursor.execute("SELECT COUNT(*) as count FROM salary_roles")
        result = cursor.fetchone()
        count = result['count']
        
        conn.close()
        
        print(f"✅ SUCCESS! Found {count} salary roles")
        print(f"   This connection works!")
        print()
        working_connections.append((name, conn_string))
        
    except psycopg2.OperationalError as e:
        error_msg = str(e).split('\n')[0]
        print(f"❌ FAILED: {error_msg}")
        print()
    except Exception as e:
        print(f"❌ ERROR: {e}")
        print()

print("=" * 70)
print("Summary")
print("=" * 70)
print()

if working_connections:
    print(f"✅ Found {len(working_connections)} working connection(s):")
    print()
    for name, conn_string in working_connections:
        print(f"✓ {name}")
        print(f"  {conn_string}")
        print()
    
    print("=" * 70)
    print("RECOMMENDED CONNECTION STRING FOR RENDER:")
    print("=" * 70)
    print(working_connections[0][1])
    print()
    
else:
    print("❌ No working connections found!")
    print()
    print("Possible issues:")
    print("1. Password might be incorrect")
    print("2. Connection Pooling might not be enabled in Supabase")
    print("3. IP might be blocked")
    print()
    print("Next steps:")
    print("1. Go to Supabase Dashboard → Settings → Database")
    print("2. Enable 'Connection Pooling'")
    print("3. Copy the connection string from there")
    print()
