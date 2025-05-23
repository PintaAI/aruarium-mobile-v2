import { useState, useRef } from 'react';
import { View, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Heart, MessageCircle, Share2, ChevronUp, ChevronDown, BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

// Apply className support to icons
const HeartIcon = iconWithClassName(Heart);
const MessageIcon = iconWithClassName(MessageCircle);
const ShareIcon = iconWithClassName(Share2);
const ChevronUpIcon = iconWithClassName(ChevronUp);
const ChevronDownIcon = iconWithClassName(ChevronDown);
const BookOpenIcon = iconWithClassName(BookOpen);

const { width, height } = Dimensions.get('window');

// Mock data for soal (questions) content
const mockSoals = [
  {
    id: '1',
    question: '다음 중 "안녕하세요"의 뜻으로 알맞은 것은?',
    options: [
      { id: 'A', text: 'Selamat malam', isCorrect: false },
      { id: 'B', text: 'Halo/Selamat pagi', isCorrect: true },
      { id: 'C', text: 'Terima kasih', isCorrect: false },
      { id: 'D', text: 'Sampai jumpa', isCorrect: false },
    ],
    explanation: '"안녕하세요" adalah ucapan selamat/salam dalam bahasa Korea yang berarti "Halo" atau "Selamat pagi".',
    difficulty: 'Mudah',
    likes: 245,
    comments: 12,
    shares: 34,
    backgroundImage: 'https://images.unsplash.com/photo-1617733063746-5e15dda91f5f',
  },
  {
    id: '2',
    question: '다음 문장을 완성하세요: "저는 학생___."',
    options: [
      { id: 'A', text: '은', isCorrect: false },
      { id: 'B', text: '는', isCorrect: false },
      { id: 'C', text: '이에요', isCorrect: true },
      { id: 'D', text: '예요', isCorrect: false },
    ],
    explanation: 'Partikel yang tepat untuk melengkapi kalimat "Saya adalah seorang siswa" adalah "이에요".',
    difficulty: 'Sedang',
    likes: 187,
    comments: 23,
    shares: 15,
    backgroundImage: 'https://images.unsplash.com/photo-1596443686116-458004dcd0ff',
  },
  {
    id: '3',
    question: '한국의 수도는 어디입니까?',
    options: [
      { id: 'A', text: '부산', isCorrect: false },
      { id: 'B', text: '서울', isCorrect: true },
      { id: 'C', text: '인천', isCorrect: false },
      { id: 'D', text: '대구', isCorrect: false },
    ],
    explanation: 'Ibu kota Korea Selatan adalah Seoul (서울).',
    difficulty: 'Mudah',
    likes: 312,
    comments: 8,
    shares: 27,
    backgroundImage: 'https://images.unsplash.com/photo-1603852452440-b8fe13292324',
  },
  {
    id: '4',
    question: '다음 단어의 발음을 고르세요: 감사합니다',
    options: [
      { id: 'A', text: 'kamsahamnida', isCorrect: true },
      { id: 'B', text: 'kamsamida', isCorrect: false },
      { id: 'C', text: 'gamsahapnida', isCorrect: false },
      { id: 'D', text: 'kansahamnida', isCorrect: false },
    ],
    explanation: 'Pelafalan yang benar untuk kata "감사합니다" adalah "kamsahamnida".',
    difficulty: 'Sedang',
    likes: 276,
    comments: 19,
    shares: 31,
    backgroundImage: 'https://images.unsplash.com/photo-1601562219908-2c9fc0f261ef',
  },
  {
    id: '5',
    question: '한글의 모음 중 다음 중 올바른 것은?',
    options: [
      { id: 'A', text: 'ㄱ, ㄴ, ㄷ, ㄹ', isCorrect: false },
      { id: 'B', text: 'ㅏ, ㅑ, ㅓ, ㅕ', isCorrect: true },
      { id: 'C', text: 'ㅋ, ㅌ, ㅍ, ㅎ', isCorrect: false },
      { id: 'D', text: 'ㄲ, ㄸ, ㅃ, ㅆ', isCorrect: false },
    ],
    explanation: 'Vokal dalam Hangul adalah ㅏ, ㅑ, ㅓ, ㅕ, dll.',
    difficulty: 'Sulit',
    likes: 198,
    comments: 27,
    shares: 12,
    backgroundImage: 'https://images.unsplash.com/photo-1585000865459-f431484ea257',
  },
];

interface SoalItemProps {
  item: typeof mockSoals[0];
  onNext: () => void;
  onPrev: () => void;
}

function SoalItem({ item, onNext, onPrev }: SoalItemProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [liked, setLiked] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    // Show explanation after selection
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  const isCorrect = selectedOption ? 
    item.options.find(opt => opt.id === selectedOption)?.isCorrect : null;

  return (
    <View 
      className="flex-1 bg-background" 
      style={{ width, height: height - insets.top }}
    >
      {/* Gradient overlay for better text readability */}
      <View className="absolute inset-0 bg-black/30" />
      
      {/* Background image */}
      <Image
        source={{ uri: item.backgroundImage }}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.7 }}
      />

      {/* Navigation chevrons */}
      <TouchableOpacity 
        onPress={onPrev}
        className="absolute top-10 left-4 z-10 bg-black/20 rounded-full p-2"
        accessibilityLabel="Previous question"
      >
        <ChevronUpIcon className="text-white" size={24} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onNext}
        className="absolute bottom-32 left-4 z-10 bg-black/20 rounded-full p-2"
        accessibilityLabel="Next question"
      >
        <ChevronDownIcon className="text-white" size={24} />
      </TouchableOpacity>

      {/* Question and options container */}
      <View className="flex-1 justify-center px-6 pb-20">
        <View className="bg-background/80 dark:bg-background/70 rounded-2xl p-5 backdrop-blur-md">
          <Text className="text-xl font-bold mb-6">{item.question}</Text>
          
          <View className="space-y-3">
            {item.options.map((option) => {
              const isSelected = selectedOption === option.id;
              let optionClass = "border border-border p-3 rounded-lg flex-row items-center";
              
              if (isSelected) {
                optionClass += option.isCorrect 
                  ? " bg-green-500/20 border-green-500" 
                  : " bg-red-500/20 border-red-500";
              }
              
              return (
                <TouchableOpacity 
                  key={option.id}
                  onPress={() => handleSelectOption(option.id)}
                  disabled={selectedOption !== null}
                  className={optionClass}
                >
                  <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <Text className="font-bold">{option.id}</Text>
                  </View>
                  <Text className="flex-1">{option.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {showExplanation && (
            <View className="mt-4 bg-primary/5 p-3 rounded-lg">
              <Text className="font-medium mb-1">Penjelasan:</Text>
              <Text className="text-foreground/80">{item.explanation}</Text>
            </View>
          )}
          
          <View className="mt-4 flex-row justify-between items-center">
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text className="text-xs">{item.difficulty}</Text>
            </View>
            <BookOpenIcon className="text-primary" size={20} />
          </View>
        </View>
      </View>
      
      {/* Right side interaction buttons */}
      <View className="absolute right-4 bottom-44 items-center space-y-6">
        <TouchableOpacity 
          className="items-center"
          onPress={() => setLiked(!liked)}
        >
          <HeartIcon 
            className={liked ? "text-red-500" : "text-white"} 
            fill={liked ? "#ef4444" : "none"}
            size={32} 
          />
          <Text className="text-white text-xs mt-1">{liked ? item.likes + 1 : item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center">
          <MessageIcon className="text-white" size={32} />
          <Text className="text-white text-xs mt-1">{item.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center">
          <ShareIcon className="text-white" size={32} />
          <Text className="text-white text-xs mt-1">{item.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FypSoal() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleViewableItemsChanged = (info: any) => {
    if (info.viewableItems.length > 0) {
      setCurrentIndex(info.viewableItems[0].index);
    }
  };

  const goToNext = () => {
    if (currentIndex < mockSoals.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  return (
    <View className="flex-1 bg-black">
      <FlatList
        ref={flatListRef}
        data={mockSoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SoalItem 
            item={item} 
            onNext={goToNext} 
            onPrev={goToPrev} 
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
      />
    </View>
  );
}
