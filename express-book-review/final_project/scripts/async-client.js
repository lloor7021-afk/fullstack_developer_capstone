const { getAllBooks, getBooksByISBN, getBooksByAuthor, getBooksByTitle } = require('../router/general.js');
(async () => {
  const [all, isbn, author, title] = await Promise.all([
    getAllBooks(), getBooksByISBN('1'), getBooksByAuthor('Jane Austen'), getBooksByTitle('Pride and Prejudice')
  ]);
  console.log('All book count:', Object.keys(all).length);
  console.log('ISBN 1:', isbn.title);
  console.log('Author Jane Austen:', Object.keys(author).join(','));
  console.log('Title Pride and Prejudice:', Object.keys(title).join(','));
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
