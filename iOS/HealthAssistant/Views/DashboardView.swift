//
//  DashboardView.swift
//  HealthAssistant
//

import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var healthData: HealthDataManager
    @EnvironmentObject var sensorFusion: SensorFusionManager
    @EnvironmentObject var llmService: LLMInferenceService
    @StateObject private var activityService = ActivityRecognitionService()
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    headerSection
                    vitalsGrid
                    activityCard
                    quickActionsSection
                    modelPerformanceCard
                }
                .padding()
            }
            .navigationTitle("Health Assistant")
            .background(
                LinearGradient(
                    colors: [Color.purple.opacity(0.1), Color.blue.opacity(0.05)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
            )
            .onAppear {
                activityService.startActivityRecognition()
            }
        }
    }
    
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading) {
                    Text("Welcome back,")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    Text(healthData.userProfile.name)
                        .font(.title.bold())
                }
                Spacer()
                Circle()
                    .fill(sensorFusion.isStreaming ? Color.green : Color.gray)
                    .frame(width: 12, height: 12)
                    .overlay(
                        Circle()
                            .stroke(sensorFusion.isStreaming ? Color.green : Color.gray, lineWidth: 2)
                            .scaleEffect(sensorFusion.isStreaming ? 1.5 : 1.0)
                            .opacity(sensorFusion.isStreaming ? 0 : 1)
                            .animation(.easeOut(duration: 1.0).repeatForever(autoreverses: false), value: sensorFusion.isStreaming)
                    )
            }
        }
    }
    
    private var vitalsGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            VitalCard(
                title: "Heart Rate",
                value: "\(Int(sensorFusion.fusedMetrics.heartRate))",
                unit: "bpm",
                icon: "heart.fill",
                color: .red
            )
            VitalCard(
                title: "Blood Oxygen",
                value: String(format: "%.0f", sensorFusion.fusedMetrics.bloodOxygen),
                unit: "%",
                icon: "lungs.fill",
                color: .blue
            )
            VitalCard(
                title: "HRV",
                value: "\(Int(sensorFusion.fusedMetrics.heartRateVariability))",
                unit: "ms",
                icon: "waveform.path.ecg",
                color: .purple
            )
            VitalCard(
                title: "Steps",
                value: "\(healthData.dailyMetrics.steps)",
                unit: "today",
                icon: "figure.walk",
                color: .green
            )
        }
    }
    
    private var activityCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: activityService.currentActivity.activity.icon)
                    .font(.title)
                    .foregroundStyle(.purple)
                VStack(alignment: .leading) {
                    Text("Current Activity")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text(activityService.currentActivity.activity.rawValue)
                        .font(.title2.bold())
                }
                Spacer()
                VStack(alignment: .trailing) {
                    Text("\(Int(activityService.currentActivity.confidence * 100))%")
                        .font(.title3.bold())
                        .foregroundStyle(.green)
                    Text("confidence")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            
            ProgressView(value: activityService.currentActivity.confidence)
                .tint(.purple)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(.regularMaterial)
        )
    }
    
    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Actions")
                .font(.headline)
            
            HStack(spacing: 12) {
                QuickActionButton(title: "AR Coach", icon: "figure.run.circle.fill", color: .orange)
                QuickActionButton(title: "Voice", icon: "mic.fill", color: .pink)
                QuickActionButton(title: "Analyze", icon: "brain.head.profile", color: .indigo)
            }
        }
    }
    
    private var modelPerformanceCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: "cpu.fill")
                    .foregroundStyle(.cyan)
                Text("On-Device Model Performance")
                    .font(.headline)
                Spacer()
            }
            
            HStack {
                MetricBadge(label: "Latency", value: "\(Int(llmService.lastInferenceTime))ms", color: .green)
                MetricBadge(label: "Accuracy", value: "93%", color: .blue)
                MetricBadge(label: "FPS", value: "30", color: .orange)
            }
            
            Text("LLaMA-7B 4-bit quantized • Zero-cloud processing")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(.regularMaterial)
        )
    }
}

struct VitalCard: View {
    let title: String
    let value: String
    let unit: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundStyle(color)
                Text(title)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Spacer()
            }
            HStack(alignment: .lastTextBaseline, spacing: 4) {
                Text(value)
                    .font(.title.bold())
                Text(unit)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(.regularMaterial)
        )
    }
}

struct QuickActionButton: View {
    let title: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(.white)
                .frame(width: 50, height: 50)
                .background(Circle().fill(color))
            Text(title)
                .font(.caption)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(.regularMaterial)
        )
    }
}

struct MetricBadge: View {
    let label: String
    let value: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.headline)
                .foregroundStyle(color)
            Text(label)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(color.opacity(0.1))
        .cornerRadius(8)
    }
}
