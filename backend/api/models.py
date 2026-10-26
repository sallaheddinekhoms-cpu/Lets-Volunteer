from django.db import models
from users.models import Organization, Volunteer, Profile
import uuid
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.label


class Opportunity(models.Model):
    class StatusChoices(models.TextChoices):
        REFUSED = "refused", "Refused"
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to='opportunities/', null=True, blank=True)
    title = models.CharField(max_length=100)
    description = models.TextField() 
    date_of_opportunity = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="opportunities")
    
    shared_organizations = models.ManyToManyField(Organization, related_name="shared_opportunities")
    
    is_urgent = models.BooleanField(default=False)
    is_remote = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=False)
    
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
    duration = models.IntegerField(default=1)
    wilaya = models.CharField(max_length=100)
    daira = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=10, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    # GPS coordinates for interactive map
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_address = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at'] 

    def __str__(self):
        return self.title


class ResponsabilityTemplate(models.Model):
    """Predefined responsibility catalog managed by Admin for easy selection."""
    title = models.CharField(max_length=200, unique=True)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL, related_name="responsibility_templates")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class OrganizationContact(models.Model):
    """Multiple phone numbers / contact points for organizations."""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="contacts")
    name = models.CharField(max_length=100)
    role_title = models.CharField(max_length=100, blank=True, null=True)  # e.g. منسق العمل الميداني
    phone_number = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.phone_number})"


class Responsability(models.Model):
    title = models.CharField(max_length=100)
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name="responsabilities")

    def __str__(self):
        return self.title

    
class Qualification(models.Model):
    title = models.CharField(max_length=100)
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name="qualifications")

    def __str__(self):
        return self.title
    
    
class Participation(models.Model):
    class StatusChoices(models.TextChoices):
        REFUSED = "refused"
        PENDING = "pending"
        ACCEPTED = "accepted"
        DONE = "done"

    class SkillLevel(models.TextChoices):
        GENERAL = "general", "مساهم عام / هاوي"
        SPECIALIST = "specialist", "منفذ فني متخصص (+2 س)"
        LEAD = "lead", "قائد ورشة / مؤطر فني (+3 س)"
        
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name="participations")
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name="participations")
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,  
        default=StatusChoices.PENDING 
    ) 
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True, auto_now=True)
    hours_worked = models.PositiveIntegerField(null=True, blank=True)
    rating = models.PositiveIntegerField(
        null=True, 
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    organization_feedback = models.TextField(null=True, blank=True)
    volunteer_feedback = models.TextField(null=True, blank=True)

    # Valuation & Impact System fields
    skill_level = models.CharField(
        max_length=20,
        choices=SkillLevel.choices,
        default=SkillLevel.GENERAL
    )
    provided_transport = models.BooleanField(default=False)
    provided_equipment = models.BooleanField(default=False)
    provided_donation = models.BooleanField(default=False)
    
    # Reverse rating: volunteer rates organization
    volunteer_org_rating = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    volunteer_org_feedback = models.TextField(null=True, blank=True)
    calculated_credit_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    
    invited = models.BooleanField(default=False)
    invite_accepted = models.BooleanField(default=False)
    verified_by_platform = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['opportunity', 'volunteer'], name='unique_participation')
        ]
    
    def __str__(self):
        return f"{self.volunteer} - {self.opportunity} ({self.status})"


class Beneficiary(models.Model):
    identity = models.CharField(max_length=100)

    def __str__(self):
        return self.identity


class AidType(models.Model):
    label = models.CharField(max_length=100)
    year = models.IntegerField(default=2025)
    is_open = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.label


class Aid(models.Model):
    beneficiary = models.ForeignKey(Beneficiary, on_delete=models.CASCADE)  
    organization = models.ForeignKey(Organization, null=True, on_delete=models.SET_NULL)
    aid_type = models.ForeignKey(AidType, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_duplicated = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.beneficiary} - {self.aid_type} ({self.created_at})"

    
class Article(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    desc = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    article_image = models.ImageField(upload_to='articles/', null=True, blank=True)
    video = models.URLField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.email}"


class Partner(models.Model):
    name = models.CharField(max_length=100)
    logo = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    website = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Video(models.Model):
    title = models.CharField(max_length=200)
    video_url = models.CharField(max_length=500)
    cloudinary_public_id = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return self.title


class Announcement(models.Model):
    title = models.CharField(max_length=200)
    image_url = models.CharField(max_length=500)
    cloudinary_public_id = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return self.title


class Certificate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participation = models.OneToOneField(Participation, on_delete=models.CASCADE, related_name="certificate")
    serial_number = models.CharField(max_length=30, unique=True, editable=False)
    place_of_birth = models.CharField(max_length=100, null=True, blank=True)
    activities = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    hours = models.PositiveIntegerField(default=0)
    partners = models.CharField(max_length=300, null=True, blank=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-issued_at']

    def save(self, *args, **kwargs):
        if not self.serial_number:
            self.serial_number = f"LV-{timezone.now().year}-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.serial_number


class SupportTicket(models.Model):
    """Complaints and inquiry ticket management system."""
    class Status(models.TextChoices):
        OPEN = "open", "مفتوحة"
        IN_PROGRESS = "in_progress", "قيد المعالجة"
        RESOLVED = "resolved", "تم الحل"
        CLOSED = "closed", "مغلقة"

    class Priority(models.TextChoices):
        LOW = "low", "عادية"
        MEDIUM = "medium", "متوسطة"
        HIGH = "high", "عاجلة"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="tickets")
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)
    admin_response = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} ({self.get_status_display()})"


class TrainingCourse(models.Model):
    """Training, qualification and capacity building space for volunteers."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    trainer_or_provider = models.CharField(max_length=150)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name="training_courses_organized", db_constraint=False)
    description = models.TextField()
    is_online = models.BooleanField(default=False)
    location = models.CharField(max_length=200, null=True, blank=True)
    meeting_link = models.URLField(null=True, blank=True)
    start_date = models.DateTimeField()
    duration_hours = models.PositiveIntegerField(default=2)
    max_participants = models.PositiveIntegerField(default=50)
    volunteers = models.ManyToManyField(Profile, related_name="training_courses", blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.title


class SolidarityItem(models.Model):
    """Solidarity Marketplace: Donate or lend medical gear, items, equipment."""
    class ItemType(models.TextChoices):
        DONATION = "donation", "تبرع مجاني"
        LENDING = "lending", "إعارة مجانية مؤقتة"

    class ItemStatus(models.TextChoices):
        AVAILABLE = "available", "متاح"
        RESERVED = "reserved", "محجوز"
        DELIVERED = "delivered", "تم الاستلام"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donor = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="donated_items")
    title = models.CharField(max_length=200)  # e.g. عكاز طبي مزدوج، كرسي متحرك
    category = models.CharField(max_length=100)  # أدوات طبية، عتاد، مستلزمات
    item_type = models.CharField(max_length=20, choices=ItemType.choices, default=ItemType.LENDING)
    description = models.TextField()
    wilaya = models.CharField(max_length=100)
    daira = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=ItemStatus.choices, default=ItemStatus.AVAILABLE)
    image = models.ImageField(upload_to='solidarity_items/', null=True, blank=True)
    contact_phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_item_type_display()})"


class SolidarityRequest(models.Model):
    """Citizens or associations requesting an item/gear they did not find in the solidarity store."""
    class StatusChoices(models.TextChoices):
        PENDING = "pending", "قيد المراجعة"
        APPROVED = "approved", "معتمد"
        REJECTED = "rejected", "مرفوض"
        FULFILLED = "fulfilled", "تمت التلبية"

    class UrgencyChoices(models.TextChoices):
        NORMAL = "normal", "عادي"
        MEDIUM = "medium", "متوسط"
        URGENT = "urgent", "عاجل جداً"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requester_name = models.CharField(max_length=150)
    user = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True, blank=True, related_name="solidarity_requests", db_constraint=False)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, default="مستلزمات طبية")
    urgency = models.CharField(max_length=20, choices=UrgencyChoices.choices, default=UrgencyChoices.NORMAL)
    description = models.TextField()
    wilaya = models.CharField(max_length=100)
    daira = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=25)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    admin_note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.requester_name} ({self.get_status_display()})"


class TrainingEnrollment(models.Model):
    """Tracks volunteer enrollment and certified completion of training courses."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(TrainingCourse, on_delete=models.CASCADE, related_name="enrollments")
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name="training_enrollments", db_constraint=False)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course', 'volunteer')

    def __str__(self):
        return f"{self.volunteer} in {self.course.title} (Completed: {self.is_completed})"


class VolunteerCreditLog(models.Model):
    """Granular audit trail for all awarded volunteering impact credit hours."""
    class CreditType(models.TextChoices):
        FIELDWORK = "fieldwork", "الجهد الميداني (x1.5)"
        SKILL_BONUS = "skill_bonus", "بونص المهارة والتخصص"
        TRAINING = "training", "تكوين وتأهيل"
        TRANSPORT = "transport", "توفير وسيلة نقل"
        EQUIPMENT = "equipment", "توفير عتاد وأدوات"
        DONATION = "donation", "دعم عيني أو تمويلي"
        RATING_BONUS = "rating_bonus", "بونص التقييم المتميز"
        FIRST_MILESTONE = "first_milestone", "مكافأة الانطلاقة الأولى"
        LOYALTY_MILESTONE = "loyalty_milestone", "حافز الاستمرارية (كل 5 مشاركات)"
        SENIORITY = "seniority", "الأقدمية السنوية"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name="credit_logs", db_constraint=False)
    credit_type = models.CharField(max_length=30, choices=CreditType.choices)
    hours = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.CharField(max_length=255)
    participation = models.ForeignKey(Participation, on_delete=models.SET_NULL, null=True, blank=True, related_name="credits_awarded")
    training_course = models.ForeignKey(TrainingCourse, on_delete=models.SET_NULL, null=True, blank=True, related_name="credits_awarded")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.volunteer} - {self.get_credit_type_display()}: {self.hours} hrs"


class OrganizationImpact(models.Model):
    """National Civic Impact & Excellence Index for Volunteer Organizations."""
    class Tier(models.TextChoices):
        EMERGING = "emerging", "جمعية ناشئة ومبادرة"
        ACTIVE = "active", "جمعية نشطة وموثوقة"
        PIONEER = "pioneer", "هيئة رائدة في العمل التطوعي"
        STRATEGIC_PARTNER = "strategic_partner", "شريك استراتيجي في النفع العام"

    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name="impact_profile", db_constraint=False)
    impact_points = models.IntegerField(default=20)
    tier = models.CharField(max_length=30, choices=Tier.choices, default=Tier.EMERGING)

    avg_volunteer_rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    total_ratings_count = models.PositiveIntegerField(default=0)

    badge_volunteer_friendly = models.BooleanField(default=False)
    badge_training_incubator = models.BooleanField(default=False)
    badge_rapid_response = models.BooleanField(default=False)

    opportunities_completed = models.PositiveIntegerField(default=0)
    trainings_organized = models.PositiveIntegerField(default=0)
    new_volunteers_onboarded = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.organization.organization_name} - {self.get_tier_display()} ({self.impact_points} pts)"

