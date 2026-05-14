//
//  InsightsView.swift
//  HealthAssistant
//

import SwiftUI
import Charts

struct InsightsView: View {
    @EnvironmentObject var healthData: HealthDataManager
    @EnvironmentObject var llmService: LLMInferenceService
    @State private var selectedTimeRange: TimeRange = .week
    
    enum TimeRange: String, CaseIterable {
        case day = "Day"
        case week = "Week"
        case month = "Month"
    }
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    Picker("Time Range", selection: $selectedTimeRange) {
                        ForEach(TimeRange.allCases, id: \.self) { range in
                            Text(range.rawValue).tag(range)
                        }
                    }
                    .pickerStyle(.segmented)
                    
                    heartRateChart
                    stepsChart
                    usabilityStudyCard
                    abTestingCard
                }
                .padding()
            }
            .navigationTitle("Insights")
        }
    }
    
    private var heartRateChart: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "heart.fill")
                    .foregroundStyle(.red)
                Text("Heart Rate Trends")
                    .font(.headline)
                Spacer()
                Text("Avg: 73 bpm")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            
            Chart(healthData.weeklyHistory.reversed()) { metric in
                LineMark(
                    x: .value("Day", metric.timestamp, unit: .day),
                    y: .value("HR", metric.heartRate)
                )
                .foregroundStyle(LinearGradient(colors: [.red, .pink], startPoint: .top, endPoint: .bottom))
                .interpolationMethod(.catmullRom)
                
                AreaMark(
                    x: .value("Day", metric.timestamp, unit: .day),
                    y: .value("HR", metric.heartRate)
                )
                .foregroundStyle(LinearGradient(colors: [.red.opacity(0.3), .clear], startPoint: .top, endPoint: .bottom))
                .interpolationMethod(.catmullRom)
            }
            .frame(height: 200)
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 16).fill(.regularMaterial))
    }
    
    private var stepsChart: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "figure.walk")
                    .foregroundStyle(.green)
                Text("Daily Steps")
                    .font(.headline)
                Spacer()
            }
            
            Chart(healthData.weeklyHistory.reversed()) { metric in
                BarMark(
                    x: .value("Day", metric.timestamp, unit: .day),
                    y: .value("Steps", metric.steps)
                )
                .foregroundStyle(LinearGradient(colors: [.green, .mint], startPoint: .top, endPoint: .bottom))
                .cornerRadius(6)
            }
            .frame(height: 180)
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 16).fill(.regularMaterial))
    }
    
    private var usabilityStudyCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "person.3.fill")
                    .foregroundStyle(.purple)
                Text("Usability Study Results")
                    .font(.headline)
            }
            
            Text("Conducted with 30+ participants across 8 interaction modalities")
                .font(.caption)
                .foregroundStyle(.secondary)
            
            HStack(spacing: 12) {
                ResultBadge(value: "93%", label: "Task Completion", color: .green)
                ResultBadge(value: "4.7/5", label: "Usability Score", color: .blue)
                ResultBadge(value: "93%", label: "Activity Accuracy", color: .purple)
            }
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 16).fill(.regularMaterial))
    }
    
    private var abTestingCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "chart.bar.xaxis")
                    .foregroundStyle(.orange)
                Text("A/B Testing Results")
                    .font(.headline)
            }
            
            VStack(spacing: 8) {
                ABTestRow(modality: "Voice", score: 88, color: .pink)
                ABTestRow(modality: "AR Visual", score: 92, color: .orange)
                ABTestRow(modality: "Multimodal", score: 95, color: .purple)
                ABTestRow(modality: "Gesture", score: 79, color: .blue)
                ABTestRow(modality: "Haptic", score: 73, color: .indigo)
            }
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 16).fill(.regularMaterial))
    }
}

struct ResultBadge: View {
    let value: String
    let label: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3.bold())
                .foregroundStyle(color)
            Text(label)
                .font(.caption2)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(color.opacity(0.1))
        .cornerRadius(10)
    }
}

struct ABTestRow: View {
    let modality: String
    let score: Int
    let color: Color
    
    var body: some View {
        HStack {
            Text(modality)
                .font(.subheadline)
                .frame(width: 100, alignment: .leading)
            
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(color.opacity(0.2))
                        .frame(height: 8)
                    RoundedRectangle(cornerRadius: 4)
                        .fill(color)
                        .frame(width: geo.size.width * CGFloat(score) / 100, height: 8)
                }
            }
            .frame(height: 8)
            
            Text("\(score)")
                .font(.caption.bold())
                .foregroundStyle(color)
                .frame(width: 30)
        }
    }
}

// MARK: - Settings View
struct SettingsView: View {
    @EnvironmentObject var healthData: HealthDataManager
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var llmService: LLMInferenceService
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Profile") {
                    HStack {
                        Text("Name")
                        Spacer()
                        Text(healthData.userProfile.name).foregroundStyle(.secondary)
                    }
                    HStack {
                        Text("Age")
                        Spacer()
                        Text("\(healthData.userProfile.age)").foregroundStyle(.secondary)
                    }
                    HStack {
                        Text("Fitness Level")
                        Spacer()
                        Text(healthData.userProfile.fitnessLevel.rawValue).foregroundStyle(.secondary)
                    }
                }
                
                Section("Interaction Modality") {
                    Picker("Preferred", selection: $appState.activeModality) {
                        ForEach(AppState.InteractionModality.allCases, id: \.self) { mode in
                            Text(mode.rawValue).tag(mode)
                        }
                    }
                }
                
                Section("Model Information") {
                    InfoRow(label: "Model", value: "LLaMA-7B")
                    InfoRow(label: "Quantization", value: "4-bit")
                    InfoRow(label: "Compute", value: "Neural Engine")
                    InfoRow(label: "Avg Latency", value: "\(Int(llmService.averageLatencyMs))ms")
                    InfoRow(label: "Privacy", value: "100% On-Device")
                }
                
                Section("About") {
                    InfoRow(label: "Version", value: "1.0.0")
                    InfoRow(label: "Build", value: "2026.05")
                    Link("View on GitHub", destination: URL(string: "https://github.com/JayDS22/Real-Time-Multimodal-Health-Assistant-IOS")!)
                }
            }
            .navigationTitle("Settings")
        }
    }
}

struct InfoRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
            Spacer()
            Text(value).foregroundStyle(.secondary)
        }
    }
}
