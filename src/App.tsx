/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  GraduationCap, 
  Globe, 
  Users, 
  ShoppingBag, 
  Award, 
  MessageSquare, 
  ChevronRight, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Menu,
  X,
  Send,
  Sparkles,
  TrendingUp,
  ExternalLink,
  Heart,
  Share2,
  BookOpen,
  Clock,
  CheckCircle,
  Check,
  Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type Module = 'home' | 'marketplace' | 'academy' | 'becas' | 'circulation' | 'community' | 'sala-mendoza' | 'signup';

interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  artistBio: string;
  description: string;
  price: number;
  image: string;
  category: 'Pintura' | 'Fotografía' | 'Escultura' | 'Digital' | 'Textil';
  country: string;
}

interface Scholarship {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  type: 'Residencia' | 'Producción' | 'Viaje';
  description: string;
  fullDescription: string;
  directedTo: string;
  requirements: string[];
  documentation: string[];
  image: string;
}

interface CourseTopic {
  title: string;
  duration: string;
}

interface Course {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  level: string;
  image: string;
  topics: CourseTopic[];
}

interface Event {
  id: string;
  city: string;
  country: string;
  countryImage: string;
  venue: string;
  venueImage: string;
  dateFrom: string;
  dateTo: string;
  exhibitionName: string;
  description: string;
  virtualGallery: string[];
}

// --- Mock Data ---
const ART_PIECES: ArtPiece[] = [
  { 
    id: '1', 
    title: 'Ecos del Sur', 
    artist: 'Elena Rivas', 
    artistBio: 'Elena es una pintora argentina con más de 10 años explorando paisajes abstractos.',
    description: 'Una exploración vibrante de los colores de la Patagonia a través de pinceladas enérgicas.',
    price: 1200, 
    image: 'https://picsum.photos/seed/painting1/800/1000', 
    category: 'Pintura', 
    country: 'Argentina' 
  },
  { 
    id: '2', 
    title: 'Fragmentos Urbanos', 
    artist: 'Mateo Silva', 
    artistBio: 'Mateo captura la esencia de la vida citadina en Bogotá a través de su lente.',
    description: 'Serie fotográfica que documenta la arquitectura brutalista y la vida cotidiana.',
    price: 850, 
    image: 'https://picsum.photos/seed/photo1/800/1000', 
    category: 'Fotografía', 
    country: 'Colombia' 
  },
  { 
    id: '3', 
    title: 'Tejido Ancestral', 
    artist: 'Lucía Quispe', 
    artistBio: 'Lucía rescata técnicas de tejido tradicionales de los Andes peruanos.',
    description: 'Obra textil realizada con lana de alpaca teñida con pigmentos naturales.',
    price: 2100, 
    image: 'https://picsum.photos/seed/textile1/800/1000', 
    category: 'Textil', 
    country: 'Perú' 
  },
  { 
    id: '4', 
    title: 'Gravedad Cero', 
    artist: 'Carlos Méndez', 
    artistBio: 'Escultor mexicano enfocado en el equilibrio y la tensión de los materiales.',
    description: 'Escultura en acero que desafía la percepción del peso y el espacio.',
    price: 3400, 
    image: 'https://picsum.photos/seed/sculpture1/800/1000', 
    category: 'Escultura', 
    country: 'México' 
  },
  { 
    id: '5', 
    title: 'Luz Líquida', 
    artist: 'Sofía Aranda', 
    artistBio: 'Artista digital chilena pionera en el uso de algoritmos generativos.',
    description: 'Composición digital que simula el movimiento del agua bajo diferentes espectros de luz.',
    price: 1500, 
    image: 'https://picsum.photos/seed/digital1/800/1000', 
    category: 'Digital', 
    country: 'Chile' 
  },
  { 
    id: '6', 
    title: 'Silencio Mineral', 
    artist: 'Javier Rocha', 
    artistBio: 'Pintor uruguayo cuya obra se centra en la textura y la materia.',
    description: 'Óleo sobre lienzo con texturas que evocan formaciones geológicas antiguas.',
    price: 950, 
    image: 'https://picsum.photos/seed/painting2/800/1000', 
    category: 'Pintura', 
    country: 'Uruguay' 
  },
];

const SCHOLARSHIPS: Scholarship[] = [
  { 
    id: 'b1', 
    title: 'Residencia en Berlín 2026', 
    organization: 'KulturLab', 
    deadline: '2026-06-15', 
    type: 'Residencia', 
    description: '3 meses de estancia con taller y estipendio mensual.', 
    fullDescription: 'Esta beca ofrece a artistas emergentes la oportunidad de desarrollar un proyecto de investigación en el corazón de Berlín. Incluye acceso a talleres compartidos, mentorías con curadores locales y una exposición final.',
    directedTo: 'Artistas visuales individuales con enfoque en nuevos medios o pintura contemporánea.',
    requirements: ['Ser artista emergente con menos de 5 años de trayectoria', 'Dominio básico de inglés o alemán', 'Propuesta de proyecto coherente'],
    documentation: ['Portafolio digital (PDF)', 'CV actualizado', 'Carta de motivación', 'Presupuesto estimado'],
    image: 'https://picsum.photos/seed/berlin/800/600' 
  },
  { 
    id: 'b2', 
    title: 'Fondo de Producción Joven', 
    organization: 'ArtRise Foundation', 
    deadline: '2026-05-20', 
    type: 'Producción', 
    description: 'Apoyo económico para materiales y montaje de obra.', 
    fullDescription: 'El Fondo de Producción Joven busca apoyar la realización de obras de gran formato o alta complejidad técnica que requieran una inversión inicial significativa.',
    directedTo: 'Artistas de entre 18 y 35 años residentes en cualquier país de Latinoamérica.',
    requirements: ['Residir en Latinoamérica', 'Tener entre 18 y 35 años', 'Proyecto en fase de pre-producción'],
    documentation: ['Descripción técnica de la obra', 'Cronograma de trabajo', 'Cotización de materiales', 'Bocetos o renders'],
    image: 'https://picsum.photos/seed/studio/800/600' 
  },
  { 
    id: 'b3', 
    title: 'Beca de Circulación Latam', 
    organization: 'OEA Cultura', 
    deadline: '2026-07-01', 
    type: 'Viaje', 
    description: 'Pasajes y viáticos para exposiciones en el extranjero.', 
    fullDescription: 'Facilitamos la presencia de artistas latinoamericanos en ferias y bienales internacionales cubriendo los costos de movilidad y estancia.',
    directedTo: 'Artistas, curadores y gestores culturales con una invitación formal a un evento internacional.',
    requirements: ['Tener una invitación formal a un evento internacional', 'Pasaporte vigente', 'No haber recibido esta beca en los últimos 2 años'],
    documentation: ['Carta de invitación del evento', 'Copia de pasaporte', 'Plan de viaje', 'Presupuesto de viáticos'],
    image: 'https://picsum.photos/seed/travel/800/600' 
  },
];

const COURSES: Course[] = [
  { 
    id: 'c1', 
    title: 'ABC del Mercado del Arte', 
    shortDescription: 'Aprende las bases para comercializar tu obra profesionalmente.',
    fullDescription: 'Este curso te llevará desde la valuación de tu obra hasta la negociación con galerías y coleccionistas. Entenderás cómo funciona el ecosistema del arte actual.',
    duration: '4 semanas', 
    level: 'Básico', 
    image: 'https://picsum.photos/seed/market/600/400',
    topics: [
      { title: 'Valuación de obra', duration: '1 semana' },
      { title: 'Portafolio profesional', duration: '1 semana' },
      { title: 'Relación con galerías', duration: '1 semana' },
      { title: 'Contratos y legalidad', duration: '1 semana' }
    ]
  },
  { 
    id: 'c2', 
    title: 'Gestión Cultural y Emprendimiento', 
    shortDescription: 'Convierte tu práctica artística en un proyecto sostenible.',
    fullDescription: 'Aprende a gestionar proyectos culturales desde la idea hasta la ejecución, incluyendo búsqueda de fondos y marketing cultural.',
    duration: '8 semanas', 
    level: 'Intermedio', 
    image: 'https://picsum.photos/seed/management/600/400',
    topics: [
      { title: 'Diseño de proyectos', duration: '2 semanas' },
      { title: 'Financiamiento y becas', duration: '2 semanas' },
      { title: 'Marketing para artistas', duration: '2 semanas' },
      { title: 'Gestión de audiencias', duration: '2 semanas' }
    ]
  },
  { 
    id: 'c3', 
    title: 'Curaduría para Artistas', 
    shortDescription: 'Aprende a narrar y montar tus propias exposiciones.',
    fullDescription: 'La curaduría no es solo para expertos. Aprende a seleccionar, organizar y presentar tu trabajo de manera que cuente una historia poderosa.',
    duration: '6 semanas', 
    level: 'Avanzado', 
    image: 'https://picsum.photos/seed/curator/600/400',
    topics: [
      { title: 'Teoría de la curaduría', duration: '1 semana' },
      { title: 'Narrativa espacial', duration: '2 semanas' },
      { title: 'Montaje e iluminación', duration: '2 semanas' },
      { title: 'Texto curatorial', duration: '1 semana' }
    ]
  },
];

const EVENTS: Event[] = [
  {
    id: 'e1',
    city: 'Bogotá',
    country: 'Colombia',
    countryImage: 'https://picsum.photos/seed/colombia/400/300',
    venue: 'Museo de Arte Moderno (MAMBO)',
    venueImage: 'https://picsum.photos/seed/mambo/800/600',
    dateFrom: '2026-04-15',
    dateTo: '2026-05-15',
    exhibitionName: 'Raíces Digitales',
    description: 'Una exploración de la identidad latinoamericana a través de medios digitales y algoritmos generativos.',
    virtualGallery: [
      'https://picsum.photos/seed/expo1_1/800/600',
      'https://picsum.photos/seed/expo1_2/800/600',
      'https://picsum.photos/seed/expo1_3/800/600',
      'https://picsum.photos/seed/expo1_4/800/600'
    ]
  },
  {
    id: 'e2',
    city: 'Ciudad de México',
    country: 'México',
    countryImage: 'https://picsum.photos/seed/mexico/400/300',
    venue: 'Museo de Arte Moderno',
    venueImage: 'https://picsum.photos/seed/mam_mexico/800/600',
    dateFrom: '2026-06-01',
    dateTo: '2026-07-15',
    exhibitionName: 'Horizontes Compartidos',
    description: 'Diálogo visual entre artistas mexicanos y colombianos sobre el paisaje urbano contemporáneo.',
    virtualGallery: [
      'https://picsum.photos/seed/expo2_1/800/600',
      'https://picsum.photos/seed/expo2_2/800/600',
      'https://picsum.photos/seed/expo2_3/800/600'
    ]
  },
  {
    id: 'e3',
    city: 'Buenos Aires',
    country: 'Argentina',
    countryImage: 'https://picsum.photos/seed/argentina/400/300',
    venue: 'Centro Cultural Recoleta',
    venueImage: 'https://picsum.photos/seed/recoleta/800/600',
    dateFrom: '2026-08-10',
    dateTo: '2026-09-20',
    exhibitionName: 'Materia y Memoria',
    description: 'Exposición colectiva que investiga el uso de materiales no convencionales en la escultura.',
    virtualGallery: [
      'https://picsum.photos/seed/expo3_1/800/600',
      'https://picsum.photos/seed/expo3_2/800/600'
    ]
  },
  {
    id: 'e4',
    city: 'Madrid',
    country: 'España',
    countryImage: 'https://picsum.photos/seed/spain/400/300',
    venue: 'Matadero Madrid',
    venueImage: 'https://picsum.photos/seed/matadero/800/600',
    dateFrom: '2026-10-05',
    dateTo: '2026-11-15',
    exhibitionName: 'Diálogos Transatlánticos',
    description: 'Muestra internacional que conecta las vanguardias europeas con el nuevo arte latino.',
    virtualGallery: [
      'https://picsum.photos/seed/expo4_1/800/600',
      'https://picsum.photos/seed/expo4_2/800/600',
      'https://picsum.photos/seed/expo4_3/800/600'
    ]
  },
  {
    id: 'e5',
    city: 'Lima',
    country: 'Perú',
    countryImage: 'https://picsum.photos/seed/peru/400/300',
    venue: 'MALI - Museo de Arte de Lima',
    venueImage: 'https://picsum.photos/seed/mali/800/600',
    dateFrom: '2026-12-01',
    dateTo: '2027-01-15',
    exhibitionName: 'Tejidos de la Tierra',
    description: 'Una mirada profunda a las tradiciones textiles y su evolución en el arte contemporáneo.',
    virtualGallery: [
      'https://picsum.photos/seed/expo5_1/800/600',
      'https://picsum.photos/seed/expo5_2/800/600'
    ]
  }
];

const COMMUNITY_MEMBERS = [
  { id: 1, name: 'Elena Rivas', role: 'Artista', country: 'Argentina', image: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Dr. Ricardo Velez', role: 'Curador', country: 'México', image: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Museo MAMBO', role: 'Organización', country: 'Colombia', image: 'https://picsum.photos/seed/mambo_logo/150/150' },
  { id: 4, name: 'Mateo Silva', role: 'Artista', country: 'Colombia', image: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: 'Ana Sofía Torres', role: 'Curador', country: 'España', image: 'https://i.pravatar.cc/150?u=5' },
  { id: 6, name: 'KulturLab', role: 'Organización', country: 'Alemania', image: 'https://picsum.photos/seed/kl_logo/150/150' },
  { id: 7, name: 'Lucía Quispe', role: 'Artista', country: 'Perú', image: 'https://i.pravatar.cc/150?u=7' },
  { id: 8, name: 'Carlos Bauza', role: 'Curador', country: 'Argentina', image: 'https://i.pravatar.cc/150?u=8' },
];

const FORUM_TOPICS = [
  { 
    id: 't1', 
    title: '¿Qué opinan del uso de IA en la pintura tradicional?', 
    author: 'Elena Rivas', 
    replies: [
      { user: 'Mateo Silva', text: 'Creo que es una herramienta más, como lo fue la fotografía en su momento.' },
      { user: 'Ana Sofía Torres', text: 'La clave está en cómo el artista integra el algoritmo en su discurso personal.' }
    ]
  },
  { 
    id: 't2', 
    title: 'Buscando colaboradores para un proyecto de fotografía urbana en CDMX.', 
    author: 'Mateo Silva', 
    replies: [
      { user: 'Dr. Ricardo Velez', text: 'Me interesa. Conozco varios espacios que podrían albergar una muestra así.' }
    ]
  },
  { 
    id: 't3', 
    title: 'Comparto mi último proceso de teñido natural. ¡Miren estos colores!', 
    author: 'Lucía Quispe', 
    replies: [
      { user: 'Carlos Bauza', text: 'Impresionante la saturación que lograste con pigmentos orgánicos.' }
    ]
  }
];

const SALA_MENDOZA_GALLERY = [
  { id: 1, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_0.png', title: 'Exposición de Carteles', size: 'large' },
  { id: 2, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_2.png', title: 'Vida en la Sala', size: 'medium' },
  { id: 3, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_3.png', title: 'Archivos Históricos', size: 'small' },
  { id: 4, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_4.png', title: 'Documentación de Arte', size: 'small' },
  { id: 5, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_5.png', title: 'Comunidad Sala Mendoza', size: 'medium' },
  { id: 6, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_6.png', title: 'Instalación Suspendida', size: 'medium' },
  { id: 7, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_7.png', title: 'Galería de Pintura', size: 'small' },
  { id: 8, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_8.png', title: 'Mural Geométrico', size: 'large' },
  { id: 9, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_9.png', title: 'Tríptico Abstracto', size: 'medium' },
  { id: 10, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_10.png', title: 'Enfoque Artístico', size: 'small' },
  { id: 11, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_11.png', title: 'Artesanía y Diseño', size: 'medium' },
  { id: 12, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_12.png', title: 'Perspectiva de Salas', size: 'large' },
  { id: 13, url: 'https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_13.png', title: 'Mirada Atenta', size: 'small' },
];

// --- Constants ---
const LOGO_TRANSPARENT = "https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/Logo_transparente.png";
const LOGO_BLACK = "https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/Logo_negro.png";

// --- Components ---

const Logo = ({ className = "h-8", mode = "on-light", src }: { className?: string, mode?: "on-light" | "on-dark", src?: string }) => (
  <img 
    src={src || (mode === "on-dark" ? LOGO_TRANSPARENT : LOGO_BLACK)} 
    alt="Arte sin Frontera Logo" 
    className={`${className} object-contain`}
    referrerPolicy="no-referrer"
  />
);

const Navbar = ({ activeModule, setActiveModule }: { activeModule: Module, setActiveModule: (m: Module) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems: { id: Module, label: string, icon: React.ReactNode }[] = [
    { id: 'home', label: 'Inicio', icon: <Palette size={18} /> },
    { id: 'marketplace', label: 'Mercado', icon: <ShoppingBag size={18} /> },
    { id: 'academy', label: 'Academia', icon: <GraduationCap size={18} /> },
    { id: 'becas', label: 'Becas', icon: <Award size={18} /> },
    { id: 'circulation', label: 'Circulación', icon: <Globe size={18} /> },
    { id: 'community', label: 'Comunidad', icon: <Users size={18} /> },
    { id: 'sala-mendoza', label: 'Sala Mendoza', icon: <Library size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveModule('home')}>
            <Logo className="h-10" mode="on-light" />
            <span className="text-xl font-bold tracking-tighter uppercase hidden sm:block">Arte sin <span className="text-gray-400 font-light">Frontera</span></span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeModule === item.id ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => setActiveModule('signup')}
              className="px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-full hover:bg-gray-800 transition-colors"
            >
              Registrarse
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveModule(item.id); setIsOpen(false); }}
                  className={`flex items-center gap-3 w-full px-3 py-3 text-base font-medium rounded-lg ${activeModule === item.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: '¡Hola! Soy tu Curador Virtual. ¿En qué puedo ayudarte hoy con ArtRise Global?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `Eres el asistente de Arte sin Frontera, una plataforma de arte contemporáneo para artistas emergentes. 
            Ayuda al usuario con preguntas sobre:
            1. Marketplace: Venta de obras internacionales con detalles del artista y obra.
            2. Academia: Cursos de gestión cultural con temarios detallados.
            3. Becas: Residencias y apoyos con requisitos y documentación.
            4. Circulación: Exposiciones híbridas y galerías virtuales.
            5. Comunidad: Foro de artistas y directorio de curadores.
            
            El usuario pregunta: ${userMsg}` }]
          }
        ],
        config: {
          systemInstruction: "Sé amable, profesional y apasionado por el arte. Usa un tono inspirador y menciona que somos 'Arte sin Frontera'."
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Lo siento, tuve un problema procesando tu solicitud." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Lo siento, no puedo conectarme en este momento." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-100 flex flex-col h-[500px]"
          >
            <div className="bg-black p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-400" />
                <span className="font-bold">Curador Virtual AI</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm animate-pulse flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregunta sobre la plataforma..."
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-black"
              />
              <button onClick={handleSend} className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </button>
    </div>
  );
};

// --- Module Views ---

const HomeView = ({ onNavigate }: { onNavigate: (m: Module) => void }) => {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/art-hero-2/1920/1080" 
            alt="Hero Art" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-white"></div>
              <Logo className="h-12" src="https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/logo_blanco.jpg" />
              <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">Plataforma Global de Arte</span>
            </div>
            <h1 className="text-7xl sm:text-[10rem] font-black tracking-tighter leading-[0.8] mb-12 text-white uppercase">
              Arte sin <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aeef] via-[#fff200] to-[#ec008c] italic font-light">Frontera</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-xl leading-relaxed font-light">
              Donde la visión artística se encuentra con la oportunidad global. 
              Formación, mercado y comunidad en un solo ecosistema digital.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => onNavigate('marketplace')}
                className="px-10 py-5 bg-white text-black font-black rounded-full flex items-center gap-3 hover:bg-gray-200 transition-all group uppercase tracking-widest text-xs"
              >
                Explorar Galería <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('signup')}
                className="px-10 py-5 border border-white/30 text-white font-black rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs backdrop-blur-sm"
              >
                Unirse a la Red
              </button>
            </div>
          </motion.div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute right-8 bottom-24 hidden lg:block">
          <p className="writing-mode-vertical text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 rotate-180">
            EST. 2026 • BOGOTÁ • CDMX • MADRID • BUENOS AIRES
          </p>
        </div>
      </section>

      {/* Artistic Quote / Philosophy */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-4xl sm:text-6xl font-serif italic text-gray-300 mb-8 block">"El arte no tiene límites, solo horizontes por descubrir."</span>
          <div className="h-20 w-px bg-black mx-auto mb-8"></div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Nuestra Filosofía</p>
        </motion.div>
      </section>

      {/* Impact Stats - Artistic Version */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {[
            { label: 'Artistas Formados', val: '200+', icon: <GraduationCap /> },
            { label: 'Obras Vendidas', val: '100+', icon: <ShoppingBag /> },
            { label: 'Usuarios Globales', val: '1,000+', icon: <Users /> },
            { label: 'Alianzas Int.', val: '5', icon: <Globe /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ backgroundColor: '#000', color: '#fff' }}
              className="p-16 border border-gray-100 flex flex-col items-center text-center transition-colors duration-500 group"
            >
              <div className="mb-8 text-black group-hover:text-white transition-colors">{stat.icon}</div>
              <div className="text-6xl font-black mb-4 tracking-tighter">{stat.val}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold group-hover:text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sala Mendoza Preview */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
             >
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[600px]">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_12.png" 
                    alt="Sala Mendoza Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                     <p className="text-white text-sm font-bold uppercase tracking-[0.3em]">Vista de Instalación / Sala Mendoza</p>
                  </div>
                </div>
             </motion.div>
             <div className="space-y-8">
                <div className="bg-black text-white px-4 py-1 inline-block rounded-full text-[10px] font-bold uppercase tracking-widest">Aliado Estratégico</div>
                <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">Explora el Legado de <br /> <span className="italic font-light text-gray-400">Sala Mendoza</span></h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg font-light">
                  Sumérgete en la historia visual de uno de los espacios más icónicos del arte contemporáneo latinoamericano. 
                  Desde carteles históricos hasta instalaciones vanguardistas, ahora parte de nuestra red global.
                </p>
                <div className="pt-4">
                  <button 
                    onClick={() => onNavigate('sala-mendoza')}
                    className="px-12 py-6 bg-black text-white font-black rounded-full hover:bg-gray-800 transition-all uppercase tracking-widest text-xs shadow-xl shadow-black/20"
                  >
                    Ver Galería Completa
                  </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Section - Artistic Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-6">Obras <br /><span className="text-gray-300">Destacadas</span></h2>
            <p className="text-gray-500 text-lg">Una selección rigurosa de las piezas más impactantes de nuestra red global.</p>
          </div>
          <button 
            onClick={() => onNavigate('marketplace')} 
            className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-2"
          >
            Ver Catálogo Completo <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <ArtCard art={ART_PIECES[0]} />
          </div>
          <div className="md:col-span-5 space-y-8">
            <ArtCard art={ART_PIECES[1]} />
            <ArtCard art={ART_PIECES[2]} />
          </div>
        </div>
      </section>
    </div>
  );
};


const SalaMendozaView = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Editorial Header */}
      <div className="mb-24 text-center max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-10 bg-black"></div>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-gray-500">Curaduría e Historia</p>
            <div className="h-px w-10 bg-black"></div>
          </div>
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-10">
            Sala <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aeef] via-[#fff200] to-[#ec008c] italic font-light">Mendoza</span>
          </h1>
          <p className="text-2xl text-gray-600 font-light leading-relaxed">
            Explora la riqueza visual y el legado de uno de los espacios más vibrantes del arte contemporáneo. 
            Una inmersión profunda en sus archivos, exposiciones y comunidad.
          </p>
        </motion.div>
      </div>

      {/* Bento-style Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-[300px]">
        {SALA_MENDOZA_GALLERY.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className={`group relative rounded-[2.5rem] overflow-hidden cursor-zoom-in ${
              item.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
              item.size === 'medium' ? 'md:col-span-2' : ''
            }`}
          >
             <img 
               src={item.url} 
               alt={item.title} 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
               <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-2 opacity-60">Archivo Sala Mendoza</span>
               <h3 className="text-white text-2xl font-black uppercase tracking-tighter leading-none">{item.title}</h3>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Contact Section for Sala Mendoza */}
      <div className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
           <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight mb-8">Conecta con la <br /><span className="italic font-light">Sala Mendoza</span></h2>
           <p className="text-gray-600 text-lg mb-10 leading-relaxed">
             Para consultas sobre obras, archivos históricos o propuestas de colaboración directa con la Sala Mendoza, 
             puedes contactar directamente a su equipo de curaduría.
           </p>
           <button className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-2 hover:gap-6 transition-all">
             Contactar Curadores <ArrowRight size={16} />
           </button>
        </div>
        <div className="h-64 rounded-[3rem] overflow-hidden">
           <img src="https://cdn.jsdelivr.net/gh/msb70/Arte-sin-Frontera@main/public/sala-mendoza/foto_2.png" alt="Contacto" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </div>
    </div>
  );
};

const ArtCard: React.FC<{ art: ArtPiece }> = ({ art }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-4 bg-gray-100">
        <img 
          src={art.image} 
          alt={art.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
            {art.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-6 py-3 bg-white text-black font-bold rounded-full scale-90 group-hover:scale-100 transition-transform">
            Ver Detalles
          </button>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold leading-tight">{art.title}</h3>
          <p className="text-sm text-gray-500">{art.artist} • {art.country}</p>
        </div>
        <div className="text-lg font-black">${art.price}</div>
      </div>
    </motion.div>
  );
};

const MarketplaceView = () => {
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);

  if (selectedArt) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <button onClick={() => setSelectedArt(null)} className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all">
          <ArrowRight className="rotate-180" size={18} /> Volver al Mercado
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="rounded-[3rem] overflow-hidden bg-gray-100">
            <img src={selectedArt.image} alt={selectedArt.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full w-fit mb-6">
              {selectedArt.category}
            </span>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{selectedArt.title}</h1>
            <p className="text-2xl font-light text-gray-500 mb-8">{selectedArt.artist} • {selectedArt.country}</p>
            
            <div className="space-y-8 mb-12">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Descripción de la obra</h4>
                <p className="text-lg text-gray-700 leading-relaxed">{selectedArt.description}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Sobre el artista</h4>
                <p className="text-lg text-gray-700 leading-relaxed">{selectedArt.artistBio}</p>
              </div>
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Precio de venta</h4>
                  <p className="text-3xl font-black">${selectedArt.price}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Forma de pago</h4>
                  <p className="text-sm font-bold">Tarjeta, Crypto, Transferencia</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                Comprar Ahora
              </button>
              <button className="px-8 py-5 border-2 border-black text-black font-bold rounded-full hover:bg-black hover:text-white transition-all">
                Ofertar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Marketplace</h1>
          <p className="text-gray-500">Adquiere arte original de los talentos más prometedores.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Buscar obra o artista..." className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black" />
          </div>
          <button className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {ART_PIECES.map((art) => (
          <div key={art.id} onClick={() => setSelectedArt(art)}>
            <ArtCard art={art} />
          </div>
        ))}
      </div>
    </div>
  );
};

const AcademyView = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  if (isEnrolled) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-48 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Award size={48} />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">¡Inscripción Exitosa!</h1>
          <p className="text-xl text-gray-600 mb-12">Ya eres parte de "{selectedCourse?.title}". Revisa tu correo para los detalles del acceso.</p>
          <button 
            onClick={() => { setIsEnrolled(false); setSelectedCourse(null); }}
            className="px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all"
          >
            Volver a Formación
          </button>
        </motion.div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <button onClick={() => setSelectedCourse(null)} className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all">
          <ArrowRight className="rotate-180" size={18} /> Volver a la Academia
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="rounded-[3rem] overflow-hidden mb-8 h-[400px]">
              <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">{selectedCourse.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">{selectedCourse.fullDescription}</p>
            
            <div className="flex gap-4 mb-12">
              <div className="px-6 py-3 bg-gray-100 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-gray-400">Duración Total</p>
                <p className="font-bold">{selectedCourse.duration}</p>
              </div>
              <div className="px-6 py-3 bg-gray-100 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-gray-400">Nivel</p>
                <p className="font-bold">{selectedCourse.level}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100">
            <h3 className="text-2xl font-black uppercase mb-8">Temario del Curso</h3>
            <div className="space-y-6 mb-12">
              {selectedCourse.topics.map((topic, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <p className="font-bold">{topic.title}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{topic.duration}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setIsEnrolled(true)}
              className="w-full py-5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
            >
              Confirmar Inscripción
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-3xl mb-16">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Academia ABC del Arte</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Capacitamos a artistas en gestión cultural, mercado y emprendimiento para que su talento 
          se convierta en una carrera sostenible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COURSES.map((course) => (
          <div key={course.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase rounded">{course.duration}</span>
                <span className="px-2 py-1 bg-black text-white text-[10px] font-bold uppercase rounded">{course.level}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">{course.shortDescription}</p>
              <button 
                onClick={() => setSelectedCourse(course)}
                className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Inscribirse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BecasView = () => {
  const [selectedBeca, setSelectedBeca] = useState<Scholarship | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  if (isApplied) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={48} />
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">¡Postulación Exitosa!</h2>
          <p className="text-xl text-gray-600 mb-10">Ya te encuentras postulado para la beca <strong>{selectedBeca?.title}</strong>. Nuestro comité revisará tu documentación y te contactará vía email.</p>
          <button 
            onClick={() => {
              setIsApplied(false);
              setSelectedBeca(null);
            }}
            className="px-12 py-5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all uppercase tracking-widest text-sm"
          >
            Volver a Becas
          </button>
        </motion.div>
      </div>
    );
  }

  if (selectedBeca) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <button onClick={() => setSelectedBeca(null)} className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all">
          <ArrowRight className="rotate-180" size={18} /> Volver a Becas
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="rounded-[3rem] overflow-hidden mb-8 h-[400px]">
              <img src={selectedBeca.image} alt={selectedBeca.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{selectedBeca.title}</h1>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-8">{selectedBeca.organization}</p>
            <div className="space-y-6 mb-12">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Descripción de la beca</h4>
                <p className="text-xl text-gray-600 leading-relaxed">{selectedBeca.fullDescription}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Dirigida a</h4>
                <p className="text-xl text-gray-600 leading-relaxed">{selectedBeca.directedTo}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100">
              <h3 className="text-2xl font-black uppercase mb-6">Requisitos Mínimos</h3>
              <ul className="space-y-4 mb-10">
                {selectedBeca.requirements.map((req, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="mt-1.5 w-2 h-2 bg-black rounded-full shrink-0"></div>
                    <p className="text-gray-700">{req}</p>
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-black uppercase mb-6">Documentación Requerida</h3>
              <ul className="space-y-4 mb-12">
                {selectedBeca.documentation.map((doc, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="mt-1.5 w-2 h-2 bg-gray-400 rounded-full shrink-0"></div>
                    <p className="text-gray-700">{doc}</p>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => setIsApplied(true)}
                className="w-full py-5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-xl shadow-black/10 uppercase tracking-widest"
              >
                Confirmar Postulación
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex justify-between items-end mb-16">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Becas y Apoyos</h1>
          <p className="text-xl text-gray-600">
            Oportunidades de financiamiento, residencias y movilidad para impulsar tu proyección internacional.
          </p>
        </div>
        <div className="hidden md:block">
          <TrendingUp size={48} className="text-gray-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SCHOLARSHIPS.map((beca) => (
          <motion.div 
            key={beca.id}
            whileHover={{ x: 10 }}
            className="flex flex-col sm:flex-row bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden">
              <img src={beca.image} alt={beca.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="p-8 sm:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    beca.type === 'Residencia' ? 'bg-blue-100 text-blue-700' : 
                    beca.type === 'Producción' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {beca.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-red-500 font-bold">
                    <Calendar size={14} />
                    Cierra: {beca.deadline}
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-2">{beca.title}</h3>
                <p className="text-sm text-gray-500 font-medium mb-4">{beca.organization}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{beca.description}</p>
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => setSelectedBeca(beca)}
                  className="flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 hover:gap-4 transition-all"
                >
                  Postular ahora <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Application Process Mock */}
      <div className="mt-24 p-12 bg-black text-white rounded-[3rem] relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black uppercase mb-6">¿Cómo aplicar?</h2>
            <div className="space-y-6">
              {[
                { step: '01', text: 'Completa tu portafolio digital en la plataforma.' },
                { step: '02', text: 'Selecciona la beca que mejor se adapte a tu proyecto.' },
                { step: '03', text: 'Sube tu propuesta técnica y presupuesto.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-2xl font-black text-gray-500">{item.step}</span>
                  <p className="text-lg">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
            <h4 className="font-bold mb-4 flex items-center gap-2"><Sparkles size={18} className="text-yellow-400" /> Tip del Curador</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              "Para las becas de residencia, enfócate en explicar cómo el entorno de la ciudad destino 
              influirá en tu proceso creativo. La investigación es tan importante como la técnica."
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
};

const CirculationView = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showVirtual, setShowVirtual] = useState(false);

  if (showVirtual && selectedEvent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <button onClick={() => setShowVirtual(false)} className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all">
          <ArrowRight className="rotate-180" size={18} /> Volver a la Exposición
        </button>
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12">Galería Virtual: {selectedEvent.exhibitionName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {selectedEvent.virtualGallery.map((img, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden h-[400px]"
            >
              <img src={img} alt={`Obra ${i+1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <button onClick={() => setSelectedEvent(null)} className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all">
          <ArrowRight className="rotate-180" size={18} /> Volver a Circulación
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="rounded-[3rem] overflow-hidden h-[500px] relative">
              <img src={selectedEvent.venueImage} alt={selectedEvent.venue} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-6 right-6 w-24 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                <img src={selectedEvent.countryImage} alt={selectedEvent.country} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">{selectedEvent.exhibitionName}</h1>
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Sede</p>
                <p className="font-bold">{selectedEvent.venue}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Ubicación</p>
                <p className="font-bold">{selectedEvent.city}, {selectedEvent.country}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-gray-50 rounded-[3rem] p-12 border border-gray-100">
            <div className="mb-12">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Fechas de la Exposición</h4>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-400 uppercase">Desde</p>
                  <p className="text-2xl font-black">{selectedEvent.dateFrom}</p>
                </div>
                <div className="h-px w-12 bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-400 uppercase">Hasta</p>
                  <p className="text-2xl font-black">{selectedEvent.dateTo}</p>
                </div>
              </div>
            </div>
            <div className="mb-12">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Sobre la exposición</h4>
              <p className="text-lg text-gray-700 leading-relaxed">{selectedEvent.description}</p>
            </div>
            <button 
              onClick={() => setShowVirtual(true)}
              className="w-full py-5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <Globe size={20} /> Explorar Virtualmente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 italic">Circulación <span className="text-gray-300">Global</span></h1>
        <p className="text-xl text-gray-600">
          Exposiciones híbridas que rompen fronteras, conectando el espacio físico con el digital en las sedes más prestigiosas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EVENTS.map((event) => (
          <motion.div 
            key={event.id}
            whileHover={{ y: -10 }}
            onClick={() => setSelectedEvent(event)}
            className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all"
          >
            <div className="relative h-64 overflow-hidden">
              <img src={event.venueImage} alt={event.venue} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">{event.city}, {event.country}</p>
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{event.exhibitionName}</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">{event.description}</p>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2"><Calendar size={14} /> {event.dateFrom}</div>
                <ArrowRight size={14} />
                <div className="flex items-center gap-2">{event.dateTo}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CommunityView = () => {
  const [selectedTopic, setSelectedTopic] = useState<typeof FORUM_TOPICS[0] | null>(null);

  if (selectedTopic) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <button onClick={() => setSelectedTopic(null)} className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all">
          <ArrowRight className="rotate-180" size={18} /> Volver al Foro
        </button>
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">{selectedTopic.author[0]}</div>
            <div>
              <p className="font-black uppercase text-sm tracking-tighter">{selectedTopic.author}</p>
              <p className="text-xs text-gray-400">Autor del tema</p>
            </div>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-tight">{selectedTopic.title}</h1>
          <div className="h-px w-full bg-gray-100 mb-8"></div>
          <div className="space-y-8">
            {selectedTopic.replies.map((reply, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">{reply.user[0]}</div>
                <div className="flex-1 bg-gray-50 p-6 rounded-2xl rounded-tl-none">
                  <p className="font-bold text-xs uppercase tracking-widest mb-2">{reply.user}</p>
                  <p className="text-gray-600 leading-relaxed">{reply.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100">
            <textarea className="w-full p-6 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black mb-4" placeholder="Escribe tu respuesta..."></textarea>
            <button className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all uppercase tracking-widest text-xs">Publicar Respuesta</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-20">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 italic">Comunidad <span className="text-gray-300">Global</span></h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Una sola red para conectar artistas, curadores y organizaciones de todo el mundo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Network List */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Users size={24} /> Red de Miembros
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {COMMUNITY_MEMBERS.map((member) => (
                <motion.div 
                  key={member.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 text-center group"
                >
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover border-2 border-white shadow-md group-hover:border-black transition-colors" />
                    <div className="absolute -bottom-1 -right-1 bg-black text-white text-[8px] font-bold uppercase px-2 py-1 rounded-full">
                      {member.role}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm leading-tight mb-1">{member.name}</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{member.country}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
              <MessageSquare size={24} /> Foro de Discusión
            </h2>
            <div className="space-y-4">
              {FORUM_TOPICS.map((topic) => (
                <div 
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className="bg-gray-50 p-8 rounded-[2rem] border border-transparent hover:border-black hover:bg-white transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter group-hover:text-gray-600 transition-colors">{topic.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white px-3 py-1 rounded-full">{topic.replies.length} respuestas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-bold text-black uppercase tracking-tighter">{topic.author}</span>
                    <span>•</span>
                    <span>Hace 2 horas</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / CTA */}
        <div className="space-y-8">
          <div className="bg-black text-white p-10 rounded-[3rem] relative overflow-hidden">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-none">¿Aún no eres parte?</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">Únete a la red más grande de arte emergente y comienza a circular tu obra globalmente.</p>
            <button className="w-full py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all uppercase tracking-widest text-xs">Registrarme Ahora</button>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          </div>

          <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
            <h4 className="font-bold uppercase text-xs tracking-widest mb-6">Actividad Reciente</h4>
            <div className="space-y-6">
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div>
                    <p className="text-xs font-bold">Nuevo miembro se unió</p>
                    <p className="text-[10px] text-gray-400 uppercase">Hace {i*5} minutos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignUpView = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', birth: '', country: '', artType: '', bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto py-48 text-center px-4">
        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <Users size={40} />
        </div>
        <h1 className="text-4xl font-black uppercase mb-4">¡Bienvenido a la Red!</h1>
        <p className="text-gray-600 mb-12">Tu perfil ha sido creado exitosamente. Ahora puedes postular a becas y subir tus obras al marketplace.</p>
        <button onClick={onComplete} className="px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all">Ir al Inicio</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-24 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Únete a la Red</h1>
        <p className="text-gray-500">Crea tu perfil profesional y conecta con el mundo del arte.</p>
      </div>

      <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100">
        <div className="flex gap-2 mb-10 justify-center">
          {[1, 2].map(s => (
            <div key={s} className={`h-1.5 w-12 rounded-full ${step >= s ? 'bg-black' : 'bg-gray-200'}`}></div>
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Nombre Completo</label>
                <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black" placeholder="Ej. Elena Rivas" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black" placeholder="elena@arte.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Fecha de Nacimiento</label>
                <input name="birth" value={formData.birth} onChange={handleChange} type="date" className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">País</label>
                <input name="country" value={formData.country} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black" placeholder="Ej. Argentina" />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all">Siguiente Paso</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tipo de Arte que realizas</label>
              <select name="artType" value={formData.artType} onChange={handleChange} className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black">
                <option value="">Selecciona una opción</option>
                <option value="pintura">Pintura</option>
                <option value="fotografia">Fotografía</option>
                <option value="escultura">Escultura</option>
                <option value="digital">Digital</option>
                <option value="textil">Textil</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pequeña Biografía</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black" placeholder="Cuéntanos sobre tu trayectoria..."></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Agregar Obras (Link a Portafolio)</label>
              <input type="text" className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black" placeholder="https://behance.net/tuperfil" />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 border-2 border-black text-black font-bold rounded-full hover:bg-black hover:text-white transition-all">Atrás</button>
              <button onClick={() => setStep(3)} className="flex-1 py-5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all">Finalizar Registro</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeModule]);

  const renderModule = () => {
    switch (activeModule) {
      case 'home': return <HomeView onNavigate={setActiveModule} />;
      case 'marketplace': return <MarketplaceView />;
      case 'academy': return <AcademyView />;
      case 'becas': return <BecasView />;
      case 'circulation': return <CirculationView />;
      case 'community': return <CommunityView />;
      case 'sala-mendoza': return <SalaMendozaView />;
      case 'signup': return <SignUpView onComplete={() => setActiveModule('home')} />;
      default: return <HomeView onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      <Navbar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Chatbot />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Logo className="h-12" mode="on-light" />
                <span className="text-xl font-bold tracking-tighter uppercase">Arte sin <span className="text-gray-400 font-light">Frontera</span></span>
              </div>
              <p className="text-gray-500 max-w-sm mb-8">
                Transformando el futuro del arte contemporáneo a través de la tecnología, 
                la formación y la conexión global.
              </p>
              <div className="flex gap-4">
                {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                  <button key={social} className="text-xs font-bold uppercase tracking-widest hover:underline">{social}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-6">Plataforma</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><button onClick={() => setActiveModule('marketplace')} className="hover:text-black transition-colors">Marketplace</button></li>
                <li><button onClick={() => setActiveModule('academy')} className="hover:text-black transition-colors">Academia</button></li>
                <li><button onClick={() => setActiveModule('becas')} className="hover:text-black transition-colors">Becas</button></li>
                <li><button onClick={() => setActiveModule('circulation')} className="hover:text-black transition-colors">Circulación</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-6">Contacto</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>hola@artesinfrontera.com</li>
                <li>+57 300 123 4567</li>
                <li>Bogotá, Colombia</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <p>© 2026 Arte sin Frontera. Todos los derechos reservados.</p>
            <div className="flex gap-8">
              <button className="hover:text-black">Privacidad</button>
              <button className="hover:text-black">Términos</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
