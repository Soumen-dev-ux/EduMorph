"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Key, Globe, Settings } from "lucide-react"

export function SetupGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Configuration</span>
          </CardTitle>
          <CardDescription>Configure your Supabase database connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Environment Variables</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>
                DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.likipraehiedarembxwf.supabase.co:5432/postgres
              </div>
              <div>NEXT_PUBLIC_SUPABASE_URL=https://likipraehiedarembxwf.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
              <div>SUPABASE_SERVICE_ROLE_KEY=your_service_role_key</div>
            </div>
          </div>
          <Badge variant="outline">Replace [YOUR-PASSWORD] with your actual database password</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Authentication Setup</span>
          </CardTitle>
          <CardDescription>Configure NextAuth.js for authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Required Variables</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>NEXTAUTH_URL=http://localhost:3000</div>
              <div>NEXTAUTH_SECRET=your-super-secret-jwt-secret</div>
            </div>
          </div>
          <Badge variant="outline">Generate a secure random string for NEXTAUTH_SECRET</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>OAuth Providers (Optional)</span>
          </CardTitle>
          <CardDescription>Configure Google and Facebook authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">OAuth Variables</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>GOOGLE_CLIENT_ID=your_google_client_id</div>
              <div>GOOGLE_CLIENT_SECRET=your_google_client_secret</div>
              <div>FACEBOOK_CLIENT_ID=your_facebook_client_id</div>
              <div>FACEBOOK_CLIENT_SECRET=your_facebook_client_secret</div>
            </div>
          </div>
          <Badge variant="secondary">Leave empty if not using OAuth providers</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>AI Features (Optional)</span>
          </CardTitle>
          <CardDescription>Configure OpenAI for AI-powered features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">AI Configuration</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>OPENAI_API_KEY=your_openai_api_key</div>
            </div>
          </div>
          <Badge variant="secondary">Required for AI recommendations and content generation</Badge>
        </CardContent>
      </Card>
    </div>
  )
}
