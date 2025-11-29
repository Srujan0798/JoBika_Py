# 📱 JoBika Mobile App (React Native)

This directory contains the architecture and specifications for the JoBika mobile application.

## 🏗 Architecture

The app is built using **React Native** for cross-platform compatibility (iOS & Android).

### Core Features
1.  **Push Notifications**: Firebase Cloud Messaging (FCM) for job alerts.
2.  **Offline Mode**: Realm/WatermelonDB for local caching of jobs and applications.
3.  **Biometric Auth**: TouchID/FaceID for secure and quick access.
4.  **Camera Integration**: Scanning business cards and resumes.
5.  **Widgets**: Home screen widgets for quick job match views.
6.  **Voice Commands**: Hands-free navigation and interaction.

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "@react-native-firebase/app": "^18.0.0",
    "@react-native-firebase/messaging": "^18.0.0",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "realm": "^12.0.0",
    "react-native-biometrics": "^3.0.1",
    "react-native-vision-camera": "^3.0.0",
    "react-native-voice": "^3.2.4"
  }
}
```

## 🚀 Implementation Details

### Push Notifications
Using `@react-native-firebase/messaging`.
- **High Priority**: New Job Matches (Sound + Vibration)
- **Medium Priority**: Application Status Updates
- **High Priority**: Interview Scheduled

### Offline Support
Using `Realm` for local database.
- Schema: `Job`, `Application`
- Sync strategy: Queue actions (like applying) in `AsyncStorage` and sync when online.

### Biometric Auth
Using `react-native-biometrics`.
- Use case: Quick login, approving sensitive actions.

### Camera & AR
Using `react-native-vision-camera` and ML Kit.
- **Business Card Scanner**: Extract contact info via OCR.
- **Resume Scanner**: Capture and convert to PDF.

## 🛠 Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **iOS Setup**:
    ```bash
    cd ios && pod install
    ```

3.  **Run App**:
    ```bash
    npx react-native run-ios
    # or
    npx react-native run-android
    ```
