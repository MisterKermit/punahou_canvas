/*
 * A pixel that is able to be serialized and sent through the internet
 */
export interface NetPixel {
    color: number;
    user: string | null;
}

export interface Message {
    type: string;
}

export interface PixelChange {
    type: string;
    pixelColor: number;
    xPos: number;
    yPos: number;
}

export interface ChatMessage {
    type: string;
    message: string;
}

/*
 * A pixel that is able to be serialized and sent through the internet
 */
export interface NetPixel {
    color: number,
    user: string | null,
};
export type NetPixelMatrix = NetPixel[][];
