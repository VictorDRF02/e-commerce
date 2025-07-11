import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDescription',
  standalone: true,
})
export class ShortDescriptionPipe implements PipeTransform {
  /**
   * Transform a string to a short description by the given length
   * @param value - The string to transform
   * @param length - The length of the description
   * @param ignoreWords - If true, the split will ignore the words, otherwise it will split by words (default: true)
   * @returns The short description
   */
  transform(
    value: string,
    length: number,
    ignoreWords: boolean = true
  ): string {
    if (ignoreWords) {
      return value.substring(0, length) + (value.length > length ? '...' : '');
    } else {
      const words = value.split(' ');
      let sentence = '';
      for (let i = 0; i < words.length; i++) {
        if (sentence.length + words[i].length > length) {
          return sentence + '...';
        }
        sentence += (i === 0 ? '' : ' ') + words[i];
      }

      return sentence;
    }
  }
}
