// DOM Elements
const persianBtn = document.getElementById('persian-btn');
const englishBtn = document.getElementById('english-btn');
const searchInput = document.querySelector('.ph-search__input');
const searchButton = document.querySelector('.ph-search__button');
const heroTitle = document.querySelector('.ph-hero__title');
const heroSubtitle = document.querySelector('.ph-hero__subtitle');

// Language Content
const content = {
  persian: {
    title: 'پیشگامان سلامت',
    subtitle: 'راهکارهای پیشگیری و سلامت جامع',
    searchPlaceholder: 'جستجو برای موضوعات سلامت، نکات پیشگیری...',
    searchButton: 'جستجو',
    direction: 'rtl'
  },
  english: {
    title: 'Health Pioneers',
    subtitle: 'Comprehensive Prevention and Health Solutions',
    searchPlaceholder: 'Search for health topics, prevention tips...',
    searchButton: 'Search',
    direction: 'ltr'
  }
};

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
    try {
      // Replace 'YOUR_SEARCH_API_ENDPOINT' with your actual API endpoint
      const response = await fetch('https://preventivecare-backend.onrender.com/api?query=${encodeURIComponent(searchTerm)}');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Process the search results (e.g., display them on the page)
      console.log('Search results:', data);

      // Here you would typically update the DOM to show search results
      // For now, just alert the user with the number of results
      const currentLang = localStorage.getItem('preferredLanguage') || 'persian';
      const resultCount = data.results ? data.results.length : 0; // Assuming your API returns results in a 'results' array
      const alertMessage = currentLang === 'persian'
        ? `تعداد نتایج: ${resultCount}`
        : `Number of results: ${resultCount}`;

      alert(alertMessage);

    } catch (error) {
      console.error('Search API error:', error);
      alert('An error occurred during the search.'); // User-friendly error message
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

// Function to fetch initial data on page load
async function fetchInitialData() {
  try {
    // Replace 'YOUR_INITIAL_DATA_API_ENDPOINT' with your actual API endpoint
    const response = await fetch('"https://preventivecare-backend.onrender.com/api');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process the initial data (e.g., display featured articles)
    console.log('Initial data:', data);

    // Here you would typically update the DOM with the fetched data
    // For now, let's just log a message
    console.log('Initial data loaded and processed.');

  } catch (error) {
    console.error('Initial data API error:', error);
    // Optionally display an error message on the page
  }
}


// Initialize language and fetch initial data on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check for previously saved language preference
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'persian';
  setLanguage(savedLanguage);

  // Add active class to initial language button
  if (savedLanguage === 'persian') {
    persianBtn.classList.add('ph-language-switcher__button--active');
  } else {
    englishBtn.classList.add('ph-language-switcher__button--active');
  }

  // Fetch initial data
  fetchInitialData();
});

 /**
 * preventive-features
 * Using BEM naming convention and component-scoped structure
 */
document.addEventListener('DOMContentLoaded', function() {
  const showModalButtons = document.querySelectorAll('.js-show-modal');
  const closeModalButtons = document.querySelectorAll('.js-close-modal');
  const modals = document.querySelectorAll('.js-modal');
  const searchButton = document.getElementById('search-button'); // Assuming you have a search button
  const searchInput = document.getElementById('search-input'); // Assuming you have a search input
  const API_ENDPOINT = "https://preventivecare-backend.onrender.com/api";
  let allData = []; // Store fetched data

  // Function to fetch data from the API
  const fetchData = async (searchTerm = '') => {
    try {
      let url = API_ENDPOINT;
      if (searchTerm) {
        url += `?search=${searchTerm}`; // Adjust the query parameter based on your API
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allData = data; // Store the fetched data
      renderData(data); // Render the data after fetching
    } catch (error) {
      console.error("Fetching data failed:", error);
      // Handle the error appropriately (e.g., display an error message)
    }
  };

  // Function to render data (you'll need to adapt this to your specific HTML structure)
  const renderData = (data) => {
    // Example: Assuming you have a container with an ID 'data-container'
    const dataContainer = document.getElementById('data-container');
    if (!dataContainer) {
      console.error("Data container element not found.");
      return;
    }

    dataContainer.innerHTML = ''; // Clear existing data

    data.forEach(item => {
      // Create elements to display the data (adapt this to your data structure)
      const itemElement = document.createElement('div');
      itemElement.classList.add('data-item'); // Example BEM class

      itemElement.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <button class="js-show-modal" data-modal-id="modal-${item.id}">Read More</button>
        <div id="full-content-modal-${item.id}" style="display:none;">
          ${item.fullContent}
        </div>
      `;

      dataContainer.appendChild(itemElement);
    });

    // Re-attach event listeners to the newly created modal buttons
    const newShowModalButtons = document.querySelectorAll('.js-show-modal');
    newShowModalButtons.forEach(button => {
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

  };

  // Event listener for search button click
  if (searchButton && searchInput) {
    searchButton.addEventListener('click', function() {
      const searchTerm = searchInput.value.trim();
      fetchData(searchTerm);
    });
  }

  // Initial data fetch on page load
  fetchData();

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

    // NEW: Search button (assuming you have one)
    const searchButton = document.getElementById('search-button'); // You'll need to add this button in your HTML
    const searchInput = document.getElementById('search-input'); // you need this as well in HTML
    // Section order for progress tracking
    const sectionOrder = ['demographic', 'medical-history', 'lifestyle', 'chronic-risks', 'acute-risks'];
    let currentSection = 0;

    // Event Listeners
    startAssessmentBtn.addEventListener('click', startAssessment);
    tabButtons.forEach(button => button.addEventListener('click', switchTab));
    nextButtons.forEach(button => button.addEventListener('click', goToNextSection));
    prevButtons.forEach(button => button.addEventListener('click', goToPrevSection));
    form.addEventListener('submit', submitForm);
    printResultsBtn.addEventListener('click', printResults);
    emailResultsBtn.addEventListener('click', emailResults);
    restartBtn.addEventListener('click', restartAssessment);

    // NEW: Event listener for search button (if it exists)
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

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

    function submitForm(e) {
        e.preventDefault();

        // Validate current section before submitting
        if (validateCurrentSection()) {
            // Collect form data
            const formData = new FormData(form);

            // Calculate risk scores
            const riskScores = calculateRiskScores(formData);

            // Update risk visualization in results
            updateRiskVisualization(riskScores);

            // Generate recommendations
            generateRecommendations(riskScores, formData);

            // Show results section
            mainContainer.querySelector('.assessment-form').style.display = 'none';
            resultsSection.style.display = 'block';
        }
    }

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

    // NEW FUNCTIONS: Data Fetching

    function fetchData() {
        fetch('https://preventivecare-backend.onrender.com/api')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Process the fetched data here. For example:
                console.log('Fetched data:', data);
                // You might want to populate certain form fields or display information
                // based on the data you receive. Adapt this section to your needs.

                //Example: pre-fill the name field (assuming it exists)
                // if(data.name) {
                //    document.getElementById('name').value = data.name;
                // }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('Failed to fetch data from the API.'); // User-friendly error message
            });
    }

    function handleSearch() {
        const searchTerm = searchInput.value; // Get the search term
        if (searchTerm) {
            fetchDataWithSearch(searchTerm);
        } else {
            alert("Please enter a search term");
        }
    }

    function fetchDataWithSearch(searchTerm) {
        fetch(`https://preventivecare-backend.onrender.com/api?search=${searchTerm}`) // Modify the endpoint as needed.
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Process the search results here.
                console.log('Search results:', data);
                // Update the UI to display the search results.
                // Example: populate a results list
            })
            .catch(error => {
                console.error('Search error:', error);
                alert('Failed to fetch search results.'); // User-friendly error message
            });
    }

    // Call fetchData on page load
    fetchData();
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

        this.initialData = null; // Store initial data fetched on page load

        this.bindEvents();
        this.fetchInitialData(); // Fetch data on page load
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
            const response = await this.checkSymptoms(age, gender, symptom, duration);

            if (response) {
                this.aiResponseDiv.textContent = response; // Assuming response is the diagnosis
                this.resultsSection.classList.remove('symptom-checker__hidden');
            } else {
                this.showError('پاسخی از سرور دریافت نشد.');
            }

        } catch (error) {
            console.error('Error:', error);
            this.showError('خطا در برقراری ارتباط با سرور.');
        } finally {
            this.hideLoadingState();
        }
    }

    async checkSymptoms(age, gender, symptoms, duration) {
        try {
            const response = await fetch('https://preventivecare-backend.onrender.com/api/symptom-checker/check', {  // Replace with your actual URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ age, gender, symptoms, duration }) // Send data as JSON
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse error response
                console.error('Error:', errorData);
                this.showError(`Error: ${errorData.message || 'An error occurred.'}`);  // Display error
                return null;
            }

            const data = await response.json();
            console.log(data);
            return data.diagnosis;  // Or however you want to display it
        } catch (error) {
            console.error('Fetch error:', error);
            this.showError('An unexpected error occurred.');
            return null;
        }
    }

    async fetchInitialData() {
        try {
            const response = await fetch("https://preventivecare-backend.onrender.com/api/symptom-checker/check");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.initialData = await response.json();
            console.log("Initial data fetched:", this.initialData);
            // You can do something with the initial data here, like populating a list or displaying it.
        } catch (error) {
            console.error("Error fetching initial data:", error);
            this.showError('فشل في جلب البيانات الأولية.'); // Show error to user
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
/* Global Variables */
document.addEventListener('DOMContentLoaded', () => {
  const API_ENDPOINT = 'https://preventivecare-backend.onrender.com/api';

  // Function to fetch data from the API based on the topic
  async function fetchPaperData(topic) {
    try {
      const response = await fetch(`${API_ENDPOINT}/${topic}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data; // Assuming the API returns the data you need for the card
    } catch (error) {
      console.error('Failed to fetch paper data:', error);
      return null;
    }
  }

  // Function to update card content with fetched data
  async function updateCardContent(card) {
    const topic = card.dataset.topic;
    const paperData = await fetchPaperData(topic);

    if (paperData) {
      // Update title and abstract (adjust based on your API response structure)
      card.querySelector('.he-paper__title').textContent = paperData.title || 'Title not available';
      card.querySelector('.he-paper__abstract').innerHTML = paperData.abstract || 'Abstract not available';

      // Update download URL
      const downloadButton = card.querySelector('.he-paper__btn--download');
      downloadButton.dataset.downloadUrl = paperData.download_url || '#'; //  or the correct field

      // Optionally, update the image URL too
      //card.querySelector('.he-card__image').style.backgroundImage = `url('${paperData.image_url}')`;
    }
  }

  // Fetch data for each card on page load
  document.querySelectorAll('.he-card').forEach(card => {
    updateCardContent(card);
  });

  // Event listener for "مشاهده مقاله" button
  document.querySelectorAll('.he-card__btn').forEach(button => {
    button.addEventListener('click', event => {
      const card = event.target.closest('.he-card');
      const paperTitle = card.querySelector('.he-paper__title').textContent;
      const paperAbstract = card.querySelector('.he-paper__abstract').innerHTML;
      const downloadUrl = card.querySelector('.he-paper__btn--download').dataset.downloadUrl;

      const modal = document.querySelector('.he-modal');
      modal.querySelector('.he-modal__title').textContent = paperTitle;
      modal.querySelector('.he-modal__body').innerHTML = paperAbstract;

      // Set up the download button in the modal
      const downloadButton = modal.querySelector('.he-modal__btn--download');
      downloadButton.onclick = () => {
        window.location.href = downloadUrl; // Open download URL in current tab
      };

      modal.classList.add('he-modal--active');
      document.body.classList.add('he-modal-open');
    });
  });

  // Event listener for modal close button
  document.querySelector('.he-modal__close').addEventListener('click', () => {
    const modal = document.querySelector('.he-modal');
    modal.classList.remove('he-modal--active');
    document.body.classList.remove('he-modal-open');
  });

  // Event listener for modal close button in the footer
  document.querySelector('.he-modal__btn--close').addEventListener('click', () => {
    const modal = document.querySelector('.he-modal');
    modal.classList.remove('he-modal--active');
    document.body.classList.remove('he-modal-open');
  });

  // Close modal if background is clicked
  document.querySelector('.he-modal').addEventListener('click', event => {
    if (event.target === event.currentTarget) {
      document.querySelector('.he-modal').classList.remove('he-modal--active');
      document.body.classList.remove('he-modal-open');
    }
  });
});
/* Health Chat Module with Namespacing */
const HealthChat = (function() {
  /* Private Variables */
  let currentUser = null;
  let currentRoom = null;
  let socket = null;
  let reconnectionAttempts = 0;
  const maxReconnectionAttempts = 5;

  /* DOM Elements Cache */
  let DOM = {};

  /* Initialize the module */
  function init() {
    cacheDOM();
    bindEvents();
    // Fetch data on page load (example - adjust as needed)
    fetchInitialData();
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
      onlineCount: document.querySelector('#health-chat__online-count'),
      // Add a potential search button (if needed in HTML)
      searchButton: document.querySelector('#health-chat__search-button'), //Example, if there's a search feature
      searchInput: document.querySelector('#health-chat__search-input'), // Example
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
          currentUser = username;
          showChatInterface(username);
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
          alert('ثبت نام با موفقیت انجام شد! لطفا وارد شوید.');
          DOM.showLoginLink.click();
        } else {
          alert('ثبت نام ناموفق بود! لطفا ورودی های خود را بررسی کنید.');
        }
      });
    }

    // Logout
    if (DOM.logoutBtn) {
      DOM.logoutBtn.addEventListener('click', () => {
        currentUser = null;
        currentRoom = null;
        disconnectSocket();
        DOM.chatContainer.classList.add('health-chat__chat--hidden');
        DOM.authContainer.classList.remove('hidden');
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

      // Example: Handling Search Button Click
    if (DOM.searchButton) {
      DOM.searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const searchTerm = DOM.searchInput.value.trim();
        if (searchTerm) {
          fetchData(searchTerm); // Call the data fetching function with the search term
        } else {
          alert('لطفا یک عبارت جستجو وارد کنید.');
        }
      });
    }
  }

  /* Send the current message */
  function sendCurrentMessage() {
    const message = DOM.messageInput.value.trim();
    if (message && currentRoom) {
       // Send the message to the server using socket.io
      sendMessage(message);

      // Optionally, send the message to the API endpoint as well
      // Useful if you want to store the messages in a database
      sendDataToAPI({
        room: currentRoom,
        user: currentUser,
        message: message,
        timestamp: new Date().toISOString()
      });

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

    // Check socket connection before sending
    if (socket && socket.connected) {
      socket.emit('chatMessage', { username: currentUser, message, time });
      addMessageToChat(currentUser, message, time, true);
    } else {
      console.warn('Socket not connected. Reconnecting before sending message.');
      connectSocket();
      setTimeout(() => {
        if (socket && socket.connected) {
          socket.emit('chatMessage', { username: currentUser, message, time });
          addMessageToChat(currentUser, message, time, true);
        } else {
          displayErrorMessage('مشکل در اتصال به سرور. پیام ارسال نشد.');
        }
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

  function joinRoom(room) {
    if (socket && socket.connected) {
      socket.emit('joinRoom', { username: currentUser, room });
    } else {
      console.warn('Socket not connected. Reconnecting before joining room.');
      connectSocket();
      setTimeout(() => {
        if (socket && socket.connected) {
          socket.emit('joinRoom', { username: currentUser, room });
        } else {
          displayErrorMessage('مشکل در اتصال به سرور. نتوانستم به اتاق بپیوندم.');
        }
      }, 1000);
    }
  }

   function reconnectWithDelay() {
    if (reconnectionAttempts < maxReconnectionAttempts) {
      reconnectionAttempts++;
      console.log(`Attempting to reconnect in 5 seconds... (attempt ${reconnectionAttempts})`);
      setTimeout(connectSocket, 5000); // Retry after 5 seconds
    } else {
      console.error('Max reconnection attempts reached.');
      displayErrorMessage('حداکثر تلاش برای اتصال مجدد انجام شد. لطفا بعدا امتحان کنید.');
    }
  }


  // Placeholder functions for server-side interactions
  function fetchInitialData() {
    // Example: Fetch initial data from the server
    // In a real application, replace this with an actual API call
    console.log('Fetching initial data...');
  }

  function fetchData(searchTerm) {
     //  Replace this with an actual API call to fetch data based on the search term
      console.log('Fetching data with search term:', searchTerm);
      // Example: Call an API with the search term
      // fetch(`/api/search?term=${searchTerm}`)
      //   .then(response => response.json())
      //   .then(data => {
      //     // Handle the data
      //   })
      //   .catch(error => console.error('Error:', error));
  }

  function sendDataToAPI(data) {
    // Replace this with an actual API call to send data to the server
    console.log('Sending data to API:', data);
     // fetch('/api/messages', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(data)
      // })
      // .then(response => {
      //   if (!response.ok) {
      //     throw new Error('Network response was not ok');
      //   }
      //   return response.json();
      // })
      // .then(data => {
      //   console.log('Success:', data);
      // })
      // .catch(error => {
      //   console.error('Error:', error);
      // });
  }

  /* Public API */
  return {
    init: init
  };
})();

HealthChat.init();
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

    // Function to fetch data from the API
    async function fetchData(searchTerm = '') { // Default search term is empty string
        try {
            const response = await fetch(`https://preventivecare-backend.onrender.com/api?search=${searchTerm}`); // Append search term to the URL
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null; // or handle the error appropriately, like displaying an error message
        }
    }

    // Function to update the articles section with fetched data
    async function updateArticlesSection(searchTerm = '') {
        const data = await fetchData(searchTerm);

        const articlesSection = document.querySelector('[data-section="articles"]').closest('.footer__section, .footer__contact');

        if (!articlesSection) {
            console.warn("Articles section not found.");
            return;
        }

        let contentDisplay = articlesSection.querySelector('.footer__content-display');
        if (!contentDisplay) {
            contentDisplay = document.createElement('div');
            contentDisplay.className = 'footer__content-display';
            articlesSection.appendChild(contentDisplay);
        }

        let contentElement = document.getElementById(`footer-content-articles`);
        if (!contentElement) {
            contentElement = document.createElement('div');
            contentElement.className = 'footer__section-content';
            contentElement.id = `footer-content-articles`;
            contentDisplay.appendChild(contentElement);
        }

        if (data) {
            // Clear existing content
            contentElement.innerHTML = '';

            if (Array.isArray(data) && data.length > 0) {
                // Build the HTML content based on the fetched data
                const articlesHTML = data.map(article => `
                    <div class="article">
                        <h3>${article.title}</h3>
                        <p>${article.summary}</p>
                        <a href="${article.link}" target="_blank">Read More</a>
                    </div>
                `).join('');

                contentElement.innerHTML = articlesHTML;
            } else {
                contentElement.innerHTML = '<p>No articles found.</p>';
            }
        } else {
            contentElement.innerHTML = '<p>Failed to load articles.</p>';
        }
    }


    // Initial data load on page load
    updateArticlesSection();


    // Event listener for search button (Assumed you'll have a search button)
    const searchButton = document.getElementById('searchButton'); // Replace 'searchButton' with the actual ID
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput'); // Replace 'searchInput' with the actual ID
            const searchTerm = searchInput.value;
            updateArticlesSection(searchTerm);
        });
    }


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

