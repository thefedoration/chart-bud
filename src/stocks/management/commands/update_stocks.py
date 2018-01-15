from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = 'Updates all existing stocks in db to current price'

    def handle(self, *args, **options):
        from stocks.tasks import update_stocks
        update_stocks.delay(num_to_update=1000)