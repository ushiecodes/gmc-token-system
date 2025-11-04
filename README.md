# टोकन - digital token and queue management system

## Overview
"टोकन" is a digital token and queue management system designed specifically for Outpatient Departments (OPDs) in government hospitals. The primary goal of this project is to modernize and streamline the patient flow process, replacing traditional manual token systems with an efficient digital solution. This system aims to reduce waiting times, improve patient experience, and enhance the overall operational efficiency of OPDs.

## Features
- **Digital Token Generation:** Patients can obtain digital tokens, eliminating the need for physical tokens.
- **Patient Interface:** Facilitates smooth communication and patient calling for doctors.
- **Admin Dashboard:** Provides an overview and control over the system for administrators.
- **Counter Console:** Manages token distribution and patient check-in at various counters.
- **Real-time Updates:** Patients can view their queue status and estimated waiting times.
- **Queue Management:** Real-time tracking and management of patient queues.

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Real-time Communication & Authentication:** Firebase
- **TypeScript:** For type safety and better developer experience

## Installation

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/ushiecodes/gmc-token-system.git

# Navigate to the project directory
cd gmc-token-system

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Alternative Installation Methods
- **Docker:** You can use Docker to run the application in a containerized environment. Check the [Dockerfile](Dockerfile) for instructions.
- **Yarn:** If you prefer using Yarn, you can install dependencies with `yarn install`.

## Usage

### Basic Usage
```typescript
// Example of generating a token
const token = await firebaseService.generateToken("casePaperId", "General Medicine", TokenCategory.General);
console.log(token);
```

### Advanced Usage
- **Admin Dashboard:** Access the admin dashboard to view and manage tokens.
- **Counter Console:** Manage token distribution and patient check-in at various counters.
- **Patient Portal:** Generate tokens for patients and view their queue status.

## Project Structure
```
gmc-token-system/
├── .gitignore
├── index.html
├── package.json
├── README.md
├── eslint.config.js
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── src/
│   ├── index.css
│   ├── App.tsx
│   ├── components/
│   │   ├── AuthGuard.tsx
│   │   ├── Layout.tsx
│   │   ├── Spinner.tsx
│   │   ├── StatCard.tsx
│   ├── constants.ts
│   ├── hooks/
│   │   ├── useAuth.tsx
│   ├── main.tsx
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   ├── CounterConsole.tsx
│   │   ├── Login.tsx
│   │   ├── PatientPortal.tsx
│   ├── services/
│   │   ├── firebaseService.ts
│   ├── types.ts
```

## Configuration
- **Environment Variables:** Create a `.env.local` file in the root directory with the following content:
  ```
  VITE_FIREBASE_API_KEY=your_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
  ```

## Contributing
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

## Authors & Contributors
- **Utkarsh Kamat** - Initial work - [@ushiecodes](https://github.com/ushiecodes)

## Issues & Support
- Report issues on the [GitHub Issues page](https://github.com/ushiecodes/gmc-token-system/issues).
- For support, please contact [Utkarsh Kamat](mailto:work.utkarshkamat@gmail.com).

## Roadmap
- **Planned Features:**
  - Implement real-time updates for patients.
  - Enhance queue management with real-time tracking.
  - Improve user interface and experience.

- **Future Improvements:**
  - Integrate with hospital management systems.
  - Add support for multiple languages.

---

**Badges:**
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributors](https://img.shields.io/github/contributors/ushiecodes/gmc-token-system)](https://github.com/ushiecodes/gmc-token-system/graphs/contributors)

---

**Note:** Ensure you have the necessary Firebase configuration in your `.env.local` file before running the application.