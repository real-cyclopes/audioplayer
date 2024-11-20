import { useRef, useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { Stack } from "expo-router";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";

import { SafeAreaView } from "react-native-safe-area-context";

import { AudioController } from "@/components/AudioController";
import { useAudio } from "@/hooks/useAudio";
import { Comment, CommentView } from "@/components/CommentView";

const audioPlayer = new Audio.Sound();

export default function HomeScreen() {
  const listRef = useRef<FlatList<Comment>>(null);

  const { audio, loading } = useAudio();

  const [audioState, setAudioStatus] = useState<AVPlaybackStatusSuccess | null>(
    null,
  );

  useEffect(() => {
    if (audio && !loading) {
      try {
        audioPlayer.loadAsync({
          uri: audio.audioUrl,
        });
      } catch (err) {
        console.log(err);
      }
    }

    return () => {
      audioPlayer.unloadAsync();
    };
  }, [audio, loading]);

  useEffect(() => {
    const timer = setInterval(async () => {
      const status = await audioPlayer.getStatusAsync();

      if (status.isLoaded) {
        setAudioStatus(status);
      }
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleTogglePlayer = useCallback(async () => {
    if (!audioState?.isLoaded) {
      return;
    }

    if (audioState.isPlaying) {
      audioPlayer.pauseAsync();
    } else {
      if (
        audioState.durationMillis !== undefined &&
        audioState.positionMillis + 100 > audioState.durationMillis
      ) {
        await audioPlayer.setPositionAsync(0);
      }

      audioPlayer.playAsync();
    }
  }, [audioState]);

  const currentTime = audioState?.positionMillis || 0;
  const currentCommentIndex =
    audio?.comments.findIndex(
      comment => comment.start <= currentTime && currentTime < comment.end,
    ) || 0;

  const handleSkip = (direction: "forward" | "backward") => {
    if (!audio) {
      return;
    }

    const modifier = direction === "forward" ? 1 : -1;
    const nextCommentIndex = Math.min(
      Math.max(currentCommentIndex + modifier, 0),
      audio.comments.length - 1,
    );

    const comment = audio.comments[nextCommentIndex];

    audioPlayer.setPositionAsync(comment.start);
  };

  const onScrollToIndexFailed = useCallback(
    (info: {
      index: number;
      highestMeasuredFrameIndex: number;
      averageItemLength: number;
    }) => {
      listRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: true,
      });
    },
    [],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-[#f8f8f8]">
        <Stack.Screen
          options={{
            title: "Audio Player Test",
            headerStyle: { backgroundColor: "#f5f5f5" },
            headerTintColor: "#18181b",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />

        <FlatList
          ref={listRef}
          data={audio?.comments || []}
          renderItem={({ item, index }) => (
            <CommentView
              comment={item}
              isHighlighted={index === currentCommentIndex}
              align={index % 2 === 0 ? "left" : "right"}
            />
          )}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => `${item.name}-${item.start}`}
          contentContainerStyle={[{ paddingHorizontal: 24 }]}
          className="flex-1"
          onScrollToIndexFailed={onScrollToIndexFailed}
        />

        <AudioController
          disabled={!audioState}
          duration={audioState?.durationMillis || 1}
          currentTime={currentTime}
          isPlaying={!!audioState?.isPlaying}
          onTogglePlayer={handleTogglePlayer}
          onSkip={handleSkip}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
