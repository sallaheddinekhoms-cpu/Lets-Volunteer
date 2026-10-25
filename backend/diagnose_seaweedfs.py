"""
Enhanced SeaweedFS Diagnostic Tool
This script provides detailed diagnostics for SeaweedFS connectivity issues.
"""

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError, EndpointConnectionError, NoCredentialsError
import urllib.request
import urllib.error
import socket
import ssl
import json
from urllib.parse import urlparse

# SeaweedFS Configuration
SEAWEEDFS_CONFIG = {
    'bucket_name': 'lets-volunteer',
    'endpoint_url': 'https://s3.lets-volunteer-dz.org',
    'access_key': 'OjG0LyKOhYpCLw7TJNRroot',
    'secret_key': 'reJtKflpdIO1CYdIjDCZuDKb1i8zIg89Pq1w7cpHroot',
    'region': 'us-east-1'
}


def test_dns_resolution():
    """Test DNS resolution for the endpoint"""
    print("🔍 Testing DNS Resolution...")
    
    parsed_url = urlparse(SEAWEEDFS_CONFIG['endpoint_url'])
    hostname = parsed_url.hostname
    
    try:
        ip_address = socket.gethostbyname(hostname)
        print(f"✅ DNS resolution successful: {hostname} -> {ip_address}")
        return True, ip_address
    except socket.gaierror as e:
        print(f"❌ DNS resolution failed: {e}")
        return False, None


def test_tcp_connection():
    """Test TCP connectivity to the endpoint"""
    print("🔌 Testing TCP Connection...")
    
    parsed_url = urlparse(SEAWEEDFS_CONFIG['endpoint_url'])
    hostname = parsed_url.hostname
    port = parsed_url.port or (443 if parsed_url.scheme == 'https' else 80)
    
    try:
        sock = socket.create_connection((hostname, port), timeout=10)
        sock.close()
        print(f"✅ TCP connection successful to {hostname}:{port}")
        return True
    except (socket.timeout, ConnectionRefusedError, OSError) as e:
        print(f"❌ TCP connection failed: {e}")
        return False


def test_ssl_certificate():
    """Test SSL certificate validation"""
    print("🔒 Testing SSL Certificate...")
    
    parsed_url = urlparse(SEAWEEDFS_CONFIG['endpoint_url'])
    if parsed_url.scheme != 'https':
        print("ℹ️  Not using HTTPS, skipping SSL test")
        return True
    
    hostname = parsed_url.hostname
    port = parsed_url.port or 443
    
    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                print(f"✅ SSL certificate valid for {hostname}")
                print(f"   Issued to: {cert.get('subject', [[('commonName', 'Unknown')]])[0][0][1]}")
                print(f"   Issued by: {cert.get('issuer', [[('commonName', 'Unknown')]])[0][0][1]}")
                return True
    except ssl.SSLError as e:
        print(f"❌ SSL certificate error: {e}")
        return False
    except Exception as e:
        print(f"❌ SSL test failed: {e}")
        return False


def test_http_response():
    """Test HTTP response from the endpoint"""
    print("🌐 Testing HTTP Response...")
    
    try:
        # Try different paths
        test_urls = [
            SEAWEEDFS_CONFIG['endpoint_url'],
            f"{SEAWEEDFS_CONFIG['endpoint_url']}/",
            f"{SEAWEEDFS_CONFIG['endpoint_url']}/{SEAWEEDFS_CONFIG['bucket_name']}"
        ]
        
        for url in test_urls:
            print(f"   Testing: {url}")
            try:
                req = urllib.request.Request(url)
                req.add_header('User-Agent', 'SeaweedFS-Diagnostic-Tool/1.0')
                
                response = urllib.request.urlopen(req, timeout=10)
                print(f"   ✅ HTTP {response.getcode()}: {response.reason}")
                
                # Try to read some response headers
                headers = dict(response.headers)
                if 'server' in headers:
                    print(f"   Server: {headers['server']}")
                if 'x-amz-request-id' in headers or 'x-seaweedfs-request-id' in headers:
                    print(f"   ✅ Detected S3-compatible API")
                
                return True
                
            except urllib.error.HTTPError as e:
                print(f"   ❌ HTTP {e.code}: {e.reason}")
                if e.code == 403:
                    print(f"      💡 403 Forbidden suggests authentication issue")
                elif e.code == 404:
                    print(f"      💡 404 Not Found suggests wrong path")
                
                # Try to read error response
                try:
                    error_body = e.read().decode('utf-8')
                    if error_body:
                        print(f"   Error details: {error_body[:200]}...")
                except:
                    pass
            
            except urllib.error.URLError as e:
                print(f"   ❌ URL Error: {e.reason}")
        
        return False
        
    except Exception as e:
        print(f"❌ HTTP test failed: {e}")
        return False


def test_s3_authentication():
    """Test S3 authentication with different approaches"""
    print("🔐 Testing S3 Authentication...")
    
    # Test different signature versions
    signature_versions = ['s3v4', 's3']
    
    for sig_version in signature_versions:
        print(f"   Testing with signature version: {sig_version}")
        
        try:
            s3_client = boto3.client(
                's3',
                endpoint_url=SEAWEEDFS_CONFIG['endpoint_url'],
                aws_access_key_id=SEAWEEDFS_CONFIG['access_key'],
                aws_secret_access_key=SEAWEEDFS_CONFIG['secret_key'],
                region_name=SEAWEEDFS_CONFIG['region'],
                config=Config(
                    signature_version=sig_version,
                    s3={'addressing_style': 'path'}  # Try path-style addressing
                )
            )
            
            # Try to list buckets (minimal operation)
            response = s3_client.list_buckets()
            print(f"   ✅ Authentication successful with {sig_version}")
            print(f"   Found {len(response.get('Buckets', []))} buckets")
            return True, s3_client
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_msg = e.response['Error']['Message']
            print(f"   ❌ Client error with {sig_version}: {error_code} - {error_msg}")
            
        except NoCredentialsError:
            print(f"   ❌ Credentials error with {sig_version}")
            
        except Exception as e:
            print(f"   ❌ Authentication failed with {sig_version}: {e}")
    
    return False, None


def test_bucket_operations(s3_client):
    """Test bucket-specific operations"""
    print("🪣 Testing Bucket Operations...")
    
    bucket_name = SEAWEEDFS_CONFIG['bucket_name']
    
    try:
        # Check if bucket exists
        print(f"   Checking bucket: {bucket_name}")
        try:
            s3_client.head_bucket(Bucket=bucket_name)
            print(f"   ✅ Bucket exists and is accessible")
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                print(f"   ❌ Bucket does not exist")
                
                # Try to create bucket
                print(f"   🔨 Attempting to create bucket...")
                try:
                    s3_client.create_bucket(Bucket=bucket_name)
                    print(f"   ✅ Bucket created successfully")
                except Exception as create_error:
                    print(f"   ❌ Failed to create bucket: {create_error}")
                    return False
            else:
                print(f"   ❌ Bucket access error: {e}")
                return False
        
        # Test listing objects
        print(f"   Testing object listing...")
        try:
            response = s3_client.list_objects_v2(Bucket=bucket_name, MaxKeys=5)
            object_count = response.get('KeyCount', 0)
            print(f"   ✅ Listed objects successfully (sample: {object_count} objects)")
        except Exception as e:
            print(f"   ❌ Object listing failed: {e}")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Bucket operations failed: {e}")
        return False


def run_comprehensive_diagnostics():
    """Run comprehensive diagnostics"""
    print("🔧 SeaweedFS Comprehensive Diagnostics")
    print("=" * 50)
    
    # Display configuration
    print(f"📋 Configuration:")
    print(f"   Endpoint: {SEAWEEDFS_CONFIG['endpoint_url']}")
    print(f"   Bucket: {SEAWEEDFS_CONFIG['bucket_name']}")
    print(f"   Region: {SEAWEEDFS_CONFIG['region']}")
    print(f"   Access Key: {SEAWEEDFS_CONFIG['access_key'][:8]}...")
    print(f"   Secret Key: {SEAWEEDFS_CONFIG['secret_key'][:8]}...")
    
    results = {}
    
    # Test 1: DNS Resolution
    results['dns'], ip = test_dns_resolution()
    
    # Test 2: TCP Connection
    if results['dns']:
        results['tcp'] = test_tcp_connection()
    else:
        results['tcp'] = False
        print("⏭️  Skipping TCP test due to DNS failure")
    
    # Test 3: SSL Certificate
    if results['tcp']:
        results['ssl'] = test_ssl_certificate()
    else:
        results['ssl'] = False
        print("⏭️  Skipping SSL test due to TCP failure")
    
    # Test 4: HTTP Response
    if results['tcp']:
        results['http'] = test_http_response()
    else:
        results['http'] = False
        print("⏭️  Skipping HTTP test due to TCP failure")
    
    # Test 5: S3 Authentication
    if results['tcp']:
        results['auth'], s3_client = test_s3_authentication()
    else:
        results['auth'] = False
        s3_client = None
        print("⏭️  Skipping S3 auth test due to TCP failure")
    
    # Test 6: Bucket Operations
    if results['auth'] and s3_client:
        results['bucket'] = test_bucket_operations(s3_client)
    else:
        results['bucket'] = False
        print("⏭️  Skipping bucket test due to auth failure")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Diagnostic Results:")
    print("=" * 50)
    
    test_names = {
        'dns': 'DNS Resolution',
        'tcp': 'TCP Connection',
        'ssl': 'SSL Certificate',
        'http': 'HTTP Response',
        'auth': 'S3 Authentication',
        'bucket': 'Bucket Operations'
    }
    
    all_passed = True
    for key, name in test_names.items():
        status = "✅ PASS" if results.get(key) else "❌ FAIL"
        print(f"{name}: {status}")
        if not results.get(key):
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 All diagnostics passed! SeaweedFS is working correctly.")
    else:
        print("⚠️  Some diagnostics failed. Check the issues above.")
        print("\n💡 Common solutions:")
        print("   - Verify credentials are correct")
        print("   - Check if SeaweedFS server is running")
        print("   - Verify network connectivity")
        print("   - Check firewall settings")
        print("   - Ensure bucket exists or can be created")
    print("=" * 50)


if __name__ == "__main__":
    run_comprehensive_diagnostics()