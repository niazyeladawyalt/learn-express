function validationError(errors: any[]) {
  const err = new Error('Validation Error') as any;
  err.statusCode = 422;
  err.errors = errors;
  return err;
}

export { validationError };
