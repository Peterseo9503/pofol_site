import { useState, useEffect, useRef } from 'react';
////////////////////////////////////////////////////////
import FixedHeader from "./pages/FixedHeader/FixedHeader";
import Header from "./pages/Header/Header";
import Aboutme from "./pages/Aboutme/Aboutme";
import Skills from "./pages/Skills/Skills";
import Certification from './pages/Certification/Certification';
import Projects from "./pages/Projects/Projects";
import Career from "./pages/Career/Career";
import Footer from "./pages/Footer/Footer";
import ScrollTopBtn from './components/ScrollTopBtn';
import Preloader from './components/Preloader';
import { trackVisitor } from './services/tracker';
////////////////////////////////////////////////////////
function App() {

  const headerRef = useRef(null);
  const aboutmeRef = useRef(null);
  const skillsRef = useRef(null);
  const certificationRef = useRef(null);
  const projectRef = useRef(null);
  const careerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  // 방문자 접속 로깅 (IP, 지역, 디바이스, 통계)
  useEffect(() => {
    trackVisitor();
  }, []);

  useEffect(() => {
    async function waitForFonts() {
      try {
        // Google Fonts CDN에서 불러오는 폰트가 로드될 때까지 기다림
        await document.fonts.load('1rem "Noto Sans KR"');
        await document.fonts.ready;

        setIsLoading(false);
      } catch (error) {
        console.error("Font loading failed:", error);
        setIsLoading(false);
      }
    }

    waitForFonts();
  }, []);

  return (
    isLoading ? <Preloader /> :
      <div className="App">
        <ScrollTopBtn />
        <FixedHeader headerRef={headerRef} aboutmeRef={aboutmeRef} skillsRef={skillsRef} certificationRef={certificationRef} projectRef={projectRef} careerRef={careerRef} />
        <Header ref={headerRef} aboutmeRef={aboutmeRef} />
        <Aboutme ref={aboutmeRef} />
        <Certification ref={certificationRef} />
        <Skills ref={skillsRef} />
        <Projects ref={projectRef} />
        <Career ref={careerRef} />
        <Footer />
      </div>
  );
}

export default App;
