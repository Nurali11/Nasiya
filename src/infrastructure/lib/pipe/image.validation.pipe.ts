import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageValidationPipe implements PipeTransform<any> {
  private readonly allowedExtensions = [
    '.jpeg',
    '.jpg',
    '.png',
    '.svg',
    '.heic',
  ];
  transform(value: any) {
    try {
      if (value) {
        const file = value?.originalname;
        const fileExtension = extname(file).toLowerCase();
        if (!this.allowedExtensions.includes(fileExtension)) {
          throw new BadRequestException(
            'Only JPEG, JPG, PNG, SVG formats can be uploaded',
          );
        }
        return value;
      }
    } catch (error) {
      throw new BadRequestException(`Error on image pipe: ${error}`);
    }
  }
}
