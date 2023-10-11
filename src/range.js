module.exports = (req, res, next) => {
  res.header('Content-Range', 'user 0-20/20')
  next()
}