//
//  HealthDataManager.swift
//  HealthAssistant
//

import Foundation
import HealthKit
import Combine

@MainActor
class HealthDataManager: ObservableObject {
    @Published var isAuthorized: Bool = false
    @Published var dailyMetrics: HealthMetrics = HealthMetrics()
    @Published var weeklyHistory: [HealthMetrics] = []
    @Published var userProfile: UserProfile = UserProfile(
        name: "User",
        age: 28,
        weightKg: 70,
        heightCm: 175,
        fitnessLevel: .intermediate,
        healthGoals: [.generalFitness, .endurance],
        preferredModality: "Multimodal"
    )
    
    private let healthStore = HKHealthStore()
    
    func requestAuthorization() {
        guard HKHealthStore.isHealthDataAvailable() else {
            print("[HealthData] HealthKit not available")
            generateMockData()
            return
        }
        
        let typesToRead: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN)!,
            HKObjectType.quantityType(forIdentifier: .oxygenSaturation)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.quantityType(forIdentifier: .respiratoryRate)!,
            HKObjectType.quantityType(forIdentifier: .bodyTemperature)!,
        ]
        
        healthStore.requestAuthorization(toShare: nil, read: typesToRead) { [weak self] success, error in
            Task { @MainActor in
                self?.isAuthorized = success
                if success {
                    print("[HealthData] Authorization granted")
                    self?.fetchTodaysData()
                } else {
                    print("[HealthData] Authorization denied: \(error?.localizedDescription ?? "")")
                    self?.generateMockData()
                }
            }
        }
    }
    
    private func fetchTodaysData() {
        // In production, fetch real data from HealthKit
        generateMockData()
    }
    
    private func generateMockData() {
        dailyMetrics = HealthMetrics(
            heartRate: 72,
            heartRateVariability: 45,
            bloodOxygen: 98,
            steps: 8542,
            caloriesBurned: 2340,
            activeMinutes: 47,
            respirationRate: 16,
            bodyTemperature: 36.7
        )
        
        weeklyHistory = (0..<7).map { dayOffset in
            HealthMetrics(
                timestamp: Calendar.current.date(byAdding: .day, value: -dayOffset, to: Date()) ?? Date(),
                heartRate: Double.random(in: 65...85),
                heartRateVariability: Double.random(in: 35...60),
                bloodOxygen: Double.random(in: 96...99),
                steps: Int.random(in: 6000...12000),
                caloriesBurned: Double.random(in: 1800...2800),
                activeMinutes: Int.random(in: 30...90),
                respirationRate: Double.random(in: 14...18),
                bodyTemperature: Double.random(in: 36.4...37.0)
            )
        }
    }
}
