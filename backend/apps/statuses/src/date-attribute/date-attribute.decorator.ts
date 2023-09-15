import { applyDecorators } from '@nestjs/common';
import {
  Attribute,
  TransformFromDynamo,
  TransformToDynamo,
} from '@typedorm/common';
import { Type } from 'class-transformer';

export const DateAttribute = () =>
  applyDecorators(
    Attribute(),
    Type(() => Date),
    TransformToDynamo(({ value }: { value: Date }) => value.toISOString()),
    TransformFromDynamo(({ value }) => new Date(value)),
  );
