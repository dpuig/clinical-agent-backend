# Clinical Agent

A comprehensive clinical AI agent platform featuring a robust Go backend and a modern, visually stunning React Native (Expo) frontend.

## Architecture

### Backend (Go)
- **Framework**: Echo v4
- **Language**: Go 1.21+
- **Database**: PostgreSQL (via GORM/pgx)
- **Services**: Google Cloud Vertex AI, Speech-to-Text
- **Containerization**: Docker & Docker Compose

### Frontend (Expo)
- **Framework**: Expo Router (Stack Navigation)
- **UI/UX**: Custom "Magic Marble" Orb shader (Skia), Dark Mode support, Glassmorphism.
- **State Management**: React Context (`ctx.tsx`)
- **Key Features**:
  - Real-time Audio Visualization (Orb).
  - "Magic Spell" Shader with Caustics and Smoke.
  - Seamless "Listening" state transition.

## Getting Started

### Prerequisites
- **Go**: 1.21 or later
- **Node.js**: 18+ (LTS)
- **Docker**: Included for local DB/services
- **Expo Go App**: For testing on physical devices

### 1. Backend Setup

1. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your GCP credentials.
   ```bash
   cp .env.example .env
   ```
   Ensure you have a valid `service-account-key.json` in the root if using GCP Auth.

2. **Run the Server**:
   ```bash
   make run
   # OR
   go run cmd/server/main.go
   ```
   The backend runs on `http://localhost:8080`.

### 2. Frontend Setup

1. **Navigate to Expo directory**:
   ```bash
   cd expo
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the App**:
   ```bash
   npm start -- --clear
   ```
   - Press `i` to run on iOS Simulator.
   - Press `a` to run on Android Emulator.
   - Scan the QR code with **Expo Go** on your phone.

## UI/UX Features (Frontend)

The frontend features a highly polished **"Magic Orb"** interface:
- **Idle State**: A perfect glass marble with slow, organic internal movement.
- **Listening State**: Expands into a fluid, energetic shape with "smoke" and "caustic" effects.
- **Dark Mode**: Fully supported with Deep Space gradients and adaptive UI elements.

## Project Structure

- `/cmd`: Backend entry points.
- `/internal`: Core business logic and services.
- `/expo`: React Native/Expo frontend application.
- `/docs`: Documentation and architecture plans.
- `/deploy`: Deployment configurations (Terraform/Kubernetes/Cloud Run).
