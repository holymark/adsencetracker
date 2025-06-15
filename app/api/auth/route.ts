import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 })
  }

  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_ADMANAGER_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_ADMANAGER_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
  })

  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    // In a real app, store tokens.refresh_token securely (e.g., in a database or session)
    // For simplicity, we'll pass it back to the client (not recommended for production)
    return NextResponse.json({ success: true, refreshToken: tokens.refresh_token })
  } catch (error) {
    console.error('OAuth Error:', error)
    return NextResponse.json({ error: 'Failed to exchange code for tokens' }, { status: 500 })
  }
}