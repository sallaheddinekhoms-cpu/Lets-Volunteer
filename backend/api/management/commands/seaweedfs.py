from django.core.management.base import BaseCommand
from django.conf import settings
from api.storage import SeaweedFSStorage
import boto3
from botocore.client import Config


class Command(BaseCommand):
    help = 'SeaweedFS management operations'

    def add_arguments(self, parser):
        parser.add_argument(
            'operation',
            choices=['test', 'create-bucket', 'list-buckets', 'migrate-files'],
            help='Operation to perform'
        )

    def handle(self, *args, **options):
        operation = options['operation']
        
        if operation == 'test':
            self.test_connection()
        elif operation == 'create-bucket':
            self.create_bucket()
        elif operation == 'list-buckets':
            self.list_buckets()
        elif operation == 'migrate-files':
            self.migrate_files()

    def test_connection(self):
        """Test connection to SeaweedFS"""
        try:
            storage = SeaweedFSStorage()
            self.stdout.write(
                self.style.SUCCESS('Successfully connected to SeaweedFS!')
            )
            
            # Test file operations
            from django.core.files.base import ContentFile
            test_file = ContentFile(b'Hello SeaweedFS!', name='test.txt')
            
            # Save test file
            name = storage.save('test/test.txt', test_file)
            self.stdout.write(f'Saved test file: {name}')
            
            # Check if file exists
            if storage.exists(name):
                self.stdout.write('Test file exists!')
                
                # Get file size
                size = storage.size(name)
                self.stdout.write(f'File size: {size} bytes')
                
                # Get URL
                url = storage.url(name)
                self.stdout.write(f'File URL: {url}')
                
                # Delete test file
                storage.delete(name)
                self.stdout.write('Test file deleted')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Connection failed: {e}')
            )

    def create_bucket(self):
        """Create the main bucket"""
        try:
            storage = SeaweedFSStorage()
            bucket_name = getattr(settings, 'SEAWEEDFS_BUCKET', 'volunteer-platform')
            
            try:
                storage.s3_client.create_bucket(Bucket=bucket_name)
                self.stdout.write(
                    self.style.SUCCESS(f'Created bucket: {bucket_name}')
                )
            except Exception as e:
                if 'BucketAlreadyExists' in str(e):
                    self.stdout.write(
                        self.style.WARNING(f'Bucket {bucket_name} already exists')
                    )
                else:
                    raise e
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to create bucket: {e}')
            )

    def list_buckets(self):
        """List all buckets"""
        try:
            storage = SeaweedFSStorage()
            response = storage.s3_client.list_buckets()
            
            self.stdout.write('Available buckets:')
            for bucket in response['Buckets']:
                self.stdout.write(f'  - {bucket["Name"]} (created: {bucket["CreationDate"]})')
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to list buckets: {e}')
            )

    def migrate_files(self):
        """Migrate existing files to SeaweedFS"""
        from django.apps import apps
        from api.models import Opportunity, Article
        from users.models import Profile, Organization
        import os
        
        storage = SeaweedFSStorage()
        migrated_count = 0
        
        self.stdout.write('Starting file migration to SeaweedFS...')
        
        # Migrate opportunity images
        opportunities = Opportunity.objects.filter(image__isnull=False)
        for opp in opportunities:
            try:
                if opp.image and os.path.exists(opp.image.path):
                    with open(opp.image.path, 'rb') as f:
                        from django.core.files.base import ContentFile
                        content = ContentFile(f.read())
                        content.content_type = 'image/jpeg'  # Adjust as needed
                        
                        new_name = storage.save(f'opportunities/{opp.image.name}', content)
                        opp.image.name = new_name
                        opp.save()
                        migrated_count += 1
                        self.stdout.write(f'Migrated opportunity image: {new_name}')
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to migrate opportunity {opp.id}: {e}')
                )
        
        # Migrate article images
        articles = Article.objects.filter(article_image__isnull=False)
        for article in articles:
            try:
                if article.article_image and os.path.exists(article.article_image.path):
                    with open(article.article_image.path, 'rb') as f:
                        from django.core.files.base import ContentFile
                        content = ContentFile(f.read())
                        content.content_type = 'image/jpeg'  # Adjust as needed
                        
                        new_name = storage.save(f'articles/{article.article_image.name}', content)
                        article.article_image.name = new_name
                        article.save()
                        migrated_count += 1
                        self.stdout.write(f'Migrated article image: {new_name}')
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to migrate article {article.id}: {e}')
                )
        
        # Migrate user avatars
        profiles = Profile.objects.filter(avatar__isnull=False)
        for profile in profiles:
            try:
                if profile.avatar and os.path.exists(profile.avatar.path):
                    with open(profile.avatar.path, 'rb') as f:
                        from django.core.files.base import ContentFile
                        content = ContentFile(f.read())
                        content.content_type = 'image/jpeg'  # Adjust as needed
                        
                        new_name = storage.save(f'avatars/{profile.avatar.name}', content)
                        profile.avatar.name = new_name
                        profile.save()
                        migrated_count += 1
                        self.stdout.write(f'Migrated user avatar: {new_name}')
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to migrate profile {profile.id}: {e}')
                )
        
        # Migrate organization logos
        organizations = Organization.objects.filter(logo__isnull=False)
        for org in organizations:
            try:
                if org.logo and os.path.exists(org.logo.path):
                    with open(org.logo.path, 'rb') as f:
                        from django.core.files.base import ContentFile
                        content = ContentFile(f.read())
                        content.content_type = 'image/jpeg'  # Adjust as needed
                        
                        new_name = storage.save(f'logos/{org.logo.name}', content)
                        org.logo.name = new_name
                        org.save()
                        migrated_count += 1
                        self.stdout.write(f'Migrated organization logo: {new_name}')
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to migrate organization {org.id}: {e}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Migration completed! Migrated {migrated_count} files.')
        )