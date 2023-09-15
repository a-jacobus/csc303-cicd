import { TextSegmentLength } from '../../utils/text-segment-length.validator';

export class CreateStatusDTO {
  @TextSegmentLength(1, 1)
  content: string;
}
