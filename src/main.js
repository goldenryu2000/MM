// Main logic for Melancholic Muser
import poemsData from '../poems.json';
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Route handling based on page
  const isPoemPage = window.location.pathname.includes('poem.html');

  if (isPoemPage) {
    initPoemPage();
  } else {
    initHomePage();
  }
});

async function fetchPoems() {
  // Using static import for poemsData so it's perfectly bundled by Vite
  return poemsData;
}

// Calculate reading time (avg 200 words per min)
function getReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// Helper to format the scraped JSON blob text into poetic stanzas
function formatPoemText(text) {
  // Split by actual newlines preserved in the JSON
  const lines = text.split('\n');
  
  return lines.map((line, i) => {
    // If it's an empty line, render a stanza break spacer
    if (line.trim() === '') {
      return `<div class="stanza-break"></div>`;
    }
    // Otherwise render the line with a smooth cascading delay
    return `<p style="animation-delay: ${i * 0.08}s">${line}</p>`;
  }).join('');
}

function triggerHaptic() {
  if (navigator.vibrate) {
    // A very subtle, minimal haptic tick for mobile devices
    navigator.vibrate(10);
  }
}

function updateAmbientBackground(category, poemId = null) {
  let container = document.getElementById('particle-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particle-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-1';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);
  }

  // Clear existing particles
  container.innerHTML = '';

  let particleCount = 0;
  let particleClass = '';

  if (poemId) {
    switch (poemId) {
      case 'autumn-leaves':
        particleCount = 15; particleClass = 'particle-leaf'; break;
      case 'moon-river':
        container.innerHTML = '<div class="particle particle-moon"></div>';
        particleCount = 20; particleClass = 'particle-star'; break;
      case 'woeful-waters':
        particleCount = 5; particleClass = 'particle-ripple'; break;
      case 'gloomy-skies':
        container.innerHTML = '<div class="particle particle-lightning"></div>';
        particleCount = 5; particleClass = 'particle-cloud'; break;
      case 'escape':
        particleCount = 25; particleClass = 'particle-firefly'; break;
      case 'amy':
        particleCount = 15; particleClass = 'particle-music'; break;
      case 'pains-of-growing-up':
        particleCount = 12; particleClass = 'particle-glass'; break;
      case 'catching-up-with-time':
        particleCount = 10; particleClass = 'particle-hourglass'; break;
      case 'te-to-my-ti-my-chatto':
        particleCount = 20; particleClass = 'particle-ember'; break;
      case 'a-moment':
        particleCount = 25; particleClass = 'particle-dust'; break;
      case 'life-productions-presents-tomorrow':
        container.innerHTML = '<div class="particle particle-spotlight"></div>';
        particleCount = 0; break;
      case 'up-in-the-mountains':
        particleCount = 4; particleClass = 'particle-fog'; break;
      case 'december-2018':
        particleCount = 6; particleClass = 'particle-brick'; break;
    }
  }

  // If no poemId matched or we are on homepage, fallback to category
  if (!particleClass && particleCount === 0 && !container.innerHTML) {
    switch (category) {
      case 'nature':
        particleCount = 15; particleClass = 'particle-leaf'; break;
      case 'melancholy':
        particleCount = 40; particleClass = 'particle-rain'; break;
      case 'magic':
        particleCount = 30; particleClass = 'particle-star'; break;
      case 'nostalgia':
        particleCount = 25; particleClass = 'particle-dust'; break;
      case 'all':
      default:
        return; // No particles
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = `particle ${particleClass}`;

    // Common random horizontal position
    p.style.left = `${Math.random() * 100}%`;

    // Specific logic for different particles
    if (particleClass === 'particle-star' || particleClass === 'particle-firefly') {
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDuration = `${2 + Math.random() * 3}s`;
      p.style.animationDelay = `-${Math.random() * 5}s`;
    } else if (particleClass === 'particle-rain') {
      p.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
      p.style.animationDelay = `-${Math.random() * 2}s`;
    } else if (particleClass === 'particle-cloud') {
      p.style.top = `${Math.random() * 30}%`;
      p.style.animationDuration = `${20 + Math.random() * 20}s`;
      p.style.animationDelay = `-${Math.random() * 40}s`;
      p.style.left = `-50%`;
    } else if (particleClass === 'particle-fog') {
      p.style.top = `${40 + Math.random() * 40}%`;
      p.style.animationDuration = `${15 + Math.random() * 15}s`;
      p.style.animationDelay = `-${Math.random() * 30}s`;
      p.style.left = `-50%`;
    } else if (particleClass === 'particle-ripple') {
      p.style.top = `${80 + Math.random() * 15}%`;
      p.style.animationDuration = `${3 + Math.random() * 2}s`;
      p.style.animationDelay = `-${Math.random() * 5}s`;
    } else if (particleClass === 'particle-brick') {
      p.style.top = `${10 + Math.random() * 80}%`;
      p.style.animationDuration = `${10 + Math.random() * 10}s`;
      p.style.animationDelay = `-${Math.random() * 20}s`;
    } else {
      p.style.animationDuration = `${7 + Math.random() * 5}s`;
      p.style.animationDelay = `-${Math.random() * 10}s`;
    }

    container.appendChild(p);
  }
}

let allPoems = [];

async function initHomePage() {
  const grid = document.getElementById('poems-grid');
  const randomBtn = document.getElementById('random-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  allPoems = await fetchPoems();

  if (!allPoems || allPoems.length === 0) {
    grid.innerHTML = '<p style="text-align:center; width:100%;">No musings found.</p>';
    return;
  }

  // Setup random button
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      triggerHaptic();
      const randomId = allPoems[Math.floor(Math.random() * allPoems.length)].id;
      window.location.href = `poem.html?id=${randomId}`;
    });
  }

  // Setup filters
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        triggerHaptic();
        // Update active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        // Update theme vibe
        document.body.className = 'theme-dark'; // reset to base
        if (category !== 'all') {
          document.body.classList.add(`theme-${category}`);
        }
        updateAmbientBackground(category);

        renderGrid(category);
      });
    });
  }

  // Initial render
  renderGrid('all');
  updateAmbientBackground('all');
}

function renderGrid(category) {
  const grid = document.getElementById('poems-grid');
  grid.innerHTML = '';

  const filtered = category === 'all'
    ? allPoems
    : allPoems.filter(p => p.category === category);

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center; width:100%;">No musings found in this category.</p>';
    return;
  }

  filtered.forEach((poem, index) => {
    const card = document.createElement('a');
    card.href = `poem.html?id=${poem.id}`;
    card.className = 'poem-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('fade-in');

    // Create excerpt
    const excerpt = poem.content.substring(0, 120) + '...';

    card.innerHTML = `
      <h3>${poem.title}</h3>
      <p>${excerpt}</p>
      <div class="card-footer">
        <span>${getReadingTime(poem.content)}</span>
        <span class="read-more">Read <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
      </div>
    `;
    
    card.addEventListener('click', () => triggerHaptic());

    grid.appendChild(card);
  });
}

async function initPoemPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const poemId = urlParams.get('id');

  const titleEl = document.getElementById('poem-title');
  const contentEl = document.getElementById('poem-content');
  const readTimeEl = document.getElementById('poem-read-time');
  const focusBtn = document.getElementById('focus-btn');

  const poems = await fetchPoems();
  const poem = poems.find(p => p.id === poemId);

  if (!poem) {
    titleEl.textContent = 'Poem not found';
    contentEl.innerHTML = '<p>Perhaps it was lost to the wind.</p>';
    return;
  }

  // Render content
  document.title = `${poem.title} | Melancholic Muser`;
  titleEl.textContent = poem.title;
  readTimeEl.textContent = getReadingTime(poem.content);

  contentEl.innerHTML = formatPoemText(poem.content);

  // Update theme and ambient background to match poem's category
  if (poem.category && poem.category !== 'all') {
    document.body.classList.add(`theme-${poem.category}`);
  }
  updateAmbientBackground(poem.category || 'all', poem.id);

  // Focus mode logic
  if (focusBtn) {
    focusBtn.addEventListener('click', () => {
      triggerHaptic();
      document.body.classList.toggle('focus-mode');
      const isFocus = document.body.classList.contains('focus-mode');
      focusBtn.querySelector('.btn-text').textContent = isFocus ? 'Exit Focus' : 'Focus Mode';
    });
  }
}
