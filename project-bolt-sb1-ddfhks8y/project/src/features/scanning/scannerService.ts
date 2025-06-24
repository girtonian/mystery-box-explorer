/**
 * Scanner service for handling scanning logic and business rules
 * Provides high-level scanning operations and validation
 */

import { parseAttachmentCode, createScanError, validateQRFormat } from './scannerUtils';
import type { QRCodeData, AttachmentCode, ScanResult, ScanError } from '@/types';

export class ScannerService {
  private static instance: ScannerService;
  
  public static getInstance(): ScannerService {
    if (!ScannerService.instance) {
      ScannerService.instance = new ScannerService();
    }
    return ScannerService.instance;
  }

  /**
   * Process a QR code scan result
   */
  async processScan(qrData: QRCodeData): Promise<ScanResult> {
    const startTime = Date.now();
    
    try {
      // Validate QR code format
      if (!validateQRFormat(qrData.data)) {
        throw createScanError(
          'INVALID_QR_FORMAT',
          'QR code format is not valid for Curmunchkins',
          { qrData: qrData.data }
        );
      }

      // Parse attachment code
      const attachmentCode = parseAttachmentCode(qrData.data);
      if (!attachmentCode) {
        throw createScanError(
          'ATTACHMENT_NOT_RECOGNIZED',
          'Attachment code not recognized',
          { qrData: qrData.data }
        );
      }

      // Validate attachment code
      const isValid = await this.validateAttachment(attachmentCode);
      if (!isValid) {
        throw createScanError(
          'ATTACHMENT_NOT_RECOGNIZED',
          'Attachment code validation failed',
          { attachmentCode: attachmentCode.code }
        );
      }

      // Generate unlock data
      const unlockData = this.generateUnlockData(attachmentCode);
      
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        method: 'camera',
        timestamp: Date.now(),
        data: {
          qrCode: qrData,
          attachment: attachmentCode,
          unlockData,
        },
        metrics: {
          scanDuration: qrData.context.scanDuration,
          processingTime,
          retryCount: 0,
          cameraInitTime: 0,
          qrDetectionTime: qrData.context.scanDuration,
        },
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      return {
        success: false,
        method: 'camera',
        timestamp: Date.now(),
        error: error instanceof Error ? {
          code: 'UNKNOWN_ERROR',
          message: error.message,
          details: error,
          recoverable: true,
          suggestedAction: 'Try scanning again',
        } : error as ScanError,
        metrics: {
          scanDuration: qrData.context.scanDuration,
          processingTime,
          retryCount: 0,
          cameraInitTime: 0,
          qrDetectionTime: 0,
        },
      };
    }
  }

  /**
   * Process manual code entry
   */
  async processManualEntry(code: string): Promise<ScanResult> {
    const startTime = Date.now();
    
    try {
      // Clean and validate code format
      const cleanCode = code.replace(/[^A-Z0-9]/g, '').toUpperCase();
      
      if (!validateQRFormat(cleanCode)) {
        throw createScanError(
          'INVALID_QR_FORMAT',
          'Code format is not valid',
          { manualCode: cleanCode }
        );
      }

      // Parse attachment code
      const attachmentCode = parseAttachmentCode(cleanCode);
      if (!attachmentCode) {
        throw createScanError(
          'ATTACHMENT_NOT_RECOGNIZED',
          'Attachment code not recognized',
          { manualCode: cleanCode }
        );
      }

      // Validate attachment code
      const isValid = await this.validateAttachment(attachmentCode);
      if (!isValid) {
        throw createScanError(
          'ATTACHMENT_NOT_RECOGNIZED',
          'Attachment code validation failed',
          { attachmentCode: attachmentCode.code }
        );
      }

      // Generate unlock data
      const unlockData = this.generateUnlockData(attachmentCode);
      
      const processingTime = Date.now() - startTime;

      // Create mock QR data for manual entry
      const mockQRData: QRCodeData = {
        data: cleanCode,
        format: 'QR_CODE',
        quality: {
          confidence: 1.0,
          readability: 1.0,
          contrast: 1.0,
          sharpness: 1.0,
        },
        geometry: {
          boundingBox: { x: 0, y: 0, width: 100, height: 100 },
          cornerPoints: {
            topLeft: { x: 0, y: 0 },
            topRight: { x: 100, y: 0 },
            bottomLeft: { x: 0, y: 100 },
            bottomRight: { x: 100, y: 100 },
          },
        },
        context: {
          timestamp: Date.now(),
          cameraDevice: 'manual',
          scanDuration: 0,
          attemptNumber: 1,
          lightingConditions: 'good',
        },
      };

      return {
        success: true,
        method: 'manual',
        timestamp: Date.now(),
        data: {
          qrCode: mockQRData,
          attachment: attachmentCode,
          unlockData,
        },
        metrics: {
          scanDuration: 0,
          processingTime,
          retryCount: 0,
          cameraInitTime: 0,
          qrDetectionTime: 0,
        },
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      return {
        success: false,
        method: 'manual',
        timestamp: Date.now(),
        error: error instanceof Error ? {
          code: 'UNKNOWN_ERROR',
          message: error.message,
          details: error,
          recoverable: true,
          suggestedAction: 'Check the code and try again',
        } : error as ScanError,
        metrics: {
          scanDuration: 0,
          processingTime,
          retryCount: 0,
          cameraInitTime: 0,
          qrDetectionTime: 0,
        },
      };
    }
  }

  /**
   * Validate attachment code against business rules
   */
  private async validateAttachment(attachmentCode: AttachmentCode): Promise<boolean> {
    // In a real implementation, this would validate against:
    // - Server-side whitelist
    // - Expiration dates
    // - Usage limits
    // - Regional restrictions
    
    // For now, accept all properly formatted codes
    return attachmentCode.validation.isValid;
  }

  /**
   * Generate unlock data for a valid attachment
   */
  private generateUnlockData(attachmentCode: AttachmentCode) {
    // Select the first available story from the attachment's story list
    const storyId = attachmentCode.content.storyIds[0] || `${attachmentCode.attachmentType}-story-001`;
    
    // Extract character ID from the story ID (e.g., 'silo' from 'silo-fidget-feet-001')
    const characterId = storyId.split('-')[0] || attachmentCode.content.characterCompatibility[0] || 'silo';
    
    // Check if this is new content (would check against user's progress)
    const newContent = true; // Mock: assume always new for demo
    const previouslyUnlocked = false; // Mock: assume never unlocked before
    
    return {
      storyId,
      characterId,
      newContent,
      previouslyUnlocked,
    };
  }

  /**
   * Get scan statistics for analytics
   */
  getScanStatistics(scanHistory: ScanResult[]) {
    const totalScans = scanHistory.length;
    const successfulScans = scanHistory.filter(scan => scan.success).length;
    const failedScans = totalScans - successfulScans;
    
    const averageScanTime = scanHistory.length > 0
      ? scanHistory.reduce((sum, scan) => sum + scan.metrics.scanDuration, 0) / scanHistory.length
      : 0;
    
    const averageProcessingTime = scanHistory.length > 0
      ? scanHistory.reduce((sum, scan) => sum + scan.metrics.processingTime, 0) / scanHistory.length
      : 0;
    
    const methodBreakdown = scanHistory.reduce((acc, scan) => {
      acc[scan.method] = (acc[scan.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const errorBreakdown = scanHistory
      .filter(scan => !scan.success && scan.error)
      .reduce((acc, scan) => {
        const errorCode = scan.error!.code;
        acc[errorCode] = (acc[errorCode] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    return {
      totalScans,
      successfulScans,
      failedScans,
      successRate: totalScans > 0 ? (successfulScans / totalScans) * 100 : 0,
      averageScanTime,
      averageProcessingTime,
      methodBreakdown,
      errorBreakdown,
    };
  }

  /**
   * Get recommendations for improving scan success
   */
  getScanRecommendations(scanHistory: ScanResult[]) {
    const stats = this.getScanStatistics(scanHistory);
    const recommendations: string[] = [];
    
    if (stats.successRate < 50) {
      recommendations.push('Try improving lighting conditions');
      recommendations.push('Hold device steady while scanning');
      recommendations.push('Move closer to the QR code');
    }
    
    if (stats.averageScanTime > 5000) {
      recommendations.push('Ensure QR code is clearly visible');
      recommendations.push('Clean camera lens');
    }
    
    if (stats.errorBreakdown['CAMERA_PERMISSION_DENIED'] > 0) {
      recommendations.push('Enable camera permissions in browser settings');
    }
    
    if (stats.errorBreakdown['QR_CODE_NOT_DETECTED'] > 2) {
      recommendations.push('Try manual code entry');
      recommendations.push('Check QR code is not damaged');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const scannerService = ScannerService.getInstance();
export default scannerService;