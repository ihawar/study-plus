const topicColors = {
  Blue: "#2563eb",
  Green: "#22c55e",
  Red: "#ef4444",
  Yellow: "#fde047",
  Purple: "#c026d3",
  Orange: "#f97316",
  Pink: "#fb7185",
  Brown: "#44403c",
};

export type ColorOption = {
    name: string,
    hex: string
}
export const colorOptions = Object.entries(topicColors).map(([name, hex]) => ({
  name,
  hex,
}));
