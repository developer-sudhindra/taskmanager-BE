export class WrongTaskStatusException extends Error {
  constructor() {
    super('wrong task status transition!');
    this.name = 'WrongTaskStatusException';
  }
}
