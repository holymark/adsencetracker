import { NextRequest, NextResponse } from 'next/server'
import { google, adsense_v2 } from 'googleapis'

class GoogleAdsense {
  private adsense: any
  private oauth2Client: any

  constructor(clientId: string, clientSecret: string) {
    this.oauth2Client = new google.auth.OAuth2({
      clientId,
      clientSecret,
      redirectUri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || 'http://localhost:3000'
    })
    this.adsense = google.adsense({
      version: 'v2',
      auth: this.oauth2Client
    })
  }

  async getAnalytics(accountId: string) {
    try {
      // Set credentials (replace with actual refresh token from OAuth flow)
      this.oauth2Client.setCredentials({ refresh_token: 'your-refresh-token' }) // Replace with actual refresh token

      // Use the correct method signature with accountId
      const response = await this.adsense.accounts.reports.generate({
        accountId, // Top-level parameter
        requestBody: {
          dateRange: {
            startDate: { year: 2025, month: 6, day: 1 },
            endDate: { year: 2025, month: 6, day: 15 }
          },
          metrics: ['PAGE_VIEWS', 'AD_REQUESTS', 'AD_REQUESTS_COVERAGE', 'CLICKS', 'AD_REQUESTS_CTR', 'COST_PER_CLICK', 'AD_REQUESTS_RPM', 'EARNINGS'],
          filters: [],
          orderBy: { metric: 'EARNINGS', descending: true }
        }
      })

      // Handle the promise resolution and type the response
      const responseData = await response
      return responseData.data.rows?.[0] || { impressions: 'N/A', clicks: 'N/A' }
    } catch (error) {
      console.error('API Error:', error)
      throw new Error('Failed to fetch data. Ensure MCM is enabled and credentials are valid.')
    }
  }
}

export async function POST(request: NextRequest) {
  const { clientId, clientSecret, accountId } = await request.json()

  if (!clientId || !clientSecret || !accountId) {
    return NextResponse.json({ error: 'Missing required credentials' }, { status: 400 })
  }

  try {
    const adsense = new GoogleAdsense(clientId, clientSecret)
    const data = await adsense.getAnalytics(accountId)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: (error) || 'Failed to fetch data.' }, { status: 500 })
  }
}