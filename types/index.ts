export type PhraseMetadata = {
  words: string;
  time: number;
};

export type SpeakerInfo = {
  name: string;
  phrases: PhraseMetadata[];
};

export type AudioMetadata = {
  pause: number;
  speakers: SpeakerInfo[];
};
