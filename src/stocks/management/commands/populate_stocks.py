from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = 'Populate initial list of stocks'

    def handle(self, *args, **options):
        from stocks.scripts import upload_initial_data
        upload_initial_data()