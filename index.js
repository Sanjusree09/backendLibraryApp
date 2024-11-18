
const express = require('express');
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Import dotenv to load .env variables
var cors = require('cors');
const jetit  = require('@jetit/id');



const app = express();
const port = 3600;

// In-memory "database" for storing users
let users = []; // This array will hold user data
let memberList =[];
let member = [];
let bookList = [];
let registryList = [];

// Load the JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET; // Using environment variable

// Middleware to parse JSON body
app.use(express.json());
app.use(cors())

// Registration Route
app.post('/admin/Signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash the password before saving
  //const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user (just in memory)
  const newUser = { id: jetit.generateID('HEX'), name, email, role };
  users.push(newUser); // Store user in memory

  // Generate JWT token
  const token = jwt.sign({ userId: newUser.id, name:newUser.name,email:newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });

  // Return success response with token
  res.json({
    message: 'User registered successfully',
    token
  });
});

// Login Route
app.post('/admin/login', async (req, res) => {
  const { name, email, role } = req.body;

  // Find user by email
  const user = users.find(user => user.email === email||user.name === name||user.role ===role);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Compare passwords
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({ error: 'Invalid credentials' });
//   }

  // Generate JWT token after successful login
  const token = jwt.sign({ userId: user.id, name:user.name, email:user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

  // Return success response with token
  res.json({
    message: 'Login successful',
    token
  });
});







/////////////////////MEMBER///////////////////////////////////////////////////////

app.post('/member/Signup', async (req, res) => {
    const { name, email, password, contactNumber, address, occupation } = req.body;
  
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Member already exists' });
    }
  
    // Hash the password before saving
    //const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create a new user (just in memory)
    const newUser = { id: jetit.generateID('HEX'), name, email, password, contactNumber, address, occupation };
    users.push(newUser); // Store user in memory
  
    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, name:newUser.name,email:newUser.email, password: newUser.password, contactNumber: newUser.contactNumber, address: newUser.address, occupation: newUser.occupation }, JWT_SECRET, { expiresIn: '1h' });
  
    // Return success response with token
    res.json({
      message: 'Member registered successfully',
      token
    });
  });
  
  // Login Route
  app.post('/member/login', async (req, res) => {
    const { name, email, password } = req.body;
  
    // Find user by email
    const user = users.find(user => user.name === name||user.email === email||user.password ===password);
    if (!user) {
      return res.status(400).json({ error: 'Member not found' });
    }
  
    // Compare passwords
  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) {
  //     return res.status(400).json({ error: 'Invalid credentials' });
  //   }
  
    // Generate JWT token after successful login
    const token = jwt.sign({ userId: user.id, name:user.name, email:user.email, password: user.password }, JWT_SECRET, { expiresIn: '1h' });
  
    // Return success response with token
    res.json({
      message: 'Member Login successful',
      token
    });
  });

  app.get('/member/:id', (req, res) => {
        const memberId = req.params['id'];
        const member = memberList.find(user => user.id === memberId);
        console.log('Login:',member)
        if (!member) {
            return res.status(404).send('Member not found');
        }
       res.send(member);
    });
  


/////////////////////////BOOKS//////////////////////////////////////////////////////////////////////////
app.post('/addBooks', async (req, res) => {
  const { title, author, quantity, edition, description } = req.body;

  // Check if the book already exists
  const existingBook = bookList.find(book => book.title === title);
  if (existingBook) {
    return res.status(400).json({ error: 'Book already exists' });
  }

  // Generate a unique ID for the new book
  const newBook = { 
    id: jetit.generateID('HEX'), title, author, quantity, edition, description};

  // Add the new book to the in-memory list
  bookList.push(newBook);

  // Generate a JWT token for the new book (valid for 1 hour)
  const token = jwt.sign(
    { 
      bookId: newBook.id, 
      title: newBook.title, 
      author: newBook.author, 
      quantity: newBook.quantity, 
      edition: newBook.edition,
      description: newBook.description
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  // Return the success response along with the token
  res.json({
    message: 'Book registered successfully',
    bookId:newBook.id,
    token // Send the token back to the client
   
  });
  console.log('BookId:',newBook.id);
});

app.get('/getBooks/:bookId', (req, res) => {
    const id = req.params['bookId'];
    const book = bookList.find(book => book.id === id);
   
    if (!book) {
        return res.status(404).send('Book not found');
    }
    res.send(book);
});

app.patch('/updateBook/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const { title, author, quantity, edition, description } = req.body;

  // Find the book by ID
  const bookIndex = bookList.findIndex(book => book.title === bookId);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Update the book details
  const updatedBook = { ...bookList[bookIndex], title, author, quantity, edition, description };
  
  // Save the updated book back to the list
  bookList[bookIndex] = updatedBook;

  // Generate a new JWT token for the updated book
  const token = jwt.sign(
    { 
      bookId: updatedBook.id, 
      title: updatedBook.title, 
      author: updatedBook.author, 
      quantity: updatedBook.quantity, 
      edition: updatedBook.edition,
      description: updatedBook.description
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  // Return the success response with the updated book and new token
  res.json({
    message: 'Book updated successfully',
    bookId: updatedBook.bookId,
    token // Send the new token for the updated book
  });

  console.log('Updated BookId:', updatedBook.bookId);
});


/////////////////////MMMMMMMMMMMMEMBERS////////////////////////////

app.post('/addMembers', async (req, res) => {
  const { memberName, memberEmail, memberContactNumber, memberAddress, memberOccupation } = req.body;

  // Check if the book already exists
  const existingMember = member.find(mem => mem.memberEmail === memberEmail);
  if (existingMember) {
    return res.status(400).json({ error: 'Member already exists' });
  }

  // Generate a unique ID for the new book
  const newMember = { 
    memberId: jetit.generateID('HEX'), memberName, memberEmail, memberContactNumber, memberAddress, memberOccupation};

  // Add the new book to the in-memory list
  member.push(newMember);

  // Generate a JWT token for the new book (valid for 1 hour)
  const token = jwt.sign(
    { 
      memberId: newMember.memberId, 
      memberName: newMember.memberName, 
      memberEmail: newMember.memberEmail, 
      memberContactNumber: newMember.memberContactNumber, 
      memberAddress: newMember.memberAddress,
      memberOccupation: newMember.memberOccupation
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  // Return the success response along with the token
  res.json({
    message: 'Member registered successfully',
    memberId:newMember.memberId,
    token // Send the token back to the client
   
  });
  console.log('MemberId:',newMember.memberId);
});
app.get('/getMembers/:memberId', (req, res) => {
  const id = req.params['memberId'];
  const member = member.find(mem => mem.memberId === id);
 
  if (!member) {
      return res.status(404).send('Member not found');
  }
  res.send(member);
});








///////////////////////////////////////////REGISTRY/////////////////////////////////////////////////////////////
app.post('/addRegistry', async (req, res) => {
  const { registryId, registryName, registryBook, registryBookAuthor, registryBookQuantity, registryBookEdition, registryBookBorrowedDate, registryBookReturnDate } = req.body;

  // Check if the book already exists
  const existingRegistry = registryList.find(registry => registry.registryBook === registryBook);
  if (existingRegistry) {
    return res.status(400).json({ error: 'Registry already exists' });
  }

  // Generate a unique ID for the new book
  const newRegistry = { 
    registryId: jetit.generateID('HEX'), 
    registryName,registryBook, registryBookAuthor, registryBookQuantity, registryBookEdition, registryBookBorrowedDate, registryBookReturnDate 
    
  };

  // Add the new book to the in-memory list
  registryList.push(newRegistry);

  // Generate a JWT token for the new book (valid for 1 hour)
  const token = jwt.sign(
    { 
      registryId: newRegistry.registryId, 
      registryName: newRegistry.registryName, 
      registryBook: newRegistry.registryBook, 
      registryBookAuthor: newRegistry.registryBookAuthor, 
      registryBookQuantity: newRegistry.registryBookQuantity,
      registryBookEdition:newRegistry.registryBookEdition,
      registryBookBorrowedDate:newRegistry.registryBookBorrowedDate,
      registryBookReturnDate:newRegistry.registryBookReturnDate

    }, 
    JWT_SECRET, 
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  // Return the success response along with the token
  res.json({
    message: 'Registry Added to Registry successfully',
    registryId:newRegistry.registryId,
    token // Send the token back to the client
  });
});


app.get('/getRegistry/:registryBook', (req, res) => {
  const id = req.params['registryBook'];
  const registry = registryList.find(reg => reg.registryBook === id);
 
  if (!registry) {
      return res.status(404).send('Registry not found');
  }
  res.send(registry);
});







app.get('/members',(req,res)=>{
  res.json(memberList);
})








// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
