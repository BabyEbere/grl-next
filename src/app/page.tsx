import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import DivisionsSection from '@/components/home/DivisionsSection';
import MachinerySpotlight from '@/components/home/MachinerySpotlight';
import StatsSection from '@/components/home/StatsSection';
import DivisionRow from '@/components/home/DivisionRow';
import CategoryGallery from '@/components/home/CategoryGallery';
import WhyUsSection from '@/components/home/WhyUsSection';
import MallCTA from '@/components/home/MallCTA';
import YoutubeSection from '@/components/home/YoutubeSection';
import ContactSection from '@/components/home/ContactSection';

import { Metadata } from 'next';
import { query, getSettings } from '@/lib/db';
import { getCatImage } from '@/lib/products';
import { getLatestYouTubeVideos } from '@/lib/youtube';
import { Division } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Global Resources Limited | Machinery, Petroleum, Automobiles & Shopping',
  description: "Global Resources Limited is Nigeria's premier conglomerate, specializing in industrial machinery, bulk petroleum supply, automotive solutions, and retail shopping.",
  openGraph: {
    title: 'Global Resources Limited | Premier Industrial & Corporate Group',
    description: "Nigeria's leading group for machinery, fuel, and automotive excellence.",
    images: ['/assets/images/logo.jpeg'],
  }
};

export default async function Home() {
  const channelId = 'UCqyyhEXOcO8vc9hn1XbXoHg';
  
  // Fetch site settings
  const settings = await getSettings([
    'divisions_heading', 
    'divisions_subheading',
    'phone1',
    'phone2',
    'whatsapp'
  ]);

  // Fetch divisions and videos in parallel
  const [divisions, ytVideos] = await Promise.all([
    query<Division>('SELECT * FROM homepage_divisions WHERE is_active=1 ORDER BY sort_order'),
    getLatestYouTubeVideos(channelId, 5)
  ]);

  // Fetch images for spotlight sections
  const imgMachinery = await getCatImage('excavators',  'assets/images/machinery.png');
  const imgCars      = await getCatImage('automobiles', 'assets/images/cars.png');
  const imgPetroleum = await getCatImage('petroleum',   'assets/images/petroleum.png');
  const imgBulldozer = await getCatImage('bulldozers',  'assets/images/bulldozer.png');
  const imgCrane     = await getCatImage('cranes',      'assets/images/crane.png');
  const imgMall      = await getCatImage('shopping',    'assets/images/mall.png');

  return (
    <>
      <Header />
      
      <main>
        <HeroSection imgSrc={imgMachinery} />
        
        <DivisionsSection 
          heading={settings.divisions_heading || 'Our Four Core Divisions'}
          subheading={settings.divisions_subheading || 'From the construction site to the fuel pump and the shopping floor — we cover every layer of industry and lifestyle.'}
          divisions={divisions}
        />
        
        <MachinerySpotlight imgSrc={imgMachinery} />
        
        <StatsSection imgSrc={imgCrane} />
        
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <DivisionRow 
              title="Premium Automobiles"
              description="Luxury sedans, rugged SUVs, commercial vans and everything in between. All brands available — contact us for inventory and delivery options."
              imgSrc={imgCars}
              icon="ri-car-line"
              colorClass="bg-[#0f1f3d]"
              tags={['Sedans', 'SUVs', 'Pickups', 'Vans', 'Fleet Solutions']}
              linkHref="/products/automobiles"
              ctaText="Browse Cars"
            />
            
            <DivisionRow 
              title="Petroleum Products"
              description="Bulk and retail supply of AGO (Diesel), DPK, PMS, lubricants and aviation fuel with nationwide logistics."
              imgSrc={imgPetroleum}
              icon="ri-oil-line"
              colorClass="bg-orange-900"
              tags={['AGO / Diesel', 'DPK (Kerosene)', 'PMS (Petrol)', 'Lubricants', 'Aviation JET-A1']}
              linkHref="/products/petroleum"
              ctaText="Get Supply Quote"
              reverse
              delay="delay-100"
            />
          </div>
        </section>
        
        <CategoryGallery 
          imgBulldozer={imgBulldozer}
          imgCrane={imgCrane}
        />
        
        <WhyUsSection />
        
        <YoutubeSection videos={ytVideos} />
        
        <MallCTA imgSrc={imgMall} />
        
        <ContactSection 
          phone1={settings.phone1 || '+234 902 438 4244'}
          phone2={settings.phone2 || '0911 155 5552'}
          whatsapp={settings.whatsapp || '2349024384244'}
        />
      </main>

      <Footer />
    </>
  );
}
