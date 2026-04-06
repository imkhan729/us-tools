declare module "pdf-lib" {
  export type Rotation = {
    angle: number;
  };

  export type RgbColor = {
    r: number;
    g: number;
    b: number;
  };

  export function degrees(angle: number): Rotation;
  export function rgb(r: number, g: number, b: number): RgbColor;

  export const StandardFonts: {
    Helvetica: string;
  };

  export class PDFFont {
    widthOfTextAtSize(text: string, size: number): number;
  }

  export class PDFImage {
    width: number;
    height: number;
    scale(factor: number): { width: number; height: number };
  }

  export class PDFPage {
    getSize(): { width: number; height: number };
    getRotation(): Rotation;
    setRotation(rotation: Rotation): void;
    drawText(
      text: string,
      options?: {
        x?: number;
        y?: number;
        size?: number;
        font?: PDFFont;
        color?: RgbColor;
        rotate?: Rotation;
        opacity?: number;
      },
    ): void;
    drawImage(
      image: PDFImage,
      options?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        opacity?: number;
      },
    ): void;
  }

  export class PDFDocument {
    static create(): Promise<PDFDocument>;
    static load(data: ArrayBuffer | Uint8Array): Promise<PDFDocument>;
    copyPages(source: PDFDocument, indices: number[]): Promise<PDFPage[]>;
    addPage(page?: PDFPage | [number, number]): PDFPage;
    getPage(index: number): PDFPage;
    getPageIndices(): number[];
    getPageCount(): number;
    getPages(): PDFPage[];
    removePage(index: number): void;
    save(): Promise<ArrayBuffer>;
    embedPng(data: ArrayBuffer | Uint8Array): Promise<PDFImage>;
    embedJpg(data: ArrayBuffer | Uint8Array): Promise<PDFImage>;
    embedFont(font: string): Promise<PDFFont>;
  }
}
