import boto3
from botocore.client import Config
from django.core.files.storage import Storage
from django.conf import settings
from django.utils.deconstruct import deconstructible
from urllib.parse import urljoin
import os


@deconstructible
class SeaweedFSStorage(Storage):
 
    
    def __init__(self, **kwargs):
        self.bucket_name = getattr(settings, 'SEAWEEDFS_BUCKET', 'lets-volunteer')
        self.endpoint_url = getattr(settings, 'SEAWEEDFS_S3_ENDPOINT', 'https://s3.lets-volunteer-dz.org')
        self.public_url = getattr(settings, 'SEAWEEDFS_PUBLIC_URL', 'https://files.lets-volunteer-dz.org')
        self.access_key = getattr(settings, 'SEAWEEDFS_ACCESS_KEY', 'OjG0LyKOhYpCLw7TJNRroot')
        self.secret_key = getattr(settings, 'SEAWEEDFS_SECRET_KEY', 'reJtKflpdIO1CYdIjDCZuDKb1i8zIg89Pq1w7cpHroot')
        self.region = getattr(settings, 'SEAWEEDFS_REGION', 'us-east-1')
        

        self.s3_client = boto3.client(
            's3',
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            region_name=self.region,
            config=Config(signature_version='s3v4')
        )
        
        # Ensure bucket exists
        self._ensure_bucket_exists()
    
    def _ensure_bucket_exists(self):
        """Ensure the bucket exists, create if it doesn't"""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
        except:
            try:
                self.s3_client.create_bucket(Bucket=self.bucket_name)
            except Exception as e:
                print(f"Warning: Could not create bucket {self.bucket_name}: {e}")
    
    def _save(self, name, content):
        """Save file content to SeaweedFS"""
        try:
            self.s3_client.upload_fileobj(
                content,
                self.bucket_name,
                name,
                ExtraArgs={'ContentType': content.content_type if hasattr(content, 'content_type') else 'application/octet-stream'}
            )
            return name
        except Exception as e:
            raise Exception(f"Error uploading file to SeaweedFS: {e}")
    
    def _open(self, name, mode='rb'):
        """Open file from SeaweedFS"""
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=name)
            return response['Body']
        except Exception as e:
            raise FileNotFoundError(f"File {name} not found in SeaweedFS: {e}")
    
    def delete(self, name):
        """Delete file from SeaweedFS"""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=name)
        except Exception as e:
            print(f"Error deleting file from SeaweedFS: {e}")
    
    def exists(self, name):
        """Check if file exists in SeaweedFS"""
        try:
            self.s3_client.head_object(Bucket=self.bucket_name, Key=name)
            return True
        except:
            return False
    
    def size(self, name):
        """Get file size from SeaweedFS"""
        try:
            response = self.s3_client.head_object(Bucket=self.bucket_name, Key=name)
            return response['ContentLength']
        except Exception as e:
            raise Exception(f"Error getting file size: {e}")
    
    def url(self, name):
        """Generate URL for file access"""
        if not name:
            return None
        # Normalize path separators to forward slashes
        name = name.replace('\\', '/')
        # URL encode the filename to handle spaces and special characters
        from urllib.parse import quote
        encoded_name = quote(name, safe='/')
        # Use public URL for file access instead of S3 endpoint
        return urljoin(self.public_url, f"/buckets/{self.bucket_name}/{encoded_name}")
    
    def get_accessed_time(self, name):
        """Get last accessed time (not supported by S3, return modified time)"""
        return self.get_modified_time(name)
    
    def get_created_time(self, name):
        """Get created time (not supported by S3, return modified time)"""
        return self.get_modified_time(name)
    
    def get_modified_time(self, name):
        """Get last modified time"""
        try:
            response = self.s3_client.head_object(Bucket=self.bucket_name, Key=name)
            return response['LastModified']
        except Exception as e:
            raise Exception(f"Error getting file modified time: {e}")
    
    def listdir(self, path):
        """List directory contents"""
        directories = set()
        files = []
        
        try:
            paginator = self.s3_client.get_paginator('list_objects_v2')
            pages = paginator.paginate(Bucket=self.bucket_name, Prefix=path)
            
            for page in pages:
                for obj in page.get('Contents', []):
                    key = obj['Key']
                    if key.startswith(path):
                        remaining = key[len(path):]
                        if remaining.startswith('/'):
                            remaining = remaining[1:]
                        
                        if '/' in remaining:
                            # This is a directory
                            dir_name = remaining.split('/')[0]
                            directories.add(dir_name)
                        elif remaining:
                            # This is a file
                            files.append(remaining)
        except Exception as e:
            print(f"Error listing directory: {e}")
        
        return list(directories), files