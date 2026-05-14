//
//  HealthAssistantApp.swift
//  HealthAssistant
//
//  Real-Time Multimodal Health Assistant
//  Created by Jay Guwalani
//

import SwiftUI

@main
struct HealthAssistantApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var healthDataManager = HealthDataManager()
    @StateObject private var llmService = LLMInferenceService()
    @StateObject private var sensorFusion = SensorFusionManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(healthDataManager)
                .environmentObject(llmService)
                .environmentObject(sensorFusion)
                .preferredColorScheme(appState.preferredColorScheme)
                .onAppear {
                    setupApplication()
                }
        }
    }
    
    private func setupApplication() {
        // Initialize CoreML models
        llmService.loadQuantizedLLaMAModel()
        
        // Start sensor fusion
        sensorFusion.startSensorFusion()
        
        // Request health permissions
        healthDataManager.requestAuthorization()
    }
}

class AppState: ObservableObject {
    @Published var preferredColorScheme: ColorScheme? = nil
    @Published var currentTab: AppTab = .dashboard
    @Published var isOnboardingComplete: Bool = false
    @Published var activeModality: InteractionModality = .multimodal
    
    enum AppTab {
        case dashboard, ar, voice, insights, settings
    }
    
    enum InteractionModality: String, CaseIterable {
        case voice = "Voice"
        case visual = "Visual"
        case gesture = "Gesture"
        case ar = "AR"
        case haptic = "Haptic"
        case text = "Text"
        case multimodal = "Multimodal"
        case sensorOnly = "Sensor Only"
    }
}
