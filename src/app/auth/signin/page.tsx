'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import BackgroundPaths from "@/components/background-path"
import { Github, GitlabIcon as GitlabLogo, GithubIcon as Bitbucket } from 'lucide-react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState({
    github: false,
    gitlab: false,
    bitbucket: false,
  })

  const handleSignIn = async (provider: "github" | "gitlab" | "bitbucket") => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }))
    await signIn(provider, { callbackUrl: "/" })
  }

  return (
    <BackgroundPaths title="CI/CD Genie">
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-8 space-y-4">
            <button
              onClick={() => handleSignIn("github")}
              disabled={isLoading.github}
              className="group relative flex w-full justify-center items-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
            >
              <Github className="mr-2 h-5 w-5" />
              {isLoading.github ? "Loading..." : "Sign in with GitHub"}
            </button>

            <button
              onClick={() => handleSignIn("gitlab")}
              disabled={isLoading.gitlab}
              className="group relative flex w-full justify-center items-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none"
            >
              <GitlabLogo className="mr-2 h-5 w-5" />
              {isLoading.gitlab ? "Loading..." : "Sign in with GitLab"}
            </button>

            <button
              onClick={() => handleSignIn("bitbucket")}
              disabled={isLoading.bitbucket}
              className="group relative flex w-full justify-center items-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
            >
              <Bitbucket className="mr-2 h-5 w-5" />
              {isLoading.bitbucket ? "Loading..." : "Sign in with Bitbucket"}
            </button>
          </div>
        </div>
      </div>
    </BackgroundPaths>
  )
}
