const sharp = require("sharp");

// Mock Image Upload Service
// Dalam implementasi nyata, ini akan menggunakan Cloudinary atau AWS S3

class ImageUploadService {
  constructor() {
    this.mockStorage = new Map(); // Simulasi cloud storage
    this.baseUrl = "https://mock-cdn.pilahpintar.com";
  }

  async uploadImage(file, options = {}) {
    try {
      // Validate file
      this.validateFile(file);

      // Process image with Sharp
      const processedImage = await this.processImage(file.buffer, options);

      // Generate unique filename
      const filename = this.generateFilename(file.originalname);
      const publicId = `waste-classifications/${Date.now()}-${filename}`;
      const url = `${this.baseUrl}/${publicId}`;

      // Simulate upload to cloud storage
      await this.simulateUpload(processedImage, publicId);

      // Store in mock storage
      this.mockStorage.set(publicId, {
        buffer: processedImage,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: processedImage.length,
        uploadedAt: new Date(),
      });

      return {
        success: true,
        public_id: publicId,
        secure_url: url,
        url: url,
        format: "jpg",
        width: options.width || 800,
        height: options.height || 600,
        bytes: processedImage.length,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  async processImage(buffer, options = {}) {
    try {
      let sharpImage = sharp(buffer);

      // Get image metadata
      const metadata = await sharpImage.metadata();

      // Default processing options
      const defaultOptions = {
        width: 800,
        height: 600,
        quality: 85,
        format: "jpeg",
      };

      const finalOptions = { ...defaultOptions, ...options };

      // Resize image while maintaining aspect ratio
      sharpImage = sharpImage.resize(finalOptions.width, finalOptions.height, {
        fit: "inside",
        withoutEnlargement: true,
      });

      // Convert to JPEG and compress
      sharpImage = sharpImage.jpeg({
        quality: finalOptions.quality,
        progressive: true,
      });

      // Apply additional optimizations
      if (metadata.width > 1920 || metadata.height > 1080) {
        // For very large images, apply more aggressive compression
        sharpImage = sharpImage.jpeg({ quality: 75 });
      }

      const processedBuffer = await sharpImage.toBuffer();

      console.log(
        `Image processed: ${metadata.width}x${metadata.height} -> ${finalOptions.width}x${finalOptions.height}`
      );
      console.log(
        `Size reduced: ${buffer.length} -> ${processedBuffer.length} bytes`
      );

      return processedBuffer;
    } catch (error) {
      console.error("Image processing error:", error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async deleteImage(publicId) {
    try {
      // Simulate deletion from cloud storage
      await this.simulateDelete(publicId);

      // Remove from mock storage
      const deleted = this.mockStorage.delete(publicId);

      if (!deleted) {
        console.warn(`Image not found in storage: ${publicId}`);
      }

      console.log(`Image deleted: ${publicId}`);
      return { success: true };
    } catch (error) {
      console.error("Image deletion error:", error);
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }

  async getImageInfo(publicId) {
    const imageData = this.mockStorage.get(publicId);

    if (!imageData) {
      throw new Error("Image not found");
    }

    return {
      public_id: publicId,
      url: `${this.baseUrl}/${publicId}`,
      format: "jpg",
      bytes: imageData.size,
      uploaded_at: imageData.uploadedAt,
      original_filename: imageData.originalName,
    };
  }

  async generateThumbnail(publicId, width = 150, height = 150) {
    try {
      const imageData = this.mockStorage.get(publicId);

      if (!imageData) {
        throw new Error("Image not found");
      }

      const thumbnailBuffer = await sharp(imageData.buffer)
        .resize(width, height, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailId = `${publicId}_thumb_${width}x${height}`;
      const thumbnailUrl = `${this.baseUrl}/${thumbnailId}`;

      // Store thumbnail
      this.mockStorage.set(thumbnailId, {
        buffer: thumbnailBuffer,
        originalName: `thumb_${imageData.originalName}`,
        mimetype: "image/jpeg",
        size: thumbnailBuffer.length,
        uploadedAt: new Date(),
      });

      return {
        public_id: thumbnailId,
        url: thumbnailUrl,
        width,
        height,
        bytes: thumbnailBuffer.length,
      };
    } catch (error) {
      console.error("Thumbnail generation error:", error);
      throw new Error(`Thumbnail generation failed: ${error.message}`);
    }
  }

  validateFile(file) {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new Error("Invalid file buffer");
    }

    // Check file size (5MB limit)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(
        `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
      );
    }

    // Check file type
    const allowedTypes = (
      process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/jpg"
    ).split(",");
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    return true;
  }

  generateFilename(originalName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split(".").pop() || "jpg";
    return `waste_${timestamp}_${random}.${extension}`;
  }

  async simulateUpload(buffer, publicId) {
    // Simulate network delay for upload
    const uploadTime = 500 + Math.random() * 1000; // 0.5-1.5 seconds
    await new Promise((resolve) => setTimeout(resolve, uploadTime));

    console.log(
      `Simulated upload to cloud storage: ${publicId} (${buffer.length} bytes)`
    );
  }

  async simulateDelete(publicId) {
    // Simulate network delay for deletion
    const deleteTime = 200 + Math.random() * 300; // 0.2-0.5 seconds
    await new Promise((resolve) => setTimeout(resolve, deleteTime));

    console.log(`Simulated deletion from cloud storage: ${publicId}`);
  }

  // Batch operations
  async uploadMultipleImages(files, options = {}) {
    const uploadPromises = files.map((file) => this.uploadImage(file, options));
    return await Promise.all(uploadPromises);
  }

  async deleteMultipleImages(publicIds) {
    const deletePromises = publicIds.map((id) => this.deleteImage(id));
    return await Promise.all(deletePromises);
  }

  // Storage statistics
  getStorageStats() {
    const totalImages = this.mockStorage.size;
    const totalSize = Array.from(this.mockStorage.values()).reduce(
      (sum, img) => sum + img.size,
      0
    );

    return {
      totalImages,
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      storageType: "mock",
      lastCleanup: new Date().toISOString(),
    };
  }

  // Cleanup old images (maintenance function)
  async cleanup(olderThanDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    let deletedCount = 0;
    for (const [publicId, imageData] of this.mockStorage) {
      if (imageData.uploadedAt < cutoffDate) {
        await this.deleteImage(publicId);
        deletedCount++;
      }
    }

    console.log(`Cleanup completed: ${deletedCount} old images deleted`);
    return { deletedCount };
  }
}

// Singleton instance
const imageUploadService = new ImageUploadService();

module.exports = imageUploadService;
