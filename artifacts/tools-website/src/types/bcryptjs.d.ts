declare module "bcryptjs" {
  export function hash(
    password: string,
    rounds: number,
    callback: (error: Error | null, hash?: string) => void,
  ): void;

  export function compare(
    password: string,
    hash: string,
    callback: (error: Error | null, same?: boolean) => void,
  ): void;

  export function getRounds(hash: string): number;

  const bcrypt: {
    hash: typeof hash;
    compare: typeof compare;
    getRounds: typeof getRounds;
  };

  export default bcrypt;
}
