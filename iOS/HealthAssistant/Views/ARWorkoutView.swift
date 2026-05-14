//
//  ARWorkoutView.swift
//  HealthAssistant
//

import SwiftUI
import ARKit
import RealityKit

struct ARWorkoutView: View {
    @StateObject private var poseService = ARPoseEstimationService()
    @EnvironmentObject var llmService: LLMInferenceService
    @State private var showFormFeedback: Bool = true
    @State private var selectedExercise: String = "Squat"
    
    let exercises = ["Squat", "Push-up", "Lunge", "Plank", "Deadlift"]
    
    var body: some View {
        NavigationStack {
            ZStack {
                // AR Camera View placeholder
                ARCameraView()
                    .ignoresSafeArea()
                
                // Pose overlay
                if let pose = poseService.currentPose {
                    PoseOverlayView(pose: pose)
                }
                
                // UI overlay
                VStack {
                    topBar
                    Spacer()
                    if showFormFeedback {
                        formFeedbackPanel
                    }
                    bottomControls
                }
                .padding()
            }
            .navigationBarHidden(true)
            .onAppear {
                poseService.currentExercise = selectedExercise
                poseService.startTracking()
            }
            .onDisappear {
                poseService.stopTracking()
            }
        }
    }
    
    private var topBar: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 4) {
                    Circle()
                        .fill(Color.red)
                        .frame(width: 8, height: 8)
                    Text("LIVE")
                        .font(.caption.bold())
                        .foregroundColor(.white)
                }
                Text("\(Int(poseService.frameRate)) FPS")
                    .font(.title3.bold())
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(.ultraThinMaterial)
            .cornerRadius(8)
            
            Spacer()
            
            Picker("Exercise", selection: $selectedExercise) {
                ForEach(exercises, id: \.self) { exercise in
                    Text(exercise).tag(exercise)
                }
            }
            .pickerStyle(.menu)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(.ultraThinMaterial)
            .cornerRadius(8)
            .onChange(of: selectedExercise) { _, newValue in
                poseService.currentExercise = newValue
            }
        }
    }
    
    private var formFeedbackPanel: some View {
        VStack(spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("REPS")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.7))
                    Text("\(poseService.repCount)")
                        .font(.system(size: 36, weight: .bold))
                        .foregroundColor(.white)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 4) {
                    Text("FORM SCORE")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.7))
                    Text("\(Int(poseService.formScore))")
                        .font(.system(size: 36, weight: .bold))
                        .foregroundColor(formScoreColor)
                }
            }
            
            // Form score bar
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(.white.opacity(0.2))
                        .frame(height: 8)
                    RoundedRectangle(cornerRadius: 4)
                        .fill(LinearGradient(colors: [.red, .yellow, .green], startPoint: .leading, endPoint: .trailing))
                        .frame(width: geo.size.width * CGFloat(poseService.formScore / 100), height: 8)
                }
            }
            .frame(height: 8)
            
            if let analysis = poseService.exerciseAnalysis {
                ForEach(analysis.recommendations, id: \.self) { rec in
                    HStack {
                        Image(systemName: "lightbulb.fill")
                            .foregroundColor(.yellow)
                            .font(.caption)
                        Text(rec)
                            .font(.caption)
                            .foregroundColor(.white)
                        Spacer()
                    }
                }
            }
        }
        .padding()
        .background(.ultraThinMaterial)
        .cornerRadius(16)
    }
    
    private var bottomControls: some View {
        HStack(spacing: 20) {
            ControlButton(icon: "pause.fill") {
                poseService.stopTracking()
            }
            ControlButton(icon: poseService.isTracking ? "stop.fill" : "play.fill", isPrimary: true) {
                if poseService.isTracking {
                    poseService.stopTracking()
                } else {
                    poseService.startTracking()
                }
            }
            ControlButton(icon: showFormFeedback ? "eye.slash.fill" : "eye.fill") {
                withAnimation { showFormFeedback.toggle() }
            }
        }
    }
    
    private var formScoreColor: Color {
        if poseService.formScore >= 80 { return .green }
        if poseService.formScore >= 60 { return .yellow }
        return .red
    }
}

struct ControlButton: View {
    let icon: String
    var isPrimary: Bool = false
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.white)
                .frame(width: isPrimary ? 70 : 50, height: isPrimary ? 70 : 50)
                .background(
                    Circle()
                        .fill(isPrimary ? Color.red : Color.white.opacity(0.3))
                )
                .overlay(
                    Circle()
                        .stroke(.white, lineWidth: 2)
                )
        }
    }
}

struct ARCameraView: UIViewRepresentable {
    func makeUIView(context: Context) -> ARView {
        let arView = ARView(frame: .zero)
        let config = ARBodyTrackingConfiguration()
        if ARBodyTrackingConfiguration.isSupported {
            arView.session.run(config)
        }
        return arView
    }
    
    func updateUIView(_ uiView: ARView, context: Context) {}
}

struct PoseOverlayView: View {
    let pose: PoseFrame
    
    var body: some View {
        GeometryReader { geo in
            ZStack {
                // Draw skeleton connections
                ForEach(connections, id: \.start) { connection in
                    if let startPoint = pose.keypoints.first(where: { $0.name == connection.start }),
                       let endPoint = pose.keypoints.first(where: { $0.name == connection.end }) {
                        Path { path in
                            path.move(to: CGPoint(x: startPoint.x * geo.size.width, y: startPoint.y * geo.size.height))
                            path.addLine(to: CGPoint(x: endPoint.x * geo.size.width, y: endPoint.y * geo.size.height))
                        }
                        .stroke(Color.green, lineWidth: 3)
                    }
                }
                
                // Draw joints
                ForEach(pose.keypoints, id: \.name) { keypoint in
                    if keypoint.confidence > 0.5 {
                        Circle()
                            .fill(Color.cyan)
                            .frame(width: 12, height: 12)
                            .position(x: keypoint.x * geo.size.width, y: keypoint.y * geo.size.height)
                    }
                }
            }
        }
    }
    
    var connections: [(start: String, end: String)] {
        [
            ("left_shoulder", "right_shoulder"),
            ("left_shoulder", "left_elbow"),
            ("left_elbow", "left_wrist"),
            ("right_shoulder", "right_elbow"),
            ("right_elbow", "right_wrist"),
            ("left_shoulder", "left_hip"),
            ("right_shoulder", "right_hip"),
            ("left_hip", "right_hip"),
            ("left_hip", "left_knee"),
            ("left_knee", "left_ankle"),
            ("right_hip", "right_knee"),
            ("right_knee", "right_ankle"),
        ]
    }
}
