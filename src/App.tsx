import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import HeartCursor from './components/HeartCursor';
import MusicPlayer from './components/MusicPlayer';
import Scene1_Opening from './components/Scene1_Opening';
import Scene2_Scan from './components/Scene2_Scan';
import Scene3_Galaxy from './components/Scene3_Galaxy';
import Scene4_Quiz from './components/Scene4_Quiz';
import Scene5_Hacker from './components/Scene5_Hacker';
import Scene6_Proposal from './components/Scene6_Proposal';

export default function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const herName = "ريتاج"; // Placeholder, can be customized

  const nextScene = () => {
    setCurrentScene(prev => prev + 1);
  };

  return (
    <>
      <HeartCursor />
      <MusicPlayer />
      
      <AnimatePresence mode="wait">
        {currentScene === 1 && <Scene1_Opening key="scene1" onNext={nextScene} />}
        {currentScene === 2 && <Scene2_Scan key="scene2" onNext={nextScene} herName={herName} />}
        {currentScene === 3 && <Scene3_Galaxy key="scene3" onNext={nextScene} herName={herName} />}
        {currentScene === 4 && <Scene4_Quiz key="scene4" onNext={nextScene} />}
        {currentScene === 5 && <Scene5_Hacker key="scene5" onNext={nextScene} />}
        {currentScene === 6 && <Scene6_Proposal key="scene6" herName={herName} />}
      </AnimatePresence>
    </>
  );
}
