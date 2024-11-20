import { View } from "react-native";
import { Text } from "react-native-paper";
import { twMerge } from "tailwind-merge";

import { CustomSurface } from "./remap";

export type Comment = {
  name: string; // speaker name
  content: string; // words
  start: number; // start point in miliseconds in a whole time frame
  end: number; // end point in miliseconds in a whole time frame
};

export type CommentViewProps = {
  align: "left" | "right";
  comment: Comment;
  isHighlighted: boolean;
};

export function CommentView({
  align,
  comment,
  isHighlighted,
}: CommentViewProps) {
  return (
    <View
      className={twMerge(
        "flex w-full gap-1 py-2",
        align === "left" ? "items-start" : "items-end",
      )}
    >
      <Text
        variant="titleMedium"
        className={twMerge(
          "px-2 font-bold",
          isHighlighted ? "!text-yellow-600/60" : "!text-neutral-900/60",
        )}
      >
        {comment.name}
      </Text>
      <CustomSurface
        elevation={2}
        className={twMerge(
          "!rounded-xl !p-4",
          isHighlighted
            ? "!bg-yellow-100"
            : align === "left"
              ? "!bg-sky-50"
              : "!bg-red-50",
        )}
      >
        <Text
          variant="bodyLarge"
          className={twMerge(
            isHighlighted ? "!text-yellow-600" : "!text-neutral-900",
          )}
        >
          {comment.content}
        </Text>
      </CustomSurface>
    </View>
  );
}
