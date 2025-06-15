import GoogleAdsenseTool from '../components/GoogleAdsenseTool'

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">AdManager Analytics Tool</h1>
      <p className="text-center mb-4">Fetch analytic data from your Google AdManager account with MCM. Enter your credentials below!</p>
      <GoogleAdsenseTool />
    </div>
  )
}