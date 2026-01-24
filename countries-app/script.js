let allCountries = [];
const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');
const countriesContainer = document.getElementById('countriesContainer');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const noResults = document.getElementById('noResults');
const API_URL = 'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital';
async function fetchCountries() {
    try {
        showLoading();
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        allCountries = data;
        displayCountries(allCountries);
        hideLoading();
    } catch (error) {
        console.error('Error fetching countries:', error);
        showError();
    }
}
function displayCountries(countries) {
    countriesContainer.innerHTML = '';
    
    if (countries.length === 0) {
        showNoResults();
        return;
    }
    hideNoResults();
    countries.forEach(country => {
        const countryCard = createCountryCard(country);
        countriesContainer.appendChild(countryCard);
    });
}
function createCountryCard(country) {
    const card = document.createElement('div');
    card.className = 'country-card';
    const population = country.population?.toLocaleString() || 'N/A';
    const region = country.region || 'N/A';
    const capital = country.capital?.[0] || 'N/A';
    const flag = country.flags?.png || country.flags?.svg || '';
    const name = country.name?.common || 'Unknown';
    card.innerHTML = `
        <img src="${flag}" alt="${name} flag" class="country-flag">
        <div class="country-info">
            <h2 class="country-name">${name}</h2>
            <div class="country-details">
                <div class="detail-item">
                    <span class="detail-label">Population:</span>
                    <span class="detail-value">${population}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Region:</span>
                    <span class="detail-value">${region}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Capital:</span>
                    <span class="detail-value">${capital}</span>
                </div>
            </div>
        </div>
    `;
    return card;
}
function filterCountries() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedRegion = regionFilter.value;
    let filtered = allCountries;
    if (selectedRegion !== 'all') {
        filtered = filtered.filter(country => 
            country.region === selectedRegion
        );
    }
    if (searchTerm) {
        filtered = filtered.filter(country => 
            country.name?.common?.toLowerCase().includes(searchTerm) ||
            country.name?.official?.toLowerCase().includes(searchTerm)
        );
    }
    displayCountries(filtered);
}
function showLoading() {
    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    countriesContainer.style.display = 'none';
    noResults.style.display = 'none';
}
function hideLoading() {
    loadingMessage.style.display = 'none';
    countriesContainer.style.display = 'grid';
}
function showError() {
    loadingMessage.style.display = 'none';
    errorMessage.style.display = 'block';
    countriesContainer.style.display = 'none';
}
function showNoResults() {
    noResults.style.display = 'block';
}
function hideNoResults() {
    noResults.style.display = 'none';
}
searchInput.addEventListener('input', filterCountries);
regionFilter.addEventListener('change', filterCountries);
document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
});
