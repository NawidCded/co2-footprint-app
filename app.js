// Fiktiver CO2-Datensatz
const co2Data = [
    { entity: "China", type: "Land", country: "China", sector: "Industrie", emissions: 10668, year: 2023 },
    { entity: "USA", type: "Land", country: "USA", sector: "Energie", emissions: 4713, year: 2023 },
    { entity: "Indien", type: "Land", country: "Indien", sector: "Energie", emissions: 2654, year: 2023 },
    { entity: "Aramco", type: "Unternehmen", country: "Saudi-Arabien", sector: "Energie", emissions: 1850, year: 2023 },
    { entity: "Deutschland", type: "Land", country: "Deutschland", sector: "Industrie", emissions: 674, year: 2023 },
    { entity: "ExxonMobil", type: "Unternehmen", country: "USA", sector: "Energie", emissions: 540, year: 2023 },
    { entity: "Shell plc", type: "Unternehmen", country: "Großbritannien", sector: "Energie", emissions: 470, year: 2023 },
    { entity: "Volkswagen AG", type: "Unternehmen", country: "Deutschland", sector: "Transport", emissions: 280, year: 2023 }
];

// Rechtliche Dokumente & Kontaktinhalte für das Modal
const legalTexts = {
    impressum: {
        title: "⚖️ Impressum",
        content: `
            <h4>Angaben gemäß § 5 TMG</h4>
            <p><strong>EcoTrack NPO e. V.</strong><br>
            Gemeinnützige Initiative für globale Klimatransparenz<br>
            Musterstraße 42, 10117 Berlin</p>

            <h4>Vertreten durch den Vorstand:</h4>
            <p>Dr. Weronika Zbylut (1. Vorsitzende), Prof. Dr. Markus Weber</p>

            <h4>Kontakt:</h4>
            <p>E-Mail: kontakt@ecotrack-npo.org<br>
            Telefon: +49 (0) 30 123456-0</p>

            <h4>Registereintrag:</h4>
            <p>Eintragung im Vereinsregister. Registergericht: Amtsgericht Berlin-Charlottenburg, Registernummer: VR 98765 B</p>
        `
    },
    datenschutz: {
        title: "🔒 Datenschutzerklärung",
        content: `
            <h4>1. Datenschutz auf einen Blick</h4>
            <p>Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Diese Anwendung verarbeitet keinerlei personenbezogene Daten von Besuchenden und verwendet keine Tracking-Cookies.</p>

            <h4>2. Datenerfassung auf dieser Website</h4>
            <p>Sämtliche Filter- und Sortieroperationen werden direkt lokal in Ihrem Browser ausgeführt. Es werden keine Eingaben an externe Server übertragen.</p>

            <h4>3. Ihre Rechte</h4>
            <p>Sie haben jederzeit das Recht auf kostenfreie Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten sowie ein Recht auf Berichtigung oder Löschung.</p>
        `
    },
    haftung: {
        title: "📜 Haftungsausschluss (Disclaimer)",
        content: `
            <h4>Haftung für Inhalte</h4>
            <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten fiktiven und aggregierten Daten übernehmen wir jedoch keine Gewähr.</p>

            <h4>Haftung für Links</h4>
            <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.</p>
        `
    },
    kontakt: {
        title: "📬 Kontakt & Feedback",
        content: `
            <h4>Treten Sie mit uns in Kontakt</h4>
            <p>Haben Sie Fragen zur Datenbasis, Anregungen oder Feedback zum Portal?</p>
            <p><strong>EcoTrack Team:</strong> info@ecotrack-npo.org</p>
            <p><em>Hinweis: Im Rahmen dieser Fallstudie handelt es sich um eine prototypische Demonstration für das Modul IPWA01-01.</em></p>
        `
    }
};

let currentData = [...co2Data];
let currentSort = { column: 'emissions', direction: 'desc' };

document.addEventListener('DOMContentLoaded', () => {
    updateKPIs(co2Data);
    renderTable(currentData);
    setupEventListeners();
});

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', handleFilterChange);

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) categoryFilter.addEventListener('change', handleFilterChange);

    const sectorFilter = document.getElementById('sector-filter');
    if (sectorFilter) sectorFilter.addEventListener('change', handleFilterChange);

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    document.querySelectorAll('.data-table th.sortable').forEach(th => {
        th.addEventListener('click', () => handleSort(th.getAttribute('data-sort')));
    });

    const rtlToggleBtn = document.getElementById('rtl-toggle-btn');
    if (rtlToggleBtn) rtlToggleBtn.addEventListener('click', toggleCultureDirection);

    const xssTestBtn = document.getElementById('xss-test-btn');
    if (xssTestBtn) xssTestBtn.addEventListener('click', runXSSDemo);

    // Event Listener für Modal & Footer Links
    document.querySelectorAll('.legal-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const legalType = link.getAttribute('data-legal');
            openModal(legalType);
        });
    });

    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const modalOverlay = document.getElementById('legal-modal');

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(type) {
    const data = legalTexts[type] || legalTexts.impressum;
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body-content');
    const modalOverlay = document.getElementById('legal-modal');

    if (modalTitle && modalBody && modalOverlay) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modalOverlay.classList.remove('hidden');
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('legal-modal');
    if (modalOverlay) modalOverlay.classList.add('hidden');
}

function updateKPIs(data) {
    const elCountries = document.getElementById('kpi-countries');
    if (elCountries) elCountries.textContent = data.filter(d => d.type === 'Land').length;

    const elCompanies = document.getElementById('kpi-companies');
    if (elCompanies) elCompanies.textContent = data.filter(d => d.type === 'Unternehmen').length;

    const elTotalCo2 = document.getElementById('kpi-total-co2');
    if (elTotalCo2) {
        const sum = data.reduce((acc, item) => acc + item.emissions, 0);
        elTotalCo2.textContent = sum.toLocaleString('de-DE');
    }
}

function handleFilterChange() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sectorFilter = document.getElementById('sector-filter');

    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';
    const sector = sectorFilter ? sectorFilter.value : 'all';

    currentData = co2Data.filter(item => {
        const matchesSearch = item.entity.toLowerCase().includes(searchTerm) || item.country.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || item.type === category;
        const matchesSector = sector === 'all' || item.sector === sector;
        return matchesSearch && matchesCategory && matchesSector;
    });

    renderTable(currentData);
}

function handleSort(column) {
    if (!column) return;
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }
    
    currentData.sort((a, b) => {
        let valA = a[column], valB = b[column];
        if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
        return currentSort.direction === 'asc' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
    });

    renderTable(currentData);
}

function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const noResults = document.getElementById('no-results');
    if (noResults) {
        if (data.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }

    data.forEach(item => {
        const tr = document.createElement('tr');

        const tdEntity = document.createElement('td');
        tdEntity.textContent = item.entity;

        const tdType = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `badge ${item.type === 'Land' ? 'badge-land' : 'badge-unternehmen'}`;
        badge.textContent = item.type;
        tdType.appendChild(badge);

        const tdCountry = document.createElement('td');
        tdCountry.textContent = item.country;

        const tdSector = document.createElement('td');
        tdSector.textContent = item.sector;

        const tdEmissions = document.createElement('td');
        tdEmissions.className = 'numeric';
        tdEmissions.textContent = item.emissions.toLocaleString('de-DE');

        const tdYear = document.createElement('td');
        tdYear.className = 'numeric';
        tdYear.textContent = item.year;

        tr.append(tdEntity, tdType, tdCountry, tdSector, tdEmissions, tdYear);
        tableBody.appendChild(tr);
    });
}

function resetFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sectorFilter = document.getElementById('sector-filter');

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (sectorFilter) sectorFilter.value = 'all';

    currentData = [...co2Data];
    renderTable(currentData);
}

function toggleCultureDirection() {
    const htmlElem = document.documentElement;
    const isLtr = htmlElem.getAttribute('dir') === 'ltr';
    htmlElem.setAttribute('dir', isLtr ? 'rtl' : 'ltr');

    const switcherLabel = document.getElementById('switcher-label');
    if (switcherLabel) {
        switcherLabel.textContent = isLtr ? 'Schriftkultur: RTL (Rechts nach Links)' : 'Schriftkultur: LTR (Links nach Rechts)';
    }
}

function runXSSDemo() {
    const xssInput = document.getElementById('xss-input');
    const xssOutput = document.getElementById('xss-output-safe');
    if (xssInput && xssOutput) {
        xssOutput.textContent = xssInput.value;
    }
}
