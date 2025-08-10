# Pokemon Management System

## 🚀 Tech Stack

### Frontend
- **Angular 20** - Modern web framework with standalone components
- **NgRx Signals** - State management with reactive programming
- **Ng-Zorro (Ant Design)** - UI component library
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **NestJS** - Progressive Node.js framework
- **Fastify** - Fast and low overhead web framework
- **PostgreSQL** - Relational database
- **MikroORM** - TypeScript ORM
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## 📋 Features Implemented

### ✅ Authentication System
- [x] User registration with email and password
- [x] User login with JWT token authentication
- [x] Protected routes with authentication guards
- [x] Token refresh mechanism
- [x] Logout functionality

### 🚧 Responsive Layout
- [ ] Header with navigation and user menu
- [ ] Responsive sidebar navigation
- [ ] Footer component
- [ ] Mobile-friendly design
- [ ] Dark/Light theme support

### 🚧 Home Page
- [ ] Pokemon carousel with YouTube video trailers
- [ ] Featured Pokemon section (10 Pokemon display)
- [ ] Grid layout (5 Pokemon per row on desktop)
- [ ] Responsive design for mobile devices

### ✅ Pokemon Management
- [x] **CSV Import Feature**
  - File upload with drag & drop support
  - CSV parsing and validation
  - Duplicate handling options
  - Import progress tracking
  - Error handling and reporting

- [x] **Advanced Search & Filtering**
  - Search by name with 300ms debounce
  - Filter by Pokemon type
  - Filter by legendary status
  - Speed range filtering
  - URL query parameter support

- [x] **Pagination System**
  - Default 20 Pokemon per page
  - Configurable page sizes (10, 20, 50, 100)
  - Navigation controls
  - Total count display

### 🚧 Pokemon Details
- [ ] Modal/Dialog view for detailed Pokemon information
- [ ] High-quality Pokemon images
- [ ] Comprehensive stats display
- [ ] Type information with visual indicators
- [ ] YouTube video integration

### 🚧 Favorite Pokemon System
- [ ] Heart icon for marking favorites
- [ ] Toggle favorite/unfavorite functionality
- [ ] User-specific favorite lists
- [ ] Favorite Pokemon page
- [ ] Visual indicators for favorited Pokemon

### ✅ Backend API Endpoints
- [x] `POST /auth/register` - User registration
- [x] `POST /auth/login` - User authentication
- [x] `POST /auth/logout` - User logout
- [x] `POST /pokemon/import/upload` - CSV file import
- [x] `POST /pokemon` - Get Pokemon list with filters
- [x] `GET /pokemon/:id` - Get Pokemon details
- [x] `POST /pokemon/:id/favorite` - Toggle favorite status
- [x] `GET /pokemon/favorites` - Get user's favorite Pokemon
- [x] `GET /pokemon/types` - Get all Pokemon types

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v24 or higher)
- PostgreSQL (v17 or higher)
- npm or yarn package manager

### Database Setup
1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE pokemon;
   ```

2. Update database configuration in `sever/src/configs/mikro-orm.config.ts`

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd sever
   ```

2. Create environment configuration file:
   ```bash
   cp ../.env.dev .env
   ```
   
   Or manually create `.env` file with the following content:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=password
   DB_DATABASE=pokemon_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-for-development
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-for-development
   JWT_REFRESH_EXPIRES_IN=7d
   JWT_SALT=10
   
   # Application Configuration
   APP_PORT=3000
   APP_HOST=localhost
   APP_ENV=development
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:4200
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run database migrations:
   ```bash
   npm run migration:up
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3000/api`

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start
   ```

   The frontend will be available at `http://localhost:4200`



## 📁 Project Structure

### Frontend Architecture
```
client/src/app/
├── auth/                 # Authentication module
│   ├── data-access/     # Auth state management
│   ├── feature/         # Auth components
│   └── utils/           # Auth utilities
├── pokemon/             # Pokemon module
│   ├── data-access/     # Pokemon state & API
│   ├── feature/         # Pokemon components
│   └── ui/              # Reusable UI components
├── shared/              # Shared utilities
├── core/                # Core services
└── shell/               # App shell & layout
```

### Backend Architecture
```
sever/src/
├── auth/                # Authentication module
├── pokemon/             # Pokemon management
├── user/                # User management
├── import/              # File import service
├── shared/              # Shared utilities
│   ├── entities/        # Database entities
│   ├── repositories/    # Data access layer
│   └── interceptors/    # HTTP interceptors
└── configs/             # Configuration files
```

## 🎯 Design Decisions

### Backend Architecture Decisions

#### Configuration Management
- **Local Configuration**: Used for configs that rarely change and require security (database credentials, JWT secrets)
- **Remote Configuration**: Used for frequently changing configs (feature flags, business rules)
- This separation enhances security and flexibility in configuration management

#### Database Design
- **Account Table**: Contains user login information
- **User Table**: Contains detailed user information
- This separated design allows easy expansion with multiple login methods (Google, Facebook, GitHub)
- **Pokemon Table**: Includes `import_file_id` to track import files, supporting rollback when import fails

#### Repository Pattern
- Currently using repository provided by MikroORM
- **Improvement Plan**: Write custom repository and Unit of Work pattern to reduce dependency on ORM library
- Increases flexibility and testability

#### CSV Import Enhancement
- **Current**: Synchronous import, users must wait
- **Improvement Plan**: 
  - Save file and create background job
  - Import in batches to optimize performance
  - Notify users when completed
  - Improve UX and handle large files better

### Frontend Architecture Decisions

#### Angular Signals + Zoneless
- **Why Signals**:
  - Faster than traditional change detection
  - Easier to understand and work with
  - Avoid complex errors like `ExpressionChangedAfterItHasBeenCheckedError`
  - Angular's signal support is becoming comprehensive

#### State Management with NgRx Signals
- **Why NgRx Signals**:
  - Uses functional programming paradigm
  - Extremely high reusability with `signalStoreFeature`
  - More readable and maintainable code
  - Great integration with Angular Signals

#### Configuration Strategy
- **Environment Config**: For configs requiring security and rarely changing
- **API Config**: Load from assets file for runtime-changeable configs
- **Remote Config**: Can be extended to load from API for dynamic configuration
- This approach balances security and flexibility
