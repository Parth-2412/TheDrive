from datetime import datetime, timezone

# Or if you prefer a helper function:
def utc_now():
    """Get current UTC datetime with timezone awareness"""
    return datetime.now(timezone.utc)