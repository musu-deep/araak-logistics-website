import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import TrackShipment from './components/TrackShipment';
import WhyLarak from './components/WhyLarak';
import QuoteForm from './components/QuoteForm';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

function App() {
  return (
    <div className="font-cairo" dir="rtl">
      <Header />
      <main>
        <Hero />
        <Services />
        <Stats />
        <TrackShipment />
        <WhyLarak />
        <QuoteForm />
        <Partners />
        <Contact />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}

export default App;
