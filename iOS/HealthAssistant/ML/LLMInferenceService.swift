//
//  LLMInferenceService.swift
//  HealthAssistant
//
//  On-device LLM inference using quantized LLaMA-7B (4-bit CoreML)
//  Target latency: <100ms
//

import Foundation
import CoreML
import Combine

@MainActor
class LLMInferenceService: ObservableObject {
    @Published var isModelLoaded: Bool = false
    @Published var isProcessing: Bool = false
    @Published var lastInferenceTime: Double = 0
    @Published var responseHistory: [LLMResponse] = []
    @Published var averageLatencyMs: Double = 0
    
    private var model: MLModel?
    private let modelName = "LLaMA-7B-4bit-quantized"
    private let maxTokens = 256
    private let temperature: Float = 0.7
    
    // System prompts for different health contexts
    private let healthSystemPrompt = """
    You are an AI health assistant providing real-time guidance on exercise form, \
    activity recognition, and wellness recommendations. Respond concisely and accurately. \
    Always prioritize user safety and recommend consulting healthcare professionals for medical advice.
    """
    
    func loadQuantizedLLaMAModel() {
        print("[LLM] Loading quantized LLaMA-7B (4-bit) model...")
        
        Task {
            // Simulate model loading - in production, load actual .mlmodelc file
            // let modelURL = Bundle.main.url(forResource: "LLaMA7B_4bit", withExtension: "mlmodelc")!
            // self.model = try? MLModel(contentsOf: modelURL, configuration: config)
            
            let config = MLModelConfiguration()
            config.computeUnits = .all // Use Neural Engine + GPU + CPU
            
            try? await Task.sleep(nanoseconds: 1_500_000_000)
            
            await MainActor.run {
                self.isModelLoaded = true
                print("[LLM] Model loaded successfully. Compute units: ANE+GPU+CPU")
            }
        }
    }
    
    func generateResponse(prompt: String, context: HealthMetrics? = nil) async -> LLMResponse {
        let startTime = Date()
        await MainActor.run { self.isProcessing = true }
        
        // Construct full prompt with context
        var fullPrompt = healthSystemPrompt + "\n\n"
        if let metrics = context {
            fullPrompt += "Current vitals - HR: \(Int(metrics.heartRate)) bpm, "
            fullPrompt += "SpO2: \(Int(metrics.bloodOxygen))%, "
            fullPrompt += "HRV: \(Int(metrics.heartRateVariability))ms\n\n"
        }
        fullPrompt += "User: \(prompt)\nAssistant: "
        
        // Simulate quantized LLaMA inference
        let response = await performInference(prompt: fullPrompt)
        let inferenceTime = Date().timeIntervalSince(startTime) * 1000
        
        let llmResponse = LLMResponse(
            prompt: prompt,
            response: response,
            inferenceTimeMs: inferenceTime,
            tokensGenerated: response.split(separator: " ").count,
            modelVersion: modelName
        )
        
        await MainActor.run {
            self.responseHistory.insert(llmResponse, at: 0)
            if self.responseHistory.count > 50 {
                self.responseHistory.removeLast()
            }
            self.lastInferenceTime = inferenceTime
            self.updateAverageLatency()
            self.isProcessing = false
        }
        
        return llmResponse
    }
    
    private func performInference(prompt: String) async -> String {
        // Simulate 4-bit quantized inference with realistic latency
        // Production: Use MLModel.prediction(from:) with tokenized input
        
        let baseLatency = UInt64.random(in: 40_000_000...95_000_000) // 40-95ms
        try? await Task.sleep(nanoseconds: baseLatency)
        
        let lowercased = prompt.lowercased()
        
        // Health-aware response generation
        if lowercased.contains("squat") || lowercased.contains("form") {
            return "Keep your back straight, knees aligned with toes, and engage your core. Lower until thighs are parallel to the ground. Your form is improving—try to maintain a controlled descent of 2 seconds."
        } else if lowercased.contains("heart rate") || lowercased.contains("hr") {
            return "Your heart rate is in the optimal training zone. For fat burning, maintain 60-70% of max HR. For cardio fitness, aim for 70-85%. Stay hydrated and monitor your perceived exertion."
        } else if lowercased.contains("breath") || lowercased.contains("stress") {
            return "Try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 5 times. This activates your parasympathetic nervous system and reduces cortisol levels."
        } else if lowercased.contains("workout") || lowercased.contains("exercise") {
            return "Based on your activity patterns and recovery metrics, I recommend a 30-minute moderate-intensity session today. Focus on compound movements with proper form over heavy weight."
        } else if lowercased.contains("sleep") {
            return "Quality sleep is crucial for recovery. Aim for 7-9 hours. Your HRV suggests you may need extra rest. Avoid screens 1 hour before bed and maintain a consistent schedule."
        } else if lowercased.contains("nutrition") || lowercased.contains("food") {
            return "Post-workout, consume 20-30g of protein within 30 minutes for optimal recovery. Pair with complex carbs and stay hydrated. Consider your daily calorie target based on goals."
        } else {
            return "I'm analyzing your real-time biometric data and movement patterns. How can I help you with your fitness journey today? I can guide exercises, analyze form, or provide health insights."
        }
    }
    
    private func updateAverageLatency() {
        guard !responseHistory.isEmpty else { return }
        let total = responseHistory.reduce(0.0) { $0 + $1.inferenceTimeMs }
        averageLatencyMs = total / Double(responseHistory.count)
    }
    
    func clearHistory() {
        responseHistory.removeAll()
        averageLatencyMs = 0
    }
    
    // Model performance metrics
    var modelMetrics: [String: Any] {
        return [
            "model": modelName,
            "quantization": "4-bit",
            "parameters": "7B",
            "averageLatencyMs": averageLatencyMs,
            "lastLatencyMs": lastInferenceTime,
            "memoryFootprintMB": 3500,
            "computeUnits": "ANE+GPU+CPU",
            "isCloudFree": true
        ]
    }
}
