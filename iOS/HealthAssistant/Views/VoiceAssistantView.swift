//
//  VoiceAssistantView.swift
//  HealthAssistant
//

import SwiftUI

struct VoiceAssistantView: View {
    @StateObject private var audioService = AudioService()
    @EnvironmentObject var llmService: LLMInferenceService
    @EnvironmentObject var sensorFusion: SensorFusionManager
    @State private var messages: [ChatMessage] = []
    @State private var inputText: String = ""
    @FocusState private var isInputFocused: Bool
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Status header
                statusHeader
                
                // Chat messages
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(messages) { message in
                                ChatBubble(message: message)
                                    .id(message.id)
                            }
                            
                            if llmService.isProcessing {
                                HStack {
                                    TypingIndicator()
                                    Spacer()
                                }
                                .padding(.horizontal)
                            }
                        }
                        .padding()
                    }
                    .onChange(of: messages.count) { _, _ in
                        if let lastId = messages.last?.id {
                            withAnimation {
                                proxy.scrollTo(lastId, anchor: .bottom)
                            }
                        }
                    }
                }
                
                // Voice visualization
                if audioService.isListening {
                    voiceVisualization
                }
                
                // Input bar
                inputBar
            }
            .navigationTitle("AI Assistant")
            .background(
                LinearGradient(
                    colors: [Color.purple.opacity(0.1), Color.pink.opacity(0.05)],
                    startPoint: .top, endPoint: .bottom
                ).ignoresSafeArea()
            )
            .onAppear {
                if messages.isEmpty {
                    addWelcomeMessage()
                }
            }
        }
    }
    
    private var statusHeader: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(llmService.isModelLoaded ? Color.green : Color.orange)
                .frame(width: 8, height: 8)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(llmService.isModelLoaded ? "LLaMA-7B Active" : "Loading Model...")
                    .font(.caption.bold())
                Text("On-device • \(Int(llmService.averageLatencyMs))ms avg")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            
            Button(action: { messages.removeAll(); addWelcomeMessage() }) {
                Image(systemName: "arrow.counterclockwise.circle.fill")
                    .foregroundColor(.purple)
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial)
    }
    
    private var voiceVisualization: some View {
        HStack(spacing: 4) {
            ForEach(0..<20) { i in
                RoundedRectangle(cornerRadius: 2)
                    .fill(Color.purple)
                    .frame(width: 3, height: CGFloat.random(in: 5...30) * CGFloat(audioService.audioLevel * 100 + 0.5))
                    .animation(.easeInOut(duration: 0.1), value: audioService.audioLevel)
            }
        }
        .frame(height: 40)
        .padding(.vertical, 8)
    }
    
    private var inputBar: some View {
        HStack(spacing: 12) {
            TextField("Ask about your health...", text: $inputText, axis: .vertical)
                .textFieldStyle(.plain)
                .focused($isInputFocused)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(.regularMaterial)
                .cornerRadius(20)
                .lineLimit(1...4)
                .onSubmit { sendMessage() }
            
            Button(action: toggleVoice) {
                Image(systemName: audioService.isListening ? "stop.circle.fill" : "mic.circle.fill")
                    .font(.title)
                    .foregroundColor(audioService.isListening ? .red : .purple)
            }
            
            if !inputText.isEmpty {
                Button(action: sendMessage) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.title)
                        .foregroundColor(.purple)
                }
            }
        }
        .padding()
        .background(.ultraThinMaterial)
    }
    
    private func toggleVoice() {
        if audioService.isListening {
            audioService.stopListening()
            if !audioService.transcribedText.isEmpty {
                inputText = audioService.transcribedText
                audioService.transcribedText = ""
                sendMessage()
            }
        } else {
            audioService.startListening()
        }
    }
    
    private func sendMessage() {
        let trimmed = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        
        let userMsg = ChatMessage(role: .user, content: trimmed)
        messages.append(userMsg)
        inputText = ""
        isInputFocused = false
        
        Task {
            let response = await llmService.generateResponse(
                prompt: trimmed,
                context: sensorFusion.fusedMetrics
            )
            
            let aiMsg = ChatMessage(
                role: .assistant,
                content: response.response,
                latencyMs: response.inferenceTimeMs
            )
            await MainActor.run {
                messages.append(aiMsg)
                audioService.speak(response.response)
            }
        }
    }
    
    private func addWelcomeMessage() {
        messages.append(ChatMessage(
            role: .assistant,
            content: "Hi! I'm your AI health assistant. I can help with exercise form, recovery, nutrition, and analyze your real-time biometric data. What would you like to know?"
        ))
    }
}

struct ChatMessage: Identifiable {
    let id = UUID()
    let role: Role
    let content: String
    var latencyMs: Double? = nil
    let timestamp = Date()
    
    enum Role {
        case user, assistant
    }
}

struct ChatBubble: View {
    let message: ChatMessage
    
    var body: some View {
        HStack {
            if message.role == .user { Spacer(minLength: 40) }
            
            VStack(alignment: message.role == .user ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(
                        message.role == .user
                        ? AnyView(LinearGradient(colors: [.purple, .pink], startPoint: .topLeading, endPoint: .bottomTrailing))
                        : AnyView(Color(.systemGray6))
                    )
                    .foregroundColor(message.role == .user ? .white : .primary)
                    .cornerRadius(18)
                
                if let latency = message.latencyMs {
                    Text("\(Int(latency))ms • On-device")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            
            if message.role == .assistant { Spacer(minLength: 40) }
        }
    }
}

struct TypingIndicator: View {
    @State private var phase: Int = 0
    let timer = Timer.publish(every: 0.3, on: .main, in: .common).autoconnect()
    
    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<3) { i in
                Circle()
                    .fill(.purple)
                    .frame(width: 8, height: 8)
                    .opacity(phase == i ? 1 : 0.3)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(Color(.systemGray6))
        .cornerRadius(18)
        .onReceive(timer) { _ in
            phase = (phase + 1) % 3
        }
    }
}
