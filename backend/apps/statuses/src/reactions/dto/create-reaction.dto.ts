import { TextSegmentLength } from '../../utils/text-segment-length.validator';

export class CreateReactionDto {
  @TextSegmentLength(1, 1)
  content: string;
}
