// src/entities/books.js
const { EntitySchema } = require("typeorm");

const Book = new EntitySchema({
  name: "Book", // Name of the table
  columns: {
    bookId: {
      primary: true,
      type: "int",
      generated: true
    },
    title: {
      type: "varchar"
    },
    author: {
      type: "varchar"
    },
    quantity: {
      type: "varchar"
    },
    edition: {
      type: "varchar"
    },
    description: {
      type: "varchar"
    }
  }
});

module.exports = { Book };
