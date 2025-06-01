import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Text } from '../ui/text';
import { fetchWithAuth } from '~/lib/auth';
import { API_BASE_URL } from '~/lib/config';

interface KoleksiSoal {
  id: number;
  nama: string;
  deskripsi?: string;
  isPrivate: boolean;
  soalsCount: number;
  tryoutsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface SoalListProps {
  onCollectionPress?: (collection: KoleksiSoal) => void;
}

export default function SoalList({ onCollectionPress }: SoalListProps) {
  const router = useRouter();
  const [collections, setCollections] = useState<KoleksiSoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPublicCollections = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/mobile/koleksi-soal?publicOnly=true`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCollections(data.data);
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch collections');
        }
      } else {
        Alert.alert('Error', 'Failed to fetch collections');
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      Alert.alert('Error', 'Network error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPublicCollections();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPublicCollections();
  };

  const handleCollectionPress = (collection: KoleksiSoal) => {
    if (onCollectionPress) {
      onCollectionPress(collection);
    } else {
      router.push(`/apps/soal/${collection.id}`);
    }
  };

  const renderCollection = ({ item }: { item: KoleksiSoal }) => (
    <TouchableOpacity onPress={() => handleCollectionPress(item)}>
      <Card className="mb-4 mx-4">
        <CardHeader>
          <CardTitle className="text-lg">{item.nama}</CardTitle>
          {item.deskripsi && (
            <CardDescription>{item.deskripsi}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-muted-foreground">
                {item.soalsCount} soal
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-muted-foreground">Loading collections...</Text>
      </View>
    );
  }

  if (collections.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-muted-foreground">No public collections available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={collections}
      renderItem={renderCollection}
      keyExtractor={(item) => item.id.toString()}
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingVertical: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
