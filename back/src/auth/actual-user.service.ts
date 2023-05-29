export interface ActualUserService {
  get(): Promise<{ id: string }>;
}
