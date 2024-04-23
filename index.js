/// CRUD Application

/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path
const uuidv4 = require("uuid").v4;

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
// Database tables => customers, address
const databasePath = path.join(__dirname, "database/database.db");

/* -----> JSON Object Request <----- */
app.use(express.json());

/* -----> Connecting SQLite Database <----- */

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    /* -----> Assigning a port Number <----- */
    app.listen(6000, () =>
      console.log("Server Running at http://localhost:6000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

/* -----> Handling HTTP Request <----- */
// app.METHOD(PATH, HANDLER)

// API 0
// Home
app.get("/", async (request, response) => {
  console.log("Home");
  response.send("Home");
});

// API 1 : Add Single Customer
app.post("/customers", async (request, response) => {
  console.log("Add Single Customer");

  const customerDetails = request.body;
  const { name, age, address } = customerDetails;
  const {city, country, } = address;

  const uniqueId = uuidv4();
  const date = new Date()

  const CustomerQuery = `INSERT INTO customers (name, age, created_on, updated_on, address_id)
  VALUES (
      '${name}',
      ${age},
      '${date}',
      '${date}',
      '${uniqueId}'
  );`;
const addressQuery = `INSERT INTO address (id, city, country, updated_on)
VALUES (
  '${uniqueId}',
  '${city}',  
  '${country}',
  '${date}'
);`;
  try {
      await db.run(CustomerQuery);
      await db.run(addressQuery);
      response.send("Single Customer Added");
  } catch (error) {
      console.error("Error adding customer:", error.message);
      response.status(500).send("Error adding customer");
  }
});


// API 2 : Get All Customers
app.get("/customers", async (request, response) => {
  console.log("Get All Customers")

  const getAllCustomersQuery = `
  SELECT * FROM customers;
  `;
     
      const allCustomers = await db.all(getAllCustomersQuery);
      console.log(allCustomers);
      response.send(allCustomers);
});

// API 3 : Get Single Customer
app.get("/customers/:id", async (request, response)=>{
  console.log("Get Single Customer");
  const {id} = request.params;
  console.log(id);
  const singleCustomerQuery = `
    SELECT * FROM customers WHERE id = ${id};
  `;

  const singleCustomer = await db.all(singleCustomerQuery);
  console.log(singleCustomer);
  response.send(singleCustomer);
});


// API 4 : Update Single Customer Data 
app.put("/customers/:id", async (request, response) => {
  console.log("Update Single Customer Data");
  const {id} = request.params;
  console.log(id);
  const customerDetails = request.body;
  const { name } = customerDetails;

  const uniqueId = uuidv4();
  const date = new Date()

  const updateSingleCustomerQuery = `UPDATE customers
  SET name = '${name}',
updated_on = '${date}'
  WHERE id = ${id}`;

  try {
      await db.run(updateSingleCustomerQuery);
      response.send("Updated Single Customer Data");
  } catch (error) {
      console.error("Error Updated Single Customer Data:", error.message);
  }
});