import { LanguageProvider } from '../context/LanguageContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Services from '../components/Services';
import Process from '../components/Process';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import VisitorTracker from '../components/VisitorTracker';

export default function Home() {
  return (
    <LanguageProvider>
      <VisitorTracker />
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
