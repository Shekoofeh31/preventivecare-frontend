// Rest of your main.js code follows...
// DOM Elements
const persianBtn = document.getElementById('persian-btn');
const englishBtn = document.getElementById('english-btn');
const searchInput = document.querySelector('.ph-search__input');
const searchButton = document.querySelector('.ph-search__button');
const heroTitle = document.querySelector('.ph-hero__title');
const heroSubtitle = document.querySelector('.ph-hero__subtitle');

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://your-app-name.onrender.com', // Replace with your actual Render URL
  API_PREFIX: '/api'
};

// Language Content
const content = {
  persian: {
    title: 'پیشگامان سلامت',
    subtitle: 'راهکارهای پیشگیری و سلامت جامع',
    searchPlaceholder: 'جستجو برای موضوعات سلامت، نکات پیشگیری...',
    searchButton: 'جستجو',
    direction: 'rtl',
    searchingMessage: 'در حال جستجو...',
    searchErrorMessage: 'خطا در جستجو. لطفا دوباره تلاش کنید.'
  },
  english: {
    title: 'Health Pioneers',
    subtitle: 'Comprehensive Prevention and Health Solutions',
    searchPlaceholder: 'Search for health topics, prevention tips...',
    searchButton: 'Search',
    direction: 'ltr',
    searchingMessage: 'Searching...',
    searchErrorMessage: 'Error searching. Please try again.'
  }
};

// API Call Function
async function apiCall(endpoint, method = 'GET', data = null) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
      // Add authorization headers if needed
    },
    credentials: 'include'  // Important for cookies if using authentication
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Language Switcher Functionality
function setLanguage(lang) {
  // Update text content
  heroTitle.textContent = content[lang].title;
  heroSubtitle.textContent = content[lang].subtitle;
  searchInput.placeholder = content[lang].searchPlaceholder;
  searchButton.textContent = content[lang].searchButton;
  // Update document direction
  document.documentElement.dir = content[lang].direction;
  document.documentElement.lang = lang === 'persian' ? 'fa' : 'en';
  // Update active state for buttons
  if (lang === 'persian') {
    persianBtn.classList.add('ph-language-switcher__button--active');
    englishBtn.classList.remove('ph-language-switcher__button--active');
  } else {
    englishBtn.classList.add('ph-language-switcher__button--active');
    persianBtn.classList.remove('ph-language-switcher__button--active');
  }
  // Save language preference to localStorage
  localStorage.setItem('preferredLanguage', lang);
}

// Event Listeners for Language Buttons
persianBtn.addEventListener('click', () => setLanguage('persian'));
englishBtn.addEventListener('click', () => setLanguage('english'));

// Search Functionality
async function performSearch() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== '') {
    const currentLang = localStorage.getItem('preferredLanguage') || 'persian';
    
    try {
      // Display searching message (optional)
      const originalButtonText = searchButton.textContent;
      searchButton.textContent = content[currentLang].searchingMessage;
      searchButton.disabled = true;
      
      // Call search API with query parameter
      const searchResults = await apiCall(`/search/?q=${encodeURIComponent(searchTerm)}`);
      
      console.log('Search results:', searchResults);
      
      // Here you would handle the search results
      // For example, redirect to a search results page with the data
      // window.location.href = `/search-results.html?q=${encodeURIComponent(searchTerm)}`;
      
      // For demonstration purposes, still show an alert
      const alertMessage = currentLang === 'persian'
        ? `جستجو برای: ${searchTerm} - ${searchResults.length} نتیجه یافت شد`
        : `Search for: ${searchTerm} - ${searchResults.length} results found`;
      alert(alertMessage);
      
    } catch (error) {
      console.error('Search failed:', error);
      // Show error message
      alert(content[currentLang].searchErrorMessage);
    } finally {
      // Reset button state
      searchButton.textContent = content[currentLang].searchButton;
      searchButton.disabled = false;
    }
  }
}

// Event listeners for search
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

// Add autocomplete functionality
searchInput.addEventListener('input', async () => {
  const searchTerm = searchInput.value.trim();
  
  // Only call autocomplete API if there's something to search
  if (searchTerm.length >= 2) {
    try {
      const suggestions = await apiCall(`/search/autocomplete?q=${encodeURIComponent(searchTerm)}`);
      
      // Here you would display the autocomplete suggestions
      // This would typically involve creating and updating a dropdown
      console.log('Autocomplete suggestions:', suggestions);
      
      // Implementation of showing suggestions would go here
      // For example:
      // showAutocompleteSuggestions(suggestions);
    } catch (error) {
      console.error('Autocomplete failed:', error);
    }
  }
});

// Initialize language on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Check for previously saved language preference
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'persian';
  setLanguage(savedLanguage);
  // Add active class to initial language button
  if (savedLanguage === 'persian') {
    persianBtn.classList.add('ph-language-switcher__button--active');
  } else {
    englishBtn.classList.add('ph-language-switcher__button--active');
  }
  
  // Fetch popular searches on page load
  try {
    const popularSearches = await apiCall('/search/popular');
    console.log('Popular searches:', popularSearches);
    // Here you would display popular searches if your UI has a section for this
    // For example:
    // displayPopularSearches(popularSearches);
  } catch (error) {
    console.error('Failed to fetch popular searches:', error);
  }
});
/**
 * preventive-features
 * Using BEM naming convention and component-scoped structure
 */
document.addEventListener('DOMContentLoaded', function() {
  // API URLs
  const API_BASE_URL = '/api/preventive-featured';
  
  // API Functions
  const api = {
    getArticles: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
      }
    },
    
    getArticle: async (articleId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}`);
        return await response.json();
      } catch (error) {
        console.error(`Error fetching article ${articleId}:`, error);
        return null;
      }
    },
    
    getFeaturedArticles: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/featured-articles`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching featured articles:', error);
        return [];
      }
    },
    
    getResources: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/resources`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching resources:', error);
        return [];
      }
    },
    
    getResource: async (resourceId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`);
        return await response.json();
      } catch (error) {
        console.error(`Error fetching resource ${resourceId}:`, error);
        return null;
      }
    },
    
    getCategories: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    
    getCategory: async (categoryId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
        return await response.json();
      } catch (error) {
        console.error(`Error fetching category ${categoryId}:`, error);
        return null;
      }
    },
    
    getSubcategories: async (categoryId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories`);
        return await response.json();
      } catch (error) {
        console.error(`Error fetching subcategories for category ${categoryId}:`, error);
        return [];
      }
    },
    
    getHealthTopics: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health-topics`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching health topics:', error);
        return [];
      }
    },
    
    getHealthCalendar: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health-calendar`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching health calendar:', error);
        return [];
      }
    },
    
    getPreventiveTips: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/preventive-tips`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching preventive tips:', error);
        return [];
      }
    }
  };

  // Original Modal Functionality
  const showModalButtons = document.querySelectorAll('.js-show-modal');
  const closeModalButtons = document.querySelectorAll('.js-close-modal');
  const modals = document.querySelectorAll('.js-modal');
  
  showModalButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const modalId = this.dataset.modalId;
      const modal = document.getElementById(modalId);
      const fullContent = document.getElementById(`full-content-${modalId.substring(modalId.length - 1)}`);
      
      modal.classList.add('is-active');
      modal.querySelector('.preventive-featured__modal-content').innerHTML = fullContent.innerHTML; // محتوا را به مدال اضافه می‌کنیم
      document.body.style.overflow = 'hidden'; // از اسکرول کردن صفحه جلوگیری می‌کنیم
    });
  });
  
  closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.js-modal');
      modal.classList.remove('is-active');
      document.body.style.overflow = 'auto'; // اجازه اسکرول کردن صفحه را می‌دهیم
    });
  });
  
  // بستن مدال با کلیک خارج از مدال
  document.addEventListener('click', function(event) {
    if (event.target === document.querySelector('.js-modal.is-active')) {
      document.querySelector('.js-modal.is-active').classList.remove('is-active');
      document.body.style.overflow = 'auto';
    }
  });
  
  // بستن مدال با زدن کلید Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.querySelector('.js-modal.is-active')) {
      document.querySelector('.js-modal.is-active').classList.remove('is-active');
      document.body.style.overflow = 'auto';
    }
  });

  // Function to load featured articles
  const loadFeaturedArticles = async () => {
    const featuredArticlesContainer = document.querySelector('.preventive-featured__articles');
    if (!featuredArticlesContainer) return;
    
    try {
      const featuredArticles = await api.getFeaturedArticles();
      if (featuredArticles && featuredArticles.length > 0) {
        renderFeaturedArticles(featuredArticles, featuredArticlesContainer);
      }
    } catch (error) {
      console.error('Error loading featured articles:', error);
    }
  };

  // Function to render featured articles
  const renderFeaturedArticles = (articles, container) => {
    // Add your rendering logic here based on your HTML structure
    // This is just a placeholder and should be adjusted to match your BEM structure
  };

  // Initialize API data loading
  const initializeData = async () => {
    await loadFeaturedArticles();
    // Add other initialization functions as needed
  };

  // Call initialization function
  initializeData();
});
/**
 * Health Risk Assessment Application
 * Using BEM naming convention and component-scoped structure
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const landingBox = document.getElementById('landing-box');
    const mainContainer = document.getElementById('main-container');
    const startAssessmentBtn = document.getElementById('start-assessment');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const tabButtons = document.querySelectorAll('.tabs__btn');
    const formSections = document.querySelectorAll('.form-section');
    const nextButtons = document.querySelectorAll('.btn--next');
    const prevButtons = document.querySelectorAll('.btn--prev');
    const form = document.getElementById('risk-assessment-form');
    const resultsSection = document.getElementById('results');
    const printResultsBtn = document.getElementById('print-results');
    const emailResultsBtn = document.getElementById('email-results');
    const restartBtn = document.getElementById('restart-assessment');
    
    // Section order for progress tracking
    const sectionOrder = ['demographic', 'medical-history', 'lifestyle', 'chronic-risks', 'acute-risks'];
    let currentSection = 0;
    
    // API endpoints
    const API_ENDPOINTS = {
        ASSESS: '/api/risk-assessment/assess',
        GET_FACTORS: '/api/risk-assessment/factors',
        GET_RECOMMENDATIONS: '/api/risk-assessment/recommendations/',
        SAVE_ASSESSMENT: '/api/risk-assessment/save-assessment'
    };
    
    // Event Listeners
    startAssessmentBtn.addEventListener('click', startAssessment);
    tabButtons.forEach(button => button.addEventListener('click', switchTab));
    nextButtons.forEach(button => button.addEventListener('click', goToNextSection));
    prevButtons.forEach(button => button.addEventListener('click', goToPrevSection));
    form.addEventListener('submit', submitForm);
    printResultsBtn.addEventListener('click', printResults);
    emailResultsBtn.addEventListener('click', emailResults);
    restartBtn.addEventListener('click', restartAssessment);
    
    // Fetch risk factors when the page loads
    fetchRiskFactors();
    
    // Functions
    function startAssessment() {
        landingBox.style.display = 'none';
        mainContainer.style.display = 'block';
        updateProgress();
    }
    
    function switchTab(e) {
        // Get the tab id from data-tab attribute
        const tabId = e.target.getAttribute('data-tab');
        
        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('tabs__btn--active'));
        e.target.classList.add('tabs__btn--active');
        
        // Update active form section
        formSections.forEach(section => section.classList.remove('form-section--active'));
        document.getElementById(tabId).classList.add('form-section--active');
        
        // Update progress
        currentSection = sectionOrder.indexOf(tabId);
        updateProgress();
    }
    
    function goToNextSection(e) {
        // Get next tab id from data-next attribute
        const nextTabId = e.target.getAttribute('data-next');
        
        // Validate current section before proceeding
        if (validateCurrentSection()) {
            // Update active tab button
            tabButtons.forEach(btn => {
                if (btn.getAttribute('data-tab') === nextTabId) {
                    btn.classList.add('tabs__btn--active');
                } else {
                    btn.classList.remove('tabs__btn--active');
                }
            });
            
            // Update active form section
            formSections.forEach(section => {
                section.classList.remove('form-section--active');
                if (section.id === nextTabId) {
                    section.classList.add('form-section--active');
                }
            });
            
            // Update progress
            currentSection = sectionOrder.indexOf(nextTabId);
            updateProgress();
        }
    }
    
    function goToPrevSection(e) {
        // Get previous tab id from data-prev attribute
        const prevTabId = e.target.getAttribute('data-prev');
        
        // Update active tab button
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === prevTabId) {
                btn.classList.add('tabs__btn--active');
            } else {
                btn.classList.remove('tabs__btn--active');
            }
        });
        
        // Update active form section
        formSections.forEach(section => {
            section.classList.remove('form-section--active');
            if (section.id === prevTabId) {
                section.classList.add('form-section--active');
            }
        });
        
        // Update progress
        currentSection = sectionOrder.indexOf(prevTabId);
        updateProgress();
    }
    
    function updateProgress() {
        const totalSections = sectionOrder.length;
        const percentage = Math.floor(((currentSection + 1) / totalSections) * 100);
        progressBar.style.width = percentage + '%';
        progressPercentage.textContent = percentage + '%';
    }
    
    function validateCurrentSection() {
        // Get current section
        const activeSection = document.querySelector('.form-section--active');
        
        // Check required fields in the current section
        const requiredFields = activeSection.querySelectorAll('[required]');
        let valid = true;
        
        requiredFields.forEach(field => {
            // For radio buttons, check if any in the group is selected
            if (field.type === 'radio') {
                const name = field.name;
                const checkedRadio = activeSection.querySelector(`input[name="${name}"]:checked`);
                if (!checkedRadio) {
                    valid = false;
                    // Find the parent form-group and add error class
                    const formGroup = field.closest('.form-group');
                    formGroup.classList.add('form-group--error');
                    setTimeout(() => formGroup.classList.remove('form-group--error'), 3000);
                }
            } else if (!field.value) {
                valid = false;
                // Add error class to the field
                field.classList.add('form-group__input--error');
                setTimeout(() => field.classList.remove('form-group__input--error'), 3000);
            }
        });
        
        return valid;
    }
    
    async function submitForm(e) {
        e.preventDefault();
        
        // Validate current section before submitting
        if (validateCurrentSection()) {
            // Collect form data
            const formData = new FormData(form);
            const formDataObj = Object.fromEntries(formData.entries());
            
            // Handle multiple select values
            for (const key of formData.keys()) {
                if (formData.getAll(key).length > 1) {
                    formDataObj[key] = formData.getAll(key);
                }
            }
            
            try {
                // Use the API to calculate risk scores
                const response = await fetch(API_ENDPOINTS.ASSESS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataObj)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to assess risk');
                }
                
                const riskScores = await response.json();
                
                // Update risk visualization in results
                updateRiskVisualization(riskScores);
                
                // Generate recommendations based on API results
                await fetchRecommendations(riskScores);
                
                // Save assessment results
                saveAssessment(formDataObj, riskScores);
                
                // Show results section
                mainContainer.querySelector('.assessment-form').style.display = 'none';
                resultsSection.style.display = 'block';
            } catch (error) {
                console.error('Error during form submission:', error);
                alert('خطا در ارزیابی ریسک. لطفاً دوباره تلاش کنید.');
                
                // Fallback to client-side calculation if API fails
                const fallbackScores = calculateRiskScores(formData);
                updateRiskVisualization(fallbackScores);
                generateRecommendations(fallbackScores, formData);
                
                // Show results section with fallback data
                mainContainer.querySelector('.assessment-form').style.display = 'none';
                resultsSection.style.display = 'block';
            }
        }
    }
    
    // Fallback risk calculation function (unchanged)
    function calculateRiskScores(formData) {
        // Initialize risk scores
        const scores = {
            heart: 0,
            diabetes: 0,
            respiratory: 0,
            infectious: 0
        };
        
        // Calculate heart disease risk
        // Age factor
        const age = parseInt(formData.get('age'));
        if (age > 50) scores.heart += 20;
        else if (age > 40) scores.heart += 15;
        else if (age > 30) scores.heart += 10;
        
        // Gender factor
        if (formData.get('gender') === 'male') scores.heart += 5;
        
        // BMI calculation
        const height = parseInt(formData.get('height')) / 100; // convert to meters
        const weight = parseInt(formData.get('weight'));
        const bmi = weight / (height * height);
        
        if (bmi > 30) {
            scores.heart += 15;
            scores.diabetes += 20;
        } else if (bmi > 25) {
            scores.heart += 10;
            scores.diabetes += 15;
        }
        
        // Existing conditions
        const existingConditions = formData.getAll('existing_conditions');
        if (existingConditions.includes('hypertension')) scores.heart += 25;
        if (existingConditions.includes('diabetes')) {
            scores.heart += 20;
            scores.diabetes += 50;
        }
        if (existingConditions.includes('heart_disease')) scores.heart += 40;
        if (existingConditions.includes('copd') || existingConditions.includes('asthma')) {
            scores.respiratory += 40;
        }
        
        // Family history
        const familyHistory = formData.getAll('family_history');
        if (familyHistory.includes('hypertension')) scores.heart += 10;
        if (familyHistory.includes('diabetes')) scores.diabetes += 15;
        if (familyHistory.includes('heart_disease')) scores.heart += 15;
        
        // Lifestyle factors
        if (formData.get('smoking') === 'current') {
            scores.heart += 25;
            scores.respiratory += 30;
        } else if (formData.get('smoking') === 'former') {
            scores.heart += 15;
            scores.respiratory += 20;
        }
        
        if (formData.get('alcohol') === 'heavy') scores.heart += 15;
        
        if (formData.get('exercise') === 'none') {
            scores.heart += 15;
            scores.diabetes += 15;
        }
        
        if (formData.get('diet') === 'poor') {
            scores.heart += 15;
            scores.diabetes += 20;
        }
        
        // Chronic risk factors
        if (formData.get('blood_pressure') === 'stage2' || formData.get('blood_pressure') === 'crisis') {
            scores.heart += 25;
        }
        
        if (formData.get('cholesterol') === 'high' || formData.get('cholesterol') === 'very_high') {
            scores.heart += 20;
        }
        
        if (formData.get('blood_sugar') === 'prediabetes') {
            scores.diabetes += 30;
        } else if (formData.get('blood_sugar') === 'diabetes') {
            scores.diabetes += 50;
        }
        
        // Acute risk factors
        if (formData.get('infectious_exposure') === 'yes') scores.infectious += 25;
        
        const vaccinations = [
            formData.get('flu_vaccine') === 'yes' ? -10 : 0,
            formData.get('covid_vaccine') === 'full' ? -15 : 0
        ];
        scores.infectious += vaccinations.reduce((a, b) => a + b, 0);
        
        const symptoms = formData.getAll('symptoms');
        scores.infectious += symptoms.length * 5;
        
        if (formData.get('high_risk_environment') === 'yes') scores.infectious += 15;
        if (formData.get('travel_risk') === 'yes') scores.infectious += 10;
        
        // Normalize scores to 0-100 range
        for (const key in scores) {
            scores[key] = Math.min(Math.max(scores[key], 0), 100);
        }
        
        return scores;
    }
    
    function updateRiskVisualization(scores) {
        document.getElementById('heart-risk').style.width = scores.heart + '%';
        document.getElementById('diabetes-risk').style.width = scores.diabetes + '%';
        document.getElementById('respiratory-risk').style.width = scores.respiratory + '%';
        document.getElementById('infectious-risk').style.width = scores.infectious + '%';
        
        // Update risk labels
        const riskLabels = document.querySelectorAll('.risk-chart__label');
        const riskLevels = [
            { score: scores.heart, index: 0 },
            { score: scores.diabetes, index: 1 },
            { score: scores.respiratory, index: 2 },
            { score: scores.infectious, index: 3 }
        ];
        
        riskLevels.forEach(item => {
            let label = '';
            if (item.score < 20) label = 'کم';
            else if (item.score < 40) label = 'متوسط-کم';
            else if (item.score < 60) label = 'متوسط';
            else if (item.score < 80) label = 'متوسط-بالا';
            else label = 'بالا';
            
            riskLabels[item.index].textContent = label;
        });
    }
    
    // API function to fetch risk factors
    async function fetchRiskFactors() {
        try {
            const response = await fetch(API_ENDPOINTS.GET_FACTORS);
            if (!response.ok) {
                throw new Error('Failed to fetch risk factors');
            }
            
            const factors = await response.json();
            
            // This function would update the UI based on returned risk factors
            // For example, it could populate dropdowns or checkboxes
            // Implementation depends on your specific UI structure
            // updateRiskFactorsUI(factors);
            
        } catch (error) {
            console.error('Error fetching risk factors:', error);
            // Fallback to existing UI structure
        }
    }
    
    // API function to fetch recommendations
    async function fetchRecommendations(riskScores) {
        try {
            const recommendationsList = document.getElementById('recommendations-list');
            recommendationsList.innerHTML = '';
            
            // Determine highest risk factor
            const highestRisk = Object.entries(riskScores).reduce(
                (max, [key, value]) => value > max.value ? {key, value} : max, 
                {key: '', value: -1}
            );
            
            // Fetch recommendations for highest risk factor
            const response = await fetch(API_ENDPOINTS.GET_RECOMMENDATIONS + highestRisk.key);
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }
            
            const recommendations = await response.json();
            
            // Update recommendations list
            recommendations.forEach(rec => {
                const li = document.createElement('li');
                li.className = 'recommendations__item';
                li.textContent = rec;
                recommendationsList.appendChild(li);
            });
            
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            // Fallback to client-side recommendation generation
            const formData = new FormData(form);
            generateRecommendations(riskScores, formData);
        }
    }
    
    // Fallback recommendations function (unchanged)
    function generateRecommendations(scores, formData) {
        const recommendations = [];
        
        // General recommendations
        recommendations.push('برنامه منظم ورزشی را حفظ کنید - حداقل 150 دقیقه فعالیت متوسط در هفته');
        recommendations.push('رژیم غذایی متعادل و سرشار از میوه‌ها و سبزیجات داشته باشید');
        recommendations.push('چکاپ سالانه انجام دهید');
        
        // Heart-specific recommendations
        if (scores.heart > 20) {
            recommendations.push('به طور منظم فشار خون و سطح کلسترول خود را چک کنید');
            
            if (formData.get('smoking') === 'current') {
                recommendations.push('برای ترک سیگار برنامه‌ریزی کنید - از پزشک خود کمک بخواهید');
            }
            
            if (formData.get('blood_pressure') === 'stage1' || 
                formData.get('blood_pressure') === 'stage2' || 
                formData.get('blood_pressure') === 'crisis') {
                recommendations.push('فشار خون خود را به طور منظم کنترل کنید و با پزشک خود مشورت کنید');
            }
        }
        
        // Diabetes-specific recommendations
        if (scores.diabetes > 30) {
            recommendations.push('قند خون خود را به طور منظم چک کنید');
            
            if (formData.get('diet') === 'poor' || formData.get('diet') === 'average') {
                recommendations.push('مصرف کربوهیدرات‌های تصفیه شده و قندهای افزوده را کاهش دهید');
            }
        }
        
        // Respiratory-specific recommendations
        if (scores.respiratory > 30) {
            if (formData.get('smoking') === 'current') {
                recommendations.push('ترک سیگار می‌تواند به طور قابل توجهی خطر بیماری‌های تنفسی را کاهش دهد');
            }
            
            recommendations.push('از قرار گرفتن در معرض آلاینده‌های هوا و محرک‌های تنفسی خودداری کنید');
        }
        
        // Infectious disease recommendations
        if (scores.infectious > 20) {
            recommendations.push('شستن منظم دست‌ها و رعایت بهداشت شخصی را در اولویت قرار دهید');
            
            if (formData.get('flu_vaccine') !== 'yes') {
                recommendations.push('واکسن آنفولانزای فصلی در نظر بگیرید');
            }
            
            if (formData.get('covid_vaccine') !== 'full') {
                recommendations.push('واکسیناسیون کامل کووید-19 را در نظر بگیرید');
            }
        }
        
        // Update recommendations list
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '';
        
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.className = 'recommendations__item';
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
    }
    
    // API function to save assessment results
    async function saveAssessment(formData, riskScores) {
        try {
            const assessmentData = {
                user_data: formData,
                risk_scores: riskScores,
                timestamp: new Date().toISOString()
            };
            
            const response = await fetch(API_ENDPOINTS.SAVE_ASSESSMENT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assessmentData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save assessment');
            }
            
            // Assessment saved successfully
            console.log('Assessment saved successfully');
            
        } catch (error) {
            console.error('Error saving assessment:', error);
            // Continue without saving - this doesn't affect the user experience
        }
    }
    
    function printResults() {
        window.print();
    }
    
    function emailResults() {
        // Email functionality would require server-side integration
        // For now, just show an alert
        alert('این قابلیت در حال حاضر در دسترس نیست. لطفاً در آینده دوباره امتحان کنید.');
    }
    
    function restartAssessment() {
        // Reset form
        form.reset();
        
        // Show form and hide results
        mainContainer.querySelector('.assessment-form').style.display = 'block';
        resultsSection.style.display = 'none';
        
        // Reset to first section
        formSections.forEach(section => section.classList.remove('form-section--active'));
        document.getElementById('demographic').classList.add('form-section--active');
        
        tabButtons.forEach(btn => btn.classList.remove('tabs__btn--active'));
        tabButtons[0].classList.add('tabs__btn--active');
        
        currentSection = 0;
        updateProgress();
    }
});
/**
 * Symptom Checker Application
 * Uses BEM structure and namespacing
 */
// Wrap everything in a namespace to avoid global conflicts
// symptom-checker.js
class SymptomChecker {
    constructor() {
        this.landingContainer = document.querySelector('.symptom-checker__landing-container');
        this.mainContainer = document.querySelector('.symptom-checker__main-container');
        this.startButton = document.querySelector('.symptom-checker__start-button');
        this.backButton = document.querySelector('.symptom-checker__back-button');
        this.checkButton = document.querySelector('.symptom-checker__check-button');
        this.newCheckButton = document.querySelector('.symptom-checker__new-check-button');
        this.resultsSection = document.querySelector('.symptom-checker__results-section');
        this.errorMessage = document.querySelector('.symptom-checker__error-message');
        this.aiResponseDiv = document.querySelector('.symptom-checker__ai-response');
        this.spinner = document.querySelector('.symptom-checker__spinner');
        this.buttonText = document.querySelector('.symptom-checker__button-text');

        this.ageInput = document.getElementById('age');
        this.genderSelect = document.getElementById('gender');
        this.durationSelect = document.getElementById('duration');
        this.symptomInput = document.getElementById('symptom');

        this.bindEvents();
        
        // Base API URL
        this.apiBaseUrl = 'https://preventivecare-backend.onrender.com';
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.showMainContainer());
        this.backButton.addEventListener('click', () => this.showLandingContainer());
        this.newCheckButton.addEventListener('click', () => this.resetChecker());
        this.checkButton.addEventListener('click', () => this.handleSymptomCheck());
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('symptom-checker__hidden');
    }

    hideError() {
        this.errorMessage.classList.add('symptom-checker__hidden');
    }

    clearForm() {
        this.ageInput.value = '';
        this.genderSelect.value = '';
        this.durationSelect.value = '';
        this.symptomInput.value = '';
    }

    showMainContainer() {
        this.landingContainer.classList.add('symptom-checker__hidden');
        this.mainContainer.classList.remove('symptom-checker__hidden');
    }

    showLandingContainer() {
        this.mainContainer.classList.add('symptom-checker__hidden');
        this.landingContainer.classList.remove('symptom-checker__hidden');
        this.resultsSection.classList.add('symptom-checker__hidden');
        this.hideError();
        this.clearForm();
    }

    resetChecker() {
        this.resultsSection.classList.add('symptom-checker__hidden');
        this.hideError();
        this.clearForm();
    }

    async handleSymptomCheck() {
        this.hideError();
        const age = this.ageInput.value;
        const gender = this.genderSelect.value;
        const duration = this.durationSelect.value;
        const symptom = this.symptomInput.value;

        if (!age || !gender || !duration || !symptom) {
            this.showError('لطفاً تمام فیلدها را پر کنید.');
            return;
        }

        this.showLoadingState();

        try {
            // First analyze the symptoms with the new /api/symptom-checker/analyze endpoint
            const analysisResult = await this.analyzeSymptoms(age, gender, symptom, duration);
            
            if (!analysisResult) {
                throw new Error('تحلیل علائم با خطا مواجه شد.');
            }
            
            // Then check/verify the analysis with the test endpoint
            const testResult = await this.testAnalysis(analysisResult.analysisId || analysisResult.id);
            
            if (testResult) {
                this.aiResponseDiv.textContent = testResult.diagnosis || testResult.result;
                this.resultsSection.classList.remove('symptom-checker__hidden');
            } else {
                this.showError('پاسخی از سرور دریافت نشد.');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message || 'خطا در برقراری ارتباط با سرور.');
        } finally {
            this.hideLoadingState();
        }
    }

    // New method for the analyze endpoint
    async analyzeSymptoms(age, gender, symptoms, duration) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/symptom-checker/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ age, gender, symptoms, duration })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Analysis Error:', errorData);
                throw new Error(errorData.message || 'خطا در تحلیل علائم.');
            }

            const data = await response.json();
            console.log('Analysis Result:', data);
            return data;
        } catch (error) {
            console.error('Analysis Fetch error:', error);
            throw error;
        }
    }

    // New method for the test endpoint
    async testAnalysis(analysisId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/symptom-checker/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ analysisId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Test Error:', errorData);
                throw new Error(errorData.message || 'خطا در بررسی نتایج.');
            }

            const data = await response.json();
            console.log('Test Result:', data);
            return data;
        } catch (error) {
            console.error('Test Fetch error:', error);
            throw error;
        }
    }

    // Keep the original method for backward compatibility
    async checkSymptoms(age, gender, symptoms, duration) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/symptom-checker/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ age, gender, symptoms, duration })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                throw new Error(errorData.message || 'An error occurred.');
            }

            const data = await response.json();
            console.log(data);
            return data.diagnosis;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    showLoadingState() {
        this.spinner.classList.remove('symptom-checker__hidden');
        this.buttonText.textContent = 'در حال بررسی...';
    }

    hideLoadingState() {
        this.spinner.classList.add('symptom-checker__hidden');
        this.buttonText.textContent = 'بررسی علائم';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new SymptomChecker();
});
// Health Exploration Component JavaScript (Scoped to "he" namespace)
// Function to fetch articles and populate the cards
// Add event listeners to all "مشاهده مقاله" buttons
document.querySelectorAll('.he-card__btn').forEach(button => {
  button.addEventListener('click', event => {
    // Get the card to identify the content to display
    const card = event.target.closest('.he-card');
    // Extract the details from the corresponding card
    const paperTitle = card.querySelector('.he-paper__title').textContent;
    const paperAbstract = card.querySelector('.he-paper__abstract').innerHTML;
    // Extract paper ID from the card's data attribute (assuming it exists)
    const paperId = card.dataset.paperId;
    
    // Populate the modal content with the paper details
    const modal = document.querySelector('.he-modal');
    modal.querySelector('.he-modal__title').textContent = paperTitle;
    modal.querySelector('.he-modal__body').innerHTML = paperAbstract;
    
    // Update download button with correct paper ID
    const downloadBtn = modal.querySelector('.he-modal__download-btn');
    if (downloadBtn) {
      downloadBtn.dataset.paperId = paperId;
    }
    
    // Show the modal by adding the active class
    modal.classList.add('he-modal--active');
    document.body.classList.add('he-modal-open');
  });
});

// Add event listener for download button
document.querySelectorAll('.he-modal__download-btn').forEach(button => {
  button.addEventListener('click', event => {
    const paperId = event.target.dataset.paperId;
    if (paperId) {
      // Call the API to download the paper
      fetch(`/api/health-exploration/papers/${paperId}/download`, {
        method: 'GET',
      })
      .then(response => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Network response was not ok');
      })
      .then(blob => {
        // Create a link and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `paper-${paperId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading paper:', error);
        alert('Failed to download paper. Please try again later.');
      });
    }
  });
});

// Original modal close functionality
document.querySelector('.he-modal__close').addEventListener('click', () => {
  const modal = document.querySelector('.he-modal');
  modal.classList.remove('he-modal--active'); // Hide the modal
  document.body.classList.remove('he-modal-open'); // Restore body scrolling
});

// Add event listener to modal close button in the footer (if present)
document.querySelector('.he-modal__btn--close').addEventListener('click', () => {
  const modal = document.querySelector('.he-modal');
  modal.classList.remove('he-modal--active'); // Hide the modal
  document.body.classList.remove('he-modal-open'); // Restore body scrolling
});

// Close modal if background is clicked
document.querySelector('.he-modal').addEventListener('click', event => {
  if (event.target === event.currentTarget) {
    document.querySelector('.he-modal').classList.remove('he-modal--active');
    document.body.classList.remove('he-modal-open');
  }
});

/* Global Variables */
let currentUser = null;
let currentRoom = null;
let socket = null;
/* Health Chat Module with Namespacing */
const HealthChat = (function() {
  /* Private Variables */
  let currentUser = null;
  let currentRoom = null;
  let socket = null;
  let reconnectionAttempts = 0;
  const maxReconnectionAttempts = 5;
  const API_BASE_URL = '/api/health-chat';

  /* DOM Elements Cache */
  let DOM = {};

  /* Initialize the module */
  function init() {
    cacheDOM();
    bindEvents();
  }

  /* Cache DOM references */
  function cacheDOM() {
    DOM = {
      authContainer: document.querySelector('#health-chat__auth-container'),
      chatContainer: document.querySelector('#health-chat__chat-container'),
      loginForm: document.querySelector('#health-chat__login-form'),
      registerForm: document.querySelector('#health-chat__register-form'),
      showRegisterLink: document.querySelector('#health-chat__show-register'),
      showLoginLink: document.querySelector('#health-chat__show-login'),
      loginBtn: document.querySelector('#health-chat__login-btn'),
      registerBtn: document.querySelector('#health-chat__register-btn'),
      logoutBtn: document.querySelector('#health-chat__logout-btn'),
      username: document.querySelector('#health-chat__username'),
      password: document.querySelector('#health-chat__password'),
      regUsername: document.querySelector('#health-chat__reg-username'),
      regPassword: document.querySelector('#health-chat__reg-password'),
      regConfirmPassword: document.querySelector('#health-chat__reg-confirm-password'),
      currentUser: document.querySelector('#health-chat__current-user span'),
      currentRoom: document.querySelector('#health-chat__current-room'),
      roomItems: document.querySelectorAll('.health-chat__sidebar-room'),
      sendBtn: document.querySelector('#health-chat__send-btn'),
      messageInput: document.querySelector('#health-chat__message-input'),
      messages: document.querySelector('#health-chat__messages'),
      onlineCount: document.querySelector('#health-chat__online-count')
    };
  }

  /* Bind Events */
  function bindEvents() {
    // Only bind events if elements exist
    if (!DOM.authContainer) {
      console.error('Required DOM elements not found');
      return;
    }

    // Toggle forms between login and registration
    if (DOM.showRegisterLink) {
      DOM.showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        DOM.registerForm.classList.remove('health-chat__form--hidden');
        DOM.loginForm.classList.add('health-chat__form--hidden');
      });
    }

    if (DOM.showLoginLink) {
      DOM.showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        DOM.loginForm.classList.remove('health-chat__form--hidden');
        DOM.registerForm.classList.add('health-chat__form--hidden');
      });
    }

    // Handle Login
    if (DOM.loginBtn) {
      DOM.loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const username = DOM.username.value.trim();
        const password = DOM.password.value.trim();

        if (validateLogin(username, password)) {
          // Call API for login
          loginUser(username, password);
        } else {
          alert('نام کاربری یا رمز عبور نامعتبر است!');
        }
      });
    }

    // Handle Register
    if (DOM.registerBtn) {
      DOM.registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const username = DOM.regUsername.value.trim();
        const password = DOM.regPassword.value.trim();
        const confirmPassword = DOM.regConfirmPassword.value.trim();

        if (validateRegistration(username, password, confirmPassword)) {
          // Call API for registration
          registerUser(username, password);
        } else {
          alert('ثبت نام ناموفق بود! لطفا ورودی های خود را بررسی کنید.');
        }
      });
    }

    // Logout
    if (DOM.logoutBtn) {
      DOM.logoutBtn.addEventListener('click', () => {
        // Call API for logout
        logoutUser();
      });
    }

    // Room Selection
    if (DOM.roomItems && DOM.roomItems.length) {
      DOM.roomItems.forEach(room => {
        room.addEventListener('click', () => {
          const roomName = room.dataset.room;
          handleRoomSelection(roomName);
        });
      });
    }

    // Send message
    if (DOM.sendBtn) {
      DOM.sendBtn.addEventListener('click', () => {
        sendCurrentMessage();
      });
    }

    // Send message on Enter key - improved implementation
    if (DOM.messageInput) {
      DOM.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // Prevent default to avoid newline
          sendCurrentMessage();
        }
      });
    }
  }

  /* API Functions */
  async function fetchAPI(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }
      
      // For endpoints that might return no content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async function loginUser(username, password) {
    try {
      await fetchAPI('/login', 'POST', { username, password });
      currentUser = username;
      showChatInterface(username);
    } catch (error) {
      alert('ورود ناموفق بود! نام کاربری یا رمز عبور اشتباه است.');
      console.error('Login error:', error);
    }
  }

  async function registerUser(username, password) {
    try {
      await fetchAPI('/register', 'POST', { username, password });
      alert('ثبت نام با موفقیت انجام شد! لطفا وارد شوید.');
      DOM.showLoginLink.click();
    } catch (error) {
      alert('ثبت نام ناموفق بود! لطفا ورودی های خود را بررسی کنید.');
      console.error('Registration error:', error);
    }
  }

  async function logoutUser() {
    try {
      await fetchAPI('/logout', 'POST');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Continue with original logout logic
    currentUser = null;
    currentRoom = null;
    disconnectSocket();
    DOM.chatContainer.classList.add('health-chat__chat--hidden');
    DOM.authContainer.classList.remove('hidden');
  }

  async function fetchRooms() {
    try {
      return await fetchAPI('/rooms');
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  }

  async function getRoomData(roomId) {
    try {
      return await fetchAPI(`/rooms/${roomId}`);
    } catch (error) {
      console.error('Error getting room data:', error);
      return null;
    }
  }

  async function fetchMessages(roomId) {
    try {
      return await fetchAPI(`/rooms/${roomId}/messages`);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async function sendMessageAPI(roomId, message) {
    try {
      await fetchAPI(`/rooms/${roomId}/messages`, 'POST', { 
        message,
        time: new Date().toLocaleTimeString()
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  /* Send the current message */
  function sendCurrentMessage() {
    const message = DOM.messageInput.value.trim();
    if (message && currentRoom) {
      sendMessage(message);
      DOM.messageInput.value = '';
    }
  }

  /* Form Validation */
  function validateLogin(username, password) {
    return username !== '' && password !== '';
  }

  function validateRegistration(username, password, confirmPassword) {
    if (username === '' || password === '' || confirmPassword === '') {
      return false;
    }
    if (password !== confirmPassword) {
      return false;
    }
    return true;
  }

  /* Chat Functions */
  function showChatInterface(username) {
    DOM.authContainer.classList.add('hidden');
    DOM.chatContainer.classList.remove('health-chat__chat--hidden');
    if (DOM.currentUser) {
      DOM.currentUser.textContent = username;
    }
    connectSocket();
  }

  function handleRoomSelection(roomName) {
    if (!currentUser) {
      alert('لطفا ابتدا وارد شوید!');
      return;
    }

    currentRoom = roomName;
    if (DOM.currentRoom) {
      DOM.currentRoom.textContent = getRoomTitle(roomName);
    }

    if (DOM.roomItems && DOM.roomItems.length) {
      DOM.roomItems.forEach(room => {
        room.classList.remove('health-chat__sidebar-room--active');
      });
      const selectedRoom = document.querySelector(`.health-chat__sidebar-room[data-room="${roomName}"]`);
      if (selectedRoom) {
        selectedRoom.classList.add('health-chat__sidebar-room--active');
      }
    }

    // Notify server and join the room
    joinRoom(roomName);

    // Clear previous messages
    if (DOM.messages) {
      DOM.messages.innerHTML = '';
    }
    
    // Load messages from API
    fetchMessages(roomName).then(messages => {
      if (messages && messages.length) {
        messages.forEach(msg => {
          addMessageToChat(msg.username, msg.message, msg.time, msg.username === currentUser);
        });
      }
    });
  }

  /* Socket.IO Initialization */
  function connectSocket() {
    if (socket && socket.connected) {
      console.log('Socket already connected.');
      return;
    }

    try {
      // Replace with your actual server URL
      socket = io("https://www.wellnesssentinel.ir", {
        transports: ["websocket", "polling"],
        reconnectionAttempts: maxReconnectionAttempts
      });

      socket.on('connect', () => {
        console.log('Connected to socket server.');
        reconnectionAttempts = 0; // Reset reconnection attempts
        // If user was already in a room, rejoin it
        if (currentUser && currentRoom) {
          joinRoom(currentRoom);
        }
      });

      socket.on('message', data => {
        addMessageToChat(data.username, data.message, data.time);
      });

      socket.on('roomUsers', data => {
        if (DOM.onlineCount) {
          DOM.onlineCount.textContent = data.users.length;
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        displayErrorMessage('اتصال به سرور با مشکل مواجه شد. لطفا مجددا تلاش کنید.');
        reconnectWithDelay();
      });

       socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Attempting to reconnect... (attempt ${attemptNumber})`);
        displayErrorMessage(`تلاش برای اتصال مجدد... (تلاش ${attemptNumber})`);
      });

      socket.on('reconnect_error', (error) => {
        console.error('Reconnection error:', error);
        displayErrorMessage(`خطا در اتصال مجدد: ${error}`);
      });

      socket.on('reconnect_failed', () => {
        console.error('Reconnection failed.');
        displayErrorMessage('اتصال مجدد ناموفق بود. لطفا بعدا امتحان کنید.');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from the socket server.');
        displayErrorMessage('اتصال به سرور قطع شد.');
      });
    } catch (error) {
      console.error('Socket initialization error:', error);
      displayErrorMessage('مشکل در برقراری ارتباط با سرور.');
      reconnectWithDelay();
    }
  }

  function disconnectSocket() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }

  /* Helper Functions */
  function sendMessage(message) {
    const time = new Date().toLocaleTimeString();

    // Send message through API
    sendMessageAPI(currentRoom, message);

    // Also send through socket if connected
    if (socket && socket.connected) {
      socket.emit('chatMessage', { username: currentUser, message, time });
      addMessageToChat(currentUser, message, time, true);
    } else {
      console.warn('Socket not connected. Reconnecting before sending message.');
      connectSocket();
      setTimeout(() => {
        if (socket && socket.connected) {
          socket.emit('chatMessage', { username: currentUser, message, time });
        }
        addMessageToChat(currentUser, message, time, true);
      }, 1000);
    }
  }

  function addMessageToChat(username, message, time, isSelf = false) {
    if (!DOM.messages) return;

    const messageEl = document.createElement('div');
    messageEl.className = isSelf ? 'health-chat__message health-chat__message--self' : 'health-chat__message';

    messageEl.innerHTML = `
      <p class="health-chat__message-info">
        <span class="health-chat__message-username">${username}</span>
        <span class="health-chat__message-time">${time}</span>
      </p>
      <p class="health-chat__message-text">${message}</p>
    `;

    DOM.messages.appendChild(messageEl);
    DOM.messages.scrollTop = DOM.messages.scrollHeight;
  }

  function getRoomTitle(roomKey) {
    const roomTitles = {
      'heart-health': 'سلامت قلب',
      'cancer-prevention': 'پیشگیری از سرطان',
      'diabetes-management': 'مدیریت دیابت',
      'mental-health': 'سلامت روان',
      'nutrition': 'تغذیه'
    };
    return roomTitles[roomKey] || 'نامشخص';
  }

  function displayErrorMessage(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'health-chat__message health-chat__message--error';
    errorEl.textContent = message;
    DOM.messages.appendChild(errorEl);
    DOM.messages.scrollTop = DOM.messages.scrollHeight;
  }

  function reconnectWithDelay() {
    if (reconnectionAttempts < maxReconnectionAttempts) {
      reconnectionAttempts++;
      const delay = reconnectionAttempts * 2000; // Exponential backoff
      console.log(`Attempting to reconnect in ${delay}ms...`);
      displayErrorMessage(`تلاش برای اتصال مجدد در ${delay/1000} ثانیه دیگر...`);
      setTimeout(connectSocket, delay);
    } else {
      console.error('Max reconnection attempts reached.');
      displayErrorMessage('اتصال به سرور ممکن نیست. لطفا بعدا تلاش کنید.');
    }
  }

  function joinRoom(roomName) {
    // First try to join via API
    getRoomData(roomName).catch(error => {
      console.error("Error joining room via API:", error);
    });

    // Then use socket as before
    if (socket && socket.connected) {
      socket.emit('joinRoom', { username: currentUser, room: roomName });
    } else {
      console.warn('Socket not connected. Attempting to reconnect before joining room.');
      connectSocket();
      // Try joining after a short delay
      setTimeout(() => {
        if (socket && socket.connected) {
          socket.emit('joinRoom', { username: currentUser, room: roomName });
        } else {
          displayErrorMessage('Failed to connect to server. Please try again.');
        }
      }, 1000);
    }
  }

  // Public API
  return {
    init: init
  };
})();

// Initialize the module when the DOM is ready
document.addEventListener('DOMContentLoaded', HealthChat.init);
/* Footer */
document.addEventListener('DOMContentLoaded', function() {
    // Define the content for each section
    const sectionContents = {
        'about': `
            <p>سایت مراقبت پیشگیرانه با هدف ارتقای دانش و ارائه اطلاعات تخصصی در زمینه روش‌های پیشگیری از بیماری‌ها تأسیس شده است. این پلتفرم بر آن است تا با بهره‌گیری از منابع معتبر و پژوهش‌های علمی، بستر مناسبی برای دستیابی به زندگی سالم و بهینه فراهم آورد.</p>
            <p>وبسایت پیشگیری از بیماری‌ها با هدف ارائه اطلاعات علمی، کاربردی و مفید در حوزه سلامت، توسط دکتر سعید کریمی، دکترای مدیریت خدمات بهداشتی و درمانی و عضو بازنشسته هیئت علمی دانشگاه علوم پزشکی اصفهان، به صورت مفهومی شکل گرفته است. این وبسایت توسط شکوفه السادات ممهد، پژوهشگر حوزه اقتصاد سلامت، طراحی و توسعه یافته است و شما می‌توانید از طریق لینک زیر با ایشان در ارتباط باشید:
            <a href="https://linkedin.com/in/shekoofehmomahhed-1239bb202" target="_blank">LinkedIn</a></p>
        `,
        'mission': `
            <p>ماموریت ما ترویج فرهنگ پیشگیری و ارتقای آگاهی عمومی از طریق ارائه منابع علمی و کاربردی است. ما بر این باوریم که اتخاذ رویکردهای پیشگیرانه بر اساس شواهد علمی، نقش کلیدی در کاهش شیوع بیماری‌ها و بهبود کیفیت زندگی افراد جامعه دارد.</p>
        `,
        'articles': `
            <p>در این بخش، مقالات علمی و مستند مرتبط با مراقبت‌های پیشگیرانه، اصول تغذیه سالم، فعالیت‌های بدنی مناسب و سایر جنبه‌های سبک زندگی سالم ارائه شده است. این مقالات با استناد به پژوهش‌های معتبر تدوین شده‌اند تا خوانندگان بتوانند تصمیم‌گیری آگاهانه و مبتنی بر دانش را در امور مرتبط با سلامت اتخاذ کنند.</p>
        `,
        'resources': `
            <p>بانک اطلاعات سلامت ما شامل منابع مختلف، مقالات علمی، و اطلاعات معتبر در زمینه پیشگیری از بیماری‌ها است. این بخش به عنوان یک مرجع جامع برای مخاطبان علاقه‌مند به حوزه سلامت و پیشگیری طراحی شده است.</p>
        `,
        'contact': `
            <p><strong>تماس با ما</strong> بخش تماس با ما امکان ارتباط مستقیم کاربران با تیم متخصصان را فراهم می‌آورد. کاربران می‌توانند با ارسال سوالات، پیشنهادات یا درخواست‌های خود از طریق فرم تماس یا ایمیل <strong>preventivecare313@gmail.com</strong> از مشاوره‌های علمی و تخصصی بهره‌مند شوند. ما همواره آماده تعامل و پاسخگویی به مخاطبان محترم هستیم.</p>
        `
    };

    // Get all menu items
    const items = document.querySelectorAll('.footer__item');
    
    // Get all sections
    const sections = document.querySelectorAll('.footer__section, .footer__contact');
    
    // Create content display areas for each section
    sections.forEach(section => {
        // Create a content display area if it doesn't exist
        let contentDisplay = section.querySelector('.footer__content-display');
        if (!contentDisplay) {
            contentDisplay = document.createElement('div');
            contentDisplay.className = 'footer__content-display';
            section.appendChild(contentDisplay);
        }
    });

    // Set up click handlers for each menu item
    items.forEach(item => {
        const sectionName = item.getAttribute('data-section');
        const content = sectionContents[sectionName];
        
        if (!content) return;
        
        const parentSection = item.closest('.footer__section, .footer__contact');
        if (!parentSection) return;
        
        // Find or create the content display area
        let contentDisplay = parentSection.querySelector('.footer__content-display');
        if (!contentDisplay) {
            contentDisplay = document.createElement('div');
            contentDisplay.className = 'footer__content-display';
            parentSection.appendChild(contentDisplay);
        }
        
        // Create content element if it doesn't exist
        let contentElement = document.getElementById(`footer-content-${sectionName}`);
        if (!contentElement) {
            contentElement = document.createElement('div');
            contentElement.className = 'footer__section-content'; // This CSS class is already set to be hidden by default
            contentElement.id = `footer-content-${sectionName}`;
            contentElement.innerHTML = content;
            contentDisplay.appendChild(contentElement);
        }
        
        // Add click event listener
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find all content elements in this section
            const allContentElements = parentSection.querySelectorAll('.footer__section-content');
            
            // Check if this content is already active
            const isActive = contentElement.classList.contains('footer__section-content--active');
            
            // Remove active class from all items in this section
            parentSection.querySelectorAll('.footer__item').forEach(i => {
                i.classList.remove('footer__item--active');
            });
            
            // Remove active class from all content elements in this section
            allContentElements.forEach(c => {
                c.classList.remove('footer__section-content--active');
            });
            
            // If it wasn't active before, make it active now
            if (!isActive) {
                this.classList.add('footer__item--active');
                contentElement.classList.add('footer__section-content--active');
            }
            // Otherwise, just leave everything deactivated (toggle behavior)
        });
    });
    
    // Do NOT set any defaults - we want everything hidden initially
    // Removed the code that automatically clicked the first item
});
