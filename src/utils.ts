import { ReadLine } from "readline";

export function readlineQuestionPromise(readline: ReadLine, question: string) {
  return new Promise<string>(resolve => readline.question(question, resolve));
}

export function delay(timeout: number): Promise<void>;
export function delay<T>(timeout: number, value: T): Promise<T>;
export function delay(timeout: number, value?: any) {
  return new Promise<any>(resolve => setTimeout(resolve, timeout, value));
}