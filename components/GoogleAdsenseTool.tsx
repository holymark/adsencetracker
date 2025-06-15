'use client'

import { useState, useEffect } from 'react'

const GoogleAdsenseTool = () => {
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: '',
    accountId: '',
    refreshToken: ''
  })
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleAuth = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const { authUrl } = await response.json()
      if (authUrl) window.location.href = authUrl
    } catch (error: Error |any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to fetch')
      setData(result)
    } catch (error: Error | any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code && !isAuthenticated) {
      (async () => {
        setLoading(true)
        try {
          const response = await fetch('/api/auth/callback?code=' + code)
          const { refreshToken } = await response.json()
          setCredentials(prev => ({ ...prev, refreshToken }))
          setIsAuthenticated(true)
        } catch (error: Error | any) {
          setError(error.message)
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [isAuthenticated])

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      {!isAuthenticated ? (
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-500"
        >
          {loading ? 'Connecting...' : 'Connect Ad Account'}
        </button>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Client ID</label>
              <input
                type="text"
                name="clientId"
                value={credentials.clientId}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded"
                placeholder="Enter your Google Client ID"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Client Secret</label>
              <input
                type="password"
                name="clientSecret"
                value={credentials.clientSecret}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded"
                placeholder="Enter your Google Client Secret"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Account ID</label>
              <input
                type="text"
                name="accountId"
                value={credentials.accountId}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded"
                placeholder="Enter your AdManager Account ID"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-500"
            >
              {loading ? 'Fetching...' : 'Get Analytics'}
            </button>
          </form>
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          {data && (
            <div className="mt-6 p-4 bg-gray-700 rounded">
              <h2 className="text-xl font-semibold">Analytics Data</h2>
              <p>Impressions: {data.impressions || 'N/A'}</p>
              <p>Clicks: {data.clicks || 'N/A'}</p>
            </div>
          )}
          <p className="mt-4 text-center text-sm">
            Successfully fetched data? Claim your 1M Naira giveaway! Contact us via the link below.
          </p>
        </>
      )}
    </div>
  )
}

export default GoogleAdsenseTool