const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { pool , query} = require("./db"); // My connection to PostgreSQL
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bycrypt = require('bcrypt')
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Session configuration

//register 1 route

// /signup Route
app.post("/signup", async (req, res) => {
  const { fullName, phoneNumber, email, dateOfBirth, password, confirmPassword, latitude, longitude, address } =
    req.body;

  try {
    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match!" });
    }

    // Check if email already exists
    const checkEmailQuery = `SELECT email FROM Users WHERE email = $1`;
    const checkPhoneQuery = `SELECT phone FROM Users WHERE phone = $1`;

    // Execute queries
    const emailResult = await query(checkEmailQuery, [email]);
    const phoneResult = await query(checkPhoneQuery, [phoneNumber]);

    // Debugging logs to check query results
    //console.log("Email Result:", emailResult.rows);
    // console.log("Phone Result:", phoneResult.rows);

    // Check for existing email
    const errors = [];
    if (emailResult.rows.length > 0) return res.status(400).json({ error: `Email ${email} is already registered.` });
    if (phoneResult.rows.length > 0) return res.status(400).json({ error: `Phone ${phoneNumber} is already in use.` });

    res.status(201).json({ message: "User registration successful" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// Start the server

//Insert Route
app.post("/Insert", async (req, res) => {
  const { selectedLabels, userData, objExt, prices } = req.body;
  console.log(selectedLabels);
  console.log(prices);

  const fileSystem = objExt[0];
  const userType = objExt[1];
  const { fullName, phoneNumber, email, dateOfBirth, password, confirmPassword, latitude, longitude, address } =
    userData;
  console.log(fullName);
  console.log(userType);
  console.log(fileSystem);
  const client = await pool.connect();
  if (userType === "service_provider") {
    const querySync = (text, params) => client.query(text, params);

    await client.query("BEGIN");
    try {
      // Insert into Users table
      const signupQuery = `
            INSERT INTO Users (name, phone, email, dateOfBirth, password, address, latitude, longitude) 
            VALUES ($1, $2, $3, $4, crypt($5,gen_salt('bf')), $6, $7, $8) RETURNING email;
        `;
      const signupResult = await querySync(signupQuery, [
        fullName,
        phoneNumber,
        email,
        dateOfBirth,
        password,
        address,
        latitude,
        longitude,
      ]);
      console.log("First done");

      // Insert into ServiceProviders table
      const signupQueryFinal = `
      INSERT INTO ServiceProviders (provider_id) VALUES($1) RETURNING provider_id`;
      const signupQueryFinalResult = await querySync(signupQueryFinal, [signupResult.rows[0].email]);

      // Insert into ProviderServices table
      for (const service of selectedLabels) {
        const price = prices[service.service_name];
        const data = {
          provider_id: signupQueryFinalResult.rows[0].provider_id, // Reusing the same provider_id for all services
          combined_key: service.combined_key,
          price: price,
        };
        const values = [data.provider_id, data.combined_key, data.price];
        console.log(values);

        const signupQueryQuery = `INSERT INTO ProviderService (provider_id, service_id, price) VALUES($1, $2, $3) RETURNING *`;
        await querySync(signupQueryQuery, values);
      }

      await client.query("COMMIT");
      res.status(201).json({ message: "Transaction committed successfully", data: signupQueryFinalResult.rows[0] });
      return
    } catch (error) {
      await client.query("ROLLBACK");
            console.error(error);

      res.status(500).json({ error: "Transaction failed.", data: error });
      return
    } finally {
      client.release();
    }
  }

  if (userType === "customer") {
    const querySync = (text, params) => client.query(text, params);
  //const hashedPassword = hashPassword(password);

    await client.query("BEGIN");
    try {
      // Insert into Users table
      const signupQuery = `
            INSERT INTO Users (name, phone, email, dateOfBirth, password, address, latitude, longitude) 
            VALUES ($1, $2, $3, $4, crypt($5,gen_salt('bf')), $6, $7, $8) RETURNING email;
        `;
      const signupResult = await querySync(signupQuery, [
        fullName,
        phoneNumber,
        email,
        dateOfBirth,
        password,
        address,
        latitude,
        longitude,
      ]);
      console.log("First done");

      // Insert into Customers table
      const signupQueryFinal = `
      INSERT INTO Customers (customer_id, preferences) VALUES($1, $2) RETURNING *`;
      const signupQueryFinalResult = await querySync(signupQueryFinal, [
        signupResult.rows[0].email,
        JSON.stringify(selectedLabels),
      ]);

      await client.query("COMMIT");
      res.status(201).json({ message: "Transaction committed successfully", data: signupQueryFinalResult.rows[0] });
      return
    } catch (error) {
      await client.query("ROLLBACK");
            console.error(error);

      res.status(500).json({ error: "Transaction failed.", data: error });
      return
    } finally {
      client.release();
    }
  }
  console.error("Problem with store");

  res.status(500).json({ error: "Unexpected Error" });
  return
});
function toHex(s) {
    let h = ''
    for (let i = s.length - 1; i >= 0; i--)
        h = '%'+ s.charCodeAt(i).toString(16) + h
    return h
}


const hashPassword = async (password) => {
  const salt = await bycrypt.genSalt(8); // Generate salt
  try {
    const hashedPassword = await bycrypt.hash(password, salt);
    console.log("Hashed password: ", hashedPassword);
   // const decodedHashedPassword = Buffer.from;
    console.log();
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing the password", error);
    return "Hello";
  }
};

 const verifyHashedPassword = async (passwordDb, passwordUser) => {
   try {
     const match = await bycrypt.compare(passwordUser, passwordDb);
     const message = "success";

     return { match, message };
   } catch (error) {
     console.error(error);
     const message = "fail";
     const match = false;
     return { match, message };
   }
 };

//Login

app.post("/Login" ,async (req, res) => {
  const {
    email, password
  } = req.body;

  try {
const loginQuery = `
SELECT 
  Users.email AS email, 
  Users.name, 
  Users.phone, 
  Users.dateOfBirth, 
  Users.address, 
  Users.latitude, 
  Users.longitude, 
  Customers.preferences AS details, 
  CASE 
    WHEN ServiceProviders.provider_id IS NOT NULL THEN 'ServiceProvider' 
    WHEN Customers.customer_id IS NOT NULL THEN 'Customer' 
  END AS user_type,
  (crypt($2, Users.password) = Users.password) AS is_password_correct
FROM Users 
LEFT JOIN ServiceProviders ON Users.email = ServiceProviders.provider_id 
LEFT JOIN Customers ON Users.email = Customers.customer_id
WHERE Users.email = $1;
`;


// Execute the query with logging
const queryResult = await query(loginQuery, [email, password]);
//console.log("Query Result:", queryResult.rows);
const userPassword = password;
if (queryResult.rows.length > 0) {
  const {
    user_id,
    name,
    phone,
    email,
    dateofbirth,
    is_password_correct,
    address,
    latitude,
    longitude,
    details,
    user_type,
  } = queryResult.rows[0];
    const passwordD = password;
          console.log(user_type);

    console.log(passwordD);
    //const passwordVerify = verifyHashedPassword(userPassword, passwordD);
    if (is_password_correct) {
      const strings = { name, phone, email, password, address, user_type, latitude, longitude, dateofbirth };
      console.log(strings);
      const objects = { details };

      res.status(201).json({ message: "Login Successful", strings: strings, objects: objects });
      return;
    }



  console.log("Wrong password");
return res.status(400).send({
  error: "Wrong Password"
}); 
} else {
  console.log("User doesn't exist");

return res.status(500).send({
  error: "User doesn't exist.Signup below"
}); 
}

  } catch (error) {
        console.error(error);

    res.status(500).json({error: "Not today man"});
    return
  }

});





// Configure multer for file storage


// Middleware to parse request body

// Configure multer for file storage
const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({ storage: storage }); // Initialize multer with the storage configuration

// Route to handle file upload
app.post("/ImageStore", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      console.log("File upload failed: No file uploaded");
      return res.status(400).json({ error: "No file uploaded." });
    }

    const id = req.body.id; // Assume ID is sent in the request body
    const name = req.body.name; // Assume name is sent in the request body
    const ext = path.extname(req.file.originalname); // Extract the file extension
    const filename = `${id}-${name}${ext}`; // Concatenate ID, name, and extension for the filename
    const savePath = path.join(__dirname, "../assets/img/ServiceProviderProfile", filename); // Define the path to save the file

    // Save the file to the disk
    fs.writeFile(savePath, req.file.buffer, (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.status(500).json({ error: "Error saving file.", details: err.message });
      }
      console.log("File uploaded and saved successfully:", savePath);
      return res.status(201).json({ message: "File uploaded and saved successfully", filePath: savePath });
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    return res.status(500).json({ error: "An error occurred during file upload.", details: error.message });
  }
});


app.post("/getbookings", async(req, res) => {
  const { data } = req.body;
  
  
  console.log("Provider  ",data || "not parsed");
  try {
    const checkerSQL = `SELECT Users.email AS email,
  CASE
  WHEN ServiceProviders.provider_id IS NOT NULL THEN 'provider_id'
  WHEN Customers.customer_id IS NOT NULL THEN 'customer_id'
  END AS user_type
  FROM Users
  LEFT JOIN ServiceProviders ON Users.email = ServiceProviders.provider_id 
  LEFT JOIN Customers ON Users.email = Customers.customer_id
  WHERE email = $1;`;
  const checkerSQLResult = await query(checkerSQL,[data]);
  console.log(checkerSQLResult.rows[0].user_type);
  const Table = checkerSQLResult.rows[0].user_type;
  let bookingsQuery = ``;
if (Table === "provider_id") {
   bookingsQuery = `SELECT 
    ServiceBooking.booking_id,
    ServiceBooking.provider_id, 
    ServiceBooking.customer_id, 
    ServiceBooking.service_id, 
    ServiceBooking.price, 
    ServiceBooking.status AS booking_status,
    Transactions.payment_status,
    Services.service_name,
    Services.service_description,
    Users.name,
    Users.phone,
    Users.address,
    Users.latitude,
    Users.longitude
FROM ServiceBooking
LEFT OUTER JOIN Transactions 
    ON ServiceBooking.booking_id = Transactions.booking_id  -- Join by booking_id
LEFT OUTER JOIN Services 
    ON ServiceBooking.service_id = Services.combined_key
LEFT OUTER JOIN Users
    ON ServiceBooking.customer_id = Users.email
WHERE ServiceBooking.provider_id = $1;
`;
  
}else{
   bookingsQuery = `SELECT 
    ServiceBooking.booking_id,
    ServiceBooking.provider_id, 
    ServiceBooking.customer_id, 
    ServiceBooking.service_id, 
    ServiceBooking.price, 
    ServiceBooking.status AS booking_status,
    Transactions.payment_status,
    Services.service_name,
    Services.service_description,
    Users.name,
    Users.phone,
    Users.address,
    Users.latitude,
    Users.longitude
FROM ServiceBooking
LEFT OUTER JOIN Transactions 
    ON ServiceBooking.booking_id = Transactions.booking_id  -- Join by booking_id
LEFT OUTER JOIN Services 
    ON ServiceBooking.service_id = Services.combined_key
LEFT OUTER JOIN Users
    ON ServiceBooking.customer_id = Users.email
WHERE ServiceBooking.customer_id = $1;
`;
}
    

    const bookingQueryResult = await query(bookingsQuery,[data]);
    if (bookingQueryResult.rows.length > 0) {
      const { booking_id, provider_id, customer_id, service_id, price, booking_status, payment_status, service_name } =
        bookingQueryResult.rows[0];
      const bookingDetails = {
        booking_id,
        provider_id,
        customer_id,
        service_id,
        price,
        booking_status,
        payment_status,
        service_name,
      };
      console.log(booking_id);
      const Object = bookingQueryResult.rows;
     // console.log(Object);

      res.status(201).json({ message: "I've got something fya", Object: Object });
      return
            
      
    }else{
      console.log("No bookings");

      res.status(400).json({ message: "No bookings" });
      return
    }
    
  } catch (error) {
    console.log(error);
    
    res.status(500).json({error: error});
    
    return
  }

});







app.get('/Image/:filename', (req, res) => {
  const filepath = path.join(__dirname, '../assets/img/ServiceProviderProfile', req.params.filename);
  res.sendFile(filepath);
});

app.post('/search', async (req, res) => {
  const  {userQuery} = req.body;
  console.log(userQuery);
  if(!query){
    return res.status(400).json({error: "Query is required"});
  }
  try {

const result = await query(`SELECT * FROM Services WHERE to_tsvector(service_name) @@ to_tsquery($1);`, [userQuery]);
 
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error("Error executing search query: ", error);
    res.status(500).json({error: "Internal server error"});
  }
});





app.post("/providers", async (req, res) => {
  const { combined_key } = req.body;
  console.log(combined_key);
  
  try {
const queryWithWhere = `
      SELECT 
        ProviderService.provider_id,
        ProviderService.service_id,
        ProviderService.price,
        Users.email,
        Users.name,
        Users.phone,
        Users.dateOfBirth,
        Users.address
      FROM 
        ProviderService
      LEFT JOIN 
        Users 
      ON 
        ProviderService.provider_id = Users.email
      WHERE 
        ProviderService.service_id = $1;
    `;     
        const result = await query(queryWithWhere, [combined_key]);

    console.log(result.rows || "Providers retrieval failed");

    res.json(result.rows);
    return
  } catch (error) {
    console.error("Error executing search query: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/payment", async (req,res) => {
  //const { obj } = req.body;
  const { userData, providerprice, phoneNumber, payedService } = req.body;
   try {
const accessToken = await generateAccessToken();
  const shortcode = "174379"; 
  const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; 
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3); 
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64'); 
  const lipaNaMpesaOnlineApi = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  
console.log(phoneNumber);
console.log(providerprice);
console.log(userData);
console.log(payedService)

    const paymentRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(providerprice.price), // Amount in KES
      PartyA: phoneNumber, // Customer phone number
      PartyB: shortcode,
      PhoneNumber: phoneNumber, // Customer phone number
      CallBackURL: "https://mydomain.com/path",
      AccountReference: "Test123",
      TransactionDesc: "My First Mpesa API",
    };

    const paymentResponse = await axios.post(lipaNaMpesaOnlineApi, paymentRequest, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
const transactionID = "dhgghgsk124745757";
      booking(userData, providerprice, payedService, transactionID);
          console.log(paymentResponse.data);
            



    console.log("Payment failed and by extension booking");

    res.status(paymentResponse.status).json({ message: "Failure", transactionData: paymentResponse.data.checkoutRequestID });


return
  
    
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error});
    return
  }

});

const booking = async (userData, providerprice, payedService, transactionID) => {
  try {
    console.log(userData);
    const client = await pool.connect();

    const querySync = (text, params) => client.query(text, params);
    await client.query("BEGIN");
    const firstQuery = `INSERT INTO ServiceBooking (customer_id, provider_id, service_id, price, additional_details) VALUES($1, $2, $3, $4, $5) RETURNING booking_id`;
    const firstQueryResult = await querySync(firstQuery, [
      userData.email,
      providerprice.provider_id,
      payedService.combined_key,
      providerprice.price,
      payedService,
    ]);
    console.log("Partially out of the trenches");
    const transactionIDdummy = 466785328;
    const currTime = new Date().toISOString().slice(0, -5).replace("T", " ");
    console.log(currTime);
    const completed = "Completed";
    const paymentMethod = "Mpesa";
    const paymentType = "MobileBank";
    const secondQuery = `INSERT INTO Transactions (transaction_id,booking_id,amount,transaction_date,payment_status, payment_method,payment_type, transaction_details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const secondQueryResult = await querySync(secondQuery, [
      transactionIDdummy,
      firstQueryResult.rows[0].booking_id,
      providerprice.price,
      currTime,
      completed,
      paymentMethod,
      paymentType,
      payedService,
    ]);

    if (secondQueryResult.rows.length > 0) {
      await client.query("COMMIT");
      console.log("Booking Success");
      return


      

    }

  } catch (error) {
    console.error(error);
  }
};

app.post("/getallservices", async (req, res) => {
  const filler = [];
  try {
    const result = await pool.query(`SELECT combined_key, service_name  FROM Services`);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    res.status(500).json({error: error});
    console.error(error);
  }
});

const generateAccessToken = async () => {
  const consumerKey = "WLcZq5WC6TOtFQtJVBLIaWwVU9XfmYuVbkGrLRZFM1i66AVE";
  const consumerSecret = "XwbxokuJ5IAdSQMesFgbQyCHyIcGHKfNq3XNm3lZ8u6TTe5bdO1hODSzvIWEcbbl";
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};


const startServer = () => {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
