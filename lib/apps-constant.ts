import { Keyboard, GraduationCap, BookOpen, PencilRuler, Swords, LucideIcon } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

// Apply iconWithClassName to icons
const EnhancedBookOpen = iconWithClassName(BookOpen);
const EnhancedPencilRuler = iconWithClassName(PencilRuler);
const EnhancedSwords = iconWithClassName(Swords);
const EnhancedKeyboard = iconWithClassName(Keyboard);
const EnhancedGraduationCap = iconWithClassName(GraduationCap);

export type AppItem = {
  icon: LucideIcon;
  name: string;
  route: string;
  type: 'game' | 'app';
};

export const APPS: AppItem[] = [
  {
    icon: EnhancedBookOpen,
    name: 'Soal',
    route: 'apps/soal',
    type: 'app',
  },
  {
    icon: EnhancedPencilRuler,
    name: 'Tryout',
    route: 'apps/tryout',
    type: 'app',
  },
  {
    icon: EnhancedSwords,
    name: 'Matchkor',
    route: 'apps/matchkor',
    type: 'app',
  },
  {
    icon: EnhancedKeyboard,
    name: 'Z-Type',
    route: 'game/z-type',
    type: 'game',
  },
  {
    icon: EnhancedGraduationCap,
    name: 'Flashcard',
    route: 'game/flashcard',
    type: 'game',
  },
];

// Helper function to get apps by type
export const getAppsByType = (type: 'game' | 'app') => {
  return APPS.filter(app => app.type === type);
};
