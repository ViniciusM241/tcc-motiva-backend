module.exports = (text) => {
  const firstLetter = text.substring(0, 1);
  const newText = text.replace(firstLetter, firstLetter.toLowerCase());

  return newText;
}
