import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
  registerDecorator,
} from 'class-validator';

const segmenter = new Intl.Segmenter();

@ValidatorConstraint()
class TextSegmentLengthConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly min: number,
    private readonly max: number,
  ) {}

  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    const length = [...segmenter.segment(value)].length;
    return length >= this.min && length <= this.max;
  }

  defaultMessage(): string {
    return 'Text ($value) is shorter than $constraint1, or longer than $constraint2';
  }
}

export function TextSegmentLength(
  min: number,
  max: number = Infinity,
  options?: ValidatorOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'textSegmentLength',
      target: object.constructor,
      propertyName: propertyName,
      options,
      constraints: [min, max],
      validator: new TextSegmentLengthConstraint(min, max),
    });
  };
}
