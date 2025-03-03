// tests/test-cicdgen.js
const fetch = require('node-fetch');
const fs = require('fs/promises');

async function testCICDGenerator() {
  console.log("Starting test for CICD generator API...");
  
  try {
    // Create complex pipeline request
    const pipelineRequest = {
      "repoInfo": "Repository: my-microservice-app\nLanguage: TypeScript\nFramework: NextJS\nDatabase: PostgreSQL\nContainerization: Docker\nAdditional services: Redis, MongoDB\nCloud provider: AWS\nCode quality requirements: ESLint, Prettier, 90% test coverage",
      "nodes": [
        {
          "id": "start",
          "type": "input",
          "data": { "name": "Start" },
          "position": { "x": 250, "y": 0 }
        },
        {
          "id": "n1",
          "type": "buildNode",
          "data": {
            "name": "Install Dependencies",
            "config": {
              "image": "node:18-alpine",
              "commands": [
                "npm ci",
                "npm run lint",
                "npm run format:check"
              ]
            }
          },
          "position": { "x": 250, "y": 100 }
        },
        {
          "id": "n2",
          "type": "buildNode",
          "data": {
            "name": "Build Application",
            "config": {
              "image": "node:18-alpine",
              "commands": [
                "npm run build",
                "npm run generate-types"
              ]
            }
          },
          "position": { "x": 250, "y": 200 }
        },
        {
          "id": "n3",
          "type": "testNode",
          "data": {
            "name": "Unit Tests",
            "config": {
              "framework": "Jest",
              "commands": [
                "npm run test:unit",
                "npm run test:coverage"
              ]
            }
          },
          "position": { "x": 100, "y": 300 }
        },
        {
          "id": "n4",
          "type": "testNode",
          "data": {
            "name": "Integration Tests",
            "config": {
              "framework": "Jest",
              "commands": [
                "docker-compose up -d db redis",
                "npm run test:integration",
                "docker-compose down"
              ]
            }
          },
          "position": { "x": 400, "y": 300 }
        },
        {
          "id": "n5",
          "type": "buildNode",
          "data": {
            "name": "Build Docker Image",
            "config": {
              "image": "docker:20.10.16",
              "commands": [
                "docker build -t my-microservice-app:${GITHUB_SHA} .",
                "docker tag my-microservice-app:${GITHUB_SHA} my-microservice-app:latest"
              ]
            }
          },
          "position": { "x": 250, "y": 400 }
        },
        {
          "id": "n6",
          "type": "testNode",
          "data": {
            "name": "E2E Tests",
            "config": {
              "framework": "Cypress",
              "commands": [
                "docker-compose up -d",
                "npm run test:e2e",
                "docker-compose down"
              ]
            }
          },
          "position": { "x": 250, "y": 500 }
        },
        {
          "id": "n7",
          "type": "deployNode",
          "data": {
            "name": "Deploy to Staging",
            "config": {
              "environment": "staging",
              "method": "AWS ECS"
            }
          },
          "position": { "x": 250, "y": 600 }
        },
        {
          "id": "n8",
          "type": "testNode",
          "data": {
            "name": "Smoke Tests",
            "config": {
              "framework": "Custom",
              "commands": [
                "npm run test:smoke -- --env=staging"
              ]
            }
          },
          "position": { "x": 250, "y": 700 }
        },
        {
          "id": "n9",
          "type": "deployNode",
          "data": {
            "name": "Deploy to Production",
            "config": {
              "environment": "production",
              "method": "AWS ECS"
            }
          },
          "position": { "x": 250, "y": 800 }
        }
      ],
      "edges": [
        { "id": "e1", "source": "start", "target": "n1" },
        { "id": "e2", "source": "n1", "target": "n2" },
        { "id": "e3", "source": "n2", "target": "n3" },
        { "id": "e4", "source": "n2", "target": "n4" },
        { "id": "e5", "source": "n3", "target": "n5" },
        { "id": "e6", "source": "n4", "target": "n5" },
        { "id": "e7", "source": "n5", "target": "n6" },
        { "id": "e8", "source": "n6", "target": "n7" },
        { "id": "e9", "source": "n7", "target": "n8" },
        { "id": "e10", "source": "n8", "target": "n9" }
      ],
      "ciProvider": "github-actions"
    };
    
    console.log("Sending request to CICD generator API...");
    
    // Try the test API endpoint first
    const testEndpoint = 'http://localhost:3000/api-test/test-cicdgen';
    console.log(`Trying test endpoint: ${testEndpoint}`);
    
    let response;
    try {
      response = await fetch(testEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipelineRequest)
      });
    } catch (error) {
      console.log(`Test endpoint not available, falling back to main endpoint`);
      response = await fetch('http://localhost:3000/api/cicdgen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipelineRequest)
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      console.error("API returned an error:", result.error);
    } else {
      console.log("Successfully received YAML configuration!");
      console.log("YAML Preview (first 500 chars):", result.yaml.substring(0, 500) + "...");
      
      // Save the YAML to a file
      await fs.writeFile('./generated-workflow.yml', result.yaml, 'utf8');
      console.log("Full YAML saved to ./generated-workflow.yml");
    }
  } catch (error) {
    console.error("Error during test:", error);
  }
}

// Run the test
testCICDGenerator();