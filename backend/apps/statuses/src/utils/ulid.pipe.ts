import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const ULID_REGEX = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/;

@Injectable()
export class ParseULIDPipe implements PipeTransform {
  transform(value: string) {
    const str = value
      .toUpperCase()
      .replace(/O/g, '0')
      .replace(/[IL]/g, '1')
      .replace(/-+/g, '');
    if (!ULID_REGEX.test(str)) throw new BadRequestException('ID is not valid');
    return str;
  }
}
