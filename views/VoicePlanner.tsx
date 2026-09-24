
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, Blob } from '@google/genai';
import { ScreenContainer } from '../components/UI';
import { Icons, MosqueSilhouette } from '../components/Icons';
import { TripPlanInput } from '../types';

interface Props {
  onComplete: (data: TripPlanInput) => void;
}

// Helper to decode Base64 output from Live API to audio
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to encode PCM for Live API
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// Helper to decode PCM output from Live API
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const VoicePlanner: React.FC<Props> = ({ onComplete }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<string>("Tap the gem to begin");
  
  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null); 
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const submitPlanTool: FunctionDeclaration = {
    name: 'submitTripPlan',
    description: 'Call this function ONLY when the user has provided ALL details and explicitly confirmed the plan summary.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        originCity: { type: Type.STRING, description: "The city the user is flying from." },
        travelers: { type: Type.NUMBER, description: "Number of people travelling." },
        startDate: { type: Type.STRING, description: "Estimated start date in YYYY-MM-DD format." },
        durationNights: { type: Type.NUMBER, description: "Length of trip in nights." },
        budgetPerPerson: { type: Type.NUMBER, description: "Budget per person in GBP." },
        routePreference: { 
          type: Type.STRING, 
          enum: ['jeddah-first', 'madinah-first', 'makkah-only'],
          description: "Route preference."
        }
      },
      required: ['originCity', 'travelers', 'startDate', 'durationNights', 'budgetPerPerson', 'routePreference']
    }
  };

  const startSession = async () => {
    if (!process.env.API_KEY) {
      alert("API Key not found");
      return;
    }

    try {
      setStatus("Connecting...");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: `You are Musafir, a warm, patient, and knowledgeable Umrah travel companion. 
          You speak with a gentle, respectful, and slightly formal tone, fitting for a spiritual journey. 
          You are a male guide.

          Your goal is to build a connection with the user and then naturally gather their trip details.
          
          1. GREETING: Start immediately by saying 'As-salamu alaykum' and welcoming them to Musafir. Ask how they are feeling about their intention to visit the Holy Cities.
          2. CONVERSATION: Chat with them briefly. Don't rush to business.
          3. GATHERING INFO: Gently ask for these details one by one (or two at a time), do not interrogate:
             - Origin City
             - Number of Travelers
             - Approximate Date & Duration
             - Budget per person (GBP)
             - Route Preference (Start in Makkah via Jeddah, or start in Madinah?)
          
          4. CONFIRMATION: Once you have ALL details, summarize them back to the user (e.g., "So, you want to fly from London with your wife in March for 10 nights...").
          
          5. SUBMISSION: Ask "Is this correct?".
             - IF they say YES: Say "Bismillah, I am now generating your packages." AND ONLY THEN call the 'submitTripPlan' tool.
             - IF they say NO: Ask what needs changing. DO NOT call the tool yet.

          NEVER call 'submitTripPlan' before the verbal confirmation.`,
          tools: [{ functionDeclarations: [submitPlanTool] }]
        },
        callbacks: {
          onopen: async () => {
            console.log("Session opened");
            setIsConnected(true);
            setStatus("Listening...");
            
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current);
            processorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            processorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(processorRef.current);
            processorRef.current.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              setStatus("Musafir is speaking...");
              if (outputAudioContextRef.current) {
                const audioData = decode(base64Audio);
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                
                const buffer = await decodeAudioData(audioData, outputAudioContextRef.current);
                const source = outputAudioContextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(outputNodeRef.current!);
                
                source.addEventListener('ended', () => {
                   sourcesRef.current.delete(source);
                   if (sourcesRef.current.size === 0) {
                     setIsSpeaking(false);
                     setStatus("Listening...");
                   }
                });

                source.start(nextStartTimeRef.current);
                sourcesRef.current.add(source);
                nextStartTimeRef.current += buffer.duration;
              }
            }

            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                if (fc.name === 'submitTripPlan') {
                  const args = fc.args as unknown as TripPlanInput;
                  console.log("Plan submitted:", args);
                  
                  // Let the audio finish playing before switching
                  setStatus("Perfect. Generating your journey...");
                  sessionPromise.then(session => session.sendToolResponse({
                    functionResponses: [{
                      id: fc.id,
                      name: fc.name,
                      response: { result: { status: "success" } }
                    }]
                  }));

                  // Reduced delay for faster perceived speed
                  setTimeout(() => {
                    stopSession();
                    onComplete(args);
                  }, 800); 
                }
              }
            }
          },
          onclose: () => {
            console.log("Session closed");
            setIsConnected(false);
            setStatus("Session Ended");
          },
          onerror: (err) => {
            console.error("Session error:", err);
            setStatus("Connection Error");
            setIsConnected(false);
          }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (e) {
      console.error(e);
      setStatus("Failed to connect");
    }
  };

  const stopSession = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioContextRef.current) {
      await inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      await outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
    setStatus("Session Ended");
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <ScreenContainer className="justify-between bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E6] overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
         {/* Top Light */}
         <div className={`absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-b from-amber-200/30 to-transparent rounded-full blur-[100px] transition-all duration-1000 ${isConnected ? 'opacity-100' : 'opacity-40'}`}></div>
         
         {/* Bottom Warmth */}
         <div className={`absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-t from-orange-200/20 to-transparent rounded-full blur-[80px] transition-all duration-1000 ${isConnected ? 'opacity-100' : 'opacity-40'}`}></div>
         
         {/* Islamic Pattern Overlay */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-multiply"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 pt-16 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3 group">
           <div className="p-2.5 bg-white rounded-xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-white/50 group-hover:scale-105 transition-transform duration-300">
             <MosqueSilhouette className="w-6 h-6 text-amber-900" />
           </div>
           <span className="text-2xl font-bold text-amber-950 tracking-tight font-serif">Musafir</span>
        </div>
        
        <div className={`transition-all duration-500 transform ${isConnected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
           <div className="flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur-md rounded-full border border-white/50 shadow-sm">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Live</span>
           </div>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-10">
        
        {/* Status Text - Elegant & Serif */}
        <div className="mb-16 text-center h-16 flex items-end justify-center px-8">
          <p className={`text-3xl font-serif text-amber-950/90 leading-tight transition-all duration-500 ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
            {status}
          </p>
        </div>

        {/* The Gem/Orb Interaction */}
        <div className="relative group cursor-pointer" onClick={!isConnected ? startSession : stopSession}>
          
          {/* Ambient Glows */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-[40px] transition-all duration-700 ${isConnected ? 'opacity-100 scale-125' : 'opacity-0 scale-75'}`}></div>

          {/* Ripples - Only visible when connected/speaking */}
          {isConnected && (
            <>
              <div className={`absolute inset-0 rounded-full border border-amber-600/10 z-0 transition-all duration-1000 ${isSpeaking ? 'animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]' : 'scale-100 opacity-0'}`}></div>
              <div className={`absolute inset-[-20px] rounded-full border border-amber-600/5 z-0 transition-all duration-1000 delay-150 ${isSpeaking ? 'animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]' : 'scale-100 opacity-0'}`}></div>
            </>
          )}

          {/* Main Sphere */}
          <div className={`
            relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
            ${isConnected 
              ? 'scale-110 shadow-[inset_0_-8px_20px_rgba(0,0,0,0.1),0_15px_40px_rgba(217,119,6,0.4)] bg-gradient-to-br from-amber-400 to-orange-600' 
              : 'scale-100 shadow-[inset_0_-4px_10px_rgba(0,0,0,0.05),0_15px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(217,119,6,0.2)] hover:scale-105 bg-gradient-to-br from-white to-stone-100 border border-white/60'
            }
          `}>
            {/* Glossy reflection on top */}
            <div className="absolute top-3 left-6 w-12 h-6 bg-white rounded-full blur-[8px] opacity-40 transform -rotate-12 pointer-events-none"></div>

            {/* Icon */}
            {isConnected ? (
               isSpeaking ? (
                 <div className="flex gap-1 h-6 items-center">
                   <div className="w-1.5 bg-white/90 rounded-full animate-[music_0.8s_ease-in-out_infinite] shadow-sm"></div>
                   <div className="w-1.5 bg-white/90 rounded-full animate-[music_0.8s_ease-in-out_0.1s_infinite] shadow-sm"></div>
                   <div className="w-1.5 bg-white/90 rounded-full animate-[music_0.8s_ease-in-out_0.2s_infinite] shadow-sm"></div>
                   <div className="w-1.5 bg-white/90 rounded-full animate-[music_0.8s_ease-in-out_0.3s_infinite] shadow-sm"></div>
                 </div>
               ) : (
                 <Icons.Mic className="w-10 h-10 text-white drop-shadow-md animate-pulse" />
               )
            ) : (
              <Icons.Mic className="w-10 h-10 text-stone-400 group-hover:text-amber-700 transition-colors duration-300" />
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div className={`mt-12 transition-all duration-700 delay-100 ${isConnected ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">Touch to Speak</p>
        </div>

      </div>

      {/* Footer Area */}
      <div className="relative z-10 w-full flex flex-col items-center pb-8">
         <div className="w-full opacity-10 pointer-events-none mb-4">
           <MosqueSilhouette className="w-full text-amber-950 scale-150 transform origin-bottom" />
         </div>
      </div>
      
      {/* CSS for custom waveform animation */}
      <style>{`
        @keyframes music {
          0%, 100% { height: 6px; }
          50% { height: 28px; }
        }
      `}</style>
    </ScreenContainer>
  );
};
