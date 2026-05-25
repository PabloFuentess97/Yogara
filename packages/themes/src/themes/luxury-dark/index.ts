import type { ThemeContract } from '../../engine/types'
import { config } from './theme.config'
import { MainLayout } from './layouts/MainLayout'
import { ClassLayout } from './layouts/ClassLayout'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { ClassCard } from './components/ClassCard'
import { InstructorCard } from './components/InstructorCard'
import { BookingButton } from './components/BookingButton'
import { MembershipCard } from './components/MembershipCard'
import { CommunityPost } from './components/CommunityPost'
import { HeroSection } from './sections/HeroSection'
import { ClasesSection } from './sections/ClasesSection'
import { ProfesoresSection } from './sections/ProfesoresSection'
import { TestimoniosSection } from './sections/TestimoniosSection'
import { PreciosSection } from './sections/PreciosSection'
import { ContactoSection } from './sections/ContactoSection'

const theme: ThemeContract = {
  config,
  components: {
    layouts: {
      MainLayout,
      ClassLayout,
    },
    components: {
      Navbar,
      Footer,
      Hero,
      ClassCard,
      InstructorCard,
      BookingButton,
      MembershipCard,
      CommunityPost,
    },
    sections: {
      HeroSection,
      ClasesSection,
      ProfesoresSection,
      TestimoniosSection,
      PreciosSection,
      ContactoSection,
    },
  },
}

export default theme
