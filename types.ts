export interface ScriptConfig {
  botToken: string;
  chatId: string;
  sourcePath: string;
  password: string;
  filename: string;
}

export enum CopyState {
  IDLE = 'IDLE',
  COPIED = 'COPIED',
}