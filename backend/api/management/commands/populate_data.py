import uuid
from django.core.management.base import BaseCommand
from faker import Faker
from ...models import Opportunity, Organization, Category

class Command(BaseCommand):
    help = "Populate the database with dummy opportunity data"

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Organization UUID
        ORG_UUID = "c7c43963-c4ee-43d6-9119-9107db755b77"

        # Get Organization instance
        try:
            organization = Organization.objects.get(id=ORG_UUID)
        except Organization.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"❌ Organization with UUID {ORG_UUID} does not exist."))
            return

        # Get existing categories or create some
        categories = list(Category.objects.all())
        if not categories:
            for _ in range(3):  # Create 3 categories if none exist
                categories.append(Category.objects.create(name=fake.word()))

        # Create fake opportunities
        NUM_OPPORTUNITIES = 10  # Adjust as needed
        opportunities = []

        for _ in range(NUM_OPPORTUNITIES):
            opportunity = Opportunity(
                id=uuid.uuid4(),
                title=fake.job(),
                description=fake.text(),
                organization=organization,
                is_urgent=fake.boolean(),
                is_remote=fake.boolean(),
                is_available=fake.boolean(),
                category=fake.random_element(categories),
                duration=fake.random_int(min=1, max=12),  # Duration in months
                wilaya=fake.city(),
                daira=fake.city_suffix(),
                phone_number=fake.phone_number()[:10],  # Ensure valid length
                email=fake.email(),
            )
            opportunities.append(opportunity)

        # Bulk insert opportunities
        Opportunity.objects.bulk_create(opportunities)

        self.stdout.write(self.style.SUCCESS(f"✅ Successfully created {NUM_OPPORTUNITIES} opportunities!"))
