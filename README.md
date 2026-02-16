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
- **Framework**: React Native with Expo Router (File-based routing)
- **Design System**: "Bio-Digital Slate" based on Material 3 Expressive.
- **Styling**: Custom Theme Context (`ctx.tsx`) with Dark/Light mode support.
- **Graphics**: `@shopify/react-native-skia` for high-performance 2D graphics (Waveforms).
- **Animations**: `react-native-reanimated` for fluid layout transitions and morphing effects.
- **Authentication**: Enterprise SSO Simulation via `AuthContext`.

### Key Features
- **Clinical Dashboard**: Responsive layout adapting to Smartphones (Vertical Stack) and Tablets (Split View).
- **Real-time Audio Visualizer**: Skia-based waveform that reacts to "Listening" state.
- **Morphing FAB**: Ambient Action Button that transitions between shapes (Pill/Circle) based on state.
- **Enterprise SSO**: Simulated secure login flow with route protection.
- **Adaptive Theming**: Manual toggle (Light/Dark/System) with a specialized Teal-based dark palette.

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

The frontend implements a **"Bio-Digital Slate"** aesthetic, merging clinical precision with organic fluidity:

- **Expressive Motion**: Layouts transition smoothly using `LinearTransition`. Elements enter/exit with fluid fades and springs.
- **Visual Feedback**:
  - **Idle**: Clean, minimalist dashboard focused on the patient context.
  - **Listening**: The interface transforms detailed views into a focused waveform visualization.
  - **Processing**: Visual indicators (Hourglass/Pulse) reassure the user of active computation.
- **Enterprise Ready**:
  - **Login**: Dedicated SSO screen with enterprise branding.
  - **Profile**: Modal-based settings for theme management and session control.

## Project Structure

- `/cmd`: Backend entry points.
- `/internal`: Core business logic and services.
- `/expo`: React Native/Expo frontend application.
- `/docs`: Documentation and architecture plans.
- `/deploy`: Deployment configurations (Terraform/Kubernetes/Cloud Run).
