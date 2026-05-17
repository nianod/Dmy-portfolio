import { useState, useEffect, useCallback } from "react";
import awinging from "./Ui/dummy";
import Resime from "../Components/resime";

 const USER_DATA = {
  name: "Arnold Katumo",
  imageUrl: "/image.jpeg",
  imageII: "/dis.png",
};

const MOVING_TEXTS = [
  "Hello my name is Arnold...",  
  "DevOps Archtect...",
  "A Software Developer...",
  "System DEveloper...",
  "Can we collaborate?",
];

const TYPING_SPEED = 150;
const PAUSE_DURATION = 500;

const Home = () => {
  const [text, setText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

   const typeEffect = useCallback(() => {
    const currentText = MOVING_TEXTS[textIndex];
    const shouldType = !isDeleting && text.length < currentText.length;
    const shouldDelete = isDeleting && text.length > 0;
    const shouldPause = !isDeleting && text.length === currentText.length;
    const shouldMoveToNext = isDeleting && text.length === 0;

    if (shouldType) {
      const timeout = setTimeout(() => {
        setText(currentText.substring(0, text.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    }

    if (shouldDelete) {
      const timeout = setTimeout(() => {
        setText(currentText.substring(0, text.length - 1));
      }, TYPING_SPEED / 2);
      return () => clearTimeout(timeout);
    }

    if (shouldPause) {
      const timeout = setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
      return () => clearTimeout(timeout);
    }

    if (shouldMoveToNext) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % MOVING_TEXTS.length);
    }
  }, [text, isDeleting, textIndex]);

  useEffect(() => {
    const cleanup = typeEffect();
    return cleanup;
  }, [typeEffect]);

  return (
    <div className="mt-10 pb-5 min-h-screen bg-gradient-to-br from-gray-900/9o-black/90 relative z-10">
      <div className="container mx-auto px-4 py-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
           <div className="flex flex-col items-center lg:items-start space-y-6">
            <div className="relative group">
              <img
                className="w-48 h-48 object-cover rounded-full border-4 border-blue-500 shadow-lg  transition-transform duration-300"
                src={USER_DATA.imageUrl}
                alt={`Profile of ${USER_DATA.name}`}
              />
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-300 transition-all duration-300" />
            </div>
            
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {USER_DATA.name}
              </h1>
              
              <div className="mt-4 min-h-8">
                <h2 className="text-xl font-semibold text-gray-300">
                  {text}
                  <span className="ml-1 animate-pulse">|</span>
                </h2>
              </div>

              <div className="mt-6 space-y-2">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-blue-400">
                  Transforming
                </div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                  Ideas into Code
                </div>
              </div>
            </div>
          </div>

           <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                About Me
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto" />
            </div>

            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg">
  I'm a self-taught and passionate DevOps Engineer and Software Developer 
  from Kenya, currently pursuing a degree in Information Technology at 
  Meru University. I specialize in building scalable, responsive, and 
  high-performing applications while designing reliable infrastructure, 
  automating workflows, and implementing modern CI/CD and cloud deployment 
  practices that power seamless digital experiences.
</p>

              <Resime />

               <div className="space-y-6">
                <div className="bg-transparent border border-blue-500/30 p-6 rounded-xl backdrop-blur-sm">
                  <p className="text-green-300 font-semibold text-center">
                    {awinging.digital}
                  </p>
                </div>

                <blockquote className="text-gray-300 italic text-center border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/20 rounded-r-lg">
                  "My journey in tech is driven by curiosity and the desire to 
                  create meaningful digital solutions that make a difference."
                </blockquote>

                 <div className="flex justify-center gap-4 mt-6">
                  <div className="bg-blue-900/30 border border-blue-500/50 px-6 py-3 rounded-lg text-center backdrop-blur-sm hover:scale-105 transition-transform duration-200">
                    <div className="text-2xl font-bold text-blue-300">2+</div>
                    <div className="text-sm text-blue-200">Years Experience</div>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/50 px-6 py-3 rounded-lg text-center backdrop-blur-sm hover:scale-105 transition-transform duration-200">
                    <div className="text-2xl font-bold text-green-300">20+</div>
                    <div className="text-sm text-green-200">Projects</div>
                  </div>
                </div>

                <div 
                  className="bg-transparent border border-blue-500/30 p-6 rounded-xl backdrop-blur-sm"
                  data-aos="flip-up"
                >
                  <p className="text-green-300 font-semibold text-center">
                    {awinging.future}
                  </p>
                </div>
              </div>
            </div>
          </div>

           <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <img
                className="animating border-2 border-gray-700 group-hover:border-blue-400 transition-all duration-500 group-hover:scale-105"
                src={USER_DATA.imageII}
                alt={`Work of ${USER_DATA.name}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;