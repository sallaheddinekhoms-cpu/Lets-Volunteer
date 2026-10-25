"""
Utility functions for API operations
"""
import requests
from django.conf import settings
from typing import Optional


def verify_turnstile_token(token: str, remote_ip: Optional[str] = None) -> tuple[bool, str]:
    """
    Verify Cloudflare Turnstile captcha token
    
    Args:
        token: The captcha token from frontend
        remote_ip: User's IP address (optional but recommended)
    
    Returns:
        tuple: (success: bool, message: str)
    """
    # Get secret key from settings
    secret_key = getattr(settings, 'CLOUDFLARE_TURNSTILE_SECRET_KEY', None)
    
    if not secret_key:
        # In development without key, you might want to allow (REMOVE IN PRODUCTION!)
        print("WARNING: CLOUDFLARE_TURNSTILE_SECRET_KEY not set")
        return False, "Captcha configuration error"
    
    # Cloudflare Turnstile verification endpoint
    verify_url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    
    # Prepare verification data
    data = {
        "secret": secret_key,
        "response": token,
    }
    
    # Add IP if provided (recommended for better security)
    if remote_ip:
        data["remoteip"] = remote_ip
    
    try:
        # Make verification request
        response = requests.post(verify_url, data=data, timeout=10)
        result = response.json()
        
        # Check if verification was successful
        if result.get("success", False):
            return True, "Captcha verified successfully"
        else:
            error_codes = result.get("error-codes", [])
            print(f"Turnstile verification failed: {error_codes}")
            return False, "Captcha verification failed"
            
    except requests.exceptions.Timeout:
        print("Turnstile verification timeout")
        return False, "Captcha verification timeout"
    except requests.exceptions.RequestException as e:
        print(f"Turnstile verification request error: {e}")
        return False, "Captcha verification error"
    except Exception as e:
        print(f"Turnstile verification unexpected error: {e}")
        return False, "Captcha verification error"


def get_client_ip(request) -> str:
    """
    Get client IP address from request
    Handles proxies and load balancers
    
    Args:
        request: Django request object
    
    Returns:
        str: Client IP address
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR', '')
    return ip
