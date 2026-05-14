//
//  HealthAssistantTests.swift
//  HealthAssistantTests
//

import XCTest
@testable import HealthAssistant

final class HealthAssistantTests: XCTestCase {
    
    func testHealthMetricsInitialization() {
        let metrics = HealthMetrics(
            heartRate: 75,
            heartRateVariability: 50,
            bloodOxygen: 98,
            steps: 5000,
            caloriesBurned: 250,
            activeMinutes: 30,
            respirationRate: 16,
            bodyTemperature: 36.6
        )
        
        XCTAssertEqual(metrics.heartRate, 75)
        XCTAssertEqual(metrics.steps, 5000)
        XCTAssertEqual(metrics.bloodOxygen, 98)
    }
    
    func testActivityRecognitionConfusionMatrix() {
        let service = ActivityRecognitionService()
        // Diagonal should be highest (true positives)
        for i in 0..<service.confusionMatrix.count {
            let row = service.confusionMatrix[i]
            let diagonalValue = row[i]
            let maxValue = row.max() ?? 0
            XCTAssertEqual(diagonalValue, maxValue, "Diagonal should be max for row \(i)")
            XCTAssertGreaterThan(diagonalValue, 0.85, "Accuracy should be >85% for \(ActivityType.allCases[i])")
        }
    }
    
    @MainActor
    func testLLMInferenceLatency() async {
        let service = LLMInferenceService()
        service.loadQuantizedLLaMAModel()
        try? await Task.sleep(nanoseconds: 2_000_000_000)
        
        let response = await service.generateResponse(prompt: "What is good squat form?")
        
        XCTAssertLessThan(response.inferenceTimeMs, 200, "Latency should be <200ms")
        XCTAssertFalse(response.response.isEmpty)
        XCTAssertEqual(response.modelVersion, "LLaMA-7B-4bit-quantized")
    }
    
    func testPoseFrameKeypoints() {
        let keypoints = [
            PoseKeypoint(name: "nose", x: 0.5, y: 0.1, z: 0, confidence: 0.95),
            PoseKeypoint(name: "left_shoulder", x: 0.4, y: 0.25, z: 0, confidence: 0.93)
        ]
        let frame = PoseFrame(keypoints: keypoints, frameNumber: 1)
        
        XCTAssertEqual(frame.keypoints.count, 2)
        XCTAssertEqual(frame.frameNumber, 1)
        XCTAssertEqual(frame.keypoints.first?.name, "nose")
    }
    
    func testUserProfileGoals() {
        let profile = UserProfile(
            name: "Test",
            age: 30,
            weightKg: 70,
            heightCm: 175,
            fitnessLevel: .intermediate,
            healthGoals: [.weightLoss, .endurance],
            preferredModality: "Voice"
        )
        
        XCTAssertEqual(profile.healthGoals.count, 2)
        XCTAssertTrue(profile.healthGoals.contains(.weightLoss))
        XCTAssertEqual(profile.fitnessLevel, .intermediate)
    }
    
    @MainActor
    func testSensorFusionKalmanFilter() {
        let manager = SensorFusionManager()
        manager.startSensorFusion()
        
        // Initial value should be reasonable
        XCTAssertGreaterThan(manager.fusedMetrics.heartRate, 0)
        XCTAssertLessThan(manager.fusedMetrics.heartRate, 200)
        
        manager.stopSensorFusion()
    }
    
    func testUsabilityMetrics() {
        let metric = UsabilityMetrics(
            participantId: "P001",
            sessionDate: Date(),
            taskCompletionRate: 0.93,
            timeOnTaskSeconds: 45.2,
            errorCount: 2,
            susScore: 87.5,
            satisfactionScore: 4.7,
            modality: "Multimodal"
        )
        
        XCTAssertEqual(metric.taskCompletionRate, 0.93)
        XCTAssertEqual(metric.satisfactionScore, 4.7)
        XCTAssertGreaterThan(metric.susScore, 80) // SUS score above 80 = excellent
    }
    
    func testActivityTypeIcons() {
        for activity in ActivityType.allCases {
            XCTAssertFalse(activity.icon.isEmpty, "\(activity.rawValue) should have an icon")
        }
    }
}
