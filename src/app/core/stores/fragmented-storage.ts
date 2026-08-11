/**
 * Storage that splits a value in several fragments, each one persisted in localStorage
 * under a random key, and reassembles it only when the value is requested.
 *
 * It does not make the data secure (an XSS payload still runs in the same origin),
 * it only makes the token harder to be located and stolen by generic scripts.
 */
export class FragmentedStorage {
  private static readonly fragmentCount = 5;
  private static readonly decoyCount = 3;
  private static readonly cipherKey = 'p5w-4pi-d0cs-fr4gm3nt';

  static setItem(name: string, value: string): void {
    this.removeItem(name);

    const signature = this.signatureOf(name);
    const fragments = this.split(value, this.fragmentCount);

    fragments.forEach((fragment, index) => {
      localStorage.setItem(
        this.randomKey(),
        this.encode(`${signature}|${index}|${fragments.length}|${fragment}`)
      );
    });

    for (let i = 0; i < this.decoyCount; i++) {
      localStorage.setItem(
        this.randomKey(),
        this.encode(`${signature}|-1|${fragments.length}|${this.randomKey()}`)
      );
    }
  }

  static getItem(name: string): string {
    const signature = this.signatureOf(name);
    const fragments: string[] = [];
    let total: number = null;

    this.eachFragmentOf(signature, part => {
      if (part.index < 0) {
        return;
      }

      total = part.total;
      fragments[part.index] = part.content;
    });

    if (total === null || fragments.length !== total) {
      return null;
    }

    for (let i = 0; i < total; i++) {
      if (fragments[i] === undefined) {
        return null;
      }
    }

    return fragments.join('');
  }

  static removeItem(name: string): void {
    const signature = this.signatureOf(name);
    const keys: string[] = [];

    this.eachFragmentOf(signature, (_, key) => keys.push(key));

    keys.forEach(key => localStorage.removeItem(key));
  }

  private static eachFragmentOf(
    signature: string,
    handler: (part: { index: number, total: number, content: string }, key: string) => void
  ): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const part = this.parse(localStorage.getItem(key), signature);

      if (part) {
        handler(part, key);
      }
    }
  }

  private static parse(value: string, signature: string): { index: number, total: number, content: string } {
    if (!value) {
      return null;
    }

    let decoded: string;
    try {
      decoded = this.decode(value);
    } catch {
      return null;
    }

    const separator = decoded.indexOf('|');
    if (separator < 0 || decoded.substring(0, separator) !== signature) {
      return null;
    }

    const parts = decoded.split('|');
    if (parts.length < 4) {
      return null;
    }

    return {
      index: Number(parts[1]),
      total: Number(parts[2]),
      content: parts.slice(3).join('|')
    };
  }

  private static split(value: string, parts: number): string[] {
    const size = Math.ceil(value.length / parts) || 1;
    const fragments: string[] = [];

    for (let i = 0; i < value.length; i += size) {
      fragments.push(value.substr(i, size));
    }

    return fragments.length ? fragments : [''];
  }

  private static signatureOf(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }

    return Math.abs(hash).toString(36);
  }

  private static randomKey(): string {
    const buffer = new Uint8Array(16);

    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(buffer);
    } else {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
    }

    return Array.from(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private static encode(value: string): string {
    const base64 = btoa(unescape(encodeURIComponent(value)));

    return this.toHex(this.cipher(base64));
  }

  private static decode(value: string): string {
    const base64 = this.cipher(this.fromHex(value));

    return decodeURIComponent(escape(atob(base64)));
  }

  private static cipher(value: string): string {
    let result = '';

    for (let i = 0; i < value.length; i++) {
      // tslint:disable-next-line: no-bitwise
      result += String.fromCharCode(value.charCodeAt(i) ^ this.cipherKey.charCodeAt(i % this.cipherKey.length));
    }

    return result;
  }

  private static toHex(value: string): string {
    let result = '';

    for (let i = 0; i < value.length; i++) {
      result += value.charCodeAt(i).toString(16).padStart(2, '0');
    }

    return result;
  }

  private static fromHex(value: string): string {
    if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) {
      throw new Error('Invalid content');
    }

    let result = '';

    for (let i = 0; i < value.length; i += 2) {
      result += String.fromCharCode(parseInt(value.substr(i, 2), 16));
    }

    return result;
  }
}
