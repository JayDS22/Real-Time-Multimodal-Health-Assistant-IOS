//
//  ContentView.swift
//  HealthAssistant
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        TabView(selection: $appState.currentTab) {
            DashboardView()
                .tabItem {
                    Label("Dashboard", systemImage: "heart.text.square.fill")
                }
                .tag(AppState.AppTab.dashboard)
            
            ARWorkoutView()
                .tabItem {
                    Label("AR Coach", systemImage: "figure.run.circle.fill")
                }
                .tag(AppState.AppTab.ar)
            
            VoiceAssistantView()
                .tabItem {
                    Label("Assistant", systemImage: "mic.circle.fill")
                }
                .tag(AppState.AppTab.voice)
            
            InsightsView()
                .tabItem {
                    Label("Insights", systemImage: "chart.line.uptrend.xyaxis.circle.fill")
                }
                .tag(AppState.AppTab.insights)
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape.fill")
                }
                .tag(AppState.AppTab.settings)
        }
        .accentColor(.purple)
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
        .environmentObject(HealthDataManager())
        .environmentObject(LLMInferenceService())
        .environmentObject(SensorFusionManager())
}
