export interface ApiErrorDetail {
  type?: string;
  loc?: Array<string | number>;
  msg?: string;
  input?: unknown;
}

export interface ApiErrorPayload {
  error?: {
    type?: string;
    message?: string;
    details?: ApiErrorDetail[] | string | null;
  };
}

export type ApiErrorDetails = ApiErrorDetail[] | string | null;

export class ApiError extends Error {
  public readonly status?: number;
  public readonly details?: ApiErrorDetails;

  constructor(message: string, status?: number, details?: ApiErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}
