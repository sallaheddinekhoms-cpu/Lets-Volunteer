#!/usr/bin/env python3
"""
Test script for SeaweedFS configuration
This script tests various aspects of the SeaweedFS storage backend.
"""

import os
import sys
import django
from django.conf import settings
from django.core.files.base import ContentFile
from io import BytesIO

# Add the backend directory to Python path
backend_path = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_path)

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'base.settings')
django.setup()

from api.storage import SeaweedFSStorage


def test_seaweedfs_connection():
    """Test basic connection to SeaweedFS"""
    print("🔍 Testing SeaweedFS Connection...")
    
    try:
        storage = SeaweedFSStorage()
        print(f"✅ Storage instance created successfully")
        print(f"   - Endpoint: {storage.endpoint_url}")
        print(f"   - Bucket: {storage.bucket_name}")
        print(f"   - Region: {storage.region}")
        
        # Test bucket existence
        try:
            storage.s3_client.head_bucket(Bucket=storage.bucket_name)
            print(f"✅ Bucket '{storage.bucket_name}' exists and is accessible")
        except Exception as e:
            print(f"❌ Bucket access failed: {e}")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Failed to create storage instance: {e}")
        return False


def test_file_operations():
    """Test basic file operations (upload, download, delete)"""
    print("\n📁 Testing File Operations...")
    
    storage = SeaweedFSStorage()
    test_filename = "test_file.txt"
    test_content = "Hello SeaweedFS! This is a test file."
    
    try:
        # Create a test file
        content_file = ContentFile(test_content.encode('utf-8'))
        content_file.content_type = 'text/plain'
        
        # Test upload
        print("⬆️  Testing file upload...")
        saved_name = storage._save(test_filename, content_file)
        print(f"✅ File uploaded successfully as: {saved_name}")
        
        # Test file existence
        print("🔍 Testing file existence...")
        if storage.exists(test_filename):
            print(f"✅ File exists in storage")
        else:
            print(f"❌ File not found in storage")
            return False
        
        # Test file size
        print("📏 Testing file size...")
        size = storage.size(test_filename)
        print(f"✅ File size: {size} bytes")
        
        # Test file URL generation
        print("🔗 Testing URL generation...")
        url = storage.url(test_filename)
        print(f"✅ File URL: {url}")
        
        # Test file download
        print("⬇️  Testing file download...")
        file_obj = storage._open(test_filename)
        downloaded_content = file_obj.read().decode('utf-8')
        if downloaded_content == test_content:
            print(f"✅ File content matches: '{downloaded_content}'")
        else:
            print(f"❌ Content mismatch. Expected: '{test_content}', Got: '{downloaded_content}'")
            return False
        
        # Test file deletion
        print("🗑️  Testing file deletion...")
        storage.delete(test_filename)
        if not storage.exists(test_filename):
            print(f"✅ File deleted successfully")
        else:
            print(f"❌ File still exists after deletion")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ File operation failed: {e}")
        # Cleanup in case of error
        try:
            storage.delete(test_filename)
        except:
            pass
        return False


def test_directory_operations():
    """Test directory listing operations"""
    print("\n📂 Testing Directory Operations...")
    
    storage = SeaweedFSStorage()
    
    try:
        # Create test files in different directories
        test_files = [
            "test_dir/file1.txt",
            "test_dir/file2.txt", 
            "test_dir/subdir/file3.txt",
            "another_dir/file4.txt"
        ]
        
        print("📁 Creating test directory structure...")
        for filename in test_files:
            content = ContentFile(f"Content of {filename}".encode('utf-8'))
            content.content_type = 'text/plain'
            storage._save(filename, content)
        
        print("✅ Test files created")
        
        # Test directory listing
        print("📋 Testing directory listing...")
        directories, files = storage.listdir("test_dir")
        print(f"✅ Found directories: {directories}")
        print(f"✅ Found files: {files}")
        
        # Cleanup
        print("🧹 Cleaning up test files...")
        for filename in test_files:
            storage.delete(filename)
        
        return True
        
    except Exception as e:
        print(f"❌ Directory operation failed: {e}")
        # Cleanup in case of error
        try:
            for filename in test_files:
                storage.delete(filename)
        except:
            pass
        return False


def test_settings_validation():
    """Validate SeaweedFS settings"""
    print("\n⚙️  Validating Settings...")
    
    required_settings = [
        'SEAWEEDFS_BUCKET',
        'SEAWEEDFS_S3_ENDPOINT', 
        'SEAWEEDFS_ACCESS_KEY',
        'SEAWEEDFS_SECRET_KEY',
        'SEAWEEDFS_REGION'
    ]
    
    print("🔍 Checking Django settings...")
    for setting in required_settings:
        value = getattr(settings, setting, None)
        if value:
            # Mask sensitive information
            display_value = value
            if 'KEY' in setting:
                display_value = '*' * (len(value) - 4) + value[-4:] if len(value) > 4 else '*' * len(value)
            print(f"✅ {setting}: {display_value}")
        else:
            print(f"⚠️  {setting}: Not configured (using default)")
    
    return True


def run_all_tests():
    """Run all SeaweedFS tests"""
    print("🚀 Starting SeaweedFS Configuration Tests")
    print("=" * 50)
    
    tests = [
        ("Settings Validation", test_settings_validation),
        ("Connection Test", test_seaweedfs_connection),
        ("File Operations", test_file_operations),
        ("Directory Operations", test_directory_operations),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"❌ {test_name} crashed with error: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    all_passed = True
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 All tests passed! SeaweedFS configuration is working correctly.")
    else:
        print("⚠️  Some tests failed. Please check your SeaweedFS configuration.")
    print("=" * 50)
    
    return all_passed


if __name__ == "__main__":
    run_all_tests()