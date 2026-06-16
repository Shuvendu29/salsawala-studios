import { VideoHero } from '@/components/home/VideoHero'
import { StatsBar } from '@/components/home/StatsBar'
import { DanceStyles } from '@/components/home/DanceStyles'
import { ClassesPreview } from '@/components/home/ClassesPreview'
import { FacultySection } from '@/components/home/FacultySection'
import { Testimonials } from '@/components/home/Testimonials'
import { GalleryPreview } from '@/components/home/GalleryPreview'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import { CTASection } from '@/components/home/CTASection'
import { ContactSection } from '@/components/home/ContactSection'

export default function HomePage() {
  return (
    <>
      <VideoHero />
      <StatsBar />
      <DanceStyles />
      <ClassesPreview />
      <FacultySection />
      <Testimonials />
      <GalleryPreview />
      <UpcomingEvents />
      <CTASection />
      <ContactSection />
    </>
  )
}
