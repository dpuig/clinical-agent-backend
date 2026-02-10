# Clinical Agent - Mobile Client UI/UX Specification

## 1. Design Philosophy
The Clinical Agent Mobile Client is designed as an **Invisible Interface** for medical professionals. It prioritizes:
-   **Clinical Professionalism**: Clean typography, high-contrast states, and medically relevant terminology.
-   **Hands-Free Workflow**: Voice-first interaction model centered around a "Listening Orb".
-   **Zero-Distraction**: Minimal UI clutter; information is presented only when necessary.
-   **Secure Environment**: Visual cues (e.g., "HIPAA Secure Environment") to reassure users of data privacy.

## 2. Design System
The visual language is built on **Material Design 3 (Material You)** principles, customized for a futuristic clinical aesthetic.

### 2.1 Color Palette: "Neural Violet"
A theme built to communicate intelligence, trust, and creativity.

| Role | Token Name | Light Mode (Hex) | Dark Mode (Hex) | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `primary` | `#6750A4` (Deep Violet) | `#D0BCFF` (Soft Lilac) | Key actions, FABs, Active States. |
| **On Primary** | `onPrimary` | `#FFFFFF` | `#381E72` | Text/Icons on Primary. |
| **Primary Container** | `primaryContainer` | `#EADDFF` (Lavender) | `#4F378B` (Deep Violet) | Lower-emphasis active states (e.g., chat bubbles). |
| **Secondary** | `secondary` | `#625B71` | `#CCC2DC` | Chips, filtering, secondary icons. |
| **Background** | `surface` | `#FFFBFE` (Clean White) | `#1C1B1F` (Deep Grey) | Main canvas. Avoid pure black in Dark Mode. |
| **Outline** | `outline` | `#79747E` | `#938F99` | Borders, dividers. |

### 2.2 Typography
-   **Font Family**: **Inter** (Google Fonts).
-   **Characteristics**: Clean, utilitarian, highly legible at small sizes.
-   **Weights**:
    -   **Display Medium (400)**: "Good Morning, Dr. Jay."
    -   **Label Medium (500)**: "HIPAA Secure Environment", Chip Labels.
    -   **Body Large (400)**: Transcript text.

### 2.3 Iconography
-   **Style**: Material Symbols Outlined interactions (24px default).
-   **Key Icons**:
    -   `medical_services_outlined` (Patient Intake)
    -   `note_alt_outlined` (SOAP Notes)
    -   `lock_outline` (Security Status)
    -   `mic` (Recording Status - typically animated or highlighted)

## 3. Core Components

### 3.1 The "Living" Orb (Agent State Visualization)
The central interface element is a **procedurally generated fluid sphere** (Signed Distance Field rendered via Shader). It represents the AI's attentiveness.

#### Visual States
1.  **Idle (Calm)**:
    -   **Shape**: Smooth sphere with gentle, low-frequency noise displacement.
    -   **Motion**: Slow rotation/undulation.
    -   **Color**: Adopts the **Primary** color of the current theme (Deep Violet in Light, Soft Lilac in Dark).
    -   **Physics**: Low Energy (`energy = 0.0`).
2.  **Listening (Active / Focused)**:
    -   **Shape**: Turbulent, high-frequency noise displacement (spikes/ripples).
    -   **Motion**: Fast, aggressive undulation.
    -   **Color**: **Soft Lilac (#D0BCFF)** (Forced Dark Mode usually applies here).
    -   **Physics**: High Energy (`energy = 1.0`).

#### Implementation Note (Shader Logic)
-   Use `simplex3d` noise for displacement.
-   `uTime`: Drives the animation.
-   `uEnergy`: Interpolates between Calm (0.0) and Turbulent (1.0).
-   `uBrightness`: Interpolates between Light Mode Color and Dark Mode Color.

### 3.2 Glass Card (Container)
Primary content (controls, status text) is housed in **Glassmorphic** containers to create depth without heaviness.

-   **Background**:
    -   **Light Mode**: White with ~60% opacity (`rgba(255, 255, 255, 0.6)`).
    -   **Dark Mode**: White with ~5% opacity (`rgba(255, 255, 255, 0.05)`).
-   **Blur**: `BackdropFilter` with `sigmaX=20, sigmaY=20` (Gaussian Blur).
-   **Border**: 1px solid stroke.
    -   **Light**: Grey at 20% opacity.
    -   **Dark**: White at 10-12% opacity.
-   **Shadow** (Light Mode Only): Soft drop shadow (`rgba(0,0,0,0.05)`, Y+4, Blur 10).

### 3.3 Suggestion Chips (Contextual Actions)
Rounded pills providing quick access to common clinical workflows.

-   **Shape**: Pill (Stadium Border), 30px radius.
-   **Content**: Icon (Left) + Label (Right).
-   **Style**:
    -   **Light Mode**: White Background, Black Text/Icon, Grey Border.
    -   **Dark Mode**: Glass background (White 5%), White Text/Icon, White 10% Border.

## 4. User Flows & Interaction Model

### 4.1 Initialization
-   **State**: "Connecting..."
-   **Visual**: Orb is small or loading.
-   **Action**: WebSocket connection established to backend.

### 4.2 Idle State (Ready)
-   **Greeting**: "Good Morning, Dr. [Name]."
-   **Security**: "HIPAA Secure Environment" badge visible.
-   **Orb**: Large, Calm, Center screen.
-   **Chips**: "Patient Intake", "SOAP Note", "Search Protocols" available at bottom.
-   **Theme**: Respects user preference (Light/Dark/System).

### 4.3 Listening State (Dictation)
-   **Trigger**: Mic Button Tap or Voice Activation (Wake Word).
-   **Transition**:
    -   **Theme**: **Forces Dark Mode** (Focus Mode) to reduce screen glare and highlight the Orb.
    -   **Orb**: Transitions to **High Energy** state.
-   **Feedback**: Text updates to "Listening to clinical dictation..."
-   **Termination**: Silence detection or Stop Button -> Returns to Idle (Processing).

### 4.4 Theme Toggling
-   **Manual**: User can cycle themes via a dedicated button in the header.
-   **Automatic**:
    -   **Listening**: Overrides to Dark Mode.
    -   **Idle**: Returns to User Preference.
