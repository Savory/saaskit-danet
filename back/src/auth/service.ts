export interface AuthService {
  getActualUser(): Promise<{ id: string }>;
}
