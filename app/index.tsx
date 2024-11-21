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
    }, 100);

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
  const commentsLength = audio?.comments.length || 0;
  let currentCommentIndex =
    audio?.comments.findIndex(
      comment => comment.start <= currentTime && currentTime < comment.end,
    ) || 0;

  if (audio && currentTime + 10 > audio.comments[commentsLength - 1].end) {
    currentCommentIndex = commentsLength - 1; //audio play ended! make sure index is always in range.
  }

  const handleSkip = (direction: "forward" | "backward") => {
    if (!audio) {
      return;
    }

    let modifier = direction === "forward" ? 1 : -1;

    let nextPosition = currentTime;

    let nextCommentIndex = Math.max(currentCommentIndex + modifier, 0); // prevent underflow issue.

    if (
      currentTime + 10 > audio.comments[commentsLength - 1].end &&
      direction === "backward"
    ) {
      nextCommentIndex = currentCommentIndex; // edge case. play the last phrase again when audio play ended
    }

    if (nextCommentIndex === commentsLength) {
      nextPosition = audio.comments[commentsLength - 1].end; // prevent overflow issue.
    } else {
      nextPosition = audio.comments[nextCommentIndex].start;
    }

    audioPlayer.setPositionAsync(nextPosition);
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

  useEffect(() => {
    if (currentCommentIndex > 0 && currentCommentIndex < commentsLength) {
      listRef.current?.scrollToIndex({
        index: currentCommentIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [commentsLength, currentCommentIndex]);

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
