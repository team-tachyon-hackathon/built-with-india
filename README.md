# CI/CD Genie

![CI/CD Genie Logo](https://ci-cd-genie.vercel.app/logo.png)

## 🧞 Overview

CI/CD Genie is an intelligent workflow builder that makes creating and managing continuous integration and continuous delivery pipelines effortless. With an intuitive drag-and-drop interface, repository analysis, and multi-platform support, it streamlines the DevOps process for development teams of all sizes.

**Live Demo**: [https://ci-cd-genie.vercel.app/](https://ci-cd-genie.vercel.app/)

## 🚀 Features

### 1. Visual Pipeline Builder
- **Drag-and-Drop Interface**: Create complex CI/CD workflows visually without writing YAML or script files
- **Intuitive Connections**: Easily link build, test, and deployment stages with visual connectors
- **Real-time Preview**: See your workflow diagram as you build it

### 2. Repository Analysis
- **Intelligent Scanning**: Analyze your GitHub or GitLab repositories to detect languages, frameworks, and dependencies
- **Workflow Recommendations**: Get smart suggestions for optimal pipeline configurations based on your codebase
- **Configuration Detection**: Automatically identify existing CI/CD setups and Docker configurations

### 3. Multi-Platform Support
- **Platform Flexibility**: Generate configurations for GitHub Actions, GitLab CI, and Jenkins
- **One-Click Generation**: Create production-ready YAML files with a single click
- **Save for Later**: Store configurations in your account for future reference or sharing

### 4. Workflow Management
- **Custom Naming**: Name and organize your workflow configurations
- **Saved Configurations**: Access your saved workflows anytime from any device
- **Version History**: Track changes to your CI/CD configurations over time

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Hooks
- **Diagram Tools**: GoJS for interactive diagram creation
- **AI Integration**: Gemini API for intelligent CI/CD configuration generation
- **Backend**: Next.js API routes
- **Database**: MongoDB for configuration storage
- **Deployment**: Vercel for hosting and serverless functions

## 🔍 Why CI/CD Genie?

### The Problem

Setting up CI/CD pipelines traditionally requires:
- Extensive knowledge of YAML and pipeline configurations
- Understanding of platform-specific syntax and features
- Time-consuming trial and error to get configurations right
- Difficulty in visualizing complex workflows
- Manual maintenance when projects evolve

### Our Solution

CI/CD Genie addresses these challenges by:
- Visualizing the entire pipeline process through an intuitive interface
- Eliminating the need to write YAML files manually
- Providing intelligent suggestions based on your repository analysis
- Supporting multiple CI/CD platforms from a single workflow design
- Enabling easy sharing and reuse of configurations

## 📈 Impact

### For Developers
- **Time Savings**: Reduce pipeline setup time from hours to minutes
- **Reduced Complexity**: No need to learn platform-specific YAML syntax
- **Focus on Code**: Spend more time writing code, less time configuring CI/CD

### For DevOps Teams
- **Standardization**: Create consistent pipeline templates across projects
- **Onboarding**: Simplify the onboarding process for new team members
- **Documentation**: Visualization serves as living documentation of your deployment process

### For Organizations
- **Faster Delivery**: Accelerate software delivery with quickly implementable pipelines
- **Cost Efficiency**: Reduce DevOps overhead and configuration maintenance costs
- **Platform Flexibility**: Avoid vendor lock-in with multi-platform support

## 🚦 How to Use

### 1. Build Your Workflow
- Start with a blank canvas or import an existing configuration
- Drag components from the sidebar to create build, test, and deploy stages
- Connect components to define the workflow sequence

### 2. Analyze Your Repository
- Connect to GitHub or GitLab by entering your repository information
- Analyze the repository to get intelligent suggestions
- Let CI/CD Genie auto-populate your workflow based on repository analysis

### 3. Generate Configuration
- Select your preferred CI/CD platform (GitHub Actions, GitLab CI, or Jenkins)
- Click "Generate CI/CD Config" to create the configuration file
- Review, copy, or download the generated YAML

### 4. Save and Share
- Name your project for easy identification
- Save configurations for later use
- Access saved configurations from the dashboard

## 🔮 Future Roadmap

- **Additional Platform Support**: Expanding to support CircleCI, Travis CI, and more
- **Team Collaboration**: Shared workspaces and collaborative editing
- **Custom Components**: Create and save custom pipeline components
- **Webhook Integration**: Trigger workflows based on external events
- **Pipeline Analytics**: Monitor and analyze pipeline performance

## 👨‍💻 Getting Started for Developers

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB connection

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cicd-genie.git
cd cicd-genie
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=cicd_builder
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [GoJS](https://gojs.net/) for the diagram visualization library
- [Gemini API](https://developers.generativeai.google/products/gemini) for AI-powered configuration generation
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [MongoDB](https://www.mongodb.com/) for database services
- [Vercel](https://vercel.com/) for hosting and deployment

---

Built with ❤️ by the Team Tachyon.