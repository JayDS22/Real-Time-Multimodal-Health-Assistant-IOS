// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "HealthAssistant",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(name: "HealthAssistant", targets: ["HealthAssistant"])
    ],
    dependencies: [],
    targets: [
        .target(
            name: "HealthAssistant",
            path: "HealthAssistant"
        ),
        .testTarget(
            name: "HealthAssistantTests",
            dependencies: ["HealthAssistant"],
            path: "HealthAssistantTests"
        )
    ]
)
