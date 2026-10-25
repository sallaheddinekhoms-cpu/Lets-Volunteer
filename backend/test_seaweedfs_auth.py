"""
SeaweedFS Configuration Test with Proper Authentication
This script tests SeaweedFS using boto3 with proper S3 authentication.
"""

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError, NoCredentialsError, EndpointConnectionError
import sys

# SeaweedFS Configuration (from your storage.py)
SEAWEEDFS_CONFIG = {
    'bucket_name': 'lets-volunteer',
    'endpoint_url': 'https://s3.lets-volunteer-dz.org',
    'access_key': 'OjG0LyKOhYpCLw7TJNRroot',
    'secret_key': 'reJtKflpdIO1CYdIjDCZuDKb1i8zIg89Pq1w7cpHroot',
    'region': 'us-east-1'
}


def create_s3_client():
    """Create authenticated S3 client"""
    return boto3.client(
        's3',
        endpoint_url=SEAWEEDFS_CONFIG['endpoint_url'],
        aws_access_key_id=SEAWEEDFS_CONFIG['access_key'],
        aws_secret_access_key=SEAWEEDFS_CONFIG['secret_key'],
        region_name=SEAWEEDFS_CONFIG['region'],
        config=Config(signature_version='s3v4')
    )


def test_authentication():
    """Test S3 authentication with credentials"""
    print("🔐 Testing S3 Authentication...")
    
    try:
        s3_client = create_s3_client()
        
        # Try to list buckets - this is a basic authenticated operation
        print("   Attempting to list buckets...")
        response = s3_client.list_buckets()
        
        buckets = response.get('Buckets', [])
        print(f"✅ Authentication successful!")
        print(f"   Found {len(buckets)} buckets:")
        
        for bucket in buckets:
            print(f"   - {bucket['Name']} (created: {bucket['CreationDate']})")
        
        return True, s3_client
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        print(f"❌ S3 Client Error: {error_code} - {error_message}")
        
        if error_code == 'InvalidAccessKeyId':
            print("💡 The access key ID is invalid")
        elif error_code == 'SignatureDoesNotMatch':
            print("💡 The secret key is incorrect or signature is malformed")
        elif error_code == 'AccessDenied':
            print("💡 Access denied - check permissions")
        
        return False, None
        
    except NoCredentialsError:
        print("❌ No credentials provided")
        return False, None
        
    except EndpointConnectionError as e:
        print(f"❌ Cannot connect to endpoint: {e}")
        return False, None
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False, None


def test_bucket_access(s3_client):
    """Test access to the specific bucket"""
    print(f"\n🪣 Testing Bucket Access: '{SEAWEEDFS_CONFIG['bucket_name']}'...")
    
    try:
        # Check if bucket exists and is accessible
        print("   Checking bucket existence...")
        s3_client.head_bucket(Bucket=SEAWEEDFS_CONFIG['bucket_name'])
        print("✅ Bucket exists and is accessible")
        
        # Try to list objects in the bucket
        print("   Testing object listing...")
        response = s3_client.list_objects_v2(
            Bucket=SEAWEEDFS_CONFIG['bucket_name'],
            MaxKeys=5
        )
        
        object_count = response.get('KeyCount', 0)
        total_objects = response.get('Contents', [])
        
        print(f"✅ Object listing successful")
        print(f"   Sample objects found: {object_count}")
        
        if total_objects:
            print("   Recent objects:")
            for obj in total_objects[:3]:
                size_kb = obj['Size'] / 1024
                print(f"   - {obj['Key']} ({size_kb:.1f} KB, {obj['LastModified']})")
        
        return True
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        
        if error_code == 'NoSuchBucket':
            print(f"❌ Bucket '{SEAWEEDFS_CONFIG['bucket_name']}' does not exist")
            
            # Try to create the bucket
            print("🔨 Attempting to create bucket...")
            try:
                s3_client.create_bucket(Bucket=SEAWEEDFS_CONFIG['bucket_name'])
                print("✅ Bucket created successfully!")
                return True
            except ClientError as create_error:
                print(f"❌ Failed to create bucket: {create_error.response['Error']['Message']}")
                return False
        else:
            print(f"❌ Bucket access error: {error_code} - {e.response['Error']['Message']}")
            return False
            
    except Exception as e:
        print(f"❌ Unexpected bucket error: {e}")
        return False


def test_file_operations(s3_client):
    """Test file upload, download, and deletion"""
    print(f"\n📁 Testing File Operations...")
    
    test_key = 'seaweedfs_test_file.txt'
    test_content = 'Hello from SeaweedFS test! 🌊🗂️'
    
    try:
        # Upload test file
        print("   ⬆️  Uploading test file...")
        s3_client.put_object(
            Bucket=SEAWEEDFS_CONFIG['bucket_name'],
            Key=test_key,
            Body=test_content.encode('utf-8'),
            ContentType='text/plain'
        )
        print(f"✅ File uploaded: {test_key}")
        
        # Check if file exists
        print("   🔍 Checking file existence...")
        s3_client.head_object(
            Bucket=SEAWEEDFS_CONFIG['bucket_name'],
            Key=test_key
        )
        print("✅ File exists in storage")
        
        # Download and verify content
        print("   ⬇️  Downloading and verifying content...")
        response = s3_client.get_object(
            Bucket=SEAWEEDFS_CONFIG['bucket_name'],
            Key=test_key
        )
        
        downloaded_content = response['Body'].read().decode('utf-8')
        if downloaded_content == test_content:
            print("✅ Content verification passed")
        else:
            print(f"❌ Content mismatch!")
            print(f"   Expected: '{test_content}'")
            print(f"   Got: '{downloaded_content}'")
            return False
        
        # Generate presigned URL
        print("   🔗 Generating presigned URL...")
        try:
            url = s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': SEAWEEDFS_CONFIG['bucket_name'],
                    'Key': test_key
                },
                ExpiresIn=3600  # 1 hour
            )
            print(f"✅ Presigned URL generated: {url[:50]}...")
        except Exception as url_error:
            print(f"⚠️  Presigned URL generation failed: {url_error}")
        
        # Delete test file
        print("   🗑️  Cleaning up test file...")
        s3_client.delete_object(
            Bucket=SEAWEEDFS_CONFIG['bucket_name'],
            Key=test_key
        )
        
        # Verify deletion
        try:
            s3_client.head_object(
                Bucket=SEAWEEDFS_CONFIG['bucket_name'],
                Key=test_key
            )
            print("❌ File still exists after deletion")
            return False
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                print("✅ File deleted successfully")
            else:
                print(f"❌ Unexpected error checking deletion: {e}")
                return False
        
        return True
        
    except ClientError as e:
        print(f"❌ File operation failed: {e.response['Error']['Code']} - {e.response['Error']['Message']}")
        
        # Cleanup attempt
        try:
            s3_client.delete_object(
                Bucket=SEAWEEDFS_CONFIG['bucket_name'],
                Key=test_key
            )
        except:
            pass
            
        return False
        
    except Exception as e:
        print(f"❌ Unexpected file operation error: {e}")
        return False


def main():
    """Run all SeaweedFS tests with proper authentication"""
    print("🚀 SeaweedFS Configuration Test with Authentication")
    print("=" * 60)
    
    # Display config (masked sensitive info)
    print("📋 Configuration:")
    print(f"   Endpoint: {SEAWEEDFS_CONFIG['endpoint_url']}")
    print(f"   Bucket: {SEAWEEDFS_CONFIG['bucket_name']}")
    print(f"   Region: {SEAWEEDFS_CONFIG['region']}")
    print(f"   Access Key: {SEAWEEDFS_CONFIG['access_key'][:8]}***")
    print(f"   Secret Key: {SEAWEEDFS_CONFIG['secret_key'][:8]}***")
    
    # Test authentication
    auth_success, s3_client = test_authentication()
    
    if not auth_success:
        print("\n" + "=" * 60)
        print("❌ FAILURE: Authentication failed")
        print("💡 Check your access key and secret key credentials")
        print("=" * 60)
        sys.exit(1)
    
    # Test bucket access
    bucket_success = test_bucket_access(s3_client)
    
    if not bucket_success:
        print("\n" + "=" * 60)
        print("❌ FAILURE: Bucket access failed")
        print("=" * 60)
        sys.exit(1)
    
    # Test file operations
    file_success = test_file_operations(s3_client)
    
    # Final summary
    print("\n" + "=" * 60)
    print("📊 Test Summary:")
    print(f"Authentication: {'✅ PASS' if auth_success else '❌ FAIL'}")
    print(f"Bucket Access: {'✅ PASS' if bucket_success else '❌ FAIL'}")
    print(f"File Operations: {'✅ PASS' if file_success else '❌ FAIL'}")
    
    if auth_success and bucket_success and file_success:
        print("\n🎉 SUCCESS: SeaweedFS configuration is working perfectly!")
        print("Your Django application should be able to use SeaweedFS storage.")
    else:
        print("\n⚠️  PARTIAL SUCCESS: Some tests failed")
        
    print("=" * 60)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {e}")
        sys.exit(1)