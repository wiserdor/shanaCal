export interface Photo {
  id: string;
  file: File;
  url: string;
  name: string;
}

export interface CollageLayout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  template: number[][];
  cssGridTemplate?: string;
  cssGridAreas?: string;
}
export interface Photo {
  id: string;
  file: File;
  url: string;
  name: string;
}

export interface CollageLayout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  template: number[][];
  cssGridTemplate?: string;
  cssGridAreas?: string;
}

export class PhotoCollageService {
  private layouts: CollageLayout[] = [
    {
      id: "grid-2x2",
      name: "רשת 2x2",
      rows: 2,
      cols: 2,
      template: [
        [1, 1],
        [1, 1],
      ],
      cssGridTemplate: "1fr 1fr / 1fr 1fr",
      cssGridAreas: '"img1 img2" "img3 img4"',
    },
    {
      id: "grid-3x2",
      name: "רשת 3x2",
      rows: 2,
      cols: 3,
      template: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      cssGridTemplate: "1fr 1fr / 1fr 1fr 1fr",
      cssGridAreas: '"img1 img2 img3" "img4 img5 img6"',
    },
    {
      id: "grid-4x2",
      name: "רשת 4x2",
      rows: 2,
      cols: 4,
      template: [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
      ],
    },
    {
      id: "featured-1",
      name: "תמונה מרכזית",
      rows: 3,
      cols: 3,
      template: [
        [2, 1, 1],
        [2, 1, 1],
        [1, 1, 1],
      ],
      cssGridTemplate: "1fr 1fr 1fr / 2fr 1fr 1fr",
      cssGridAreas: '"main img1 img2" "main img3 img4" "img5 img6 img7"',
    },
    // FIXED: rows/cols now match the 3x2 template (3 rows, 2 cols)
    {
      id: "featured-2",
      name: "תמונה גדולה",
      rows: 3,
      cols: 2,
      template: [
        [2, 1],
        [2, 1],
        [1, 1],
      ],
    },
    {
      id: "panoramic",
      name: "פנורמי",
      rows: 2,
      cols: 4,
      template: [
        [2, 1, 1, 1],
        [1, 1, 1, 1],
      ],
    },
    {
      id: "diagonal",
      name: "אלכסוני",
      rows: 3,
      cols: 3,
      template: [
        [2, 1, 1],
        [1, 2, 1],
        [1, 1, 2],
      ],
    },
    {
      id: "asymmetric",
      name: "אסימטרי",
      rows: 2,
      cols: 3,
      template: [
        [2, 1, 1],
        [1, 1, 2],
      ],
    },
    {
      id: "magazine",
      name: "מגזין",
      rows: 3,
      cols: 3,
      template: [
        [1, 1, 1],
        [1, 2, 1],
        [1, 1, 1],
      ],
    },
  ];

  getLayouts(): CollageLayout[] {
    return this.layouts;
  }

  getLayout(id: string): CollageLayout | undefined {
    return this.layouts.find((layout) => layout.id === id);
  }

  async createCollage(
    photos: Photo[],
    layout: CollageLayout,
    width: number = 800,
    height: number = 600,
    fitMode: "contain" | "cover" = "cover"
  ): Promise<string> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // HiDPI
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.scale(scale, scale);

    // background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(1, "#f1f5f9");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const cellWidth = width / layout.cols;
    const cellHeight = height / layout.rows;

    let photoIndex = 0;

    // FIX: honor colspan-like template by skipping spanned columns
    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; ) {
        const span = layout.template[row]?.[col] ?? 0;

        if (span > 0 && photoIndex < photos.length) {
          const photo = photos[photoIndex];

          const cellX = col * cellWidth;
          const cellY = row * cellHeight;
          const cellW = cellWidth * span;
          const cellH = cellHeight;

          const img = await this.loadImage(photo.url);

          // rounded clip
          ctx.save();
          const radius = Math.min(cellW, cellH) * 0.02;
          ctx.beginPath();
          ctx.roundRect(cellX, cellY, cellW, cellH, radius);
          ctx.clip();

          // FIX: centralized, aspect-safe drawing
          this.drawImageFit(ctx, img, cellX, cellY, cellW, cellH, fitMode);

          ctx.restore();

          // border + shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(cellX, cellY, cellW, cellH, radius);
          ctx.stroke();

          // reset shadow
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          photoIndex++;
        }

        col += Math.max(1, span); // <- skip spanned columns
      }
    }

    return canvas.toDataURL("image/png");
  }

  async createRandomCollage(
    photos: Photo[],
    width: number = 800,
    height: number = 600,
    fitMode: "contain" | "cover" = "cover"
  ): Promise<string> {
    if (photos.length === 0) return this.createEmptyCollage(width, height);

    const selectedPhotos = photos.sort(() => Math.random() - 0.5);

    return this.createProfessionalCollage(
      selectedPhotos,
      width,
      height,
      fitMode
    );
  }

  async createProfessionalCollage(
    photos: Photo[],
    width: number = 800,
    height: number = 600,
    fitMode: "contain" | "cover" = "cover"
  ): Promise<string> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.scale(scale, scale);

    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width / 2
    );
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "#f8fafc");
    gradient.addColorStop(1, "#f1f5f9");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // subtle texture
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < width; i += 60) {
      for (let j = 0; j < height; j += 60) {
        if ((i + j) % 120 === 0) {
          ctx.beginPath();
          ctx.arc(i, j, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const photoCount = photos.length;
    const padding = 20;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    if (photoCount === 1) {
      await this.drawSinglePhoto(
        ctx,
        photos[0],
        padding,
        padding,
        innerWidth,
        innerHeight,
        fitMode
      );
    } else if (photoCount === 2) {
      await this.drawTwoPhotos(
        ctx,
        photos,
        padding,
        padding,
        innerWidth,
        innerHeight,
        fitMode
      );
    } else if (photoCount === 3) {
      await this.drawThreePhotos(
        ctx,
        photos,
        padding,
        padding,
        innerWidth,
        innerHeight,
        fitMode
      );
    } else if (photoCount === 4) {
      await this.drawFourPhotos(
        ctx,
        photos,
        padding,
        padding,
        innerWidth,
        innerHeight,
        fitMode
      );
    } else if (photoCount === 5) {
      await this.drawFivePhotos(
        ctx,
        photos,
        padding,
        padding,
        innerWidth,
        innerHeight,
        fitMode
      );
    } else if (photoCount === 6) {
      await this.drawSixPhotos(
        ctx,
        photos,
        padding,
        padding,
        innerWidth,
        innerHeight,
        fitMode
      );
    } else if (photoCount >= 7) {
      await this.drawManyPhotos(
        ctx,
        photos,
        padding,
        padding,
        innerWidth,
        innerHeight,
        fitMode
      );
    }

    return canvas.toDataURL("image/png");
  }

  // ===== NEW central aspect-safe helper =====
  private drawImageFit(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    fitMode: "contain" | "cover"
  ): void {
    const imgW = img.width;
    const imgH = img.height;
    const imgAspect = imgW / imgH;
    const rectAspect = w / h;

    if (fitMode === "cover") {
      // crop source to fill destination
      let sx = 0,
        sy = 0,
        sw = imgW,
        sh = imgH;

      if (imgAspect > rectAspect) {
        // crop width
        const targetW = imgH * rectAspect;
        sx = (imgW - targetW) / 2;
        sw = targetW;
      } else {
        // crop height
        const targetH = imgW / rectAspect;
        sy = (imgH - targetH) / 2;
        sh = targetH;
      }
      ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    } else {
      // contain: letterbox inside destination
      let dw = w,
        dh = h,
        dx = x,
        dy = y;

      if (imgAspect > rectAspect) {
        dh = w / imgAspect;
        dy = y + (h - dh) / 2;
      } else {
        dw = h * imgAspect;
        dx = x + (w - dw) / 2;
      }
      ctx.drawImage(img, 0, 0, imgW, imgH, dx, dy, dw, dh);
    }
  }

  private async drawSinglePhoto(
    ctx: CanvasRenderingContext2D,
    photo: Photo,
    x: number,
    y: number,
    width: number,
    height: number,
    fitMode: "contain" | "cover"
  ): Promise<void> {
    const img = await this.loadImage(photo.url);
    const radius = 16;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.clip();
    this.drawImageFit(ctx, img, x, y, width, height, fitMode);
    ctx.restore();

    this.addImageEffects(ctx, x, y, width, height, radius);
  }

  private async drawTwoPhotos(
    ctx: CanvasRenderingContext2D,
    photos: Photo[],
    x: number,
    y: number,
    width: number,
    height: number,
    fitMode: "contain" | "cover"
  ): Promise<void> {
    const gap = 12;
    const photoWidth = (width - gap) / 2;

    for (let i = 0; i < 2; i++) {
      const img = await this.loadImage(photos[i].url);
      const photoX = x + i * (photoWidth + gap);
      const radius = 12;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, y, photoWidth, height, radius);
      ctx.clip();

      this.drawImageFit(ctx, img, photoX, y, photoWidth, height, fitMode);
      ctx.restore();

      this.addImageEffects(ctx, photoX, y, photoWidth, height, radius);
    }
  }

  private async drawThreePhotos(
    ctx: CanvasRenderingContext2D,
    photos: Photo[],
    x: number,
    y: number,
    width: number,
    height: number,
    fitMode: "contain" | "cover"
  ): Promise<void> {
    const gap = 10;
    const topHeight = height * 0.6;
    const bottomHeight = height * 0.35;
    const bottomY = y + topHeight + gap;
    const bottomWidth = (width - gap) / 2;

    // Top
    {
      const img1 = await this.loadImage(photos[0].url);
      const radius1 = 14;
      ctx.save();
      ctx.beginPath();

      ctx.roundRect(x, y, width, topHeight, radius1);
      ctx.clip();
      this.drawImageFit(ctx, img1, x, y, width, topHeight, fitMode);
      ctx.restore();
      this.addImageEffects(ctx, x, y, width, topHeight, radius1);
    }

    // Bottom 2
    for (let i = 1; i < 3; i++) {
      const img = await this.loadImage(photos[i].url);
      const photoX = x + (i - 1) * (bottomWidth + gap);
      const radius = 10;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, bottomY, bottomWidth, bottomHeight, radius);
      ctx.clip();
      this.drawImageFit(
        ctx,
        img,
        photoX,
        bottomY,
        bottomWidth,
        bottomHeight,
        fitMode
      );
      ctx.restore();

      this.addImageEffects(
        ctx,
        photoX,
        bottomY,
        bottomWidth,
        bottomHeight,
        radius
      );
    }
  }

  private async drawFourPhotos(
    ctx: CanvasRenderingContext2D,
    photos: Photo[],
    x: number,
    y: number,
    width: number,
    height: number,
    fitMode: "contain" | "cover"
  ): Promise<void> {
    const gap = 8;
    const photoWidth = (width - gap) / 2;
    const photoHeight = (height - gap) / 2;

    for (let i = 0; i < 4; i++) {
      const img = await this.loadImage(photos[i].url);
      const row = Math.floor(i / 2);
      const col = i % 2;
      const photoX = x + col * (photoWidth + gap);
      const photoY = y + row * (photoHeight + gap);
      const radius = 10;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoWidth, photoHeight, radius);
      ctx.clip();
      this.drawImageFit(
        ctx,
        img,
        photoX,
        photoY,
        photoWidth,
        photoHeight,
        fitMode
      );
      ctx.restore();

      this.addImageEffects(
        ctx,
        photoX,
        photoY,
        photoWidth,
        photoHeight,
        radius
      );
    }
  }

  private async drawFivePhotos(
    ctx: CanvasRenderingContext2D,
    photos: Photo[],
    x: number,
    y: number,
    width: number,
    height: number,
    fitMode: "contain" | "cover"
  ): Promise<void> {
    const gap = 8;
    const topHeight = height * 0.4;
    const bottomHeight = height * 0.55;
    const bottomY = y + topHeight + gap;

    // Top 2
    const topWidth = (width - gap) / 2;
    for (let i = 0; i < 2; i++) {
      const img = await this.loadImage(photos[i].url);
      const photoX = x + i * (topWidth + gap);
      const radius = 12;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, y, topWidth, topHeight, radius);
      ctx.clip();
      this.drawImageFit(ctx, img, photoX, y, topWidth, topHeight, fitMode);
      ctx.restore();

      this.addImageEffects(ctx, photoX, y, topWidth, topHeight, radius);
    }

    // Bottom 3
    const bottomWidth = (width - 2 * gap) / 3;
    for (let i = 2; i < 5; i++) {
      const img = await this.loadImage(photos[i].url);
      const photoX = x + (i - 2) * (bottomWidth + gap);
      const radius = 10;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, bottomY, bottomWidth, bottomHeight, radius);
      ctx.clip();
      this.drawImageFit(
        ctx,
        img,
        photoX,
        bottomY,
        bottomWidth,
        bottomHeight,
        fitMode
      );
      ctx.restore();

      this.addImageEffects(
        ctx,
        photoX,
        bottomY,
        bottomWidth,
        bottomHeight,
        radius
      );
    }
  }

  private async drawSixPhotos(
    ctx: CanvasRenderingContext2D,
    photos: Photo[],
    x: number,
    y: number,
    width: number,
    height: number,
    fitMode: "contain" | "cover"
  ): Promise<void> {
    const gap = 6;
    const photoWidth = (width - 2 * gap) / 3;
    const photoHeight = (height - gap) / 2;

    for (let i = 0; i < 6; i++) {
      const img = await this.loadImage(photos[i].url);
      const row = Math.floor(i / 3);
      const col = i % 3;
      const photoX = x + col * (photoWidth + gap);
      const photoY = y + row * (photoHeight + gap);
      const radius = 8;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoWidth, photoHeight, radius);
      ctx.clip();
      this.drawImageFit(
        ctx,
        img,
        photoX,
        photoY,
        photoWidth,
        photoHeight,
        fitMode
      );
      ctx.restore();

      this.addImageEffects(
        ctx,
        photoX,
        photoY,
        photoWidth,
        photoHeight,
        radius
      );
    }
  }

  private async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  private addImageEffects(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.stroke();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  async createCSSGridCollage(
    photos: Photo[],
    layout: CollageLayout,
    width: number = 800,
    height: number = 600,
    fitMode: "contain" | "cover" = "cover"
  ): Promise<string> {
    if (!layout.cssGridTemplate || !layout.cssGridAreas) {
      throw new Error("Layout does not support CSS Grid");
    }

    const tempDiv = document.createElement("div");
    tempDiv.style.cssText = `
      display: grid;
      grid-template-rows: repeat(${layout.rows}, 1fr);
      grid-template-columns: repeat(${layout.cols}, 1fr);
      width: ${width}px;
      height: ${height}px;
      gap: 8px;
      padding: 12px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      position: absolute;
      left: -9999px;
      top: -9999px;
    `;

    const imagePromises: Promise<void>[] = [];
    const totalCells = layout.rows * layout.cols;
    const photosToShow = Math.min(photos.length, totalCells);

    for (let i = 0; i < photosToShow; i++) {
      const img = document.createElement("img");
      img.src = photos[i].url;
      img.crossOrigin = "anonymous";
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: ${fitMode};
        object-position: center; /* FIX */
        border-radius: 8px;
        display: block;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 2px solid rgba(255, 255, 255, 0.8);
        transition: transform 0.2s ease;
      `;

      tempDiv.appendChild(img);

      const imagePromise = new Promise<void>((resolve, reject) => {
        if (img.complete) resolve();
        else {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error(`Failed to load image: ${photos[i].url}`));
        }
      });

      imagePromises.push(imagePromise);
    }

    document.body.appendChild(tempDiv);

    try {
      await Promise.all(imagePromises);
      const html2canvas = (await import("html2canvas")).default;
      const canvasResult = await html2canvas(tempDiv, {
        width,
        height,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      return canvasResult.toDataURL("image/png");
    } finally {
      document.body.removeChild(tempDiv);
    }
  }

  private createEmptyCollage(width: number, height: number): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(0.5, "#f1f5f9");
    gradient.addColorStop(1, "#e2e8f0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < width; i += 40) {
      for (let j = 0; j < height; j += 40) {
        if ((i + j) % 80 === 0) {
          ctx.fillRect(i, j, 20, 20);
        }
      }
    }

    return canvas.toDataURL("image/png");
  }

  static async resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Could not get canvas context"));

        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Failed to resize image"));
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          0.9
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Method to handle 7+ photos with a grid layout
  private async drawManyPhotos(
    ctx: CanvasRenderingContext2D,
    photos: Photo[],
    x: number,
    y: number,
    width: number,
    height: number,
    fitMode: "contain" | "cover"
  ): Promise<void> {
    const photoCount = photos.length;

    // Calculate grid dimensions based on photo count
    let cols: number;
    let rows: number;

    if (photoCount <= 9) {
      cols = 3;
      rows = Math.ceil(photoCount / 3);
    } else if (photoCount <= 16) {
      cols = 4;
      rows = Math.ceil(photoCount / 4);
    } else {
      cols = 5;
      rows = Math.ceil(photoCount / 5);
    }

    const cellWidth = width / cols;
    const cellHeight = height / rows;
    const gap = 8;
    const actualCellWidth = cellWidth - gap;
    const actualCellHeight = cellHeight - gap;

    for (let i = 0; i < photoCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const cellX = x + col * cellWidth + gap / 2;
      const cellY = y + row * cellHeight + gap / 2;

      try {
        const img = await this.loadImage(photos[i].url);

        // Add shadow effect
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Add border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 3;

        this.drawImageFit(
          ctx,
          img,
          cellX,
          cellY,
          actualCellWidth,
          actualCellHeight,
          fitMode
        );

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      } catch (error) {
        console.error(`Error loading image ${i}:`, error);
        // Draw placeholder for failed images
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(cellX, cellY, actualCellWidth, actualCellHeight);
        ctx.fillStyle = "#999";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "Error",
          cellX + actualCellWidth / 2,
          cellY + actualCellHeight / 2
        );
      }
    }
  }
}

export const photoCollageService = new PhotoCollageService();
