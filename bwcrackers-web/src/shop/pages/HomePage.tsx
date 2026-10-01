'use client';

import { FALLBACK_BRANDS } from '../constants';
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
  return (
    <>
      <Hero />
      <HowToOrder />
      <PriceListSection />
      <FeaturedCategories />
      <CollectionsPreview />
      <AboutSection />
      <DeliverySection />
      <HowToPaySection />
      <FaqSection />
      <BrandsMarquee brands={FALLBACK_BRANDS} />
      <WhyChooseUs />
    </>
  );
}
