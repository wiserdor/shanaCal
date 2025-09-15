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
    {
      id: "featured-2",
      name: "תמונה גדולה",
      rows: 2,
      cols: 3,
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

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Use higher resolution for better quality
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.scale(scale, scale);

    // Fill background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(1, "#f1f5f9");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const cellWidth = width / layout.cols;
    const cellHeight = height / layout.rows;

    let photoIndex = 0;

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; col++) {
        const cellSpan = layout.template[row][col];

        if (cellSpan > 0 && photoIndex < photos.length) {
          const photo = photos[photoIndex];

          // Calculate cell dimensions
          const cellX = col * cellWidth;
          const cellY = row * cellHeight;
          const cellW = cellWidth * cellSpan;
          const cellH = cellHeight;

          // Create image element
          const img = new Image();
          img.crossOrigin = "anonymous";

          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              try {
                // Calculate aspect ratio and positioning
                const imgAspect = img.width / img.height;
                const cellAspect = cellW / cellH;

                let drawWidth = cellW;
                let drawHeight = cellH;
                let drawX = cellX;
                let drawY = cellY;
                let sourceX = 0;
                let sourceY = 0;
                let sourceWidth = img.width;
                let sourceHeight = img.height;

                if (fitMode === "contain") {
                  // CSS object-fit: contain - scale to fit within cell, maintain aspect ratio
                  if (imgAspect > cellAspect) {
                    // Image is wider than cell - fit to width
                    drawHeight = cellW / imgAspect;
                    drawY = cellY + (cellH - drawHeight) / 2;
                  } else {
                    // Image is taller than cell - fit to height
                    drawWidth = cellH * imgAspect;
                    drawX = cellX + (cellW - drawWidth) / 2;
                  }
                } else {
                  // CSS object-fit: cover - scale to fill cell, maintain aspect ratio, crop if needed
                  if (imgAspect > cellAspect) {
                    // Image is wider than cell - fit to height, crop width
                    drawHeight = cellH;
                    drawWidth = cellH * imgAspect;
                    drawX = cellX + (cellW - drawWidth) / 2;

                    // Calculate source crop
                    sourceWidth = img.width * (cellW / drawWidth);
                    sourceX = (img.width - sourceWidth) / 2;
                  } else {
                    // Image is taller than cell - fit to width, crop height
                    drawWidth = cellW;
                    drawHeight = cellW / imgAspect;
                    drawY = cellY + (cellH - drawHeight) / 2;

                    // Calculate source crop
                    sourceHeight = img.height * (cellH / drawHeight);
                    sourceY = (img.height - sourceHeight) / 2;
                  }
                }

                // Add subtle shadow/border effect
                ctx.save();

                // Create shadow
                ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
                ctx.shadowBlur = 8;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // Draw image with rounded corners effect
                ctx.beginPath();
                const radius = Math.min(drawWidth, drawHeight) * 0.02; // 2% of smallest dimension
                ctx.roundRect(drawX, drawY, drawWidth, drawHeight, radius);
                ctx.clip();

                // Draw image with proper aspect ratio handling
                if (
                  fitMode === "cover" &&
                  (sourceX > 0 ||
                    sourceY > 0 ||
                    sourceWidth < img.width ||
                    sourceHeight < img.height)
                ) {
                  // Use source cropping for cover mode
                  ctx.drawImage(
                    img,
                    sourceX,
                    sourceY,
                    sourceWidth,
                    sourceHeight,
                    drawX,
                    drawY,
                    drawWidth,
                    drawHeight
                  );
                } else {
                  // Use full image for contain mode or when no cropping needed
                  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                }

                // Add enhanced border and shadow
                ctx.restore();

                // Add shadow
                ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
                ctx.shadowBlur = 8;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // Add border
                ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(drawX, drawY, drawWidth, drawHeight, radius);
                ctx.stroke();

                // Reset shadow
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                resolve();
              } catch (error) {
                reject(error);
              }
            };
            img.onerror = reject;
            img.src = photo.url;
          });

          photoIndex++;
        }
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
    if (photos.length === 0) {
      return this.createEmptyCollage(width, height);
    }

    // Select random photos (up to 6 for better layouts)
    const selectedPhotos = photos
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(6, photos.length));

    console.log(
      `Creating professional collage with ${selectedPhotos.length} photos`
    );

    // Use the new professional collage method
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

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Use higher resolution for better quality
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.scale(scale, scale);

    // Create professional background
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

    // Add subtle texture
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

    // Create professional layout based on number of photos
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
    } else {
      await this.drawSixPhotos(
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

    // Create clipping path for rounded corners
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.clip();

    // Draw image
    this.drawImageInRect(ctx, img, x, y, width, height, fitMode);
    ctx.restore();

    // Add shadow and border
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

      this.drawImageInRect(ctx, img, photoX, y, photoWidth, height, fitMode);
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

    // Top photo (main)
    const img1 = await this.loadImage(photos[0].url);
    const radius1 = 14;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, topHeight, radius1);
    ctx.clip();
    this.drawImageInRect(ctx, img1, x, y, width, topHeight, fitMode);
    ctx.restore();
    this.addImageEffects(ctx, x, y, width, topHeight, radius1);

    // Bottom photos
    for (let i = 1; i < 3; i++) {
      const img = await this.loadImage(photos[i].url);
      const photoX = x + (i - 1) * (bottomWidth + gap);
      const radius = 10;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, bottomY, bottomWidth, bottomHeight, radius);
      ctx.clip();
      this.drawImageInRect(
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
      this.drawImageInRect(
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

    // Top row - 2 photos
    const topWidth = (width - gap) / 2;
    for (let i = 0; i < 2; i++) {
      const img = await this.loadImage(photos[i].url);
      const photoX = x + i * (topWidth + gap);
      const radius = 12;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, y, topWidth, topHeight, radius);
      ctx.clip();
      this.drawImageInRect(ctx, img, photoX, y, topWidth, topHeight, fitMode);
      ctx.restore();

      this.addImageEffects(ctx, photoX, y, topWidth, topHeight, radius);
    }

    // Bottom row - 3 photos
    const bottomWidth = (width - 2 * gap) / 3;
    for (let i = 2; i < 5; i++) {
      const img = await this.loadImage(photos[i].url);
      const photoX = x + (i - 2) * (bottomWidth + gap);
      const radius = 10;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, bottomY, bottomWidth, bottomHeight, radius);
      ctx.clip();
      this.drawImageInRect(
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
      this.drawImageInRect(
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

  private drawImageInRect(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    fitMode: "contain" | "cover"
  ): void {
    const imgAspect = img.width / img.height;
    const rectAspect = width / height;

    let drawWidth, drawHeight, drawX, drawY;

    if (fitMode === "cover") {
      if (imgAspect > rectAspect) {
        // Image is wider than rect
        drawHeight = height;
        drawWidth = height * imgAspect;
        drawX = x - (drawWidth - width) / 2;
        drawY = y;
      } else {
        // Image is taller than rect
        drawWidth = width;
        drawHeight = width / imgAspect;
        drawX = x;
        drawY = y - (drawHeight - height) / 2;
      }
    } else {
      // contain mode
      if (imgAspect > rectAspect) {
        // Image is wider than rect
        drawWidth = width;
        drawHeight = width / imgAspect;
        drawX = x;
        drawY = y + (height - drawHeight) / 2;
      } else {
        // Image is taller than rect
        drawHeight = height;
        drawWidth = height * imgAspect;
        drawX = x + (width - drawWidth) / 2;
        drawY = y;
      }
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }

  private addImageEffects(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    // Add shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    // Add border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.stroke();

    // Reset shadow
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

    console.log(`Creating CSS Grid collage with ${photos.length} photos`);

    // Create a temporary div with CSS Grid
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

    console.log("Grid template:", layout.cssGridTemplate);
    console.log("Grid areas:", layout.cssGridAreas);

    // Create image elements for each photo (simple grid placement)
    const imagePromises = [];
    const totalCells = layout.rows * layout.cols;
    const photosToShow = Math.min(photos.length, totalCells);

    console.log(`Placing ${photosToShow} photos in ${totalCells} grid cells`);

    for (let i = 0; i < photosToShow; i++) {
      const img = document.createElement("img");
      img.src = photos[i].url;
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: ${fitMode};
        border-radius: 8px;
        display: block;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 2px solid rgba(255, 255, 255, 0.8);
        transition: transform 0.2s ease;
      `;

      // Add crossOrigin to handle CORS
      img.crossOrigin = "anonymous";

      tempDiv.appendChild(img);

      // Create promise for image loading
      const imagePromise = new Promise<void>((resolve, reject) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error(`Failed to load image: ${photos[i].url}`));
        }
      });

      imagePromises.push(imagePromise);
    }

    // Add to DOM
    document.body.appendChild(tempDiv);

    try {
      // Wait for all images to load
      await Promise.all(imagePromises);
      console.log("All images loaded successfully");

      // Use html2canvas to capture the grid
      const html2canvas = (await import("html2canvas")).default;
      const canvasResult = await html2canvas(tempDiv, {
        width: width,
        height: height,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure the cloned document has the same styles
          const clonedDiv = clonedDoc.querySelector(
            'div[style*="display: grid"]'
          );
          if (clonedDiv) {
            console.log("Grid element found in cloned document");
          }
        },
      });

      console.log("Canvas captured successfully");
      return canvasResult.toDataURL("image/png");
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  }

  private createEmptyCollage(width: number, height: number): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    canvas.width = width;
    canvas.height = height;

    // Fill background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(0.5, "#f1f5f9");
    gradient.addColorStop(1, "#e2e8f0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle pattern overlay
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

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Calculate new dimensions
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

        // Draw and resize
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Failed to resize image"));
            }
          },
          file.type,
          0.9
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}

export const photoCollageService = new PhotoCollageService();
