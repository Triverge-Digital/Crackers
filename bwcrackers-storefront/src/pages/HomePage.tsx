import { useEffect, useState } from 'react';
import { Brand, FALLBACK_BRANDS } from '../constants';
import { fetchBrands } from '../lib/api';
import Seo from '../components/ui/Seo';
import Hero from '../components/home/Hero';
import HowToOrder from '../components/home/HowToOrder';
import PriceListSection from '../components/home/PriceListSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import CollectionsPreview from '../components/home/CollectionsPreview';
import AboutSection from '../components/home/AboutSection';
import DeliverySection from '../components/home/DeliverySection';
import HowToPaySection from '../components/home/HowToPaySection';
import FaqSection from '../components/home/FaqSection';
import BrandsMarquee from '../components/home/BrandsMarquee';
import WhyChooseUs from '../components/home/WhyChooseUs';

export default function HomePage() {
  const [brands, setBrands] = useState<Brand[]>(FALLBACK_BRANDS);
  useEffect(() => { fetchBrands().then(setBrands); }, []);

  return (
    <>
      <Seo
        path="/"
        description="B&W Crackers Sivakasi — 2026 Diwali price list with a flat 80% discount on MRP. 165 items across 27 categories, direct dispatch from Sivakasi, order on WhatsApp, pay after confirmation."
      />
      <Hero />
      <HowToOrder />
      <PriceListSection />
      <FeaturedCategories />
      <CollectionsPreview />
      <AboutSection />
      <DeliverySection />
      <HowToPaySection />
      <FaqSection />
      <BrandsMarquee brands={brands} />
      <WhyChooseUs />
    </>
  );
}
