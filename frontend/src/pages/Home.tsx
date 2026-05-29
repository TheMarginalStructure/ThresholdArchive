import HeroSection from '../sections/HeroSection'
import CoreDirective from '../sections/CoreDirective'
import AnomalyArchives from '../sections/AnomalyArchives'
import ReviewsSection from '../sections/ReviewsSection'
import Footer from '../sections/Footer'

export default function Home() {
  return (
    <div>
      <main>
        <HeroSection />
        <CoreDirective />
        <AnomalyArchives />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  )
}
