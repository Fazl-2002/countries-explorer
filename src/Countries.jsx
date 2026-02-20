import React, { useState, useEffect } from 'react';
import './Countries.css';

function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '';
      
      if (region !== 'all') {
        url = `https://restcountries.com/v3.1/region/${region}`;
      } else if (search.length >= 2) {
        url = `https://restcountries.com/v3.1/name/${search}`;
      } else {
        url = 'https://restcountries.com/v3.1/all';
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          setCountries([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const processedData = data.map(country => {
        // تشخیص کشورهای آسیایی خاص
        let countryId = 'other';
        const name = country.name?.common?.toLowerCase() || '';
        
        if (name.includes('afghan')) countryId = 'afghanistan';
        else if (name.includes('iran')) countryId = 'iran';
        else if (name.includes('japan')) countryId = 'japan';
        else if (name.includes('india')) countryId = 'india';
        else if (name.includes('korea')) countryId = 'korea';
        else if (name.includes('thai')) countryId = 'thailand';
        else if (name.includes('viet')) countryId = 'vietnam';
        else if (name.includes('china')) countryId = 'china';
        
        return {
          name: country.name?.common || 'Unknown',
          region: country.region || 'Unknown',
          subregion: country.subregion || 'Unknown',
          population: country.population || 0,
          capital: country.capital?.[0] || 'N/A',
          flag: country.flags?.png || country.flags?.svg || 'https://via.placeholder.com/300x200?text=No+Flag',
          cca2: country.cca2 || Math.random().toString(),
          countryId: countryId
        };
      });
      
      // مرتب‌سازی به ترتیب حروف الفبا
      processedData.sort((a, b) => a.name.localeCompare(b.name));
      
      setCountries(processedData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.length < 2 && region === 'all') {
      fetchCountries();
    } else if (region !== 'all') {
      fetchCountries();
    } else if (search.length >= 2) {
      fetchCountries();
    }
  }, [search, region]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  const handleRetry = () => {
    fetchCountries();
  };

  const formatPopulation = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="container">
      {/* حاشیه نئونی در اطراف صفحه */}
      <div className="neon-border">
        <div className="border-top"></div>
        <div className="border-bottom"></div>
        <div className="border-left"></div>
        <div className="border-right"></div>
        <div className="corner-dot"></div>
        <div className="corner-dot"></div>
        <div className="corner-dot"></div>
        <div className="corner-dot"></div>
      </div>

      {/* خطوط نئونی متحرک */}
      <div className="neon-lines">
        <div className="neon-line-horizontal"></div>
        <div className="neon-line-horizontal"></div>
        <div className="neon-line-horizontal"></div>
        <div className="neon-line-vertical"></div>
        <div className="neon-line-vertical"></div>
        <div className="neon-line-vertical"></div>
      </div>

      {/* پس‌زمینه با گوی‌های نوری */}
      <div className="background-glow">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      {/* هدر نئونی */}
      <div className="header">
        <h1>Countries Explorer</h1>
        <div className="header-subtitle">
          <span>✦</span> Discover Asia's Finest <span>✦</span>
        </div>
      </div>

      {/* بخش کنترل‌ها */}
      <div className="controls-section">
        <div className="controls">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search country..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="filter-wrapper">
            <span className="filter-icon">🌍</span>
            <select 
              className="region-select"
              value={region}
              onChange={handleRegionChange}
            >
              <option value="all">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
        </div>
      </div>

      {/* وضعیت لودینگ */}
      {loading && (
        <div className="status-container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading countries...</p>
          </div>
        </div>
      )}

      {/* وضعیت خطا */}
      {error && (
        <div className="status-container">
          <div className="error">
            <p>❌ Error: {error}</p>
            <button className="retry-btn" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* وضعیت بدون نتیجه */}
      {!loading && !error && countries.length === 0 && (
        <div className="status-container">
          <div className="no-results">
            <div className="no-results-emoji">🔍</div>
            <p>No countries found</p>
            <div className="no-results-suggestion">Try a different search term</div>
          </div>
        </div>
      )}

      {/* گرید کشورها */}
      {!loading && !error && countries.length > 0 && (
        <div className="countries-grid">
          {countries.map((country, index) => (
            <div 
              key={country.cca2} 
              className="country-card"
              data-country={country.countryId}
            >
              <div className="flag-wrapper">
                <div className="flag-container">
                  <img 
                    src={country.flag} 
                    alt={`Flag of ${country.name}`}
                    className="flag"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Flag';
                    }}
                  />
                  <div className="flag-overlay"></div>
                </div>
              </div>
              
              <div className="country-info">
                <h3 className="country-name">{country.name}</h3>
                
                <div className="country-details">
                  <div className="detail-item">
                    <span className="detail-icon">🌍</span>
                    <span className="detail-label">Region</span>
                    <span className="detail-value">{country.region}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-label">Subregion</span>
                    <span className="detail-value">{country.subregion}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span className="detail-label">Population</span>
                    <span className="detail-value">{formatPopulation(country.population)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">🏛️</span>
                    <span className="detail-label">Capital</span>
                    <span className="detail-value">{country.capital}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* فوتر نئونی */}
      <footer className="footer">
        <div className="footer-content">
          <p>
            <span className="footer-icon">✦</span>
            Designed with 
            <span className="footer-icon">💫</span>
            by
            <span className="footer-name">Farahnaz Fazl</span>
            <span className="footer-icon">🌏</span>
          </p>
          <p className="footer-date">2026 • Countries Explorer</p>
          <p className="footer-quote">"Exploring the beauty of Asian cultures through design"</p>
        </div>
      </footer>
    </div>
  );
}

export default Countries;