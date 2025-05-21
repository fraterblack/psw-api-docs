export class StringHelper {
  /**
   * Extract initials name of a fullname
   *
   * @param fullname - Fullname
   */
  static extractInitialsName(fullname: string): string {
    if (!fullname) {
      return '';
    }

    // Split name by spaces
    const nameParts = fullname.split(' ');

    // Prepositions
    const prepositions = ['de', 'da', 'do', 'das', 'dos', 'e'];

    // Filter to remove prepositios
    const filteredNameParts = nameParts.filter(i => !prepositions.includes(i));

    let firstLetter = filteredNameParts[0][0];
    if (!firstLetter) {
      firstLetter = filteredNameParts[filteredNameParts.length - 1][0];
    }

    let secondLetter = filteredNameParts[filteredNameParts.length - 1][0];

    if (!secondLetter) {
      secondLetter = firstLetter;
    }

    // Returs the first letter of the first and the last parts
    return (firstLetter || '*') + (secondLetter || '*');
  }

  static copyTextToClipboard(text: string, showTextOnSuccess = true) {
    if (!navigator.clipboard) {
      StringHelper.fallbackCopyTextToClipboard(text);

      return;
    }

    navigator.clipboard.writeText(text).then(() => console.log('Copied to clipboard: ', showTextOnSuccess ? text : '---hidden---'));
  }

  private static fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');

      if (successful) {
        console.log('Copied to clipboard: ', text);
      }
    } catch (err) { }

    document.body.removeChild(textArea);
  }
}
