

// Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// Find books published after a certain year (example: after 2000)
db.books.find({ published_year: { $gt: 2000 } });

// Find books by a specific author
db.books.find({ author: "George Orwell" });

// Update the price of a specific book
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 15.99 } }
);

// Delete a book by its title
db.books.deleteOne({ title: "Animal Farm" });


/* ------------------------- Advanced Queries ------------------------- */

// Find books that are in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

// Use projection to return only title, author, and price fields
db.books.find(
  {},
  { _id: 0, title: 1, author: 1, price: 1 }
);

// Sort books by price ascending
db.books.find().sort({ price: 1 });

// Sort books by price descending
db.books.find().sort({ price: -1 });

// Pagination: limit and skip (5 books per page)
db.books.find().skip(0).limit(5); // Page 1
db.books.find().skip(5).limit(5); // Page 2


/* ------------------------- Aggregation Pipelines ------------------------- */

// Calculate the average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// Find the author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
          "s"
        ]
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);


/* ------------------------- Indexing ------------------------- */

// Create an index on the title field
db.books.createIndex({ title: 1 });

// Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Use explain() to show performance improvement with index on title
db.books.find({ title: "1984" }).explain("executionStats");

// Use explain() to show performance improvement with compound index
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");
