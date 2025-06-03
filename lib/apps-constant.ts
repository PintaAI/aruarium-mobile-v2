import { Keyboard, GraduationCap, BookOpen, PencilRuler, Swords, LucideIcon, Languages, Code } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

// Apply iconWithClassName to icons
const EnhancedBookOpen = iconWithClassName(BookOpen);
const EnhancedPencilRuler = iconWithClassName(PencilRuler);
const EnhancedSwords = iconWithClassName(Swords);
const EnhancedKeyboard = iconWithClassName(Keyboard);
const EnhancedGraduationCap = iconWithClassName(GraduationCap);
const EnhancedLanguages = iconWithClassName(Languages);
const EnhancedCode = iconWithClassName(Code);

export type AppItem = {
  icon: LucideIcon;
  name: string;
  description: string;
  route: string;
  type: 'game' | 'app';
};

export const APPS: AppItem[] = [
  {
    icon: EnhancedBookOpen,
    name: 'Soal',
    description: 'Practice with question collections',
    route: 'apps/soal',
    type: 'app',
  },
  {
    icon: EnhancedPencilRuler,
    name: 'Tryout',
    description: 'Take timed practice exams',
    route: 'apps/tryout',
    type: 'app',
  },
  {
    icon: EnhancedSwords,
    name: 'Matchkor',
    description: 'Match Korean words with meanings',
    route: 'game/matchkor',
    type: 'game',
  },
  {
    icon: EnhancedKeyboard,
    name: 'Z-Type',
    description: 'Type Korean words to destroy asteroids',
    route: 'game/z-type',
    type: 'game',
  },
  {
    icon: EnhancedGraduationCap,
    name: 'Flashcard',
    description: 'Study with interactive flashcards',
    route: 'game/flashcard',
    type: 'game',
  },
  {
    icon: EnhancedLanguages,
    name: 'Translate',
    description: 'Translate between Korean and Indonesian',
    route: 'apps/translate',
    type: 'app',
  },
  {
    icon: EnhancedCode,
    name: 'Rich Demo',
    description: 'Explore rich text features',
    route: '/demo',
    type: 'app',
  },
];

// Helper function to get apps by type
export const getAppsByType = (type: 'game' | 'app') => {
  return APPS.filter(app => app.type === type);
};
