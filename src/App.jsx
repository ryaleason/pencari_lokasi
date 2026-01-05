import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [accuracy, setAccuracy] = useState(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser")
      return
    }

    setLoading(true)
    setError(null)
    setLocation(null)

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          altitudeAccuracy: pos.coords.altitudeAccuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: new Date(pos.timestamp).toLocaleString('id-ID')
        }

        if (!location || pos.coords.accuracy < 50) {
          setLocation(newLocation)
          setAccuracy(pos.coords.accuracy)
          
          if (pos.coords.accuracy < 20) {
            navigator.geolocation.clearWatch(watchId)
            setLoading(false)
          }
        }
      },
      (err) => {
        setLoading(false)
        switch(err.code) {
          case err.PERMISSION_DENIED:
            setError("Izin lokasi ditolak. Aktifkan izin lokasi di browser Anda.")
            break
          case err.POSITION_UNAVAILABLE:
            setError("Informasi lokasi tidak tersedia.")
            break
          case err.TIMEOUT:
            setError("Permintaan lokasi timeout. Coba lagi.")
            break
          default:
            setError("Terjadi kesalahan saat mengambil lokasi.")
        }
        navigator.geolocation.clearWatch(watchId)
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }
    )

    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId)
      if (loading) {
        setLoading(false)
        if (!location) {
          setError("Timeout: Tidak bisa mendapatkan lokasi akurat dalam 30 detik")
        }
      }
    }, 30000)
  }

  const getAccuracyColor = (acc) => {
    if (acc < 10) return '#22c55e'
    if (acc < 50) return '#eab308'
    return '#ef4444'
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🌍 Geolokasi Akurat</h1>
        <p style={{ color: '#666' }}>
          Sistem ini menggunakan GPS dengan akurasi tinggi
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setCount(count + 1)} style={{ marginRight: '10px' }}>
          count is {count}
        </button>
        
        <button 
          onClick={getLocation} 
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading ? '#94a3b8' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? '🔄 Mencari Lokasi Akurat...' : '📍 Ambil Lokasi'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: '#991b1b',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {loading && !location && (
        <div style={{
          padding: '15px',
          backgroundColor: '#dbeafe',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          color: '#1e40af',
          marginBottom: '20px'
        }}>
          ⏳ Sedang mencari sinyal GPS terbaik... Pastikan Anda di area terbuka untuk hasil optimal.
        </div>
      )}

      {location && (
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '15px' }}>📌 Informasi Lokasi</h2>
          
          <div style={{
            display: 'grid',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{ 
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <strong>Latitude:</strong> {location.lat.toFixed(8)}
            </div>
            
            <div style={{ 
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <strong>Longitude:</strong> {location.lng.toFixed(8)}
            </div>
            
            <div style={{ 
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span><strong>Akurasi:</strong> ±{location.accuracy.toFixed(2)} meter</span>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: getAccuracyColor(location.accuracy),
                color: 'white',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {location.accuracy < 10 ? 'Sangat Akurat' : location.accuracy < 50 ? 'Akurat' : 'Kurang Akurat'}
              </span>
            </div>

            {location.altitude && (
              <div style={{ 
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <strong>Ketinggian:</strong> {location.altitude.toFixed(2)} meter
              </div>
            )}

            {location.speed !== null && location.speed > 0 && (
              <div style={{ 
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <strong>Kecepatan:</strong> {(location.speed * 3.6).toFixed(2)} km/jam
              </div>
            )}

            <div style={{ 
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <strong>Waktu:</strong> {location.timestamp}
            </div>
          </div>

          <iframe
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '8px' }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=18&output=embed`}
          ></iframe>

          <div style={{ 
            marginTop: '15px',
            padding: '12px',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#92400e'
          }}>
            💡 <strong>Tips:</strong> Untuk akurasi terbaik, pastikan:
            <ul style={{ marginBottom: 0 }}>
              <li>GPS di perangkat Anda aktif</li>
              <li>Anda berada di area terbuka (bukan di dalam gedung)</li>
              <li>Izinkan browser mengakses lokasi Anda</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
