import os
import sys
import time
import django
import psycopg2
from dotenv import load_dotenv
import secrets

# Load environment variables
load_dotenv()

# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def wait_for_database(max_retries=30, retry_interval=1):
    """Wait for PostgreSQL database to be ready"""
    retries = 0
    while retries < max_retries:
        try:
            conn = psycopg2.connect(
                dbname=os.getenv('POSTGRES_DB', 'thedrive'),
                user=os.getenv('POSTGRES_USER'),
                password=os.getenv('POSTGRES_PASSWORD'),
                host=os.getenv('POSTGRES_HOST', 'postgres'),
                port=os.getenv('POSTGRES_PORT', '5432')
            )
            conn.close()
            print("Database is ready!")
            return True
        except psycopg2.OperationalError:
            retries += 1
            print(f"Waiting for database... ({retries}/{max_retries})")
            time.sleep(retry_interval)
    return False

def initialize_ai_node():
    """Initialize AI node and link it to a drive user"""
    from api.models import DriveUser, AINode
    from django.db import transaction
    
    public_key = os.getenv('AI_NODE_PUBLIC_KEY')
    if not public_key:
        print("Error: AI_NODE_PUBLIC_KEY not found in environment variables")
        return False
        
    try:
        with transaction.atomic():
            # Check if AI node already exists
            if AINode.objects.filter(public_key=public_key).exists():
                print("AI Node already exists")
                return True
                
            # Create drive user for AI node
            username = public_key
            user = DriveUser.objects.create_user(
                public_key=public_key,
                username=username
            )
            print(f"Created DriveUser: {username}")
            
            # Create and link AI node
            ai_node = AINode.objects.create(
                name="Primary AI Node",
                public_key=public_key,
                is_authorized=True,
                own_user_object=user
            )
            
            user.preferred_ai_node = ai_node
            user.save()
            
            print(f"Successfully initialized AI Node: {ai_node.id}")
            return True
            
    except Exception as e:
        print(f"Error initializing AI node: {e}")
        return False

def main():
    # Wait for database
    if not wait_for_database():
        print("Error: Database not available")
        sys.exit(1)

    # Setup Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

    # Get the project root directory
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    manage_py = os.path.join(project_root, 'manage.py')

    # Run migrations using full path
    from django.core.management import execute_from_command_line
    execute_from_command_line([manage_py, 'makemigrations'])
    execute_from_command_line([manage_py, 'migrate'])

    # Initialize AI node
    if not initialize_ai_node():
        print("Error: Failed to initialize AI node")
        sys.exit(1)

    # Start Django server
    print("\nStarting Django development server...")
    execute_from_command_line([manage_py, 'runserver', '0.0.0.0:8000'])

if __name__ == "__main__":
    main()