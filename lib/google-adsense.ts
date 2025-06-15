import { adsense } from '@googleapis/adsense'
import { google } from 'googleapis'
// import { google } from 'googleapis'

export class GoogleAdsense {
  private adsense: any
  private auth: any

  constructor(clientId: string, clientSecret: string) {
    this.auth = new google.auth.OAuth2({
      clientId,
      clientSecret,
      redirectUri: 'http://localhost:3000' // Update for production
    })
    this.adsense = adsense('v2')
    this.adsense.auth = this.auth
  }

  async getAnalytics(accountId: string) {
    try {
      const response = await this.adsense.accounts.reports.generate({
        accountId,
        startDate: { year: 2025, month: 6, day: 1 },
        endDate: { year: 2025, month: 6, day: 15 } // Current month as of 06/15/2025
      })
      return response.data.rows?.[0] || { impressions: 'N/A', clicks: 'N/A' }
    } catch (error) {
      console.error('API Error:', error)
      throw new Error('Failed to fetch AdManager data. Ensure MCM is enabled and credentials are valid.')
    }
  }
}

export default GoogleAdsense