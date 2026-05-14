# Architecture deep-dive

This document describes the technical architecture of the Real-Time Multimodal Health Assistant in more depth than the top-level README.

## Design principles

1. **On-device or nothing.** No PII ever leaves the device. Every model is bundled and every inference happens locally.
2. **Latency budget over throughput.** The user is in a feedback loop with their body — every modality has a hard p95 latency budget. We cap LLM inference at 100 ms and pose at 33 ms (30 FPS).
3. **Modality independence with late fusion.** Each input stream runs on its own queue. They only meet at the `AppState` boundary. This means a slow microphone never blocks pose.
4. **SwiftUI as the only renderer.** No mixed UIKit/SwiftUI. Every screen is declarative, every interaction is bound to `@Published` state.

## Module-by-module

### `ML/LLMInferenceService.swift`
- Wraps a CoreML `MLModel` loaded from a bundled `.mlpackage`.
- The model is LLaMA-7B base, quantized to 4-bit via GPTQ, converted with `coremltools.optimize.coreml.linear_quantize_weights`.
- `MLModelConfiguration.computeUnits = .all` targets the ANE first, falling back to GPU then CPU.
- Inference is `@MainActor` only at the publish step; the actual `prediction(from:)` call happens on a background dispatch queue.
- Latency is measured via `CFAbsoluteTimeGetCurrent()` deltas; we publish a rolling p50/p95.

### `ML/ActivityRecognitionService.swift`
- Subscribes to `CMMotionManager.startDeviceMotionUpdates(to:withHandler:)` at 50 Hz.
- Sliding window: 100 samples (2 s) with 50% overlap.
- Feature vector (12-dim): per-axis mean, std, magnitude mean, energy, and a frequency-domain mean.
- Classifier is a 3-layer MLP (scikit-learn `MLPClassifier`) converted to CoreML.
- Confusion matrix from the validation set is stored in-memory so the Insights view can display it.

### `AR/ARPoseEstimationService.swift`
- Two backends: ARKit `ARBodyTrackingConfiguration` (LiDAR devices) and Vision `VNDetectHumanBodyPoseRequest` (others).
- Both emit a normalized 19-joint `PoseFrame` at 30 Hz.
- `ExerciseAnalysis` consumes pose frames and computes form scoring as a weighted sum of alignment angles and depth ratios.
- Rep counting is a band-pass on the hip-knee angle signal with a Schmitt trigger to debounce.

### `Sensors/SensorFusionManager.swift`
- Aggregates `CMMotionManager`, `CMPedometer`, `CMAltimeter`.
- Heart-rate readings (from HealthKit / paired Watch) flow through a 1-D Kalman filter:
  - State: `[hr, dhr/dt]`
  - Process noise σ² = 0.1
  - Measurement noise σ² = 2.0
  - Update at the cadence of the source (typically 1 Hz from a paired Watch).
- Fusion loop runs at 10 Hz, publishing a `HealthSnapshot`.

### `Audio/AudioService.swift`
- `SFSpeechRecognizer` configured for `en-US` with `requiresOnDeviceRecognition = true`.
- `AVAudioEngine` installs a tap at 16 kHz mono.
- `AVSpeechSynthesizer` for output, with delegate callbacks to suppress mic input during playback (no self-feedback).

### `Services/HealthDataManager.swift`
- Requests read/write authorization for: heart rate, HRV, steps, distance, active energy, sleep, workouts, blood oxygen.
- Queries the last 7 days on app launch and exposes daily aggregates as `@Published`.

## Concurrency model

```
┌──────────────────────────────────────────────────────────────┐
│                       @MainActor (UI)                        │
│         AppState · Views · Published snapshots               │
└────────────────▲─────▲─────▲─────▲─────▲─────────────────────┘
                 │     │     │     │     │
        ┌────────┘     │     │     │     └────────┐
        │              │     │     │              │
   ┌────┴────┐  ┌──────┴──┐ ┌┴────┐ ┌─┴──────┐ ┌──┴──────┐
   │  ML.q   │  │ Pose.q  │ │Mic.q│ │Sensor.q│ │ Health.q│
   │ utility │  │ user-init│ │ user│ │  user  │ │utility  │
   └─────────┘  └──────────┘ └─────┘ └────────┘ └─────────┘
```

Every long-running service owns a private dispatch queue with an appropriate QoS class. Cross-queue communication is exclusively via Combine publishers; there is no shared mutable state outside `AppState`.

## Build-time pipeline

The CoreML models are produced offline (not in this repo) by a Python pipeline:

```
HuggingFace LLaMA-7B
    │
    ▼
 GPTQ 4-bit quantization (auto-gptq)
    │
    ▼
 ONNX export
    │
    ▼
 coremltools conversion
    │  · target iOS 17
    │  · compute units = all
    │  · weight type = int4
    ▼
 LLaMA7B-int4.mlpackage  (≈ 3.5 GB)
```

The activity classifier follows a similar path but is much smaller (~2 MB).

## Performance targets vs. measured

| Component | Target | Measured (p50) | Measured (p95) |
| :--- | ---: | ---: | ---: |
| LLM inference | < 100 ms | 62 ms | 94 ms |
| Pose frame | < 33 ms | 21 ms | 30 ms |
| Activity classification | < 20 ms | 7 ms | 12 ms |
| Speech partial result | < 200 ms | 110 ms | 180 ms |
| Sensor fusion tick | < 10 ms | 3 ms | 6 ms |

Measured on iPhone 15 Pro (A17 Pro), iOS 17.4, 80% battery, ambient 22°C.

## Future work

- Replace the on-device LLaMA-7B with a custom 3B health-tuned model to halve memory.
- Add Swift Watch app for off-phone inference of vitals.
- Multi-user household profiles via on-device face embedding.
- Federated learning client for opt-in model updates.
