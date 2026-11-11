const errorHandler = (err, req, res, _next) => {
  if (res.headersSent) return _next(err)

  const statusCode = err.status || 500
  if (statusCode >= 500) console.error(err)

  res.status(statusCode).json({
    error: {
      message: statusCode >= 500 ? 'Palvelinvirhe' : err.message,
      status: statusCode
    }
  })
}

export default errorHandler