from decimal import Decimal
from django.db.models import Avg, Sum, Count
from django.utils import timezone
from api.models import (
    Participation,
    VolunteerCreditLog,
    TrainingCourse,
    TrainingEnrollment,
    OrganizationImpact,
    Article,
)
from users.models import Volunteer, Organization


class ImpactService:

    @staticmethod
    def award_participation_credits(participation: Participation) -> Decimal:
        """
        Calculates and logs certified volunteering hours for a completed participation
        based on fieldwork multiplier (1.5x), skill role bonus, logistics support, 
        performance ratings, and milestones.
        """
        if participation.status != Participation.StatusChoices.DONE:
            return Decimal("0.00")

        volunteer = participation.volunteer
        opportunity = participation.opportunity
        
        # Avoid duplicate awarding for the same participation
        existing_logs = VolunteerCreditLog.objects.filter(participation=participation)
        if existing_logs.exists():
            existing_logs.delete()

        awarded_total = Decimal("0.00")

        # 1. Fieldwork base (1.5x multiplier)
        field_hours = Decimal(str(participation.hours_worked or opportunity.duration or 4))
        field_credit = (field_hours * Decimal("1.5")).quantize(Decimal("0.01"))
        VolunteerCreditLog.objects.create(
            volunteer=volunteer,
            credit_type=VolunteerCreditLog.CreditType.FIELDWORK,
            hours=field_credit,
            description=f"الجهد الميداني في فرصة: {opportunity.title} ({field_hours}س × 1.5)",
            participation=participation
        )
        awarded_total += field_credit

        # 2. Skill & Specialization bonus
        if participation.skill_level == Participation.SkillLevel.SPECIALIST:
            skill_credit = Decimal("2.00")
            VolunteerCreditLog.objects.create(
                volunteer=volunteer,
                credit_type=VolunteerCreditLog.CreditType.SKILL_BONUS,
                hours=skill_credit,
                description=f"بونص مهارة تخصصية في: {opportunity.title}",
                participation=participation
            )
            awarded_total += skill_credit
        elif participation.skill_level == Participation.SkillLevel.LEAD:
            lead_credit = Decimal("3.00")
            VolunteerCreditLog.objects.create(
                volunteer=volunteer,
                credit_type=VolunteerCreditLog.CreditType.SKILL_BONUS,
                hours=lead_credit,
                description=f"بونص تأطير وقيادة فنية لورشة: {opportunity.title}",
                participation=participation
            )
            awarded_total += lead_credit

        # 3. Logistics & Material Support
        if participation.provided_transport:
            transport_credit = Decimal("3.00")
            VolunteerCreditLog.objects.create(
                volunteer=volunteer,
                credit_type=VolunteerCreditLog.CreditType.TRANSPORT,
                hours=transport_credit,
                description=f"توفير وسيلة نقل خاصة للمتطوعين/المؤن في: {opportunity.title}",
                participation=participation
            )
            awarded_total += transport_credit

        if participation.provided_equipment:
            equip_credit = Decimal("2.00")
            VolunteerCreditLog.objects.create(
                volunteer=volunteer,
                credit_type=VolunteerCreditLog.CreditType.EQUIPMENT,
                hours=equip_credit,
                description=f"توفير عتاد وأدوات عمل متخصصة في: {opportunity.title}",
                participation=participation
            )
            awarded_total += equip_credit

        if participation.provided_donation:
            donation_credit = Decimal("3.00")
            VolunteerCreditLog.objects.create(
                volunteer=volunteer,
                credit_type=VolunteerCreditLog.CreditType.DONATION,
                hours=donation_credit,
                description=f"مساهمة عينية أو تمويلية للحملة: {opportunity.title}",
                participation=participation
            )
            awarded_total += donation_credit

        # 4. Quality & Discipline bonus
        if participation.rating == 5:
            rating_credit = Decimal("1.00")
            VolunteerCreditLog.objects.create(
                volunteer=volunteer,
                credit_type=VolunteerCreditLog.CreditType.RATING_BONUS,
                hours=rating_credit,
                description=f"مكافأة أداء وانضباط ممتاز (5/5) في: {opportunity.title}",
                participation=participation
            )
            awarded_total += rating_credit

        # 5. First Milestone Welcome Bonus (+2h)
        # Checked across all completed participations for this volunteer
        has_first_milestone = VolunteerCreditLog.objects.filter(
            volunteer=volunteer,
            credit_type=VolunteerCreditLog.CreditType.FIRST_MILESTONE
        ).exists()
        
        completed_participations_count = Participation.objects.filter(
            volunteer=volunteer,
            status=Participation.StatusChoices.DONE
        ).count()

        if not has_first_milestone and completed_participations_count >= 1:
            welcome_credit = Decimal("2.00")
            VolunteerCreditLog.objects.create(
                volunteer=volunteer,
                credit_type=VolunteerCreditLog.CreditType.FIRST_MILESTONE,
                hours=welcome_credit,
                description="مكافأة الانطلاقة الأولى وإكمال متطلبات العضوية",
                participation=participation
            )
            awarded_total += welcome_credit

        # 6. Loyalty Milestone (Every 5 completed participations)
        if completed_participations_count > 0 and (completed_participations_count % 5 == 0):
            loyalty_desc = f"حافز الاستمرارية والوفاء (إتمام {completed_participations_count} مشاركات ناجحة)"
            has_this_loyalty = VolunteerCreditLog.objects.filter(
                volunteer=volunteer,
                credit_type=VolunteerCreditLog.CreditType.LOYALTY_MILESTONE,
                description=loyalty_desc
            ).exists()
            if not has_this_loyalty:
                loyalty_credit = Decimal("3.00")
                VolunteerCreditLog.objects.create(
                    volunteer=volunteer,
                    credit_type=VolunteerCreditLog.CreditType.LOYALTY_MILESTONE,
                    hours=loyalty_credit,
                    description=loyalty_desc,
                    participation=participation
                )
                awarded_total += loyalty_credit

        # Save total calculated hours directly on participation record
        participation.calculated_credit_hours = awarded_total
        participation.save(update_fields=['calculated_credit_hours'])

        # Recalculate Organization Impact
        ImpactService.recalculate_organization_impact(opportunity.organization)

        return awarded_total

    @staticmethod
    def award_training_credit(enrollment: TrainingEnrollment) -> Decimal:
        """Awards training hours when a volunteer successfully completes a course."""
        if not enrollment.is_completed:
            return Decimal("0.00")

        course = enrollment.course
        volunteer = enrollment.volunteer
        training_hours = Decimal(str(course.duration_hours))

        # Check for existing credit log
        existing = VolunteerCreditLog.objects.filter(
            volunteer=volunteer,
            training_course=course,
            credit_type=VolunteerCreditLog.CreditType.TRAINING
        ).first()

        if not existing:
            VolunteerCreditLog.objects.create(
                volunteer=volunteer,
                credit_type=VolunteerCreditLog.CreditType.TRAINING,
                hours=training_hours,
                description=f"إتمام دورة تأهيلية: {course.title} ({course.trainer_or_provider})",
                training_course=course
            )

        if course.organization:
            ImpactService.recalculate_organization_impact(course.organization)

        return training_hours

    @staticmethod
    def recalculate_organization_impact(organization: Organization) -> OrganizationImpact:
        """
        Recalculates the National Civic Impact & Excellence Index for an organization.
        Pillars:
          - Culture & Training (30 pts)
          - Care & Volunteer Rating (30 pts)
          - Youth Recruitment & Activity (25 pts)
          - Legal Transparency & Compliance (15 pts)
        """
        impact, _ = OrganizationImpact.objects.get_or_create(organization=organization)

        points = 0

        # Pillar 4: Transparency & Compliance (Base 20 pts for confirmed legal approval)
        if organization.is_confirmed:
            points += 20

        # Pillar 1: Training & Culture
        trainings_count = TrainingCourse.objects.filter(organization=organization).count()
        articles_count = Article.objects.filter(organization=organization).count() if hasattr(Article, 'organization') else 0
        training_points = min(trainings_count * 15 + articles_count * 5, 45)
        points += training_points

        # Pillar 2: Volunteer Care & Rating
        participations = Participation.objects.filter(opportunity__organization=organization)
        completed_opps = participations.filter(status=Participation.StatusChoices.DONE).values('opportunity').distinct().count()
        
        rated_participations = participations.filter(volunteer_org_rating__isnull=False)
        ratings_count = rated_participations.count()
        avg_rating = rated_participations.aggregate(Avg('volunteer_org_rating'))['volunteer_org_rating__avg'] or 5.0
        avg_rating_dec = Decimal(str(round(avg_rating, 2)))

        care_points = int(round((float(avg_rating) / 5.0) * 30))
        # Add fast-confirmation bonus (+10) if any opportunities completed
        if completed_opps > 0:
            care_points += 10
        points += care_points

        # Pillar 3: Youth Recruitment & Continuity
        # Count volunteers whose first completed participation was with this org
        first_time_volunteers = 0
        volunteers_in_org = participations.filter(status=Participation.StatusChoices.DONE).values_list('volunteer_id', flat=True).distinct()
        for vol_id in volunteers_in_org:
            first_p = Participation.objects.filter(
                volunteer_id=vol_id,
                status=Participation.StatusChoices.DONE
            ).order_by('completed_at', 'created_at').first()
            if first_p and first_p.opportunity.organization_id == organization.id:
                first_time_volunteers += 1

        recruitment_points = min(first_time_volunteers * 5 + completed_opps * 10, 50)
        points += recruitment_points

        # Total points
        impact.impact_points = points
        impact.avg_volunteer_rating = avg_rating_dec
        impact.total_ratings_count = ratings_count
        impact.opportunities_completed = completed_opps
        impact.trainings_organized = trainings_count
        impact.new_volunteers_onboarded = first_time_volunteers

        # Tiers
        if points >= 301:
            impact.tier = OrganizationImpact.Tier.STRATEGIC_PARTNER
        elif points >= 151:
            impact.tier = OrganizationImpact.Tier.PIONEER
        elif points >= 51:
            impact.tier = OrganizationImpact.Tier.ACTIVE
        else:
            impact.tier = OrganizationImpact.Tier.EMERGING

        # Badges
        impact.badge_volunteer_friendly = (avg_rating >= 4.8 and ratings_count >= 1) or ratings_count == 0
        impact.badge_training_incubator = trainings_count >= 2
        impact.badge_rapid_response = completed_opps >= 3

        impact.save()
        return impact

    @staticmethod
    def get_volunteer_credit_summary(volunteer: Volunteer) -> dict:
        """Returns comprehensive breakdown of volunteering impact hours, rank, and history."""
        logs = VolunteerCreditLog.objects.filter(volunteer=volunteer)
        
        total_hours = logs.aggregate(Sum('hours'))['hours__sum'] or Decimal("0.00")
        
        fieldwork_hours = logs.filter(
            credit_type=VolunteerCreditLog.CreditType.FIELDWORK
        ).aggregate(Sum('hours'))['hours__sum'] or Decimal("0.00")
        
        training_hours = logs.filter(
            credit_type=VolunteerCreditLog.CreditType.TRAINING
        ).aggregate(Sum('hours'))['hours__sum'] or Decimal("0.00")
        
        skill_hours = logs.filter(
            credit_type=VolunteerCreditLog.CreditType.SKILL_BONUS
        ).aggregate(Sum('hours'))['hours__sum'] or Decimal("0.00")
        
        logistics_hours = logs.filter(
            credit_type__in=[
                VolunteerCreditLog.CreditType.TRANSPORT,
                VolunteerCreditLog.CreditType.EQUIPMENT,
                VolunteerCreditLog.CreditType.DONATION,
            ]
        ).aggregate(Sum('hours'))['hours__sum'] or Decimal("0.00")
        
        milestone_hours = logs.filter(
            credit_type__in=[
                VolunteerCreditLog.CreditType.RATING_BONUS,
                VolunteerCreditLog.CreditType.FIRST_MILESTONE,
                VolunteerCreditLog.CreditType.LOYALTY_MILESTONE,
                VolunteerCreditLog.CreditType.SENIORITY,
            ]
        ).aggregate(Sum('hours'))['hours__sum'] or Decimal("0.00")

        # Rank calculation
        tot = float(total_hours)
        if tot >= 300:
            rank = "national_pioneer"
            rank_ar = "رائد التطوع الوطني"
            rank_color = "#047857"
            next_target = 500
        elif tot >= 151:
            rank = "ambassador"
            rank_ar = "سفير العمل التطوعي"
            rank_color = "#0284c7"
            next_target = 300
        elif tot >= 61:
            rank = "distinguished"
            rank_ar = "متطوع متميز"
            rank_color = "#7c3aed"
            next_target = 150
        elif tot >= 26:
            rank = "active"
            rank_ar = "متطوع فاعل"
            rank_color = "#0d9488"
            next_target = 60
        else:
            rank = "initiator"
            rank_ar = "متطوع مبادر"
            rank_color = "#f59e0b"
            next_target = 25

        progress = min(int((tot / next_target) * 100), 100) if next_target else 100

        recent_logs = [
            {
                "id": str(log.id),
                "credit_type": log.credit_type,
                "credit_type_label": log.get_credit_type_display(),
                "hours": float(log.hours),
                "description": log.description,
                "created_at": log.created_at.isoformat(),
            }
            for log in logs[:20]
        ]

        return {
            "total_hours": float(total_hours),
            "fieldwork_hours": float(fieldwork_hours),
            "training_hours": float(training_hours),
            "skill_hours": float(skill_hours),
            "logistics_hours": float(logistics_hours),
            "milestone_hours": float(milestone_hours),
            "rank": rank,
            "rank_ar": rank_ar,
            "rank_color": rank_color,
            "progress_to_next": progress,
            "next_target": next_target,
            "recent_logs": recent_logs,
        }
