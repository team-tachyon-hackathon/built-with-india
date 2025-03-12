import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// You'll need to add these icons to your project or use a library like react-icons
import { FaGithub, FaLightbulb, FaTools, FaUsers, FaRocket, FaCheckCircle } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              CI/CD Genie
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 font-medium mb-6">
              An AI-powered drag-and-drop CI/CD pipeline designer
            </p>
            <p className="text-gray-700 text-lg mb-8">
              Streamline your DevOps workflow with our intelligent pipeline designer that auto-generates optimized YAML configs, saving time and reducing errors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="https://github.com/team-tachyon-hackathon/built-with-india" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <FaGithub className="mr-2" />
                View on GitHub
              </Link>
              <Link href="/demo" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors">
                Try Demo
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      {/* <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Problem Statement</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-gray-700 mb-6">
              CI/CD pipelines play a crucial role in modern software development by automating the build, test, and deployment processes. However:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1"><FaCheckCircle /></span>
                <span>Configuring these pipelines requires writing YAML files, which is time-consuming and prone to errors.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1"><FaCheckCircle /></span>
                <span>Each CI/CD provider (GitHub Actions, GitLab CI, Jenkins) follows a different syntax, making it difficult for developers to switch between them and increasing the learning curve.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1"><FaCheckCircle /></span>
                <span>Representing complex workflows in code makes it challenging to visualize dependencies and execution order.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1"><FaCheckCircle /></span>
                <span>Aligning pipelines with a project's repository structure requires deep expertise, as any misconfiguration can lead to failed deployments, inefficiencies, and security risks.</span>
              </li>
            </ul>
          </div>
        </div>
      </section> */}

      {/* Our Solution
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Solution</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Visual Pipeline Editor</h3>
              <p className="text-gray-700">
                A drag-and-drop interface enables easy creation of CI/CD pipeline stages, with visual connections defining workflows and support for build, test, and deploy stages. Each stage has a dedicated configuration panel for customization.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Repository Integration</h3>
              <p className="text-gray-700">
                Automatically imports and analyzes repository structure, detecting language, frameworks, and dependencies to suggest relevant build and test commands while generating context-aware configurations.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Multi-Provider Support</h3>
              <p className="text-gray-700">
                Supports GitHub Actions, GitLab CI, and Jenkins, with plans to include more providers, ensuring flexibility in CI/CD pipeline management across different platforms.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Intelligent YAML Generation</h3>
              <p className="text-gray-700">
                Uses LLM (Deepseek and Gemini API) according to user preference to generate optimized, error-free YAML configurations based on the visual workflow design.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Design Pipeline</h3>
              <p className="text-gray-700">
                User creates workflow using the drag-and-drop editor, adding build, test, and deploy stages as needed.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Analyze Repository</h3>
              <p className="text-gray-700">
                System detects project structure, language, dependencies, and creates an optimized workflow.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Generate YAML</h3>
              <p className="text-gray-700">
                AI-assisted YAML generation based on best practices, with error prevention and validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Used */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Technologies Used</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Frontend Components</h3>
              <ul className="space-y-2 text-gray-700">
                <li>React Flow</li>
                <li>Next.js</li>
                <li>GoJS</li>
                <li>Custom Node Components</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Backend Components</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Next.js API Routes</li>
                <li>Repository Analysis</li>
                <li>Pipeline Processing</li>
                <li>Validation Logic</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">AI Integration</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Gemini API</li>
                <li>DeepSeek API</li>
                <li>Context-Aware Repository Analysis</li>
                <li>Intelligent YAML Generation</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Authentication</h3>
              <ul className="space-y-2 text-gray-700">
                <li>NextAuth.js</li>
                <li>Secure Role-Based Authentication</li>
                <li>GitHub OAuth Integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Market Value */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Market Value</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-blue-900 to-blue-700 rounded-xl p-8 shadow-xl text-white">
              <h3 className="text-xl font-semibold mb-6 border-b border-blue-500 pb-3">For Developers</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Reduces CI/CD configuration time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Eliminates common syntax and logical errors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Lowers the barrier to CI/CD adoption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Visualizes complex workflow dependencies</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-b from-blue-900 to-blue-700 rounded-xl p-8 shadow-xl text-white">
              <h3 className="text-xl font-semibold mb-6 border-b border-blue-500 pb-3">For Teams</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Standardizes CI/CD practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Ensures best practices across projects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Simplifies onboarding for new team members</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Reduces maintenance overhead</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-b from-blue-900 to-blue-700 rounded-xl p-8 shadow-xl text-white">
              <h3 className="text-xl font-semibold mb-6 border-b border-blue-500 pb-3">For Organizations</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Accelerates software delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Improves code quality through consistent CI/CD</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Reduces DevOps expertise requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3 mt-1"><FaCheckCircle /></span>
                  <span>Increases developer productivity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Impacts
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Benefits & Impacts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 border-t-4 border-blue-600 shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Software Development Industry</h3>
              <p className="text-gray-700 mb-4">
                This project significantly enhances DevOps efficiency by providing a user-friendly way to create and manage CI/CD pipelines.
              </p>
              <p className="text-gray-700">
                It reduces setup time, minimizes errors, and enables faster software releases, helping companies maintain a competitive edge in the rapidly evolving tech landscape.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 border-t-4 border-blue-600 shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Startups and Small Businesses</h3>
              <p className="text-gray-700 mb-4">
                Smaller teams and early-stage startups often lack dedicated DevOps engineers. By offering an intuitive, no-code/low-code CI/CD solution, this project allows non-experts to implement robust automation.
              </p>
              <p className="text-gray-700">
                It enables smoother software development lifecycles without requiring extensive expertise.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 border-t-4 border-blue-600 shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Education and Research Institutions</h3>
              <p className="text-gray-700 mb-4">
                Universities and coding bootcamps can use this platform to train students and researchers on modern DevOps practices.
              </p>
              <p className="text-gray-700">
                The visual representation of pipelines helps learners understand the flow of software deployment, making CI/CD concepts more accessible and practical.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Future Prospects */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Future Prospects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-800 bg-opacity-50 rounded-xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="bg-blue-500 rounded-full p-2 mr-3">
                  <FaRocket className="text-white" />
                </span>
                Near-term Enhancements
              </h3>
              <ul className="space-y-3">
                <li>Additional CI/CD providers (CircleCI, Azure DevOps)</li>
                <li>Custom node templates for specialized tasks</li>
                <li>Pipeline validation with more detailed feedback</li>
                <li>Support for more complex workflow patterns</li>
              </ul>
            </div>
            <div className="bg-blue-800 bg-opacity-50 rounded-xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="bg-blue-500 rounded-full p-2 mr-3">
                  <FaLightbulb className="text-white" />
                </span>
                Mid-term Vision
              </h3>
              <ul className="space-y-3">
                <li>Pipeline versioning and sharing</li>
                <li>Team collaboration features</li>
                <li>Integration with deployment platforms</li>
                <li>Analytics dashboard for pipeline performance</li>
              </ul>
            </div>
            <div className="bg-blue-800 bg-opacity-50 rounded-xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="bg-blue-500 rounded-full p-2 mr-3">
                  <FaTools className="text-white" />
                </span>
                Long-term Possibilities
              </h3>
              <ul className="space-y-3">
                <li>Machine learning for pipeline optimization</li>
                <li>Integration with project management tools</li>
                <li>Automated pipeline suggestion based on project type</li>
                <li>Enterprise features for large organization deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Information */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Team</h2>
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-blue-800">Team Tachyon</h3>
            <p className="text-gray-600 mt-2">BUILD WITH INDIA 2025 Hackathon</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {['Aditya Singh', 'Shridhar Kute', 'Jeet Chandak', 'Dinesh Jangid', 'Veena Sahu'].map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-200">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-blue-600 text-2xl" />
                </div>
                <h4 className="font-medium text-gray-900">{member}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Link */}
      <section className="py-16 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Explore Our Project</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Visit our GitHub repository to see the code, contribute, or learn more about CI/CD Genie.
          </p>
          <Link href="https://github.com/team-tachyon-hackathon/built-with-india" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <FaGithub className="mr-2" />
            GitHub Repository
          </Link>
        </div>
      </section>

  

      
    </div>
  );
}