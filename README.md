Here's a README file for your project that summarizes the server endpoints, input validation, error handling, technologies used, and instructions on how to use the API.

---

# Fitness Management API

This is a RESTful API designed for managing clients and coaches in a fitness application. It includes functionalities for client management, scheduling email notifications, filtering clients, and providing an admin dashboard with insights.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for building APIs.
- **Mongoose**: ODM for MongoDB to interact with the database.
- **Zod**: For input validation of request bodies and parameters.
- **Nodemailer**: For sending emails.
- **Node-Cron**: For scheduling tasks, such as sending emails.
- **JWT (JSON Web Tokens)**: For authentication (not implemented yet but can be added for production).

## Endpoints

### 1. Create Client

**POST** `/:coachid/client`

- **Request Body**:
    - `name`: String, minimum length 2.
    - `email`: String, valid email format ending with `@gmail.com`.
    - `phone`: String, length of 10 digits.
    - `age`: Number, between 18 and 30.
    - `goal`: String.

- **Response**:
    - `200`: Client created successfully.
    - `411`: Error in input validation or internal server error.

### 2. Update Client Progress

**PATCH** `/:id/progress`

- **Request Body**:
    - `progressNotes`: String, maximum length 255.
    - `lastUpdated`: String, must be a valid date.
    - `weight`: Number, between 50 and 100.
    - `bmi`: Number, between 18 and 31.

- **Response**:
    - `200`: Update successful.
    - `411`: Error in input validation or client not found.

### 3. Delete Client

**DELETE** `/:id/delete`

- **Request Parameters**:
    - `id`: String, 24 characters (MongoDB ObjectId).

- **Response**:
    - `200`: Deletion completed.
    - `411`: Admin not found or client ID not valid.

### 4. Schedule Email

**POST** `/:id/schedule`

- **Request Body**:
    - `mail`: String, valid email format.
    - `sub`: String, subject with maximum length 100.
    - `msg`: String, message body.
    - `day`: Number, between 1 and 31.
    - `month`: Number, between 1 and 12.
    - `year`: Number, current year or future.

- **Response**:
    - `200`: Cron job scheduled to send mail.
    - `400`: Input validation error.

### 5. Filter Clients

**GET** `/:coachid/filter`

- **Query Parameters**:
    - `filter`: String, name filter for clients.

- **Response**:
    - `200`: List of clients matching the filter.
    - `411`: Invalid coach ID.

### 6. Admin Dashboard

**GET** `/admin/dashboard`

- **Request Headers**:
    - `email`: Admin email.
    - `password`: Admin password.

- **Response**:
    - `200`: Dashboard statistics including the number of clients, coaches, and progress updates.
    - `411`: Invalid admin credentials.

## Error Handling

All endpoints include proper error handling with appropriate HTTP status codes and error messages. Input validation is enforced using Zod schemas to ensure data integrity.

## How to Use

1. **Setup**: Clone this repository and install dependencies.
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   npm install
   ```

2. **Start the Server**: 
   ```bash
   npm start
   ```

3. **Testing the Endpoints**:
   - Use Postman or curl to test the API endpoints.
   - Ensure to set the appropriate headers (e.g., email and password for admin-related endpoints).

4. **Example Requests**:
   - **Create Client**:
     ```json
     POST /:coachid/client
     {
         "name": "John Doe",
         "email": "johndoe@gmail.com",
         "phone": "1234567890",
         "age": 25,
         "goal": "Weight Loss"
     }
     ```

   - **Schedule Email**:
     ```json
     POST /:id/schedule
     {
         "mail": "recipient@example.com",
         "sub": "Your Weekly Update",
         "msg": "Hello, here is your weekly progress.",
         "day": 4,
         "month": 11,
         "year": 2024
     }
     ```

## Conclusion

This API is designed to facilitate the management of fitness clients and coaches effectively. The included features, input validation, and error handling make it robust for future enhancements, including JWT authentication for securing endpoints.

--- 

This README should provide a comprehensive guide for anyone looking to understand and use your API. Adjust any parts according to your specific implementation details or preferences.
