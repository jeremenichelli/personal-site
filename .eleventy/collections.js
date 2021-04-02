const blog = (collection) => {
  return collection.getFilteredByTag('post').reverse().slice(0, 8);
};

const archive = (collection) => {
  return collection.getFilteredByTag('post').reverse();
};

const all = function (collection) {
  return collection.getAll();
};

module.exports = {
  all,
  archive,
  blog
};
