"use client"

/**
 * Error Boundary Component
 * Provides graceful error handling with user-friendly messages
 */

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo)
    
    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Something went wrong
              </CardTitle>
              <CardDescription>
                An error occurred while rendering this component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  {this.state.error?.message || 'An unexpected error occurred'}
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="default">
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Reload Page
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Simple error fallback component for inline use
 */
export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Alert className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="ml-2">
        <div className="flex items-center justify-between">
          <span>{error.message || 'An error occurred'}</span>
          <Button size="sm" variant="ghost" onClick={reset}>
            Retry
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

