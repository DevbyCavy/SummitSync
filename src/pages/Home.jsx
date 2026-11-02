import Seo from '../components/Seo.jsx';
import Hero from '../components/home/Hero.jsx';
import Marquee from '../components/home/Marquee.jsx';
import Publications from '../components/home/Publications.jsx';
import Services from '../components/home/Services.jsx';
import About from '../components/home/About.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import Projects from '../components/home/Projects.jsx';

// Publisher-first order: the publications lead, then services, about, why us, and the coverage gallery.
export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <Marquee />
      <Publications />
      <Services />
      <About />
      <WhyChooseUs />
      <Projects />
    </>
  );
}
