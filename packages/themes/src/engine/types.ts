import type { ComponentType, ReactNode } from 'react'

export interface ThemeConfig {
  id: string
  name: string
  description: string
  version: string
  author: string
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    muted: string
    destructive: string
    success: string
  }
  fonts: {
    heading: string
    body: string
  }
  features: {
    hasAnimations: boolean
    hasDarkMode: boolean
    heroStyle: 'fullscreen' | 'split' | 'minimal' | 'video'
    navStyle: 'fixed' | 'sticky' | 'static' | 'transparent'
    footerStyle: 'minimal' | 'full' | 'centered'
  }
}

export interface OrganizationData {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  description: string | null
  email: string
  phone: string | null
  address: string | null
  city: string | null
  settings: Record<string, unknown>
}

export interface NavbarProps {
  org: OrganizationData
  isLoggedIn: boolean
}

export interface FooterProps {
  org: OrganizationData
}

export interface HeroProps {
  org: OrganizationData
  title: string
  subtitle?: string
  backgroundImage?: string
}

export interface ClassCardProps {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  level: string
  imageUrl: string | null
  color: string | null
}

export interface InstructorCardProps {
  id: string
  name: string
  avatarUrl: string | null
  bio?: string
}

export interface BookingButtonProps {
  sessionId: string
  availableSpots: number
  isBooked: boolean
  disabled?: boolean
}

export interface MembershipCardProps {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  type: string
  durationDays: number | null
  classLimit: number | null
  isPopular?: boolean
}

export interface CommunityPostProps {
  id: string
  authorName: string
  authorAvatar: string | null
  content: string
  imageUrls: string[]
  likesCount: number
  commentsCount: number
  createdAt: Date
  isLiked: boolean
}

export interface HeroSectionProps {
  org: OrganizationData
}

export interface ClasesSectionProps {
  org: OrganizationData
  clases: ClassCardProps[]
}

export interface ProfesoresSectionProps {
  org: OrganizationData
  profesores: InstructorCardProps[]
}

export interface TestimoniosSectionProps {
  org: OrganizationData
}

export interface PreciosSectionProps {
  org: OrganizationData
  planes: MembershipCardProps[]
}

export interface ContactoSectionProps {
  org: OrganizationData
}

export interface ThemeComponents {
  layouts: {
    MainLayout: ComponentType<{ children: ReactNode; org: OrganizationData }>
    ClassLayout: ComponentType<{ children: ReactNode; org: OrganizationData }>
  }
  components: {
    Navbar: ComponentType<NavbarProps>
    Footer: ComponentType<FooterProps>
    Hero: ComponentType<HeroProps>
    ClassCard: ComponentType<ClassCardProps>
    InstructorCard: ComponentType<InstructorCardProps>
    BookingButton: ComponentType<BookingButtonProps>
    MembershipCard: ComponentType<MembershipCardProps>
    CommunityPost: ComponentType<CommunityPostProps>
  }
  sections: {
    HeroSection: ComponentType<HeroSectionProps>
    ClasesSection: ComponentType<ClasesSectionProps>
    ProfesoresSection: ComponentType<ProfesoresSectionProps>
    TestimoniosSection: ComponentType<TestimoniosSectionProps>
    PreciosSection: ComponentType<PreciosSectionProps>
    ContactoSection: ComponentType<ContactoSectionProps>
  }
}

export interface ThemeContract {
  config: ThemeConfig
  components: ThemeComponents
}
