//
//  HealthModels.swift
//  HealthAssistant
//

import Foundation
import CoreML

// MARK: - Health Metrics
struct HealthMetrics: Codable, Identifiable {
    let id: UUID
    let timestamp: Date
    var heartRate: Double
    var heartRateVariability: Double
    var bloodOxygen: Double
    var steps: Int
    var caloriesBurned: Double
    var activeMinutes: Int
    var respirationRate: Double
    var bodyTemperature: Double
    
    init(id: UUID = UUID(), timestamp: Date = Date(),
         heartRate: Double = 72, heartRateVariability: Double = 45,
         bloodOxygen: Double = 98, steps: Int = 0,
         caloriesBurned: Double = 0, activeMinutes: Int = 0,
         respirationRate: Double = 16, bodyTemperature: Double = 36.6) {
        self.id = id
        self.timestamp = timestamp
        self.heartRate = heartRate
        self.heartRateVariability = heartRateVariability
        self.bloodOxygen = bloodOxygen
        self.steps = steps
        self.caloriesBurned = caloriesBurned
        self.activeMinutes = activeMinutes
        self.respirationRate = respirationRate
        self.bodyTemperature = bodyTemperature
    }
}

// MARK: - Activity Recognition
enum ActivityType: String, Codable, CaseIterable {
    case stationary = "Stationary"
    case walking = "Walking"
    case running = "Running"
    case cycling = "Cycling"
    case yoga = "Yoga"
    case strengthTraining = "Strength Training"
    case stretching = "Stretching"
    case sleeping = "Sleeping"
    case unknown = "Unknown"
    
    var icon: String {
        switch self {
        case .stationary: return "figure.stand"
        case .walking: return "figure.walk"
        case .running: return "figure.run"
        case .cycling: return "figure.outdoor.cycle"
        case .yoga: return "figure.yoga"
        case .strengthTraining: return "figure.strengthtraining.traditional"
        case .stretching: return "figure.flexibility"
        case .sleeping: return "bed.double.fill"
        case .unknown: return "questionmark.circle"
        }
    }
}

struct ActivityPrediction: Codable, Identifiable {
    let id: UUID
    let activity: ActivityType
    let confidence: Double
    let timestamp: Date
    
    init(activity: ActivityType, confidence: Double) {
        self.id = UUID()
        self.activity = activity
        self.confidence = confidence
        self.timestamp = Date()
    }
}

// MARK: - Pose Estimation
struct PoseKeypoint: Codable {
    let name: String
    let x: Double
    let y: Double
    let z: Double
    let confidence: Double
}

struct PoseFrame: Codable, Identifiable {
    let id: UUID
    let timestamp: Date
    let keypoints: [PoseKeypoint]
    let frameNumber: Int
    
    init(keypoints: [PoseKeypoint], frameNumber: Int) {
        self.id = UUID()
        self.timestamp = Date()
        self.keypoints = keypoints
        self.frameNumber = frameNumber
    }
}

// MARK: - Exercise Analysis
struct ExerciseAnalysis: Codable {
    let exerciseType: String
    let repCount: Int
    let formScore: Double
    let cadence: Double
    let recommendations: [String]
    let timestamp: Date
}

// MARK: - LLM Inference
struct LLMResponse: Codable, Identifiable {
    let id: UUID
    let prompt: String
    let response: String
    let inferenceTimeMs: Double
    let tokensGenerated: Int
    let modelVersion: String
    let timestamp: Date
    
    init(prompt: String, response: String, inferenceTimeMs: Double,
         tokensGenerated: Int, modelVersion: String = "LLaMA-7B-4bit") {
        self.id = UUID()
        self.prompt = prompt
        self.response = response
        self.inferenceTimeMs = inferenceTimeMs
        self.tokensGenerated = tokensGenerated
        self.modelVersion = modelVersion
        self.timestamp = Date()
    }
}

// MARK: - Sensor Data
struct SensorReading: Codable {
    let accelerationX: Double
    let accelerationY: Double
    let accelerationZ: Double
    let rotationX: Double
    let rotationY: Double
    let rotationZ: Double
    let magneticX: Double
    let magneticY: Double
    let magneticZ: Double
    let timestamp: Date
}

// MARK: - User Profile
struct UserProfile: Codable {
    var name: String
    var age: Int
    var weightKg: Double
    var heightCm: Double
    var fitnessLevel: FitnessLevel
    var healthGoals: [HealthGoal]
    var preferredModality: String
    
    enum FitnessLevel: String, Codable, CaseIterable {
        case beginner = "Beginner"
        case intermediate = "Intermediate"
        case advanced = "Advanced"
        case athlete = "Athlete"
    }
    
    enum HealthGoal: String, Codable, CaseIterable {
        case weightLoss = "Weight Loss"
        case muscleGain = "Muscle Gain"
        case endurance = "Endurance"
        case flexibility = "Flexibility"
        case generalFitness = "General Fitness"
        case stressReduction = "Stress Reduction"
    }
}

// MARK: - Usability Study Metrics
struct UsabilityMetrics: Codable {
    let participantId: String
    let sessionDate: Date
    let taskCompletionRate: Double
    let timeOnTaskSeconds: Double
    let errorCount: Int
    let susScore: Double // System Usability Scale
    let satisfactionScore: Double
    let modality: String
}
