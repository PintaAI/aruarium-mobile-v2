import { View, Image } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';

interface Article {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  readTime: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Tips Belajar Bahasa Korea untuk Pemula',
    description: 'Panduan lengkap untuk memulai perjalanan belajar bahasa Korea Anda dengan mudah dan efektif.',
    imageUrl: 'https://picsum.photos/300/200',
    category: 'Learning Tips',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Cara Cepat Menghafal Hangul',
    description: 'Teknik praktis untuk menguasai sistem penulisan Korea (Hangul) dalam waktu singkat.',
    imageUrl: 'https://picsum.photos/300/200',
    category: 'Writing',
    readTime: '3 min read'
  },
  {
    id: 3,
    title: 'Kosakata Korea Sehari-hari',
    description: 'Kumpulan kata dan frasa yang sering digunakan dalam percakapan sehari-hari.',
    imageUrl: 'https://picsum.photos/300/200',
    category: 'Vocabulary',
    readTime: '4 min read'
  }
];

export function Articles() {
  return (
    <View className="w-full">
      <Text className="text-xl font-bold mb-4">Featured Articles</Text>
      <View className="flex gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="flex-row overflow-hidden">
            <Image
              source={{ uri: article.imageUrl }}
              className="w-24 h-24"
            />
            <View className="flex-1 p-3">
              <Text className="font-bold text-base">{article.title}</Text>
              <Text className="text-foreground/70 text-sm mt-1 line-clamp-2">
                {article.description}
              </Text>
              <View className="flex-row gap-2 items-center mt-2">
                <Text className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                  {article.category}
                </Text>
                <Text className="text-xs text-foreground/50">
                  {article.readTime}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
