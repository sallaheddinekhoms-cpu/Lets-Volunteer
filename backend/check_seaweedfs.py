"""
Quick SeaweedFS Configuration Checker
Run this script to quickly validate your SeaweedFS setup.
"""

import boto3
from botocore.client import Config
import os
from urllib.parse import urljoin

# SeaweedFS Configuration
SEAWEEDFS_CONFIG = {
    'bucket_name': 'lets-volunteer',
    'endpoint_url': 'https://s3.lets-volunteer-dz.org',
    'access_key': 'OjG0LyKOhYpCLw7TJNRroot',
    'secret_key': 'reJtKflpdIO1CYdIjDCZuDKb1i8zIg89Pq1w7cpHroot',
    'region': 'us-east-1'
}


def check_seaweedfs_config():
    """Quick configuration check"""
    print("🔧 SeaweedFS Configuration Checker")
    print("=" * 40)
    
    # Display config (masked)
    print(f"📋 Configuration:")
    print(f"   Endpoint: {SEAWEEDFS_CONFIG['endpoint_url']}")
    print(f"   Bucket: {SEAWEEDFS_CONFIG['bucket_name']}")
    print(f"   Region: {SEAWEEDFS_CONFIG['region']}")
    print(f"   Access Key: {'*' * 8}{SEAWEEDFS_CONFIG['access_key'][-4:]}")
    print(f"   Secret Key: {'*' * 8}{SEAWEEDFS_CONFIG['secret_key'][-4:]}")
    
    try:
        # Create S3 client
        print(f"\n🔌 Testing connection...")
        s3_client = boto3.client(
            's3',
            endpoint_url=SEAWEEDFS_CONFIG['endpoint_url'],
            aws_access_key_id=SEAWEEDFS_CONFIG['access_key'],
            aws_secret_access_key=SEAWEEDFS_CONFIG['secret_key'],
            region_name=SEAWEEDFS_CONFIG['region'],
            config=Config(signature_version='s3v4')
        )
        
        # Test bucket access
        print(f"🪣 Checking bucket access...")
        try:
            s3_client.head_bucket(Bucket=SEAWEEDFS_CONFIG['bucket_name'])
            print(f"✅ Bucket '{SEAWEEDFS_CONFIG['bucket_name']}' is accessible")
        except Exception as e:
            print(f"❌ Bucket access failed: {e}")
            return False
        
        # Test list objects (basic operation)
        print(f"📋 Testing list operations...")
        try:
            response = s3_client.list_objects_v2(
                Bucket=SEAWEEDFS_CONFIG['bucket_name'],
                MaxKeys=1
            )
            object_count = response.get('KeyCount', 0)
            print(f"✅ List operation successful (found {object_count} objects in sample)")
        except Exception as e:
            print(f"❌ List operation failed: {e}")
            return False
        
        # Test file upload/download/delete
        print(f"📁 Testing file operations...")
        test_key = 'config_test_file.txt'
        test_content = 'SeaweedFS configuration test'
        
        try:
            # Upload
            s3_client.put_object(
                Bucket=SEAWEEDFS_CONFIG['bucket_name'],
                Key=test_key,
                Body=test_content.encode('utf-8'),
                ContentType='text/plain'
            )
            print(f"✅ File upload successful")
            
            # Download
            response = s3_client.get_object(
                Bucket=SEAWEEDFS_CONFIG['bucket_name'],
                Key=test_key
            )
            downloaded_content = response['Body'].read().decode('utf-8')
            
            if downloaded_content == test_content:
                print(f"✅ File download and content verification successful")
            else:
                print(f"❌ Content mismatch: expected '{test_content}', got '{downloaded_content}'")
                return False
            
            # Generate URL
            url = urljoin(SEAWEEDFS_CONFIG['endpoint_url'], f"/{SEAWEEDFS_CONFIG['bucket_name']}/{test_key}")
            print(f"✅ Generated URL: {url}")
            
            # Delete
            s3_client.delete_object(
                Bucket=SEAWEEDFS_CONFIG['bucket_name'],
                Key=test_key
            )
            print(f"✅ File deletion successful")
            
        except Exception as e:
            print(f"❌ File operation failed: {e}")
            # Cleanup attempt
            try:
                s3_client.delete_object(Bucket=SEAWEEDFS_CONFIG['bucket_name'], Key=test_key)
            except:
                pass
            return False
        
        print(f"\n🎉 All tests passed! SeaweedFS configuration is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False


def check_network_connectivity():
    """Check if the SeaweedFS endpoint is reachable"""
    print(f"\n🌐 Testing Network Connectivity...")
    
    import urllib.request
    import urllib.error
    
    try:
        # Try to reach the endpoint
        response = urllib.request.urlopen(SEAWEEDFS_CONFIG['endpoint_url'], timeout=10)
        print(f"✅ Endpoint is reachable (HTTP {response.getcode()})")
        return True
    except urllib.error.URLError as e:
        print(f"❌ Cannot reach endpoint: {e}")
        return False
    except Exception as e:
        print(f"❌ Network test failed: {e}")
        return False


def main():
    """Run all checks"""
    print("🚀 Starting SeaweedFS Configuration Tests")
    print("=" * 50)
    
    # Check network first
    network_ok = check_network_connectivity()
    
    if network_ok:
        # Check SeaweedFS configuration
        config_ok = check_seaweedfs_config()
        
        print(f"\n" + "=" * 50)
        if config_ok:
            print(f"✅ SUCCESS: SeaweedFS is properly configured and working!")
        else:
            print(f"❌ FAILURE: SeaweedFS configuration has issues")
    else:
        print(f"\n" + "=" * 50)
        print(f"❌ FAILURE: Cannot reach SeaweedFS endpoint")
    
    print("=" * 50)


if __name__ == "__main__":
    main()