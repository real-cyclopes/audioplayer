import { useEffect, useState } from "react";
import { Asset } from "expo-asset";

import audioJsonData from "@/static/example_audio.json";

import { AudioMetadata } from "@/types";
import { Comment } from "@/components/CommentView";

export type AudioData = {
  audioUrl: string;
  comments: Comment[];
};

export function useAudio() {
  const [audio, setAudio] = useState<AudioData | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const asset = Asset.fromModule(require("../static/example_audio.mp3"));

        await asset.downloadAsync();

        const metaData = audioJsonData as AudioMetadata;

        const comments: Comment[] = [];

        let i = 0;
        let accTime = 0;
        let moreData = true;

        while (moreData) {
          moreData = false;

          metaData.speakers.forEach(speaker => {
            if (i < speaker.phrases.length) {
              comments.push({
                name: speaker.name,
                content: speaker.phrases[i].words,
                start: accTime,
                end: accTime + speaker.phrases[i].time + metaData.pause,
              });

              accTime = accTime + speaker.phrases[i].time + metaData.pause;

              moreData = true;
            }
          });

          i++;
        }

        setAudio({
          audioUrl: asset.uri,
          comments,
        });
      } catch (error) {
        console.error("Error loading audio data:", error);
      }

      setLoading(false);
    })();
  }, []);

  return {
    audio,
    loading,
  };
}
