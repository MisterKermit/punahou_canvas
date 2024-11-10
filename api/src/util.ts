// Remove this later (tm)

/*
 * A pixel that is able to be serialized and sent through the internet
 */
export interface NetPixel {
  color: number;
  user: string | null;
}
export type NetPixelMatrix = NetPixel[][];

export function generatePixels(): NetPixelMatrix {
  // Send this over from the web later
  const samplePixels: NetPixelMatrix = [];
  const MATRIX_SIZE = 100; // This looks like the max reasonable dimension
  for (let i = 0; i < MATRIX_SIZE; i++) {
    const pixelList = [];
    for (let j = 0; j < MATRIX_SIZE; j++) {
      pixelList.push({ color: 0xffffff, user: null });
    }
    samplePixels.push(pixelList);
  }
  return samplePixels;
}
