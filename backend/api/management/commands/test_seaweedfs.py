from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from api.storage import SeaweedFSStorage
import time


class Command(BaseCommand):
    help = 'Test SeaweedFS storage configuration and operations'

    def add_arguments(self, parser):
        parser.add_argument(
            '--quick',
            action='store_true',
            help='Run only basic connection test',
        )
        parser.add_argument(
            '--verbose',
            action='store_true', 
            help='Show detailed output',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🚀 Starting SeaweedFS Configuration Test')
        )
        self.stdout.write('=' * 60)

        # Test 1: Basic connection
        self.stdout.write('\n🔍 Testing SeaweedFS Connection...')
        if self.test_connection():
            self.stdout.write(
                self.style.SUCCESS('✅ Connection test passed')
            )
        else:
            self.stdout.write(
                self.style.ERROR('❌ Connection test failed')
            )
            return

        if options['quick']:
            self.stdout.write('\n🏃 Quick test completed successfully!')
            return

        # Test 2: File operations
        self.stdout.write('\n📁 Testing File Operations...')
        if self.test_file_operations(options['verbose']):
            self.stdout.write(
                self.style.SUCCESS('✅ File operations test passed')
            )
        else:
            self.stdout.write(
                self.style.ERROR('❌ File operations test failed')
            )

        # Test 3: Performance test
        self.stdout.write('\n⚡ Testing Performance...')
        self.test_performance()

        self.stdout.write('\n' + '=' * 60)
        self.stdout.write(
            self.style.SUCCESS('🎉 SeaweedFS configuration test completed!')
        )

    def test_connection(self):
        """Test basic connection to SeaweedFS"""
        try:
            storage = SeaweedFSStorage()
            
            # Display configuration
            self.stdout.write(f'   📋 Endpoint: {storage.endpoint_url}')
            self.stdout.write(f'   📋 Bucket: {storage.bucket_name}')
            self.stdout.write(f'   📋 Region: {storage.region}')
            
            # Test bucket access
            storage.s3_client.head_bucket(Bucket=storage.bucket_name)
            self.stdout.write(f'   ✅ Bucket accessible')
            
            return True
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'   ❌ Connection failed: {e}')
            )
            return False

    def test_file_operations(self, verbose=False):
        """Test file upload, download, and deletion"""
        storage = SeaweedFSStorage()
        test_filename = f'test_file_{int(time.time())}.txt'
        test_content = 'Hello from Django management command!'
        
        try:
            if verbose:
                self.stdout.write(f'   📝 Testing with file: {test_filename}')
            
            # Upload
            content_file = ContentFile(test_content.encode('utf-8'))
            content_file.content_type = 'text/plain'
            
            saved_name = storage._save(test_filename, content_file)
            if verbose:
                self.stdout.write(f'   ⬆️  File uploaded: {saved_name}')
            
            # Check existence
            if not storage.exists(test_filename):
                raise Exception('File not found after upload')
            
            if verbose:
                self.stdout.write(f'   🔍 File exists check passed')
            
            # Get size
            size = storage.size(test_filename)
            if verbose:
                self.stdout.write(f'   📏 File size: {size} bytes')
            
            # Generate URL
            url = storage.url(test_filename)
            if verbose:
                self.stdout.write(f'   🔗 Generated URL: {url}')
            
            # Download and verify
            file_obj = storage._open(test_filename)
            downloaded_content = file_obj.read().decode('utf-8')
            
            if downloaded_content != test_content:
                raise Exception('Content mismatch after download')
            
            if verbose:
                self.stdout.write(f'   ⬇️  Content verification passed')
            
            # Delete
            storage.delete(test_filename)
            
            if storage.exists(test_filename):
                raise Exception('File still exists after deletion')
            
            if verbose:
                self.stdout.write(f'   🗑️  File deletion passed')
            
            return True
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'   ❌ File operation failed: {e}')
            )
            # Cleanup
            try:
                storage.delete(test_filename)
            except:
                pass
            return False

    def test_performance(self):
        """Test upload/download performance"""
        storage = SeaweedFSStorage()
        
        # Test with different file sizes
        test_sizes = [1024, 10240, 102400]  # 1KB, 10KB, 100KB
        
        for size in test_sizes:
            filename = f'perf_test_{size}_{int(time.time())}.bin'
            content = b'x' * size
            
            try:
                # Upload timing
                start_time = time.time()
                content_file = ContentFile(content)
                storage._save(filename, content_file)
                upload_time = time.time() - start_time
                
                # Download timing
                start_time = time.time()
                file_obj = storage._open(filename)
                downloaded = file_obj.read()
                download_time = time.time() - start_time
                
                # Calculate speeds
                size_kb = size / 1024
                upload_speed = size_kb / upload_time if upload_time > 0 else 0
                download_speed = size_kb / download_time if download_time > 0 else 0
                
                self.stdout.write(
                    f'   📊 {size_kb:.1f}KB: Upload {upload_speed:.1f}KB/s, '
                    f'Download {download_speed:.1f}KB/s'
                )
                
                # Cleanup
                storage.delete(filename)
                
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'   ⚠️  Performance test failed for {size}B: {e}')
                )