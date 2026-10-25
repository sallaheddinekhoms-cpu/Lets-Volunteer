from django.conf import settings
from .storage import SeaweedFSStorage
import logging

logger = logging.getLogger(__name__)


class SeaweedFSService:
    """Service class for SeaweedFS operations"""
    
    def __init__(self):
        self.storage = SeaweedFSStorage()
    
    def upload_file(self, file, folder='uploads'):
        """
        Upload a file to SeaweedFS
        
        Args:
            file: Django UploadedFile instance
            folder: Folder path within the bucket
            
        Returns:
            str: Path of the uploaded file
        """
        try:
            file_path = f"{folder}/{file.name}"
            saved_path = self.storage.save(file_path, file)
            logger.info(f"File uploaded successfully to SeaweedFS: {saved_path}")
            return saved_path
        except Exception as e:
            logger.error(f"Error uploading file to SeaweedFS: {e}")
            raise
    
    def delete_file(self, file_path):
        """
        Delete a file from SeaweedFS
        
        Args:
            file_path: Path of the file to delete
        """
        try:
            self.storage.delete(file_path)
            logger.info(f"File deleted successfully from SeaweedFS: {file_path}")
        except Exception as e:
            logger.error(f"Error deleting file from SeaweedFS: {e}")
            raise
    
    def get_file_url(self, file_path):
        """
        Get the URL for a file in SeaweedFS
        
        Args:
            file_path: Path of the file
            
        Returns:
            str: URL of the file
        """
        try:
            url = self.storage.url(file_path)
            return url
        except Exception as e:
            logger.error(f"Error getting file URL from SeaweedFS: {e}")
            raise
    
    def file_exists(self, file_path):
        """
        Check if a file exists in SeaweedFS
        
        Args:
            file_path: Path of the file to check
            
        Returns:
            bool: True if file exists, False otherwise
        """
        try:
            return self.storage.exists(file_path)
        except Exception as e:
            logger.error(f"Error checking file existence in SeaweedFS: {e}")
            return False
    
    def get_file_size(self, file_path):
        """
        Get the size of a file in SeaweedFS
        
        Args:
            file_path: Path of the file
            
        Returns:
            int: Size of the file in bytes
        """
        try:
            return self.storage.size(file_path)
        except Exception as e:
            logger.error(f"Error getting file size from SeaweedFS: {e}")
            raise
    
    def list_files(self, folder=''):
        """
        List files in a folder
        
        Args:
            folder: Folder path to list
            
        Returns:
            tuple: (directories, files)
        """
        try:
            return self.storage.listdir(folder)
        except Exception as e:
            logger.error(f"Error listing files from SeaweedFS: {e}")
            raise


# Global service instance
seaweedfs_service = SeaweedFSService()