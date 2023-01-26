import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class RequiredFilesPipe implements PipeTransform {
  constructor(
    private readonly requiredFiles: {
      name: string;
      validateMessage: string;
    }[],
  ) {}

  transform(value: any, { metatype }: ArgumentMetadata) {
    if (metatype !== Object) return value;

    const fields = Object.keys(value);

    let error = '';

    this.requiredFiles.every(({ name, validateMessage }) => {
      if (!fields.includes(name)) {
        error = validateMessage;

        return false;
      }

      return true;
    });

    if (error) throw new BadRequestException(error);

    return value;
  }
}
