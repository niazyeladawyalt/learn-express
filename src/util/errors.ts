function toHttpError(err: unknown, statusCode = 500): Error {
  const error = err instanceof Error ? err : new Error(String(err));
  (error as any).statusCode = statusCode;
  return error;
}

export { toHttpError };
