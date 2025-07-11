export default function errorMiddleware(err, req, res, _next) {
  console.error(err.stack || err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}