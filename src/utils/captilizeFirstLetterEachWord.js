module.exports = (text) => {
  const arr = text.split(' ');

  return arr.map(element => {
    return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  });
}
