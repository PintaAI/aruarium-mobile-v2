import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { AudioPlayer, createAudioPlayer, AudioStatus } from 'expo-audio';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { fetchWithAuth } from '~/lib/auth';
import { API_BASE_URL } from '~/lib/config';

interface Opsi {
  id: number;
  soalId: number;
  opsiText: string;
  isCorrect: boolean;
}

interface Soal {
  id: number;
  koleksiId: number;
  pertanyaan: string;
  attachmentUrl?: string;
  attachmentType?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  explanation?: string;
  opsis: Opsi[];
}

interface QuizProps {
  collectionId: string;
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: { questionId: number; selectedOptionId: number; isCorrect: boolean }[];
}

export default function Quiz({ collectionId }: QuizProps) {
  const [questions, setQuestions] = useState<Soal[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [sound, setSound] = useState<AudioPlayer | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<{ [key: number]: boolean }>({});

  const fetchQuestions = async () => {
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/mobile/koleksi-soal/${collectionId}/soal`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuestions(data.data);
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch questions');
        }
      } else {
        Alert.alert('Error', 'Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      Alert.alert('Error', 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [collectionId]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.remove();
      }
    };
  }, [sound]);

  const playAudio = async (questionId: number, audioUrl: string) => {
    try {
      if (sound) {
        await sound.remove(); // Use remove() which should handle releasing resources
      }

      setAudioPlaying(prev => ({ ...prev, [questionId]: true }));
      
      const newPlayer = createAudioPlayer({ uri: audioUrl });
      setSound(newPlayer);
      
      newPlayer.addListener('playbackStatusUpdate', (status: AudioStatus) => {
        // Ensure properties like isLoaded and didJustFinish are available on AudioStatus
        // Expo-audio's AudioStatus has: isLoaded, didJustFinish, playing, isBuffering etc.
        if (status.isLoaded && status.didJustFinish) {
          setAudioPlaying(prev => ({ ...prev, [questionId]: false }));
          newPlayer.remove(); // Clean up player after it finishes
          setSound(null);
        } else if (status.isLoaded && !status.playing && !status.isBuffering && !status.didJustFinish) {
          // Handle cases where playback might stop unexpectedly or not start
           if (audioPlaying[questionId]) { // only update if we intended it to play
            setAudioPlaying(prev => ({ ...prev, [questionId]: false }));
           }
        }
      });
      
      await newPlayer.play(); // Start playing

    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio');
      setAudioPlaying(prev => ({ ...prev, [questionId]: false }));
      if (sound) {
        await sound.remove();
        setSound(null);
      }
    }
  };

  const stopAudio = async (questionId: number) => {
    try {
      if (sound) {
        await sound.pause(); // Pause playback
        await sound.remove(); // Release resources
        setSound(null);
      }
      setAudioPlaying(prev => ({ ...prev, [questionId]: false }));
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const renderAttachment = (question: Soal) => {
    if (!question.attachmentUrl) return null;

    const isImage = question.attachmentType === 'image' || 
                   question.attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isAudio = question.attachmentType === 'audio' || 
                   question.attachmentUrl.match(/\.(mp3|wav|m4a|aac)$/i);

    if (isImage) {
      return (
        <View className="mb-4">
          <Image
            source={{ uri: question.attachmentUrl }}
            className="w-full h-48 rounded-lg"
            resizeMode="contain"
          />
        </View>
      );
    }

    if (isAudio) {
      const isPlaying = audioPlaying[question.id];
      return (
        <View className="mb-4 p-4 bg-secondary rounded-lg">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => 
                isPlaying 
                  ? stopAudio(question.id) 
                  : playAudio(question.id, question.attachmentUrl!)
              }
              className={`p-3 rounded-full ${
                isPlaying ? 'bg-red-500' : 'bg-primary'
              }`}
            >
              <Text className="text-white font-semibold">
                {isPlaying ? '⏹️' : '▶️'}
              </Text>
            </TouchableOpacity>
            <Text className="text-foreground">
              {isPlaying ? 'Playing audio...' : 'Tap to play audio'}
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    const answers = questions.map(question => {
      const selectedOptionId = selectedAnswers[question.id];
      const selectedOption = question.opsis.find(option => option.id === selectedOptionId);
      
      return {
        questionId: question.id,
        selectedOptionId: selectedOptionId || 0,
        isCorrect: selectedOption?.isCorrect || false
      };
    });

    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers,
      score,
      answers
    };

    setQuizResult(result);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResult(false);
    setQuizResult(null);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-muted-foreground">Loading quiz...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-muted-foreground text-center">
          No questions available in this collection
        </Text>
      </View>
    );
  }

  if (showResult && quizResult) {
    return (
      <ScrollView className="flex-1 bg-background p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="items-center gap-4">
            <Text className="text-6xl font-bold text-primary">
              {quizResult.score}%
            </Text>
            <Text className="text-lg text-center">
              You got {quizResult.correctAnswers} out of {quizResult.totalQuestions} questions correct
            </Text>
            <Button onPress={resetQuiz} className="mt-4">
              <Text>Take Quiz Again</Text>
            </Button>
          </CardContent>
        </Card>
        
        <Text className="text-lg font-semibold mb-4">Review Answers:</Text>
        {questions.map((question, index) => {
          const answer = quizResult.answers[index];
          const selectedOption = question.opsis.find(option => option.id === answer.selectedOptionId);
          const correctOption = question.opsis.find(option => option.isCorrect);
          
          return (
            <Card key={question.id} className="mb-4">
              <CardHeader>
                <Text className="font-semibold">
                  {index + 1}. {question.pertanyaan}
                </Text>
              </CardHeader>
              <CardContent className="gap-2">
                <View className="gap-2">
                  <Text className={`p-2 rounded ${answer.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    Your answer: {selectedOption?.opsiText || 'No answer selected'}
                  </Text>
                  {!answer.isCorrect && (
                    <Text className="p-2 rounded bg-green-100">
                      Correct answer: {correctOption?.opsiText}
                    </Text>
                  )}
                </View>
                {question.explanation && (
                  <View className="mt-2 p-2 bg-blue-50 rounded">
                    <Text className="text-sm text-blue-800">{question.explanation}</Text>
                  </View>
                )}
              </CardContent>
            </Card>
          );
        })}
      </ScrollView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <View className="flex-1 bg-background">
      {/* Progress Bar */}
      <View className="px-4 py-2 border-b border-border">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </Text>
        </View>
        <View className="h-2 bg-secondary rounded-full">
          <View 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <Card>
          <CardHeader>
            <Text className="text-lg font-semibold">
              {currentQuestion.pertanyaan}
            </Text>
            {currentQuestion.difficulty && (
              <Text className={`text-sm px-2 py-1 rounded self-start ${
                currentQuestion.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty}
              </Text>
            )}
          </CardHeader>
          <CardContent className="gap-3">
            {renderAttachment(currentQuestion)}
            {currentQuestion.opsis.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              
              return (
                <Button
                  key={option.id}
                  variant={isSelected ? "default" : "outline"}
                  className="justify-start p-4 h-auto"
                  onPress={() => handleOptionSelect(currentQuestion.id, option.id)}
                >
                  <Text className={isSelected ? "text-primary-foreground" : "text-foreground"}>
                    {option.opsiText}
                  </Text>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </ScrollView>

      {/* Navigation */}
      <View className="p-4 border-t border-border">
        <View className="flex-row gap-4">
          <Button
            variant="outline"
            onPress={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex-1"
          >
            <Text>Previous</Text>
          </Button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onPress={finishQuiz}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
              className="flex-1"
            >
              <Text>Finish Quiz</Text>
            </Button>
          ) : (
            <Button
              onPress={nextQuestion}
              className="flex-1"
            >
              <Text>Next</Text>
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}
