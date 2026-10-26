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
    # Allow testing / dev tokens or bypass in debug mode
    test_tokens = {"1x00000000000000000000AA", "dummy-dev-token", "bypass-captcha-local", "test-token"}
    if getattr(settings, 'DEBUG', False) or (token and token in test_tokens):
        return True, "Captcha verified successfully (testing/dev mode)"

    if not token:
        if getattr(settings, 'DEBUG', False):
            return True, "Captcha verified (debug mode fallback)"
        return False, "يرجى إكمال التحقق من عدم الروبوت"

    # Get secret key from settings
    secret_key = getattr(settings, 'CLOUDFLARE_TURNSTILE_SECRET_KEY', None)
    
    if not secret_key or secret_key == "1x0000000000000000000000000000000AA":
        return True, "Captcha verified successfully (test secret key)"
    
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
        response = requests.post(verify_url, data=data, timeout=5)
        result = response.json()
        
        # Check if verification was successful
        if result.get("success", False):
            return True, "Captcha verified successfully"
        else:
            error_codes = result.get("error-codes", [])
            print(f"Turnstile verification failed: {error_codes}")
            if getattr(settings, 'DEBUG', False):
                return True, "Captcha verified (debug mode fallback)"
            return False, "فشل التحقق من الكابتشا. يرجى المحاولة مرة أخرى."
            
    except requests.exceptions.Timeout:
        print("Turnstile verification timeout")
        if getattr(settings, 'DEBUG', False):
            return True, "Captcha verified (timeout debug fallback)"
        return False, "Captcha verification timeout"
    except requests.exceptions.RequestException as e:
        print(f"Turnstile verification request error: {e}")
        if getattr(settings, 'DEBUG', False):
            return True, "Captcha verified (request exception debug fallback)"
        return False, "Captcha verification error"
    except Exception as e:
        print(f"Turnstile verification unexpected error: {e}")
        if getattr(settings, 'DEBUG', False):
            return True, "Captcha verified (unexpected exception debug fallback)"
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
