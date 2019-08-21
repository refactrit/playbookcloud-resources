module.exports = (fn) => {
  return (req, res, next = console.error) => {
    return Promise.resolve(fn(req, res)).catch(next);
  };
};