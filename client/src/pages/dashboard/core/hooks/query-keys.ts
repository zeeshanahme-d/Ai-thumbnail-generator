export const thumbnailKeys = {
  all: ["thumbnails"] as const,
  mine: (deleted = false) =>
    [...thumbnailKeys.all, "mine", deleted ? "deleted" : "active"] as const,
};
