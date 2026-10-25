
import BackgroundDecorations from '@/components/background-decorations';
import ParticipationPageTable from '@/components/participations/participations-demands-table';
import ParticipationsFilter from '@/components/participations/participations-filter';
import ParticipationHeader from '@/components/participations/participations-header';
import { getParticipations } from '@/data/Participations';









async function ParticipationsPage({ params }:{params:Promise<{id:string}>} ) {
  const {id} = await params

  const filters = {
    opportunity_id:id
  }

  const {data :participations } = await getParticipations(filters);
 

  return (
    <div className="relative min-h-screen bg-background/50 overflow-hidden" dir="rtl">
      <BackgroundDecorations>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <ParticipationHeader/>

          <ParticipationsFilter/>

          <ParticipationPageTable participations_demands={participations} />
        </div>
      </BackgroundDecorations>
    </div>
  );
}

export default ParticipationsPage;