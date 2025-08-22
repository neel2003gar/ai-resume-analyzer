from django.apps import AppConfig


class ResumesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'resumes'

    def ready(self):
        """Called when Django starts up"""
        # Import here to avoid circular imports
        from .views import cleanup_old_files
        import threading
        import time

        def periodic_cleanup():
            """Run cleanup every 30 minutes"""
            while True:
                try:
                    time.sleep(1800)  # 30 minutes
                    cleanup_old_files()
                except Exception as e:
                    print(f"Error in periodic cleanup: {str(e)}")

        # Start cleanup thread (only in production, comment out for development)
        # cleanup_thread = threading.Thread(target=periodic_cleanup, daemon=True)
        # cleanup_thread.start()

        # Do initial cleanup on startup
        try:
            cleanup_old_files()
            print("Initial cleanup completed on startup")
        except Exception as e:
            print(f"Error in startup cleanup: {str(e)}")
