# iOS — HealthAssistant

The native iOS application. Built with Swift 5.9, SwiftUI, and Apple's on-device ML stack.

## Requirements

- macOS 14 (Sonoma) or later
- Xcode 15.0+
- An iOS 17.0+ device (the simulator can't run ARKit body tracking or HealthKit reads)
- Apple Developer account for code signing

## Building

```bash
# From the repo root
cd iOS
open HealthAssistant.xcodeproj
```

In Xcode:

1. Select the **HealthAssistant** scheme.
2. Under **Signing & Capabilities**, pick your team.
3. Choose a connected iOS 17+ device as the run destination.
4. ⌘R to build and run.

Or via Swift Package Manager:

```bash
swift build
swift test
```

## First run

The app will request these permissions in order:

- **Camera** — for ARKit body tracking and pose overlays
- **Microphone** — for the voice assistant
- **Speech recognition** — on-device, never leaves the phone
- **Motion & fitness** — for the activity classifier (CoreMotion)
- **HealthKit (read/write)** — for vitals, workouts, sleep

All permission strings are in `HealthAssistant/Info.plist`. The app continues to function if the user denies any of them — those modalities are gracefully disabled.

## Running the tests

```bash
xcodebuild test \
  -scheme HealthAssistant \
  -destination 'platform=iOS Simulator,name=iPhone 15'
```

Eight test cases cover:
- `HealthMetrics` initialization
- Confusion-matrix diagonal-dominance
- LLM inference latency bound (< 200 ms)
- `PoseFrame` keypoint integrity
- `UserProfile` default goals
- Kalman filter convergence
- Usability metric range invariants
- Activity → SF Symbol mapping

## Source layout

```
HealthAssistant/
├── HealthAssistantApp.swift     # @main entry. Owns AppState.
├── ContentView.swift            # 5-tab root.
├── Info.plist                   # Privacy strings + ARKit requirement.
├── Models/
│   └── HealthModels.swift       # All value types: vitals, pose, activity, profile.
├── Views/
│   ├── DashboardView.swift      # Vitals grid + quick actions.
│   ├── ARWorkoutView.swift      # ARView + pose overlay + rep counter.
│   ├── VoiceAssistantView.swift # Chat interface backed by LLM service.
│   └── InsightsAndSettings.swift # Charts + A/B-test summary + settings.
├── ML/
│   ├── LLMInferenceService.swift     # Quantized LLaMA inference wrapper.
│   └── ActivityRecognitionService.swift # CoreMotion classifier.
├── AR/
│   └── ARPoseEstimationService.swift # ARKit / Vision body tracking.
├── Sensors/
│   └── SensorFusionManager.swift # Motion + pedometer + altimeter + Kalman HR.
├── Audio/
│   └── AudioService.swift       # SFSpeechRecognizer + AVSpeechSynthesizer.
└── Services/
    └── HealthDataManager.swift  # HealthKit authorization + queries.
```

## CoreML model

The `LLaMA7B-int4.mlpackage` file is **not included** in this repo — it's ~3.5 GB. The `LLMInferenceService` will fall back to simulated latency-matched responses when the model file is missing, so you can run the app end-to-end without it.

To produce the real model, see `docs/ARCHITECTURE.md` § Build-time pipeline.

## Troubleshooting

- **"ARKit body tracking is not supported on this device"** — body tracking requires an A12 Bionic or later. Most iPhones from 2018+ qualify; older iPads do not.
- **No vitals shown** — open the Health app and confirm there's data in the Heart Rate, Steps, and HRV categories. The Watch app populates these automatically.
- **Voice assistant is silent** — check Settings → Privacy → Speech Recognition. On-device recognition needs ~1 GB of free storage for the language model.
