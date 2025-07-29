# Birth Record Management System 🏥

A secure web application designed for hospitals to manage childbirth records with comprehensive role-based access control, authentication, and data security features.

## 🌟 Features

### Security-First Design
- **Role-Based Access Control (RBAC)**: Separate portals for nurses (admin) and visitors (patients)
- **Session Management**: Secure user sessions with UUID-based session IDs
- **Password Hashing**: BCrypt implementation for secure password storage
- **Input Validation**: Server-side validation to prevent malicious input
- **Route Protection**: Authenticated and authorized access to protected routes
- **CSRF Protection**: Cross-site request forgery prevention mechanisms

### Core Functionality
- **User Management**: Registration, login, and user profile management
- **Birth Record CRUD**: Create, read, update, and delete birth records
- **Patient Portal**: Secure access for patients to view their birth records
- **Nurse Dashboard**: Administrative interface for managing all patient records
- **Real-time Updates**: Dynamic content loading and form submissions

## 🛠️ Technology Stack

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MySQL**: Relational database for data persistence
- **BCrypt**: Password hashing library
- **Express-Session**: Session middleware for authentication
- **UUID**: Unique identifier generation for sessions

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Responsive styling with Google Fonts integration
- **Vanilla JavaScript**: Client-side interactivity and API communication
- **Firebase**: Additional authentication and real-time features

## 📁 Project Structure

```
birth-record-system/
├── api/
│   ├── controllers/
│   │   ├── UserController.mjs
│   │   └── RecordController.mjs
│   ├── database.mjs
│   └── util.mjs
├── public/
│   ├── css/
│   └── js/
├── app.js              # Main server file
├── index.html          # Login page
├── register.html       # User registration
├── nurse.html          # Nurse dashboard
├── visitor.html        # Patient portal
├── edit.html          # Record editing interface
└── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/birth-record-system.git
   cd birth-record-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database
   - Update database connection settings in `api/database.mjs`
   - The application will automatically create necessary tables on first run

4. **Environment Configuration**
   - Create environment configuration in `api/util.mjs`
   - Set session secret and database credentials

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 👥 User Roles & Access Control

### Nurse (Administrator)
- **Access**: Full administrative privileges
- **Capabilities**:
  - View all patient records in tabular format
  - Add new patients to the system
  - Edit existing patient birth records
  - Delete patient records
  - Access patient management dashboard

**Route**: `/nurse/:username`

### Visitor (Patient)
- **Access**: Limited to personal records only
- **Capabilities**:
  - View personal birth record information
  - Read-only access to their data

**Route**: `/visitor/:username`

## 🔐 Security Implementation

### Authentication Flow
1. User registers with email, username, and password
2. Password is hashed using BCrypt before storage
3. Login validates credentials against hashed passwords
4. Successful login creates secure session with UUID
5. Session validates user access to protected routes

### Authorization Mechanism
- **Session-based**: User role and identity stored in server sessions
- **Route Protection**: Middleware validates user role before granting access
- **Username Verification**: Users can only access their own profiles
- **Role Validation**: Nurses cannot access visitor routes and vice versa

### Data Security
- **Password Hashing**: BCrypt with salt rounds for secure password storage
- **Session Security**: HTTP-only cookies with expiration
- **Input Sanitization**: Server-side validation prevents injection attacks
- **SQL Injection Prevention**: Parameterized queries for database operations

## 🔄 API Endpoints

### User Management
```
POST /api/users/register     # User registration
POST /api/users/login        # User authentication
GET  /api/users/             # Get all users (admin only)
GET  /api/users/visitors     # Get all patients
DELETE /api/users/           # Delete user account
GET  /api/users/find/:id     # Find specific user
GET  /api/users/find         # Get current user details
```

### Record Management
```
PUT /api/records/update/:id  # Update birth record
```

## 🎯 Usage Examples

### Patient Registration
1. Navigate to `/register`
2. Fill in username, email, and password
3. System creates account with "visitor" role by default
4. Automatic redirection based on user role

### Nurse Dashboard Access
1. Login with nurse credentials
2. Access `/nurse/:username` route
3. View patient list in tabular format
4. Click "Edit" to modify patient records
5. Use "Delete" to remove patient records

### Record Management
1. Nurses can edit patient records via `/visitor/:id/edit`
2. Form pre-populates with existing data
3. Update first name, last name, and date of birth
4. Changes saved to database with validation

## 🛡️ Security Considerations

This application was initially developed as an **intentionally insecure prototype** and then progressively hardened with security features to demonstrate:

- **Secure coding practices**
- **Authentication implementation**
- **Authorization mechanisms**
- **Input validation techniques**
- **Session management**
- **Password security**

## 🔧 Development & Testing

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run in production mode
npm start
```

### Testing Authentication
1. Register multiple users with different roles
2. Test cross-role access attempts (should be blocked)
3. Verify session persistence across browser sessions
4. Test logout and re-authentication flows

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for troubleshooting

## 🏆 Learning Outcomes

This project demonstrates:
- **Full-stack web development** with Node.js and Express
- **Security-by-design** principles and implementation
- **Role-based access control** systems
- **Database design** and MySQL integration
- **Session management** and authentication flows
- **Progressive security hardening** methodologies

---

**Note**: This application was developed for educational purposes to demonstrate secure web application development practices and should be thoroughly tested before any production use.
