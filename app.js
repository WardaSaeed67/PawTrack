// ========================================================================
//  DATA LAYER - Multi-Pet
// ========================================================================
const DEFAULT_PET_DATA = {
    id: '',
    name: '',
    type: 'dog',
    birthdate: '',
    size: 'medium',
    feeding: { breakfast: { fed: false, time: null, note: '' }, lunch: { fed: false, time: null, note: '' },
        dinner: { fed: false, time: null, note: '' }, history: [] },
    medications: [],
    poopPee: { logs: [] },
    vaccinations: [],
    walks: [],
    favorites: [],
    sitter: { petName: '', feeding: '', meds: '', vet: '', walk: '', notes: '', contact: '' },
    bath: { baths: [], trims: [] }  // NEW: store bath and trim logs
};

let data = null; // full app data: { pets: [], currentPetId: '', theme: '' }
let walkTimerInterval = null;
let walkSeconds = 0;
let walkRunning = false;
let walkStartTime = null;

// ========================================================================
//  PET NAMES DATABASE (200+)
// ========================================================================
const PET_NAMES = [
    { name: 'Max', gender: 'male', species: 'dog' }, { name: 'Charlie', gender: 'male', species: 'dog' },
    { name: 'Buddy', gender: 'male', species: 'dog' }, { name: 'Cooper', gender: 'male', species: 'dog' },
    { name: 'Milo', gender: 'male', species: 'dog' }, { name: 'Rocky', gender: 'male', species: 'dog' },
    { name: 'Bear', gender: 'male', species: 'dog' }, { name: 'Duke', gender: 'male', species: 'dog' },
    { name: 'Leo', gender: 'male', species: 'dog' }, { name: 'Tucker', gender: 'male', species: 'dog' },
    { name: 'Zeus', gender: 'male', species: 'dog' }, { name: 'Thor', gender: 'male', species: 'dog' },
    { name: 'Apollo', gender: 'male', species: 'dog' }, { name: 'Finn', gender: 'male', species: 'dog' },
    { name: 'Oscar', gender: 'male', species: 'dog' }, { name: 'Rusty', gender: 'male', species: 'dog' },
    { name: 'Sam', gender: 'male', species: 'dog' }, { name: 'Winston', gender: 'male', species: 'dog' },
    { name: 'Baxter', gender: 'male', species: 'dog' }, { name: 'Jasper', gender: 'male', species: 'dog' },
    { name: 'Moose', gender: 'male', species: 'dog' }, { name: 'Riley', gender: 'male', species: 'dog' },
    { name: 'Murphy', gender: 'male', species: 'dog' }, { name: 'Gus', gender: 'male', species: 'dog' },
    { name: 'Marley', gender: 'male', species: 'dog' }, { name: 'Maverick', gender: 'male', species: 'dog' },
    { name: 'Oliver', gender: 'male', species: 'dog' }, { name: 'Jack', gender: 'male', species: 'dog' },
    { name: 'Teddy', gender: 'male', species: 'dog' }, { name: 'Archie', gender: 'male', species: 'dog' },
    { name: 'Bella', gender: 'female', species: 'dog' }, { name: 'Lucy', gender: 'female', species: 'dog' },
    { name: 'Daisy', gender: 'female', species: 'dog' }, { name: 'Luna', gender: 'female', species: 'dog' },
    { name: 'Molly', gender: 'female', species: 'dog' }, { name: 'Sadie', gender: 'female', species: 'dog' },
    { name: 'Roxy', gender: 'female', species: 'dog' }, { name: 'Lola', gender: 'female', species: 'dog' },
    { name: 'Ginger', gender: 'female', species: 'dog' }, { name: 'Ruby', gender: 'female', species: 'dog' },
    { name: 'Chloe', gender: 'female', species: 'dog' }, { name: 'Stella', gender: 'female', species: 'dog' },
    { name: 'Maggie', gender: 'female', species: 'dog' }, { name: 'Sophie', gender: 'female', species: 'dog' },
    { name: 'Mia', gender: 'female', species: 'dog' }, { name: 'Zoe', gender: 'female', species: 'dog' },
    { name: 'Nala', gender: 'female', species: 'dog' }, { name: 'Penny', gender: 'female', species: 'dog' },
    { name: 'Ellie', gender: 'female', species: 'dog' }, { name: 'Hazel', gender: 'female', species: 'dog' },
    { name: 'Willow', gender: 'female', species: 'dog' }, { name: 'Harper', gender: 'female', species: 'dog' },
    { name: 'Lily', gender: 'female', species: 'dog' }, { name: 'Maple', gender: 'female', species: 'dog' },
    { name: 'Olive', gender: 'female', species: 'dog' }, { name: 'Poppy', gender: 'female', species: 'dog' },
    { name: 'Rosie', gender: 'female', species: 'dog' }, { name: 'Skye', gender: 'female', species: 'dog' },
    { name: 'Tilly', gender: 'female', species: 'dog' }, { name: 'Winnie', gender: 'female', species: 'dog' },
    { name: 'Oliver', gender: 'male', species: 'cat' }, { name: 'Leo', gender: 'male', species: 'cat' },
    { name: 'Milo', gender: 'male', species: 'cat' }, { name: 'Charlie', gender: 'male', species: 'cat' },
    { name: 'Max', gender: 'male', species: 'cat' }, { name: 'Simon', gender: 'male', species: 'cat' },
    { name: 'Felix', gender: 'male', species: 'cat' }, { name: 'Oscar', gender: 'male', species: 'cat' },
    { name: 'Tiger', gender: 'male', species: 'cat' }, { name: 'Smokey', gender: 'male', species: 'cat' },
    { name: 'Gizmo', gender: 'male', species: 'cat' }, { name: 'Jasper', gender: 'male', species: 'cat' },
    { name: 'Loki', gender: 'male', species: 'cat' }, { name: 'Sebastian', gender: 'male', species: 'cat' },
    { name: 'Theo', gender: 'male', species: 'cat' }, { name: 'Finn', gender: 'male', species: 'cat' },
    { name: 'Archie', gender: 'male', species: 'cat' }, { name: 'Mowgli', gender: 'male', species: 'cat' },
    { name: 'Remy', gender: 'male', species: 'cat' }, { name: 'Ziggy', gender: 'male', species: 'cat' },
    { name: 'Luna', gender: 'female', species: 'cat' }, { name: 'Bella', gender: 'female', species: 'cat' },
    { name: 'Chloe', gender: 'female', species: 'cat' }, { name: 'Daisy', gender: 'female', species: 'cat' },
    { name: 'Lucy', gender: 'female', species: 'cat' }, { name: 'Molly', gender: 'female', species: 'cat' },
    { name: 'Sophie', gender: 'female', species: 'cat' }, { name: 'Mia', gender: 'female', species: 'cat' },
    { name: 'Nala', gender: 'female', species: 'cat' }, { name: 'Willow', gender: 'female', species: 'cat' },
    { name: 'Lily', gender: 'female', species: 'cat' }, { name: 'Olive', gender: 'female', species: 'cat' },
    { name: 'Poppy', gender: 'female', species: 'cat' }, { name: 'Rosie', gender: 'female', species: 'cat' },
    { name: 'Skye', gender: 'female', species: 'cat' }, { name: 'Tilly', gender: 'female', species: 'cat' },
    { name: 'Winnie', gender: 'female', species: 'cat' }, { name: 'Cleo', gender: 'female', species: 'cat' },
    { name: 'Misty', gender: 'female', species: 'cat' }, { name: 'Sasha', gender: 'female', species: 'cat' },
    { name: 'Avery', gender: 'unisex', species: 'dog' }, { name: 'Bailey', gender: 'unisex', species: 'dog' },
    { name: 'Cody', gender: 'unisex', species: 'dog' }, { name: 'Dakota', gender: 'unisex', species: 'dog' },
    { name: 'Ellis', gender: 'unisex', species: 'dog' }, { name: 'Finley', gender: 'unisex', species: 'dog' },
    { name: 'Harley', gender: 'unisex', species: 'dog' }, { name: 'Indigo', gender: 'unisex', species: 'dog' },
    { name: 'Jordy', gender: 'unisex', species: 'dog' }, { name: 'Kai', gender: 'unisex', species: 'dog' },
    { name: 'Logan', gender: 'unisex', species: 'dog' }, { name: 'Morgan', gender: 'unisex', species: 'dog' },
    { name: 'Nova', gender: 'unisex', species: 'dog' }, { name: 'Parker', gender: 'unisex', species: 'dog' },
    { name: 'Quinn', gender: 'unisex', species: 'dog' }, { name: 'Riley', gender: 'unisex', species: 'dog' },
    { name: 'Sawyer', gender: 'unisex', species: 'dog' }, { name: 'Taylor', gender: 'unisex', species: 'dog' },
    { name: 'Ariel', gender: 'unisex', species: 'cat' }, { name: 'Blake', gender: 'unisex', species: 'cat' },
    { name: 'Charlie', gender: 'unisex', species: 'cat' }, { name: 'Drew', gender: 'unisex', species: 'cat' },
    { name: 'Eden', gender: 'unisex', species: 'cat' }, { name: 'Frankie', gender: 'unisex', species: 'cat' },
    { name: 'Gray', gender: 'unisex', species: 'cat' }, { name: 'Harper', gender: 'unisex', species: 'cat' },
    { name: 'Jules', gender: 'unisex', species: 'cat' }, { name: 'Lake', gender: 'unisex', species: 'cat' },
    { name: 'Marlowe', gender: 'unisex', species: 'cat' }, { name: 'Noel', gender: 'unisex', species: 'cat' },
    { name: 'Ori', gender: 'unisex', species: 'cat' }, { name: 'Phoenix', gender: 'unisex', species: 'cat' },
    { name: 'Raven', gender: 'unisex', species: 'cat' }, { name: 'Sage', gender: 'unisex', species: 'cat' },
    { name: 'Athena', gender: 'female', species: 'dog' }, { name: 'Bentley', gender: 'male', species: 'dog' },
    { name: 'Cali', gender: 'female', species: 'dog' }, { name: 'Dexter', gender: 'male', species: 'dog' },
    { name: 'Ella', gender: 'female', species: 'dog' }, { name: 'Fiona', gender: 'female', species: 'dog' },
    { name: 'Gatsby', gender: 'male', species: 'dog' }, { name: 'Hank', gender: 'male', species: 'dog' },
    { name: 'Ivy', gender: 'female', species: 'dog' }, { name: 'Jake', gender: 'male', species: 'dog' },
    { name: 'Kobe', gender: 'male', species: 'dog' }, { name: 'Lexi', gender: 'female', species: 'dog' },
    { name: 'Mack', gender: 'male', species: 'dog' }, { name: 'Nikki', gender: 'female', species: 'dog' },
    { name: 'Oakley', gender: 'unisex', species: 'dog' }, { name: 'Pippa', gender: 'female', species: 'dog' },
    { name: 'Quincy', gender: 'male', species: 'dog' }, { name: 'Remy', gender: 'unisex', species: 'dog' },
    { name: 'Sasha', gender: 'female', species: 'dog' }, { name: 'Toby', gender: 'male', species: 'dog' },
    { name: 'Uma', gender: 'female', species: 'dog' }, { name: 'Vivian', gender: 'female', species: 'dog' },
    { name: 'Wyatt', gender: 'male', species: 'dog' }, { name: 'Xena', gender: 'female', species: 'dog' },
    { name: 'Yuki', gender: 'unisex', species: 'dog' }, { name: 'Zara', gender: 'female', species: 'dog' },
    { name: 'Ace', gender: 'male', species: 'cat' }, { name: 'Boo', gender: 'unisex', species: 'cat' },
    { name: 'Coco', gender: 'unisex', species: 'cat' }, { name: 'Dusty', gender: 'male', species: 'cat' },
    { name: 'Ember', gender: 'female', species: 'cat' }, { name: 'Frost', gender: 'male', species: 'cat' },
    { name: 'Ginger', gender: 'female', species: 'cat' }, { name: 'Holly', gender: 'female', species: 'cat' },
    { name: 'Iris', gender: 'female', species: 'cat' }, { name: 'Jinx', gender: 'unisex', species: 'cat' },
    { name: 'Kiki', gender: 'female', species: 'cat' }, { name: 'Lucky', gender: 'unisex', species: 'cat' },
    { name: 'Mochi', gender: 'unisex', species: 'cat' }, { name: 'Nemo', gender: 'male', species: 'cat' },
    { name: 'Oreo', gender: 'unisex', species: 'cat' }, { name: 'Patch', gender: 'male', species: 'cat' },
    { name: 'Queenie', gender: 'female', species: 'cat' }, { name: 'Ringo', gender: 'male', species: 'cat' },
    { name: 'Spooky', gender: 'unisex', species: 'cat' }, { name: 'Trixie', gender: 'female', species: 'cat' },
    { name: 'Ulysses', gender: 'male', species: 'cat' }, { name: 'Violet', gender: 'female', species: 'cat' },
    { name: 'Whiskers', gender: 'male', species: 'cat' }, { name: 'Xander', gender: 'male', species: 'cat' },
    { name: 'Yogi', gender: 'male', species: 'cat' }, { name: 'Zelda', gender: 'female', species: 'cat' },
    { name: 'Avi', gender: 'unisex', species: 'bird' }, { name: 'Beak', gender: 'unisex', species: 'bird' },
    { name: 'Blue', gender: 'unisex', species: 'bird' }, { name: 'Chirp', gender: 'unisex', species: 'bird' },
    { name: 'Dodo', gender: 'unisex', species: 'bird' }, { name: 'Echo', gender: 'unisex', species: 'bird' },
    { name: 'Feather', gender: 'unisex', species: 'bird' }, { name: 'Gully', gender: 'unisex', species: 'bird' },
    { name: 'Hawk', gender: 'male', species: 'bird' }, { name: 'Icarus', gender: 'male', species: 'bird' },
    { name: 'Jett', gender: 'unisex', species: 'bird' }, { name: 'Kiwi', gender: 'unisex', species: 'bird' },
    { name: 'Lark', gender: 'unisex', species: 'bird' }, { name: 'Merlin', gender: 'male', species: 'bird' },
    { name: 'Nimbus', gender: 'unisex', species: 'bird' }, { name: 'Owl', gender: 'unisex', species: 'bird' },
    { name: 'Pip', gender: 'unisex', species: 'bird' }, { name: 'Quill', gender: 'unisex', species: 'bird' },
    { name: 'Raven', gender: 'unisex', species: 'bird' }, { name: 'Sky', gender: 'unisex', species: 'bird' },
    { name: 'Talon', gender: 'male', species: 'bird' }, { name: 'Umber', gender: 'unisex', species: 'bird' },
    { name: 'Vega', gender: 'female', species: 'bird' }, { name: 'Wren', gender: 'unisex', species: 'bird' },
    { name: 'Xeno', gender: 'unisex', species: 'bird' }, { name: 'Zen', gender: 'unisex', species: 'bird' },
    { name: 'Aspen', gender: 'unisex', species: 'dog' }, { name: 'Briar', gender: 'unisex', species: 'dog' },
    { name: 'Cedar', gender: 'unisex', species: 'dog' }, { name: 'Clover', gender: 'unisex', species: 'cat' },
    { name: 'Fern', gender: 'unisex', species: 'cat' }, { name: 'Juniper', gender: 'unisex', species: 'dog' },
    { name: 'Maple', gender: 'unisex', species: 'cat' }, { name: 'Oak', gender: 'unisex', species: 'dog' },
    { name: 'Pine', gender: 'unisex', species: 'cat' }, { name: 'Willow', gender: 'unisex', species: 'dog' }
];

// ========================================================================
//  STORAGE HELPERS
// ========================================================================
function getCurrencySymbol() {
    if (!data || !data.settings) return '$';
    const currency = data.settings.currency || 'USD';
    if (currency === 'PKR') return 'Rs';
    if (currency === 'SR') return 'SR';
    if (currency === 'WON') return '₩';
    return '$';
}

function applySettings() {
    if (!data || !data.settings) return;
    const s = data.settings;
    
    // 0. Currency Label
    const expLabel = document.getElementById('expenseAmountLabel');
    if (expLabel) {
        expLabel.textContent = `Amount (${getCurrencySymbol()})`;
    }

    // 1. Theme
    const currentTheme = s.theme || data.theme || 'warm';
    setTheme(currentTheme);
    
    // 2. Font Size
    let px = '16px';
    if (s.fontSize === 'small') px = '14px';
    else if (s.fontSize === 'large') px = '18px';
    document.documentElement.style.fontSize = px;
    
    // 3. Card Style
    document.body.classList.remove('card-style-flat', 'card-style-shadow', 'card-style-3d');
    document.body.classList.add(`card-style-${s.cardStyle || 'flat'}`);
    
    // 4. Default Pet View
    const container = document.getElementById('pet-chips-list-container');
    if (container) {
        container.className = 'pet-chips-container' + (s.defaultPetView === 'list' ? ' pet-view-list' : '');
    }
}

function loadData() {
    let raw = null;
    try {
        raw = localStorage.getItem('pawtrack_data');
    } catch (e) {
        console.error("localStorage reading failed:", e);
    }
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            // Migrate from old single-pet format
            if (parsed.pet && !parsed.pets) {
                const oldPet = parsed.pet;
                const newPet = {
                    id: 'pet1',
                    name: oldPet.name || '',
                    type: oldPet.type || 'dog',
                    birthdate: oldPet.birthdate || '',
                    size: oldPet.size || 'medium',
                    feeding: parsed.feeding || { breakfast: { fed: false, time: null, note: '' },
                        lunch: { fed: false, time: null, note: '' }, dinner: { fed: false, time: null,
                            note: '' }, history: [] },
                    medications: parsed.medications || [],
                    poopPee: parsed.poopPee || { logs: [] },
                    vaccinations: parsed.vaccinations || [],
                    walks: parsed.walks || [],
                    favorites: parsed.favorites || [],
                    sitter: parsed.sitter || { petName: '', feeding: '', meds: '', vet: '', walk: '',
                        notes: '', contact: '' },
                    bath: { baths: [], trims: [] }  // NEW
                };
                data = {
                    pets: [newPet],
                    currentPetId: 'pet1',
                    theme: parsed.theme || 'warm'
                };
            } else if (parsed.pets && Array.isArray(parsed.pets)) {
                data = parsed;
                // Ensure each pet has a bath property
                data.pets.forEach(p => {
                    if (!p.bath) p.bath = { baths: [], trims: [] };
                });
                // Initialize new database lists if they don't exist
                data.weightLogs = data.weightLogs || [];
                data.tasks = data.tasks || [];
                data.expenses = data.expenses || [];
                data.vetAppointments = data.vetAppointments || [];
                data.documents = data.documents || [];

                // Ensure currentPetId exists
                if (!data.currentPetId || !data.pets.find(p => p.id === data.currentPetId)) {
                    data.currentPetId = data.pets[0]?.id || '';
                }
            }
        } catch (e) {
            console.error("Failed to parse data:", e);
        }
    }

    if (!data) {
        // Default: no pets
        data = {
            pets: [],
            currentPetId: '',
            theme: 'warm',
            weightLogs: [],
            tasks: [],
            expenses: [],
            vetAppointments: [],
            documents: []
        };
    }

    // Ensure all sub-collections and properties exist
    data.pets = data.pets || [];
    data.weightLogs = data.weightLogs || [];
    data.tasks = data.tasks || [];
    data.expenses = data.expenses || [];
    data.vetAppointments = data.vetAppointments || [];
    data.documents = data.documents || [];

    data.pets.forEach(p => {
        if (!p.bath) p.bath = { baths: [], trims: [] };
        if (!p.diseasePrevention) p.diseasePrevention = [];
        if (!p.aiHealthLogs) p.aiHealthLogs = [];
    });

    // Ensure settings exists
    data.settings = data.settings || {
        language: 'en',
        currency: 'USD',
        notifications: false,
        defaultPetView: 'cards',
        theme: data.theme || 'warm',
        fontSize: 'medium',
        cardStyle: 'flat',
        backupReminder: true,
        dataSharing: false,
        usageAnalytics: false,
        petSounds: true
    };
    if (data.settings.petSounds === undefined) {
        data.settings.petSounds = true;
    }

    // Ensure ownerProfile exists
    data.ownerProfile = data.ownerProfile || {
        name: 'Pet Owner',
        email: 'owner@example.com',
        phone: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        avatar: ''
    };

    saveData();
    applySettings();
}

function saveData() {
    try {
        localStorage.setItem('pawtrack_data', JSON.stringify(data));
    } catch (e) {
        console.error("localStorage writing failed:", e);
    }
}

function getCurrentPet() {
    return data.pets.find(p => p.id === data.currentPetId) || null;
}

function setCurrentPetId(id) {
    data.currentPetId = id;
    saveData();
}

function updatePet(pet) {
    const idx = data.pets.findIndex(p => p.id === pet.id);
    if (idx !== -1) {
        data.pets[idx] = pet;
        saveData();
    }
}

// Ensure global registration
window.getCurrentPet = getCurrentPet;
window.setCurrentPetId = setCurrentPetId;
window.updatePet = updatePet;

function addPet(pet) {
    data.pets.push(pet);
    data.currentPetId = pet.id;
    saveData();
}

function removePet(id) {
    const idx = data.pets.findIndex(p => p.id === id);
    if (idx === -1) return;
    data.pets.splice(idx, 1);
    if (data.pets.length > 0) {
        data.currentPetId = data.pets[0].id;
    } else {
        data.currentPetId = '';
    }
    saveData();
}

function generateId() {
    return 'pet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
}

function createPetData(name, type, birthdate, size) {
    const pet = JSON.parse(JSON.stringify(DEFAULT_PET_DATA));
    pet.id = generateId();
    pet.name = name;
    pet.type = type;
    pet.birthdate = birthdate || '';
    pet.size = size || 'medium';
    pet.sitter.petName = name;
    return pet;
}

// ========================================================================
//  THEME
// ========================================================================
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    data.theme = theme;
    if (data.settings) {
        data.settings.theme = theme;
    }
    saveData();
    document.querySelectorAll('.theme-picker button').forEach(b => {
        b.classList.toggle('active', b.dataset.theme === theme);
    });
}

// ========================================================================
//  UI HELPERS
// ========================================================================
function formatTime(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString();
}

function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function isToday(ts) {
    if (!ts) return false;
    const d = new Date(ts);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today
        .getFullYear();
}

function getTodayStr() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}

function getWeekStart() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(d);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
}

function getWeekDays() {
    const start = getWeekStart();
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        days.push(d);
    }
    return days;
}

// ========================================================================
//  PET SETUP MODAL
// ========================================================================
function showSetupModal() {
    document.getElementById('setupModal').classList.remove('hidden');
    document.getElementById('petNameInput').value = '';
    document.getElementById('petTypeInput').value = 'dog';
    document.getElementById('petBirthInput').value = '';
    document.getElementById('petSizeInput').value = 'medium';
    updateSizeVisibility();
    document.getElementById('petNameInput').focus();
}

function hideSetupModal() {
    document.getElementById('setupModal').classList.add('hidden');
}

function updateSizeVisibility() {
    const type = document.getElementById('petTypeInput').value;
    document.getElementById('sizeGroup').style.display = type === 'dog' ? 'block' : 'none';
}
document.getElementById('petTypeInput').addEventListener('change', updateSizeVisibility);

document.getElementById('setupSaveBtn').addEventListener('click', function() {
    const name = document.getElementById('petNameInput').value.trim();
    if (!name) { alert('Please enter your pet\'s name.'); return; }
    const type = document.getElementById('petTypeInput').value;
    const birthdate = document.getElementById('petBirthInput').value || '';
    const size = document.getElementById('petSizeInput').value || 'medium';
    const pet = createPetData(name, type, birthdate, size);
    addPet(pet);
    hideSetupModal();
    populatePetSelector();
    updateUI();
    playPetSound(pet.type);
});

document.getElementById('petNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('setupSaveBtn').click();
});

// ========================================================================
//  PET SELECTOR
// ========================================================================
function populatePetSelector() {
    const select = document.getElementById('petSelector');
    select.innerHTML = '';
    data.pets.forEach(pet => {
        const opt = document.createElement('option');
        opt.value = pet.id;
        opt.textContent = pet.name + ' (' + pet.type + ')';
        if (pet.id === data.currentPetId) opt.selected = true;
        select.appendChild(opt);
    });
    // Update remove button visibility
    document.getElementById('removePetBtn').style.display = data.pets.length > 1 ? 'inline-flex' : 'none';
}

document.getElementById('petSelector').addEventListener('change', function() {
    const id = this.value;
    if (id) {
        setCurrentPetId(id);
        // Reset walk timer if running
        if (walkRunning) {
            walkRunning = false;
            if (walkTimerInterval) clearInterval(walkTimerInterval);
            walkTimerInterval = null;
            walkSeconds = 0;
            document.getElementById('walkStartBtn').disabled = false;
            document.getElementById('walkStopBtn').disabled = true;
            document.getElementById('walkTimerDisplay').textContent = '00:00:00';
        }
        updateUI();
        const pet = getCurrentPet();
        if (pet) playPetSound(pet.type);
    }
});

document.getElementById('addPetBtn').addEventListener('click', function() {
    const name = prompt('Enter pet name:');
    if (!name) return;
    const type = prompt('Enter pet type (dog, cat, bird, other):', 'dog');
    if (!type) return;
    const birthdate = prompt('Enter birthdate (YYYY-MM-DD) or leave empty:', '');
    const size = (type === 'dog') ? prompt('Size (small, medium, large):', 'medium') : 'medium';
    const pet = createPetData(name.trim(), type.trim().toLowerCase(), birthdate.trim(), size.trim().toLowerCase());
    addPet(pet);
    populatePetSelector();
    updateUI();
    playPetSound(pet.type);
    alert(`🐾 Added ${pet.name}!`);
});

document.getElementById('removePetBtn').addEventListener('click', function() {
    if (data.pets.length <= 1) {
        alert('Cannot remove the only pet. Add another pet first.');
        return;
    }
    const pet = getCurrentPet();
    if (!pet) return;
    if (confirm(`Remove "${pet.name}" and all its data?`)) {
        removePet(pet.id);
        populatePetSelector();
        updateUI();
    }
});

// ========================================================================
//  UPDATE UI
// ========================================================================
function updateUI() {
    const pet = getCurrentPet();
    if (!pet) {
        showSetupModal();
        return;
    }
    // Update header
    document.getElementById('petNameDisplay').textContent = pet.name || '—';
    const typeLabels = { dog: '🐕 Dog', cat: '🐈 Cat', bird: '🐦 Bird', other: '🐾 Other' };
    document.getElementById('petTypeDisplay').textContent = typeLabels[pet.type] || pet.type || '—';

    // Sitter pet name
    document.getElementById('sitterPetName').value = pet.sitter.petName || pet.name || '';

    // Update all tools
    updateFeedingUI(pet);
    updateAgeUI(pet);
    updateMedUI(pet);
    updatePoopUI(pet);
    updateVacUI(pet);
    updateWalkUI(pet);
    updateNamesUI(pet);
    updateSitterUI(pet);
    updateBathUI(pet);  // NEW

    // Theme
    setTheme(data.theme || 'warm');

    // Refresh new pages
    updateNewPagesUI(pet);

    // Render pet chips on dashboard
    if (typeof renderPetChips === 'function') {
        renderPetChips(pet);
    }

    // Update corner floating 3D pet image
    if (typeof updateFloatingPet === 'function') {
        updateFloatingPet(pet);
    }
}

// ========================================================================
//  FEEDING (per pet)
// ========================================================================
function updateFeedingUI(pet) {
    const f = pet.feeding;
    const meals = ['breakfast', 'lunch', 'dinner'];
    const labels = { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner' };
    meals.forEach(m => {
        const btn = document.querySelector(`.toggle-btn[data-meal="${m}"]`);
        const status = document.getElementById(`${m}-status`);
        if (f[m].fed && isToday(f[m].time)) {
            btn.classList.add('active');
            status.textContent = `✅ Fed at ${formatTime(f[m].time)}`;
        } else {
            btn.classList.remove('active');
            status.textContent = 'Not fed';
            if (f[m].fed && !isToday(f[m].time)) {
                f[m].fed = false;
                f[m].time = null;
                f[m].note = '';
                updatePet(pet);
            }
        }
        btn.innerHTML = `${labels[m]}<span class="sub" id="${m}-status">${status.textContent}</span>`;
    });

    const container = document.getElementById('feedingHistory');
    const today = getTodayStr();
    const history = f.history.filter(h => h.date === today).slice(-20).reverse();
    if (history.length === 0) {
        container.innerHTML = '<div class="text-secondary text-sm">No feeding records today.</div>';
    } else {
        container.innerHTML = history.map(h =>
            `<div class="timeline-item">
        <span class="time">${formatTime(h.time)}</span>
        <span><strong>${labels[h.meal] || h.meal}</strong></span>
        ${h.note ? `<span class="note">📝 ${h.note}</span>` : ''}
        <span style="margin-left:auto;font-size:0.75rem;opacity:0.6;">by me</span>
      </div>`
        ).join('');
    }
}

// Feeding event listeners (delegated)
document.querySelectorAll('.toggle-btn[data-meal]').forEach(btn => {
    btn.addEventListener('click', function() {
        const pet = getCurrentPet();
        if (!pet) return;
        const meal = this.dataset.meal;
        const f = pet.feeding;
        const now = new Date();
        const todayStr = getTodayStr();

        if (f[meal].fed && isToday(f[meal].time)) {
            if (confirm(`Unmark ${meal} as fed?`)) {
                f[meal].fed = false;
                f[meal].time = null;
                f[meal].note = '';
                updatePet(pet);
                updateFeedingUI(pet);
            }
            return;
        }

        f[meal].fed = true;
        f[meal].time = now.toISOString();
        const noteInput = document.getElementById('mealNoteInput');
        const note = noteInput.value.trim();
        if (note) {
            f[meal].note = note;
            f.history.push({ meal, time: now.toISOString(), date: todayStr, note: note });
            noteInput.value = '';
        } else {
            f.history.push({ meal, time: now.toISOString(), date: todayStr, note: '' });
        }
        updatePet(pet);
        updateFeedingUI(pet);
    });
});

document.getElementById('mealNoteAddBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;
    const note = document.getElementById('mealNoteInput').value.trim();
    if (!note) { alert('Please enter a note.'); return; }
    const f = pet.feeding;
    const todayStr = getTodayStr();
    const meals = ['breakfast', 'lunch', 'dinner'];
    let found = false;
    for (const m of meals) {
        if (f[m].fed && isToday(f[m].time) && !f[m].note) {
            f[m].note = note;
            const hist = f.history.find(h => h.meal === m && h.date === todayStr && !h.note);
            if (hist) hist.note = note;
            found = true;
            break;
        }
    }
    if (!found) {
        alert('No recent meal found to add a note to. Feed your pet first!');
        return;
    }
    updatePet(pet);
    document.getElementById('mealNoteInput').value = '';
    updateFeedingUI(pet);
});

// ========================================================================
//  AGE (per pet)
// ========================================================================
function updateAgeUI(pet) {
    const birthdate = pet.birthdate || '';
    document.getElementById('ageBirthInput').value = birthdate;

    if (!birthdate) {
        document.getElementById('ageDisplay').textContent = 'Set birthdate';
        document.getElementById('humanAgeDisplay').textContent = '—';
        document.getElementById('birthdayCountdown').textContent = '—';
        document.getElementById('birthdayCountdownLarge').textContent = '—';
        return;
    }

    const birth = new Date(birthdate + 'T00:00:00');
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--;
        months += 12; }
    if (years < 0) { years = 0;
        months = 0;
        days = 0; }

    document.getElementById('ageDisplay').textContent = `${years}y ${months}m ${days}d`;

    let humanAge = 0;
    const type = pet.type || 'dog';
    const size = pet.size || 'medium';
    if (type === 'dog') {
        const ageMap = {
            small: [15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96],
            medium: [15, 24, 28, 32, 36, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87, 92, 96, 101, 105],
            large: [15, 24, 28, 32, 36, 45, 50, 55, 61, 66, 72, 77, 82, 88, 93, 99, 104, 110, 115, 121]
        };
        const map = ageMap[size] || ageMap.medium;
        const idx = Math.min(years, map.length - 1);
        humanAge = map[idx] || 0;
    } else if (type === 'cat') {
        if (years <= 1) humanAge = 15;
        else if (years <= 2) humanAge = 24;
        else humanAge = 24 + (years - 2) * 4;
    } else {
        humanAge = years * 5;
    }
    document.getElementById('humanAgeDisplay').textContent = humanAge + ' years';

    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < now) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const diffMs = nextBirthday - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('birthdayCountdown').textContent = `${diffDays}d ${diffHrs}h ${diffMins}m`;
    document.getElementById('birthdayCountdownLarge').textContent = `${diffDays}d ${diffHrs}h ${diffMins}m`;
}

document.getElementById('ageUpdateBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;
    const val = document.getElementById('ageBirthInput').value;
    if (val) {
        pet.birthdate = val;
        updatePet(pet);
        updateAgeUI(pet);
    } else {
        alert('Please select a birthdate.');
    }
});

setInterval(() => {
    const pet = getCurrentPet();
    if (pet) updateAgeUI(pet);
}, 60000);

// ========================================================================
//  MEDICATIONS (per pet)
// ========================================================================
function updateMedUI(pet) {
    const container = document.getElementById('medList');
    const meds = pet.medications || [];
    if (meds.length === 0) {
        container.innerHTML = '<div class="text-secondary text-sm">No medications added.</div>';
        return;
    }

    container.innerHTML = meds.map((med, idx) => {
        const now = new Date();
        const start = new Date(med.startDate);
        const end = med.endDate ? new Date(med.endDate) : null;
        let nextDose = new Date(med.lastGiven || start);
        const freq = med.frequency;
        let hours = 0;
        if (freq === 'daily') hours = 24;
        else if (freq === 'weekly') hours = 168;
        else if (freq === '12h') hours = 12;
        else if (freq === '8h') hours = 8;
        else if (freq === 'custom') hours = med.customHours || 6;

        while (nextDose <= now) {
            nextDose.setHours(nextDose.getHours() + hours);
        }
        const diffMs = nextDose - now;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const countdownStr = `${diffHrs}h ${diffMins}m`;

        const isOverdue = end && now > end;

        return `<div class="med-card ${isOverdue ? 'overdue' : ''}">
      <div class="flex-between">
        <span class="med-name">${med.name}</span>
        <span class="tag ${isOverdue ? 'tag-danger' : 'tag-success'}">${isOverdue ? '⏰ Overdue' : 'Active'}</span>
      </div>
      <div class="med-detail">💊 ${med.dosage || '—'} · ${med.frequency}</div>
      <div class="med-detail">📅 Started ${formatDate(med.startDate)}${med.endDate ? ' · Ends '+formatDate(med.endDate) : ''}</div>
      <div class="flex-between mt-8">
        <span class="countdown">⏱ Next dose in ${countdownStr}</span>
        <div class="flex-center gap-sm">
          <button class="btn btn-sm btn-success med-given-btn" data-idx="${idx}">✅ Mark Given</button>
          <button class="btn btn-sm btn-danger med-del-btn" data-idx="${idx}">🗑</button>
        </div>
      </div>
      ${med.history && med.history.length > 0 ? `
        <div class="text-xs text-secondary mt-8">Last 10 doses: ${med.history.slice(-10).map(h => formatTime(h)).join(', ')}</div>
      ` : ''}
    </div>`;
    }).join('');

    container.querySelectorAll('.med-given-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pet = getCurrentPet();
            if (!pet) return;
            const idx = parseInt(this.dataset.idx);
            const med = pet.medications[idx];
            if (!med) return;
            const now = new Date();
            if (!med.history) med.history = [];
            med.history.push(now.toISOString());
            med.lastGiven = now.toISOString();
            updatePet(pet);
            updateMedUI(pet);
            if (Notification.permission === 'granted') {
                new Notification(`💊 ${med.name} given!`, { body: `Next dose scheduled.` });
            }
        });
    });
    container.querySelectorAll('.med-del-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pet = getCurrentPet();
            if (!pet) return;
            const idx = parseInt(this.dataset.idx);
            if (confirm(`Delete "${pet.medications[idx].name}"?`)) {
                pet.medications.splice(idx, 1);
                updatePet(pet);
                updateMedUI(pet);
            }
        });
    });
}

document.getElementById('medAddBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;
    const name = document.getElementById('medName').value.trim();
    const dosage = document.getElementById('medDosage').value.trim();
    const frequency = document.getElementById('medFrequency').value;
    const customHours = parseInt(document.getElementById('medCustomHours').value) || 6;
    const startDate = document.getElementById('medStartDate').value;
    const endDate = document.getElementById('medEndDate').value || null;

    if (!name) { alert('Please enter a medication name.'); return; }
    if (!startDate) { alert('Please select a start date.'); return; }

    pet.medications.push({
        name,
        dosage: dosage || '—',
        frequency,
        customHours: frequency === 'custom' ? customHours : null,
        startDate,
        endDate,
        lastGiven: null,
        history: []
    });
    updatePet(pet);
    document.getElementById('medName').value = '';
    document.getElementById('medDosage').value = '';
    document.getElementById('medStartDate').value = '';
    document.getElementById('medEndDate').value = '';
    updateMedUI(pet);

    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

document.getElementById('medFrequency').addEventListener('change', function() {
    document.getElementById('medCustomHoursGroup').style.display =
        this.value === 'custom' ? 'block' : 'none';
});

// ========================================================================
//  POOP & PEE (per pet)
// ========================================================================
function updatePoopUI(pet) {
    const logs = pet.poopPee.logs || [];
    const todayStr = getTodayStr();
    const todayLogs = logs.filter(l => l.date === todayStr).slice(-30).reverse();

    const container = document.getElementById('ppTimeline');
    if (todayLogs.length === 0) {
        container.innerHTML = '<div class="text-secondary text-sm">No logs today.</div>';
    } else {
        container.innerHTML = todayLogs.map(l =>
            `<div class="timeline-item">
        <span class="time">${formatTime(l.time)}</span>
        <span class="icon-badge">${l.type === 'pee' ? '💧' : '💩'}</span>
        <span>${l.type === 'pee' ? 'Pee' : 'Poop'} · ${l.location === 'inside' ? '🏠 Inside' : '🌳 Outside'}</span>
      </div>`
        ).join('');
    }

    const weekDays = getWeekDays();
    const weekStr = weekDays.map(d => d.toISOString().split('T')[0]);
    const summary = {};
    weekStr.forEach(d => { summary[d] = { pee: 0, poop: 0 }; });
    logs.forEach(l => {
        if (weekStr.includes(l.date)) {
            if (l.type === 'pee') summary[l.date].pee++;
            else summary[l.date].poop++;
        }
    });

    const weekContainer = document.getElementById('weeklySummary');
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekContainer.innerHTML = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center;">
    ${weekDays.map((d, i) => {
      const ds = d.toISOString().split('T')[0];
      const s = summary[ds] || {pee:0,poop:0};
      const isToday = ds === todayStr;
      return `<div style="background:${isToday ? 'var(--accent-light)' : 'var(--input-bg)'};border-radius:10px;padding:6px 2px;border:${isToday ? '2px solid var(--accent)' : '1px solid var(--border)'};">
        <div style="font-weight:700;font-size:0.7rem;">${dayLabels[i]}</div>
        <div style="font-size:0.9rem;">💧${s.pee} 💩${s.poop}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function logPP(type) {
    const pet = getCurrentPet();
    if (!pet) return;
    const location = document.getElementById('ppLocation').value;
    const now = new Date();
    pet.poopPee.logs.push({
        type,
        location,
        time: now.toISOString(),
        date: now.toISOString().split('T')[0]
    });
    updatePet(pet);
    updatePoopUI(pet);
}

document.getElementById('ppPeeBtn').addEventListener('click', () => logPP('pee'));
document.getElementById('ppPoopBtn').addEventListener('click', () => logPP('poop'));

// ========================================================================
//  VACCINATIONS (per pet)
// ========================================================================
function updateVacUI(pet) {
    const container = document.getElementById('vacList');
    const vacs = pet.vaccinations || [];
    if (vacs.length === 0) {
        container.innerHTML = '<div class="text-secondary text-sm">No vaccination records.</div>';
        return;
    }

    const now = new Date();
    const sorted = [...vacs].sort((a, b) => new Date(a.due) - new Date(b.due));

    container.innerHTML = sorted.map((vac, idx) => {
        const due = new Date(vac.due);
        const overdue = due < now;
        return `<div class="med-card ${overdue ? 'overdue' : ''}">
      <div class="flex-between">
        <span class="med-name">💉 ${vac.name}</span>
        <span class="tag ${overdue ? 'tag-danger' : 'tag-success'}">${overdue ? '🔴 Overdue' : '✅ Up to date'}</span>
      </div>
      <div class="med-detail">📅 Administered: ${formatDate(vac.date)} · Next due: ${formatDate(vac.due)}</div>
      ${vac.notes ? `<div class="med-detail">📝 ${vac.notes}</div>` : ''}
      <div class="flex-center gap-sm mt-8">
        <button class="btn btn-sm btn-outline vac-edit-btn" data-idx="${idx}">✏️ Edit</button>
        <button class="btn btn-sm btn-danger vac-del-btn" data-idx="${idx}">🗑 Delete</button>
      </div>
    </div>`;
    }).join('');

    container.querySelectorAll('.vac-del-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pet = getCurrentPet();
            if (!pet) return;
            const idx = parseInt(this.dataset.idx);
            if (confirm('Delete this vaccination record?')) {
                pet.vaccinations.splice(idx, 1);
                updatePet(pet);
                updateVacUI(pet);
            }
        });
    });
    container.querySelectorAll('.vac-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pet = getCurrentPet();
            if (!pet) return;
            const idx = parseInt(this.dataset.idx);
            const vac = pet.vaccinations[idx];
            if (!vac) return;
            const newName = prompt('Vaccine name:', vac.name);
            if (newName === null) return;
            const newDate = prompt('Date administered (YYYY-MM-DD):', vac.date);
            if (newDate === null) return;
            const newDue = prompt('Next due date (YYYY-MM-DD):', vac.due);
            if (newDue === null) return;
            const newNotes = prompt('Vet notes:', vac.notes || '');
            if (newNotes === null) return;
            vac.name = newName.trim() || vac.name;
            vac.date = newDate.trim() || vac.date;
            vac.due = newDue.trim() || vac.due;
            vac.notes = newNotes.trim() || '';
            updatePet(pet);
            updateVacUI(pet);
        });
    });
}

document.getElementById('vacAddBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;
    const name = document.getElementById('vacName').value.trim();
    const date = document.getElementById('vacDate').value;
    const due = document.getElementById('vacDue').value;
    const notes = document.getElementById('vacNotes').value.trim();

    if (!name) { alert('Please enter a vaccine name.'); return; }
    if (!date) { alert('Please select the date administered.'); return; }
    if (!due) { alert('Please select the next due date.'); return; }

    pet.vaccinations.push({ name, date, due, notes: notes || '' });
    updatePet(pet);
    document.getElementById('vacName').value = '';
    document.getElementById('vacDate').value = '';
    document.getElementById('vacDue').value = '';
    document.getElementById('vacNotes').value = '';
    updateVacUI(pet);
});

document.getElementById('vacPrintBtn').addEventListener('click', function() {
    window.print();
});

// ========================================================================
//  WALKS (per pet)
// ========================================================================
function updateWalkUI(pet) {
    const walks = pet.walks || [];
    const container = document.getElementById('walkLog');
    if (walks.length === 0) {
        container.innerHTML = '<div class="text-secondary text-sm">No walks logged.</div>';
    } else {
        const sorted = [...walks].reverse().slice(0, 20);
        container.innerHTML = sorted.map(w =>
            `<div class="walk-entry">
        <div class="walk-info">
          <span class="time">${formatDate(w.date)}</span>
          <span>🚶 ${formatDuration(w.duration)}</span>
          ${w.distance ? `<span>📏 ${w.distance}km</span>` : ''}
          ${w.note ? `<span class="note">📝 ${w.note}</span>` : ''}
        </div>
      </div>`
        ).join('');
    }

    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekWalks = walks.filter(w => {
        const d = new Date(w.date);
        return d >= weekStart && d < weekEnd;
    });
    const totalSecs = weekWalks.reduce((sum, w) => sum + w.duration, 0);
    const totalKm = weekWalks.reduce((sum, w) => sum + (w.distance || 0), 0);
    document.getElementById('walkWeeklyTotal').textContent =
        `${formatDuration(totalSecs)} ${totalKm > 0 ? `· ${totalKm.toFixed(1)}km` : ''}`;

    document.getElementById('walkTimerDisplay').textContent = formatDuration(walkSeconds);
}

document.getElementById('walkStartBtn').addEventListener('click', function() {
    if (walkRunning) return;
    walkSeconds = 0;
    walkRunning = true;
    walkStartTime = Date.now();
    document.getElementById('walkStartBtn').disabled = true;
    document.getElementById('walkStopBtn').disabled = false;
    if (walkTimerInterval) clearInterval(walkTimerInterval);
    walkTimerInterval = setInterval(() => {
        if (walkRunning) {
            walkSeconds = Math.floor((Date.now() - walkStartTime) / 1000);
            document.getElementById('walkTimerDisplay').textContent = formatDuration(walkSeconds);
        }
    }, 200);
});

document.getElementById('walkStopBtn').addEventListener('click', function() {
    if (!walkRunning) return;
    walkRunning = false;
    if (walkTimerInterval) clearInterval(walkTimerInterval);
    walkTimerInterval = null;
    document.getElementById('walkStartBtn').disabled = false;
    document.getElementById('walkStopBtn').disabled = true;

    const pet = getCurrentPet();
    if (!pet) { walkSeconds = 0;
        document.getElementById('walkTimerDisplay').textContent = '00:00:00'; return; }

    const duration = walkSeconds;
    const distance = parseFloat(document.getElementById('walkDistance').value) || 0;
    const note = document.getElementById('walkNote').value.trim() || '';

    if (duration > 5) {
        pet.walks.push({
            date: new Date().toISOString(),
            duration: duration,
            distance: distance,
            note: note
        });
        updatePet(pet);
        document.getElementById('walkDistance').value = '';
        document.getElementById('walkNote').value = '';
        updateWalkUI(pet);
    } else {
        alert('Walk was too short (less than 5 seconds). Not logged.');
    }
    walkSeconds = 0;
    document.getElementById('walkTimerDisplay').textContent = '00:00:00';
});

// ========================================================================
//  NAMES (per pet - favorites)
// ========================================================================
let filteredNames = [...PET_NAMES];

function updateNamesUI(pet) {
    renderNameGrid(pet);
    renderFavorites(pet);
}

function renderNameGrid(pet) {
    const container = document.getElementById('nameGrid');
    const gender = document.getElementById('nameGender').value;
    const species = document.getElementById('nameSpecies').value;
    const startsWith = document.getElementById('nameStartsWith').value.trim().toUpperCase();
    const maxLen = parseInt(document.getElementById('nameLength').value) || 0;

    let filtered = [...PET_NAMES];
    if (gender !== 'all') filtered = filtered.filter(n => n.gender === gender);
    if (species !== 'all') filtered = filtered.filter(n => n.species === species);
    if (startsWith) filtered = filtered.filter(n => n.name.toUpperCase().startsWith(startsWith));
    if (maxLen > 0) filtered = filtered.filter(n => n.name.length <= maxLen);

    filteredNames = filtered;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="text-secondary text-sm">No names match your filters.</div>';
        return;
    }

    const favs = pet.favorites || [];
    container.innerHTML = filtered.map(n =>
        `<div class="name-chip ${favs.includes(n.name) ? 'fav' : ''}" data-name="${n.name}">
      ${n.name}
      <span style="font-size:0.6rem;opacity:0.6;display:block;">${n.gender} · ${n.species}</span>
    </div>`
    ).join('');

    container.querySelectorAll('.name-chip').forEach(el => {
        el.addEventListener('click', function() {
            const pet = getCurrentPet();
            if (!pet) return;
            const name = this.dataset.name;
            const favs = pet.favorites || [];
            const idx = favs.indexOf(name);
            if (idx >= 0) {
                favs.splice(idx, 1);
            } else {
                favs.push(name);
            }
            pet.favorites = favs;
            updatePet(pet);
            renderNameGrid(pet);
            renderFavorites(pet);
            navigator.clipboard?.writeText(name).catch(() => {});
        });
    });
}

function renderFavorites(pet) {
    const container = document.getElementById('favoritesGrid');
    const favs = pet.favorites || [];
    if (favs.length === 0) {
        container.innerHTML = '<div class="text-secondary text-sm">No favorites yet. Click a name to star it!</div>';
        return;
    }
    container.innerHTML = favs.map(name =>
        `<div class="name-chip fav" data-name="${name}">⭐ ${name}</div>`
    ).join('');
    container.querySelectorAll('.name-chip').forEach(el => {
        el.addEventListener('click', function() {
            const pet = getCurrentPet();
            if (!pet) return;
            const name = this.dataset.name;
            const favs = pet.favorites || [];
            const idx = favs.indexOf(name);
            if (idx >= 0) {
                favs.splice(idx, 1);
                pet.favorites = favs;
                updatePet(pet);
                renderFavorites(pet);
                renderNameGrid(pet);
            }
        });
    });
}

document.getElementById('nameFilterBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (pet) renderNameGrid(pet);
});
document.getElementById('nameClearFilters').addEventListener('click', function() {
    document.getElementById('nameGender').value = 'all';
    document.getElementById('nameSpecies').value = 'all';
    document.getElementById('nameStartsWith').value = '';
    document.getElementById('nameLength').value = '0';
    const pet = getCurrentPet();
    if (pet) renderNameGrid(pet);
});

document.getElementById('nameSurpriseBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;
    const filtered = filteredNames.length > 0 ? filteredNames : PET_NAMES;
    if (filtered.length === 0) { alert('No names match your filters.'); return; }
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    alert(`🎲 Surprise name: ${random.name} (${random.gender}, ${random.species})`);
    if (confirm(`Add "${random.name}" to favorites?`)) {
        const favs = pet.favorites || [];
        if (!favs.includes(random.name)) {
            favs.push(random.name);
            pet.favorites = favs;
            updatePet(pet);
            renderNameGrid(pet);
            renderFavorites(pet);
        }
    }
});

// ========================================================================
//  SITTER (per pet)
// ========================================================================
function updateSitterUI(pet) {
    const s = pet.sitter || {};
    document.getElementById('sitterPetName').value = s.petName || pet.name || '';
    document.getElementById('sitterFeeding').value = s.feeding || '';
    document.getElementById('sitterMeds').value = s.meds || '';
    document.getElementById('sitterVet').value = s.vet || '';
    document.getElementById('sitterWalk').value = s.walk || '';
    document.getElementById('sitterNotes').value = s.notes || '';
    document.getElementById('sitterContact').value = s.contact || '';
    renderSitterPreview(pet);
}

function renderSitterPreview(pet) {
    const s = pet.sitter || {};
    const name = s.petName || pet.name || '—';
    const preview = document.getElementById('sitterPreview');
    preview.innerHTML = `
    <div style="text-align:center;font-size:1.3rem;font-weight:900;color:var(--accent);margin-bottom:8px;">🐾 Pet Sitter Instructions</div>
    <p><strong>Pet:</strong> ${name}</p>
    <p><strong>Feeding:</strong> ${s.feeding || '—'}</p>
    <p><strong>Medication:</strong> ${s.meds || '—'}</p>
    <p><strong>Vet Contact:</strong> ${s.vet || '—'}</p>
    <p><strong>Walk Routine:</strong> ${s.walk || '—'}</p>
    <p><strong>Special Notes:</strong> ${s.notes || '—'}</p>
    <p><strong>Sitter Contact:</strong> ${s.contact || '—'}</p>
  `;
}

document.getElementById('sitterSaveBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;
    pet.sitter = {
        petName: document.getElementById('sitterPetName').value.trim(),
        feeding: document.getElementById('sitterFeeding').value.trim(),
        meds: document.getElementById('sitterMeds').value.trim(),
        vet: document.getElementById('sitterVet').value.trim(),
        walk: document.getElementById('sitterWalk').value.trim(),
        notes: document.getElementById('sitterNotes').value.trim(),
        contact: document.getElementById('sitterContact').value.trim()
    };
    updatePet(pet);
    renderSitterPreview(pet);
    alert('✅ Sitter sheet saved!');
});

document.getElementById('sitterPrintBtn').addEventListener('click', function() {
    window.print();
});

let sitterTimeout;
document.querySelectorAll('#tab-sitter input, #tab-sitter textarea').forEach(el => {
    el.addEventListener('input', function() {
        const pet = getCurrentPet();
        if (!pet) return;
        clearTimeout(sitterTimeout);
        sitterTimeout = setTimeout(() => {
            pet.sitter = {
                petName: document.getElementById('sitterPetName').value.trim(),
                feeding: document.getElementById('sitterFeeding').value.trim(),
                meds: document.getElementById('sitterMeds').value.trim(),
                vet: document.getElementById('sitterVet').value.trim(),
                walk: document.getElementById('sitterWalk').value.trim(),
                notes: document.getElementById('sitterNotes').value.trim(),
                contact: document.getElementById('sitterContact').value.trim()
            };
            updatePet(pet);
            renderSitterPreview(pet);
        }, 600);
    });
});

// ========================================================================
//  BATH & TRIMMING (per pet) - NEW
// ========================================================================
function updateBathUI(pet) {
    const bathData = pet.bath || { baths: [], trims: [] };
    const todayStr = getTodayStr();

    // Update button statuses
    const hasBathToday = bathData.baths.some(b => b.date === todayStr);
    const hasTrimToday = bathData.trims.some(t => t.date === todayStr);

    const bathBtn = document.getElementById('bathBtn');
    const trimBtn = document.getElementById('trimBtn');
    const bathStatus = document.getElementById('bathStatus');
    const trimStatus = document.getElementById('trimStatus');

    if (hasBathToday) {
        bathBtn.classList.add('logged');
        const lastBath = bathData.baths.filter(b => b.date === todayStr).pop();
        bathStatus.textContent = `✅ Done at ${formatTime(lastBath.time)}`;
    } else {
        bathBtn.classList.remove('logged');
        bathStatus.textContent = 'Not logged today';
    }

    if (hasTrimToday) {
        trimBtn.classList.add('logged');
        const lastTrim = bathData.trims.filter(t => t.date === todayStr).pop();
        trimStatus.textContent = `✅ Done at ${formatTime(lastTrim.time)}`;
    } else {
        trimBtn.classList.remove('logged');
        trimStatus.textContent = 'Not logged today';
    }

    // History
    const container = document.getElementById('bathHistory');
    const allEvents = [
        ...bathData.baths.map(b => ({ ...b, type: 'bath' })),
        ...bathData.trims.map(t => ({ ...t, type: 'trim' }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 30);

    if (allEvents.length === 0) {
        container.innerHTML = '<div class="text-secondary text-sm">No bath or trimming records.</div>';
    } else {
        container.innerHTML = allEvents.map(e =>
            `<div class="timeline-item">
        <span class="time">${formatTime(e.time)}</span>
        <span class="icon-badge">${e.type === 'bath' ? '🛁' : '✂️'}</span>
        <span><strong>${e.type === 'bath' ? 'Bath' : 'Trimming'}</strong></span>
        ${e.note ? `<span class="note">📝 ${e.note}</span>` : ''}
        <span style="margin-left:auto;font-size:0.7rem;opacity:0.5;">${formatDate(e.time)}</span>
      </div>`
        ).join('');
    }
}

function logBath(type) {
    const pet = getCurrentPet();
    if (!pet) return;
    if (!pet.bath) pet.bath = { baths: [], trims: [] };

    const now = new Date();
    const entry = {
        time: now.toISOString(),
        date: now.toISOString().split('T')[0],
        note: document.getElementById('bathNoteInput').value.trim() || ''
    };

    if (type === 'bath') {
        // Check if already logged today (optional)
        const todayStr = getTodayStr();
        const existing = pet.bath.baths.filter(b => b.date === todayStr);
        if (existing.length > 0 && !confirm('Already logged a bath today. Log another?')) {
            return;
        }
        pet.bath.baths.push(entry);
    } else {
        const todayStr = getTodayStr();
        const existing = pet.bath.trims.filter(t => t.date === todayStr);
        if (existing.length > 0 && !confirm('Already logged a trimming today. Log another?')) {
            return;
        }
        pet.bath.trims.push(entry);
    }

    document.getElementById('bathNoteInput').value = '';
    updatePet(pet);
    updateBathUI(pet);
}

document.getElementById('bathBtn').addEventListener('click', () => logBath('bath'));
document.getElementById('trimBtn').addEventListener('click', () => logBath('trim'));

document.getElementById('bathNoteAddBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;
    const note = document.getElementById('bathNoteInput').value.trim();
    if (!note) { alert('Please enter a note.'); return; }

    const bathData = pet.bath || { baths: [], trims: [] };
    const todayStr = getTodayStr();

    let found = false;
    // Check baths
    for (let i = bathData.baths.length - 1; i >= 0; i--) {
        if (bathData.baths[i].date === todayStr && !bathData.baths[i].note) {
            bathData.baths[i].note = note;
            found = true;
            break;
        }
    }
    if (!found) {
        for (let i = bathData.trims.length - 1; i >= 0; i--) {
            if (bathData.trims[i].date === todayStr && !bathData.trims[i].note) {
                bathData.trims[i].note = note;
                found = true;
                break;
            }
        }
    }

    if (!found) {
        alert('No recent bath or trimming found to add a note to. Log one first!');
        return;
    }

    pet.bath = bathData;
    updatePet(pet);
    document.getElementById('bathNoteInput').value = '';
    updateBathUI(pet);
});

// ========================================================================
//  TAB SWITCHING
// ========================================================================
document.querySelectorAll('.tab-items-container button').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-items-container button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tab = this.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');

        // Update active tab label for mobile view dropdown header
        const activeTabLabel = document.getElementById('activeTabLabel');
        if (activeTabLabel) {
            activeTabLabel.textContent = this.textContent.trim();
        }
    });
});


// ========================================================================
//  THEME PICKER
// ========================================================================
document.querySelectorAll('.theme-picker button').forEach(btn => {
    btn.addEventListener('click', function() {
        const theme = this.dataset.theme;
        setTheme(theme);
    });
});

// ========================================================================
//  INIT
// ========================================================================
loadData();

if (data.pets.length === 0) {
    showSetupModal();
} else {
    hideSetupModal();
    if (!data.currentPetId || !data.pets.find(p => p.id === data.currentPetId)) {
        data.currentPetId = data.pets[0].id;
        saveData();
    }
    populatePetSelector();
    updateUI();
}

if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    Notification.requestPermission();
}

setInterval(() => {
    const pet = getCurrentPet();
    if (pet) {
        updateMedUI(pet);
        updateAgeUI(pet);
    }
}, 30000);

// ========================================================================
//  MULTI-PAGE ROUTING & INITIALIZATION
// ========================================================================
function handleRouting() {
    if (!window.location.hash) {
        window.location.hash = '#dashboard';
        return;
    }
    const hash = window.location.hash;
    const pages = ['dashboard', 'tracker', 'weight', 'tasks', 'expenses', 'appointments', 'documents', 'chat', 'settings', 'prevention', 'profile'];
    const activePage = hash.substring(1);
    const pageToShow = pages.includes(activePage) ? activePage : 'dashboard';

    // Hide all pages, show active one
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    const targetPageEl = document.getElementById(`page-${pageToShow}`);
    if (targetPageEl) targetPageEl.classList.add('active');

    // Update active class on sidebar navigation links
    document.querySelectorAll('.sidebar .nav-item').forEach(a => {
        const href = a.getAttribute('href');
        a.classList.toggle('active', href === `#${pageToShow}`);
    });

    // Update active menu label for mobile view header dropdown
    const activeLink = document.querySelector(`.sidebar .nav-item[href="#${pageToShow}"]`);
    const activeLabelEl = document.getElementById('activeMenuLabel');
    if (activeLink && activeLabelEl) {
        activeLabelEl.textContent = activeLink.textContent.trim();
    }

    // Scroll to top of content
    window.scrollTo(0, 0);

    // Special initial redraws if charts need sizing
    const pet = getCurrentPet();
    if (pet) {
        if (pageToShow === 'weight') {
            renderWeightChart(pet);
        } else if (pageToShow === 'expenses') {
            renderExpensesChart(pet);
        } else if (pageToShow === 'settings') {
            updateSettingsUI(pet);
        } else if (pageToShow === 'profile') {
            if (window.updateOwnerProfileUI) window.updateOwnerProfileUI();
        }
    }
}

window.addEventListener('hashchange', handleRouting);
// In Next.js the 'load' event fires before useEffect; call directly to ensure initial routing
if (document.readyState === 'complete') {
    handleRouting();
} else {
    window.addEventListener('load', handleRouting);
}

// Core new pages refresh dispatcher
function updateNewPagesUI(pet) {
    if (!pet) return;
    updateDashboardUI(pet);
    updateWeightUI(pet);
    updateTasksUI(pet);
    updateExpensesUI(pet);
    updateAppointmentsUI(pet);
    updateDocumentsUI(pet);
    updateSettingsUI(pet);

    // Prevention & AI Disease Tracker
    updatePreventionUI(pet);
    updateAiHealthUI(pet);
    if (window.resetAiChatWindow) {
        window.resetAiChatWindow();
    }
    if (window.updateOwnerProfileUI) {
        window.updateOwnerProfileUI();
    }
}

// ========================================================================
//  DASHBOARD FEATURE MODULE
// ========================================================================
function updateDashboardUI(pet) {
    if (!pet) return;

    // 1. Weight Summary
    const petWeights = (data.weightLogs || []).filter(w => w.petId === pet.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const weightValEl = document.getElementById('dash-weight-val');
    const weightDiffEl = document.getElementById('dash-weight-diff');
    if (petWeights.length > 0) {
        const latest = petWeights[petWeights.length - 1];
        weightValEl.textContent = `${latest.weight} kg`;
        if (petWeights.length > 1) {
            const prev = petWeights[petWeights.length - 2];
            const diff = latest.weight - prev.weight;
            const diffText = diff > 0 ? `+${diff.toFixed(2)} kg since last log` : `${diff.toFixed(2)} kg since last log`;
            weightDiffEl.textContent = diffText;
            weightDiffEl.className = diff > 0 ? 'text-secondary text-sm text-accent' : 'text-secondary text-sm text-success';
        } else {
            weightDiffEl.textContent = 'First logged weight';
            weightDiffEl.className = 'text-secondary text-sm';
        }
    } else {
        weightValEl.textContent = '—';
        weightDiffEl.textContent = 'No records yet';
        weightDiffEl.className = 'text-secondary text-sm';
    }

    // 2. Pending Tasks Summary
    const petTasks = (data.tasks || []).filter(t => t.petId === pet.id && !t.completed);
    document.getElementById('dash-tasks-val').textContent = petTasks.length;
    const tasksDueEl = document.getElementById('dash-tasks-due');
    if (petTasks.length > 0) {
        const dueSoon = [...petTasks].filter(t => t.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        if (dueSoon.length > 0) {
            tasksDueEl.textContent = `Next: "${dueSoon[0].title}" due ${formatDate(dueSoon[0].dueDate)}`;
        } else {
            tasksDueEl.textContent = 'No due dates set';
        }
    } else {
        tasksDueEl.textContent = 'All caught up!';
    }

    // 3. Vet Appointment Summary
    const petAppts = (data.vetAppointments || []).filter(a => a.petId === pet.id);
    const upcomingAppts = petAppts.filter(a => new Date(a.date + 'T' + (a.time || '00:00')) >= new Date())
        .sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')));
    const vetValEl = document.getElementById('dash-vet-val');
    const vetDueEl = document.getElementById('dash-vet-due');
    if (upcomingAppts.length > 0) {
        const nextAppt = upcomingAppts[0];
        vetValEl.textContent = nextAppt.reason || 'Checkup';
        vetDueEl.textContent = `on ${formatDate(nextAppt.date)} at ${nextAppt.time || '—'} with ${nextAppt.vetName}`;
    } else {
        vetValEl.textContent = 'None scheduled';
        vetDueEl.textContent = '—';
    }

    // 4. Monthly Expenses Summary
    const petExpenses = (data.expenses || []).filter(e => e.petId === pet.id);
    const now = new Date();
    const thisMonthExpenses = petExpenses.filter(e => {
        const ed = new Date(e.date);
        return ed.getMonth() === now.getMonth() && ed.getFullYear() === now.getFullYear();
    });
    const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    document.getElementById('dash-expenses-val').textContent = `${getCurrencySymbol()}${totalThisMonth.toFixed(2)}`;

    // 5. Dashboard Alert Checker
    const alertListEl = document.getElementById('dash-alerts-list');
    alertListEl.innerHTML = '';
    const alerts = [];
    const todayStr = getTodayStr();

    // Check Overdue Vaccines
    (pet.vaccinations || []).forEach(v => {
        if (v.due && v.due < todayStr) {
            alerts.push(`💉 Vaccine <strong>${v.name}</strong> was due on ${formatDate(v.due)}`);
        }
    });

    // Check Overdue Tasks
    petTasks.forEach(t => {
        if (t.dueDate && t.dueDate < todayStr) {
            alerts.push(`📋 Task <strong>${t.title}</strong> is overdue (due ${formatDate(t.dueDate)})`);
        }
    });

    // Check Overdue Medications
    (pet.medications || []).forEach(m => {
        const start = new Date(m.startDate);
        const end = m.endDate ? new Date(m.endDate) : null;
        if (end && new Date() > end) return;
        
        let nextDose = new Date(m.lastGiven || start);
        let hours = 0;
        if (m.frequency === 'daily') hours = 24;
        else if (m.frequency === 'weekly') hours = 168;
        else if (m.frequency === '12h') hours = 12;
        else if (m.frequency === '8h') hours = 8;
        else if (m.frequency === 'custom') hours = m.customHours || 6;

        const cur = new Date();
        while (nextDose <= cur) {
            nextDose.setHours(nextDose.getHours() + hours);
        }
        const diffMs = nextDose - cur;
        if (diffMs < 0 || (m.lastGiven && (cur - new Date(m.lastGiven)) > hours * 3600000)) {
            alerts.push(`💊 Med <strong>${m.name}</strong> dose is overdue`);
        }
    });

    // Check Backup Reminder alert
    if (data.settings && data.settings.backupReminder) {
        const lastBackup = data.lastBackupDate ? new Date(data.lastBackupDate) : null;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        if (!lastBackup || lastBackup < oneMonthAgo) {
            alerts.push(`💾 <strong>Backup Warning</strong>: It has been over a month since your last backup.`);
        }
    }

    if (alerts.length === 0) {
        alertListEl.innerHTML = '<div class="text-secondary text-sm">/ ✅ All metrics are up to date!</div>';
    } else {
        alertListEl.innerHTML = alerts.map(a => `<div class="dash-list-item">${a}</div>`).join('');
    }
}

// ========================================================================
//  WEIGHT TRACKER FEATURE MODULE
// ========================================================================
function formatDateForChart(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return (d.getMonth() + 1) + '/' + d.getDate();
}

function renderWeightChart(pet) {
    const svg = document.getElementById('weightChart');
    svg.innerHTML = '';

    const logs = (data.weightLogs || []).filter(w => w.petId === pet.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (logs.length === 0) {
        svg.innerHTML = `<text x="250" y="100" text-anchor="middle" font-family="var(--font)">No weight logs logged yet.</text>`;
        return;
    }

    const width = 500;
    const height = 200;
    const padding = 35;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    let maxW = Math.max(...logs.map(l => l.weight));
    let minW = Math.min(...logs.map(l => l.weight));
    if (maxW === minW) {
        maxW += 2;
        minW -= 2;
    } else {
        const pad = (maxW - minW) * 0.15 || 1;
        maxW += pad;
        minW -= pad;
    }

    // Draw Y-Axis Gridlines & Labels
    const gridLinesCount = 4;
    for (let i = 0; i <= gridLinesCount; i++) {
        const y = padding + (chartHeight / gridLinesCount) * i;
        const weightVal = maxW - ((maxW - minW) / gridLinesCount) * i;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", padding);
        line.setAttribute("y1", y);
        line.setAttribute("x2", width - padding);
        line.setAttribute("y2", y);
        line.setAttribute("class", "grid-line");
        svg.appendChild(line);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", padding - 6);
        text.setAttribute("y", y + 4);
        text.setAttribute("text-anchor", "end");
        text.textContent = weightVal.toFixed(1);
        svg.appendChild(text);
    }

    // Plot Graph Points & Lines
    let pointsStr = "";
    const coords = [];
    logs.forEach((log, index) => {
        const x = padding + (chartWidth / (logs.length > 1 ? logs.length - 1 : 1)) * index;
        const y = padding + chartHeight - ((log.weight - minW) / (maxW - minW)) * chartHeight;
        coords.push({ x, y, log, index });
        pointsStr += `${x},${y} `;
    });

    if (logs.length > 1) {
        const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        polyline.setAttribute("points", pointsStr.trim());
        polyline.setAttribute("class", "chart-line");
        svg.appendChild(polyline);
    }

    coords.forEach(coord => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", coord.x);
        circle.setAttribute("cy", coord.y);
        circle.setAttribute("r", 5);
        circle.setAttribute("class", "chart-point");

        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `${formatDate(coord.log.date)}: ${coord.log.weight} kg`;
        circle.appendChild(title);
        svg.appendChild(circle);

        // Add date labels
        if (logs.length <= 7 || coord.index === 0 || coord.index === logs.length - 1 || (logs.length > 3 && coord.index === Math.floor(logs.length / 2))) {
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", coord.x);
            label.setAttribute("y", height - 8);
            label.setAttribute("text-anchor", "middle");
            label.textContent = formatDateForChart(coord.log.date);
            svg.appendChild(label);
        }
    });
}

function updateWeightUI(pet) {
    const historyContainer = document.getElementById('weightLogHistory');
    const logs = (data.weightLogs || []).filter(w => w.petId === pet.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    document.getElementById('weightDate').value = getTodayStr();

    if (logs.length === 0) {
        historyContainer.innerHTML = '<div class="text-secondary text-sm">No weight records logged.</div>';
    } else {
        historyContainer.innerHTML = logs.map(l => `
            <div class="timeline-item">
                <span class="time">${formatDate(l.date)}</span>
                <span><strong>${l.weight} kg</strong></span>
                ${l.notes ? `<span class="note">📝 ${l.notes}</span>` : ''}
                <button class="btn btn-sm btn-danger weight-del-btn" data-id="${l.id}" style="margin-left:auto; padding: 2px 8px; font-size: 0.75rem;">🗑</button>
            </div>
        `).join('');

        historyContainer.querySelectorAll('.weight-del-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Delete this weight entry?')) {
                    data.weightLogs = data.weightLogs.filter(w => w.id !== this.dataset.id);
                    saveData();
                    updateUI();
                }
            });
        });
    }

    renderWeightChart(pet);
}

document.getElementById('weightSaveBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;

    const weight = parseFloat(document.getElementById('weightInput').value);
    const date = document.getElementById('weightDate').value;
    const notes = document.getElementById('weightNotes').value.trim();

    if (isNaN(weight) || weight <= 0) {
        alert('Please enter a valid weight.');
        return;
    }
    if (!date) {
        alert('Please select a date.');
        return;
    }

    const log = {
        id: 'weight_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        petId: pet.id,
        weight: weight,
        date: date,
        notes: notes
    };

    data.weightLogs = data.weightLogs || [];
    data.weightLogs.push(log);
    saveData();

    document.getElementById('weightInput').value = '';
    document.getElementById('weightNotes').value = '';
    updateUI();
});

// ========================================================================
//  RECURRING TASKS & REMINDERS MODULE
// ========================================================================
function getNextRecurrenceDate(baseDateStr, rule, interval) {
    const base = new Date(baseDateStr + 'T00:00:00');
    const next = new Date(base);
    if (rule === 'daily') {
        next.setDate(next.getDate() + 1);
    } else if (rule === 'weekly') {
        next.setDate(next.getDate() + 7);
    } else if (rule === 'monthly') {
        next.setMonth(next.getMonth() + 1);
    } else if (rule === 'custom') {
        const days = parseInt(interval) || 1;
        next.setDate(next.getDate() + days);
    }
    return next.toISOString().split('T')[0];
}

function completeTask(taskId) {
    const task = data.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = true;
    task.completedAt = new Date().toISOString();

    if (task.isRecurring) {
        const nextDueDate = getNextRecurrenceDate(task.dueDate || getTodayStr(), task.recurrenceRule, task.recurrenceInterval);
        const nextTask = {
            id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            petId: task.petId,
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: nextDueDate,
            isRecurring: true,
            recurrenceRule: task.recurrenceRule,
            recurrenceInterval: task.recurrenceInterval,
            completed: false,
            createdAt: new Date().toISOString()
        };
        data.tasks.push(nextTask);
    }

    saveData();
    updateUI();
}

function updateTasksUI(pet) {
    const activeList = document.getElementById('activeTasksList');
    const completedList = document.getElementById('completedTasksList');
    document.getElementById('taskDueDate').value = getTodayStr();

    const petTasks = (data.tasks || []).filter(t => t.petId === pet.id);
    const active = petTasks.filter(t => !t.completed).sort((a, b) => {
        const aOverdue = a.dueDate && a.dueDate < getTodayStr();
        const bOverdue = b.dueDate && b.dueDate < getTodayStr();
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
        return 0;
    });
    const completed = petTasks.filter(t => t.completed).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    const priorityLabels = { low: '🟢 Low', medium: '🟡 Medium', high: '🔴 High' };

    // Render Active Tasks
    if (active.length === 0) {
        activeList.innerHTML = '<div class="text-secondary text-sm">No active tasks. Good job!</div>';
    } else {
        activeList.innerHTML = active.map(t => {
            const overdue = t.dueDate && t.dueDate < getTodayStr();
            return `
                <div class="task-item task-priority-${t.priority}">
                    <div style="flex:1;">
                        <div style="font-weight:700; font-size:1.05rem;">${t.title}</div>
                        ${t.description ? `<div class="text-secondary text-sm" style="margin-top:2px;">${t.description}</div>` : ''}
                        <div style="margin-top:6px; display:flex; align-items:center; gap:8px;">
                            <span class="tag">${priorityLabels[t.priority] || t.priority}</span>
                            ${t.isRecurring ? `<span class="tag" style="background:#e0f7fa; color:#006064;">🔁 ${t.recurrenceRule}</span>` : ''}
                            ${t.dueDate ? `<span class="task-due ${overdue ? 'overdue' : ''}">${overdue ? '⚠️ Overdue: ' : '📅 Due: '}${formatDate(t.dueDate)}</span>` : ''}
                        </div>
                    </div>
                    <div class="flex-center gap-sm">
                        <button class="btn btn-sm btn-success task-done-btn" data-id="${t.id}">✅ Done</button>
                        <button class="btn btn-sm btn-danger task-del-btn" data-id="${t.id}">🗑</button>
                    </div>
                </div>
            `;
        }).join('');

        activeList.querySelectorAll('.task-done-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                completeTask(this.dataset.id);
            });
        });

        activeList.querySelectorAll('.task-del-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Delete this task?')) {
                    data.tasks = data.tasks.filter(t => t.id !== this.dataset.id);
                    saveData();
                    updateUI();
                }
            });
        });
    }

    // Render Completed Tasks
    if (completed.length === 0) {
        completedList.innerHTML = '<div class="text-secondary text-sm">No completed tasks yet.</div>';
    } else {
        completedList.innerHTML = completed.map(t => `
            <div class="task-item completed">
                <div style="flex:1;">
                    <div style="font-weight:700;">${t.title}</div>
                    <div class="text-xs text-secondary">Completed at: ${formatTime(t.completedAt)} on ${formatDate(t.completedAt)}</div>
                </div>
                <button class="btn btn-sm btn-danger task-del-btn" data-id="${t.id}">🗑</button>
            </div>
        `).join('');

        completedList.querySelectorAll('.task-del-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Delete this task history record?')) {
                    data.tasks = data.tasks.filter(t => t.id !== this.dataset.id);
                    saveData();
                    updateUI();
                }
            });
        });
    }
}

document.getElementById('taskRecurrence').addEventListener('change', function() {
    document.getElementById('taskCustomIntervalGroup').style.display =
        this.value === 'custom' ? 'block' : 'none';
});

document.getElementById('taskAddBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;

    const title = document.getElementById('taskTitle').value.trim();
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const recurrence = document.getElementById('taskRecurrence').value;
    const customInterval = parseInt(document.getElementById('taskCustomInterval').value) || 14;
    const description = document.getElementById('taskDescription').value.trim();

    if (!title) {
        alert('Please enter a task title.');
        return;
    }

    const task = {
        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        petId: pet.id,
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate || null,
        isRecurring: recurrence !== 'none',
        recurrenceRule: recurrence,
        recurrenceInterval: recurrence === 'custom' ? customInterval : null,
        completed: false,
        createdAt: new Date().toISOString()
    };

    data.tasks = data.tasks || [];
    data.tasks.push(task);
    saveData();

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskRecurrence').value = 'none';
    document.getElementById('taskCustomIntervalGroup').style.display = 'none';
    updateUI();
});

// ========================================================================
//  EXPENSE TRACKER FEATURE MODULE
// ========================================================================
function renderExpensesChart(pet) {
    const container = document.getElementById('expenseChartContainer');
    container.innerHTML = '';

    const petExpenses = (data.expenses || []).filter(e => e.petId === pet.id);
    const totalsByCategory = { Food: 0, Vet: 0, Grooming: 0, Toys: 0, Other: 0 };

    let grandTotal = 0;
    petExpenses.forEach(e => {
        const amt = parseFloat(e.amount) || 0;
        if (totalsByCategory[e.category] !== undefined) {
            totalsByCategory[e.category] += amt;
        } else {
            totalsByCategory.Other += amt;
        }
        grandTotal += amt;
    });

    if (grandTotal === 0) {
        container.innerHTML = '<div class="text-secondary text-sm text-center" style="padding: 20px;">No expenses recorded yet.</div>';
        return;
    }

    const colors = { Food: '#E67E22', Vet: '#C0392B', Grooming: '#2980B9', Toys: '#27AE60', Other: '#7F8C8D' };

    let html = '<div class="expense-bar-wrapper">';
    for (const category in totalsByCategory) {
        const amt = totalsByCategory[category];
        const percentage = grandTotal > 0 ? (amt / grandTotal) * 100 : 0;

        html += `
            <div class="expense-bar-row">
                <span class="expense-bar-label">${category}</span>
                <div class="expense-bar-outer">
                    <div class="expense-bar-inner" style="width: ${percentage}%; background-color: ${colors[category]}"></div>
                </div>
                <span class="expense-bar-val">$${amt.toFixed(2)} (${percentage.toFixed(0)}%)</span>
            </div>
        `;
    }
    html += `
        <div style="border-top: 2px solid var(--border); margin-top: 10px; padding-top: 8px; font-weight:800; font-size:1.1rem; display:flex; justify-content:space-between;">
            <span>Grand Total:</span>
            <span style="color: var(--accent);">$${grandTotal.toFixed(2)}</span>
        </div>
    `;
    html += '</div>';
    container.innerHTML = html;
}

function updateExpensesUI(pet) {
    const list = document.getElementById('expenseHistoryList');
    document.getElementById('expenseDate').value = getTodayStr();

    const petExpenses = (data.expenses || []).filter(e => e.petId === pet.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (petExpenses.length === 0) {
        list.innerHTML = '<div class="text-secondary text-sm">No expenses recorded.</div>';
    } else {
        list.innerHTML = petExpenses.map(e => `
            <div class="timeline-item">
                <span class="time">${formatDate(e.date)}</span>
                <span><strong>${e.category}</strong>: ${getCurrencySymbol()}${parseFloat(e.amount).toFixed(2)}</span>
                ${e.description ? `<span class="note">📝 ${e.description}</span>` : ''}
                <button class="btn btn-sm btn-danger expense-del-btn" data-id="${e.id}" style="margin-left:auto; padding: 2px 8px; font-size: 0.75rem;">🗑</button>
            </div>
        `).join('');

        list.querySelectorAll('.expense-del-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Delete this expense record?')) {
                    data.expenses = data.expenses.filter(e => e.id !== this.dataset.id);
                    saveData();
                    updateUI();
                }
            });
        });
    }

    renderExpensesChart(pet);
}

document.getElementById('expenseAddBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;

    const category = document.getElementById('expenseCategory').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const description = document.getElementById('expenseDescription').value.trim();

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    if (!date) {
        alert('Please select a date.');
        return;
    }

    const exp = {
        id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        petId: pet.id,
        category: category,
        amount: amount,
        date: date,
        description: description
    };

    data.expenses = data.expenses || [];
    data.expenses.push(exp);
    saveData();

    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDescription').value = '';
    updateUI();
});

// ========================================================================
//  VET APPOINTMENTS MODULE
// ========================================================================
function updateAppointmentsUI(pet) {
    const list = document.getElementById('apptList');
    document.getElementById('apptDate').value = getTodayStr();

    const appts = (data.vetAppointments || []).filter(a => a.petId === pet.id)
        .sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')));

    if (appts.length === 0) {
        list.innerHTML = '<div class="text-secondary text-sm">No vet appointments scheduled.</div>';
    } else {
        const now = new Date();
        list.innerHTML = appts.map(a => {
            const apptTime = new Date(a.date + 'T' + (a.time || '00:00'));
            const isPast = apptTime < now;
            return `
                <div class="med-card" style="opacity: ${isPast ? 0.6 : 1}; background: ${isPast ? 'var(--border)' : 'var(--input-bg)'};">
                    <div class="flex-between">
                        <span class="med-name">🏥 ${a.reason || 'Checkup'}</span>
                        <span class="tag ${isPast ? 'tag-danger' : 'tag-success'}">${isPast ? 'Past' : 'Upcoming'}</span>
                    </div>
                    <div class="med-detail">👨‍⚕️ Vet: ${a.vetName || '—'}</div>
                    <div class="med-detail">📅 When: ${formatDate(a.date)} at ${a.time || '—'}</div>
                    ${a.notes ? `<div class="med-detail">📝 Notes: ${a.notes}</div>` : ''}
                    <div class="flex-between mt-8" style="justify-content: flex-end;">
                        <button class="btn btn-sm btn-danger appt-del-btn" data-id="${a.id}">🗑 Delete</button>
                    </div>
                </div>
            `;
        }).join('');

        list.querySelectorAll('.appt-del-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Delete this appointment?')) {
                    data.vetAppointments = data.vetAppointments.filter(a => a.id !== this.dataset.id);
                    saveData();
                    updateUI();
                }
            });
        });
    }
}

document.getElementById('apptAddBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;

    const vetName = document.getElementById('apptVet').value.trim();
    const reason = document.getElementById('apptReason').value.trim();
    const date = document.getElementById('apptDate').value;
    const time = document.getElementById('apptTime').value;
    const reminder = document.getElementById('apptReminder').checked;
    const notes = document.getElementById('apptNotes').value.trim();

    if (!vetName) {
        alert('Please enter a vet name.');
        return;
    }
    if (!date) {
        alert('Please select a date.');
        return;
    }

    const appt = {
        id: 'appt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        petId: pet.id,
        vetName: vetName,
        reason: reason || 'Routine Checkup',
        date: date,
        time: time,
        reminder: reminder,
        notes: notes
    };

    data.vetAppointments = data.vetAppointments || [];
    data.vetAppointments.push(appt);
    saveData();

    document.getElementById('apptVet').value = '';
    document.getElementById('apptReason').value = '';
    document.getElementById('apptTime').value = '';
    document.getElementById('apptNotes').value = '';
    updateUI();
});

// ========================================================================
//  MEDICAL DOCUMENTS STORAGE MODULE
// ========================================================================
function updateDocumentsUI(pet) {
    const list = document.getElementById('docsList');
    document.getElementById('docDate').value = getTodayStr();

    const docs = (data.documents || []).filter(d => d.petId === pet.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (docs.length === 0) {
        list.innerHTML = '<div class="text-secondary text-sm">No documents uploaded yet.</div>';
    } else {
        list.innerHTML = docs.map(d => `
            <div class="timeline-item">
                <span class="time">${formatDate(d.date)}</span>
                <span><strong>${d.name}</strong> (${d.type})</span>
                ${d.description ? `<span class="note">📝 ${d.description}</span>` : ''}
                <div style="margin-left:auto; display:flex; gap:8px; align-items:center;">
                    ${d.fileData ? `<a href="${d.fileData}" download="${d.name}" class="btn btn-sm btn-outline" style="padding: 2px 8px; font-size: 0.75rem;">💾 Download</a>` : '<span class="text-xs text-secondary">(Metadata)</span>'}
                    <button class="btn btn-sm btn-danger doc-del-btn" data-id="${d.id}" style="padding: 2px 8px; font-size: 0.75rem;">🗑</button>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.doc-del-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Delete this document?')) {
                    data.documents = data.documents.filter(d => d.id !== this.dataset.id);
                    saveData();
                    updateUI();
                }
            });
        });
    }
}

document.getElementById('docAddBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;

    const name = document.getElementById('docName').value.trim();
    const type = document.getElementById('docType').value;
    const date = document.getElementById('docDate').value;
    const description = document.getElementById('docDescription').value.trim();
    const fileInput = document.getElementById('docFile');

    if (!name) {
        alert('Please enter a document name.');
        return;
    }
    if (!date) {
        alert('Please select a date.');
        return;
    }

    const doc = {
        id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        petId: pet.id,
        name: name,
        type: type,
        date: date,
        description: description,
        fileData: null
    };

    const file = fileInput.files[0];
    if (file) {
        if (file.size > 500 * 1024) {
            alert('File is too large! Maximum limit is 500KB. It will be saved as metadata only (no file attached).');
            saveDoc(doc);
        } else {
            const reader = new FileReader();
            reader.onload = function(e) {
                doc.fileData = e.target.result;
                saveDoc(doc);
            };
            reader.readAsDataURL(file);
        }
    } else {
        saveDoc(doc);
    }
});

function saveDoc(doc) {
    data.documents = data.documents || [];
    data.documents.push(doc);
    saveData();
    
    document.getElementById('docName').value = '';
    document.getElementById('docDescription').value = '';
    document.getElementById('docFile').value = '';
    updateUI();
}

// ========================================================================
//  AI HEALTH ASSISTANT MODULE
// ========================================================================
const BOT_RESPONSES = {
    chocolate: "🍫 <strong>Chocolate Toxicity:</strong> Chocolate contains theobromine, which is toxic to dogs and cats. Dark and baking chocolate are the most dangerous. Signs include vomiting, diarrhea, rapid breathing, and seizures. <strong>Action:</strong> If ingested, call your vet immediately or an animal poison control center.",
    vaccines: "💉 <strong>Puppy Vaccine Schedule:</strong><br>- 6-8 weeks: DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)<br>- 10-12 weeks: DHPP booster + Leptospirosis + Bordetella<br>- 14-16 weeks: DHPP booster + Rabies vaccine<br>- Annually or every 3 years: Boosters as advised by your vet.",
    fever: "🔥 <strong>Fever Signs in Pets:</strong> Normal dog/cat temperature is 38°C to 39.2°C (101°F to 102.5°F). Signs of fever include lethargy, warm ears/nose, shivering, loss of appetite, and coughing. <strong>Action:</strong> Do not give human medicines (like Tylenol/Advil - they are highly toxic!). Call a vet if temp exceeds 39.5°C.",
    ticks: "🕷️ <strong>Tick Removal Guide:</strong><br>1. Use fine-tipped tweezers or a tick hook.<br>2. Grasp the tick as close to the skin's surface as possible.<br>3. Pull upward with steady, even pressure. Do not twist or jerk.<br>4. Clean the bite area and your hands with alcohol or soap.<br>5. Monitor for signs of Lyme disease (lethargy, limping).",
    cat_food: "🐈 <strong>Dog eating Cat Food:</strong> Cat food is higher in protein and fat than dog food. If eaten occasionally, it might cause mild stomach upset but is not toxic. However, a continuous diet of cat food can lead to obesity, pancreatitis, and nutritional imbalances in dogs.",
    default: "🐾 I'm not sure about that specific query. Please consult with a licensed vet for medical concerns. You can also try searching for terms like: <em>chocolate</em>, <em>vaccines</em>, <em>fever</em>, <em>ticks</em>, or <em>cat_food</em>."
};

function addChatMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatQuery(queryText) {
    const cleanQuery = queryText.toLowerCase().trim();
    addChatMessage('user', queryText);

    setTimeout(() => {
        let response = BOT_RESPONSES.default;
        for (const key in BOT_RESPONSES) {
            if (cleanQuery.includes(key)) {
                response = BOT_RESPONSES[key];
                break;
            }
        }
        addChatMessage('bot', response);
    }, 500);
}

document.querySelectorAll('.chat-quick-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const query = this.dataset.query;
        if (BOT_RESPONSES[query]) {
            addChatMessage('user', this.textContent);
            setTimeout(() => {
                addChatMessage('bot', BOT_RESPONSES[query]);
            }, 500);
        }
    });
});

document.getElementById('chatSendBtn').addEventListener('click', function() {
    const input = document.getElementById('chatInput');
    const val = input.value.trim();
    if (val) {
        handleChatQuery(val);
        input.value = '';
    }
});

document.getElementById('chatInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('chatSendBtn').click();
    }
});

// ========================================================================
//  BACKGROUND REMINDER CHECKS
// ========================================================================
const firedAlerts = new Set();

function checkUpcomingAlerts() {
    const pet = getCurrentPet();
    if (!pet || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const now = new Date();
    const todayStr = getTodayStr();

    // Check Vet appointments
    const petAppts = (data.vetAppointments || []).filter(a => a.petId === pet.id && a.reminder);
    petAppts.forEach(a => {
        const alertKey = `appt_${a.id}`;
        if (a.date === todayStr && !firedAlerts.has(alertKey)) {
            new Notification(`🏥 Vet Appointment Today!`, {
                body: `${pet.name} has an appointment with ${a.vetName} for ${a.reason} at ${a.time || '—'}.`
            });
            firedAlerts.add(alertKey);
        }
    });

    // Check tasks due
    const petTasks = (data.tasks || []).filter(t => t.petId === pet.id && !t.completed && t.dueDate);
    petTasks.forEach(t => {
        const alertKey = `task_${t.id}`;
        if (t.dueDate === todayStr && !firedAlerts.has(alertKey)) {
            new Notification(`📋 Task Due Today!`, {
                body: `Reminder: "${t.title}" is due today for ${pet.name}.`
            });
            firedAlerts.add(alertKey);
        }
    });

    // Check Disease Prevention reminders
    const petNotes = (pet.diseasePrevention || []).filter(n => n.reminder);
    petNotes.forEach(n => {
        const alertKey = `prev_${n.id}`;
        if (n.date === todayStr && !firedAlerts.has(alertKey)) {
            new Notification(`🛡️ Disease Prevention Reminder!`, {
                body: `Today's event: "${n.title}" (${n.priority.toUpperCase()} priority) for ${pet.name}.`
            });
            firedAlerts.add(alertKey);
        }
    });
}

setInterval(checkUpcomingAlerts, 60000);

console.log('🐾 PawTrack Multi-Pet with Multi-Page & Premium Features loaded!');

// ========================================================================
//  === START FLAT UI & CORNER FLOATING PETS ===
// ========================================================================

const otherSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="128" height="128"><rect width="100" height="100" rx="20" fill="%23FFFDF0"/><circle cx="50" cy="50" r="35" fill="%236B7A3A"/><circle cx="38" cy="45" r="5" fill="%23fff"/><circle cx="62" cy="45" r="5" fill="%23fff"/><path d="M 40 60 Q 50 68 60 60" fill="none" stroke="%23fff" stroke-width="3"/></svg>`;

// Helper to format short date for pet chips
function formatDateShort(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
}

// Render flat 2D pet chips on dashboard
function renderPetChips(currentPet) {
    const dashCard = document.querySelector('#page-dashboard > .card');
    if (!dashCard) return;
    
    let container = document.getElementById('pet-chips-list-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pet-chips-list-container';
        container.className = 'pet-chips-container';
        const title = dashCard.querySelector('.card-title');
        if (title) title.after(container);
        else dashCard.prepend(container);
    }
    
    container.innerHTML = '';
    
    const pets = data.pets || [];
    pets.forEach(pet => {
        // Next appointment
        const petAppts = (data.vetAppointments || []).filter(a => a.petId === pet.id);
        const upcomingAppts = petAppts.filter(a => new Date(a.date + 'T' + (a.time || '00:00')) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        const nextApptStr = upcomingAppts.length > 0 ? `${formatDateShort(upcomingAppts[0].date)}` : 'No appt';
        
        // Latest weight
        const petWeights = (data.weightLogs || []).filter(w => w.petId === pet.id)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        const weightStr = petWeights.length > 0 ? `${petWeights[petWeights.length - 1].weight} kg` : 'No weight';

        const isActive = pet.id === currentPet.id;
        
        let avatarSrc = '';
        if (pet.type === 'cat') avatarSrc = 'cat_avatar.jpg';
        else if (pet.type === 'dog') avatarSrc = 'dog_avatar.png';
        else if (pet.type === 'bird') avatarSrc = 'bird_avatar.png';
        else if (pet.type === 'other') avatarSrc = 'other_avatar.jpg';
        else avatarSrc = otherSvg; // default other svg

        const chip = document.createElement('div');
        chip.className = `pet-chip ${isActive ? 'active-pet' : ''}`;
        chip.dataset.petId = pet.id;
        
        chip.innerHTML = `
            <div class="pet-avatar-container">
                <img src="${avatarSrc}" alt="${pet.name}" />
            </div>
            <div class="pet-chip-details">
                <span class="pet-name">${pet.name}</span>
                <span class="pet-info">⚖️ ${weightStr} | 🏥 ${nextApptStr}</span>
                <span class="pet-select-indicator">${isActive ? 'Active' : 'Click to activate'}</span>
            </div>
        `;
        
        chip.addEventListener('click', (e) => {
            e.stopPropagation();
            if (pet.id !== currentPet.id) {
                setCurrentPetId(pet.id);
                if (typeof populatePetSelector === 'function') populatePetSelector();
                updateUI();
                playPetSound(pet.type);
            }
        });
        
        container.appendChild(chip);
    });
}

// Static pattern background (no parallax translation on scroll)
function initStaticBackground() {
    updateStaticBackgroundPattern();
    
    document.querySelectorAll('.theme-picker button').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(updateStaticBackgroundPattern, 50);
        });
    });
}

function updateStaticBackgroundPattern() {
    const bg = document.getElementById('parallaxBg');
    if (!bg) return;
    
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const color = accentColor || '#C0392B';
    
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'><g fill='${color}' opacity='0.035'><path d='M50,75 C65,75 70,60 70,55 C70,45 60,40 50,40 C40,40 30,45 30,55 C30,60 35,75 50,75 Z'/><circle cx='25' cy='30' r='10'/><circle cx='40' cy='20' r='10'/><circle cx='60' cy='20' r='10'/><circle cx='75' cy='30' r='10'/></g></svg>`;
    const encoded = btoa(svg);
    bg.style.backgroundImage = `url("data:image/svg+xml;base64,${encoded}")`;
}

// Play synthesized sound for active pet type
function playPetSound(petType) {
    if (data && data.settings && data.settings.petSounds === false) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    try {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const t = ctx.currentTime;
        
        if (petType === 'cat') {
            // Proper Cat Meow: double meow meow sequence using formant filter sweep and LFO vibrato
            const playSingleMeow = (startTime, pitch, duration) => {
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const lfo = ctx.createOscillator();
                const lfoGain = ctx.createGain();
                const gainNode = ctx.createGain();
                const formantFilter = ctx.createBiquadFilter();
                const lowpassFilter = ctx.createBiquadFilter();
                
                osc1.type = 'triangle';
                osc2.type = 'sine';
                
                // LFO for natural, organic voice vibrato
                lfo.frequency.setValueAtTime(6.5, startTime);
                lfoGain.gain.setValueAtTime(8, startTime);
                lfo.connect(lfoGain);
                lfoGain.connect(osc1.frequency);
                lfoGain.connect(osc2.frequency);
                
                // Pitch curve modeling a natural meow vocalization (rise and then slide down)
                osc1.frequency.setValueAtTime(pitch, startTime);
                osc1.frequency.exponentialRampToValueAtTime(pitch * 1.35, startTime + duration * 0.3);
                osc1.frequency.exponentialRampToValueAtTime(pitch * 1.45, startTime + duration * 0.5);
                osc1.frequency.exponentialRampToValueAtTime(pitch * 0.95, startTime + duration * 0.95);
                
                osc2.frequency.setValueAtTime(pitch * 2, startTime);
                osc2.frequency.exponentialRampToValueAtTime(pitch * 2.7, startTime + duration * 0.3);
                osc2.frequency.exponentialRampToValueAtTime(pitch * 2.9, startTime + duration * 0.5);
                osc2.frequency.exponentialRampToValueAtTime(pitch * 1.9, startTime + duration * 0.95);
                
                // Formant filter: sweeps to mimic vocal tract vowel changes ("m" -> "ee" -> "ow")
                formantFilter.type = 'bandpass';
                formantFilter.frequency.setValueAtTime(600, startTime);
                formantFilter.frequency.exponentialRampToValueAtTime(2200, startTime + duration * 0.35); // "ee" formant
                formantFilter.frequency.exponentialRampToValueAtTime(900, startTime + duration * 0.75);   // "ow" formant
                formantFilter.frequency.exponentialRampToValueAtTime(500, startTime + duration);
                formantFilter.Q.setValueAtTime(3.5, startTime);
                
                // Warm lowpass filter to remove excessive high buzz/metallic harshness
                lowpassFilter.type = 'lowpass';
                lowpassFilter.frequency.setValueAtTime(3000, startTime);
                
                // Volume envelope (gentle attack, sustain, decay)
                gainNode.gain.setValueAtTime(0.001, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.12, startTime + duration * 0.25);
                gainNode.gain.setValueAtTime(0.12, startTime + duration * 0.45);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                
                const osc2Gain = ctx.createGain();
                osc2Gain.gain.setValueAtTime(0.04, startTime); // soft harmonic volume
                
                osc1.connect(formantFilter);
                osc2.connect(osc2Gain);
                osc2Gain.connect(formantFilter);
                
                formantFilter.connect(lowpassFilter);
                lowpassFilter.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                lfo.start(startTime);
                osc1.start(startTime);
                osc2.start(startTime);
                
                lfo.stop(startTime + duration);
                osc1.stop(startTime + duration);
                osc2.stop(startTime + duration);
            };

            // Play proper double meow meow sequence
            playSingleMeow(t, 390, 0.48);
            playSingleMeow(t + 0.62, 430, 0.42);
            
        } else if (petType === 'dog') {
            // Proper Dog Bark: dual explosive woof sequence with raspy breath noise and low tone pitch drop
            const playSingleBark = (startTime, pitch, duration) => {
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const voiceGain = ctx.createGain();
                
                osc1.type = 'sawtooth';
                osc1.frequency.setValueAtTime(pitch, startTime);
                osc1.frequency.exponentialRampToValueAtTime(pitch * 0.45, startTime + duration);
                
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(pitch * 0.5, startTime);
                osc2.frequency.exponentialRampToValueAtTime(pitch * 0.25, startTime + duration);
                
                voiceGain.gain.setValueAtTime(0.12, startTime);
                voiceGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                
                // Noise source for the breathy, raspy character of the bark
                const bufferSize = ctx.sampleRate * duration;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const channelData = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    channelData[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                
                const noiseGain = ctx.createGain();
                // Noise peaks immediately for the bark breath explosion and decays rapidly
                noiseGain.gain.setValueAtTime(0.18, startTime);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.55);
                
                // Resonant lowpass filter representing the shape of the dog's throat/mouth
                const throatFilter = ctx.createBiquadFilter();
                throatFilter.type = 'lowpass';
                throatFilter.frequency.setValueAtTime(1000, startTime);
                throatFilter.frequency.exponentialRampToValueAtTime(250, startTime + duration);
                throatFilter.Q.setValueAtTime(2.2, startTime);
                
                // Noise bandpass filter to shape the raspy breath burst
                const noiseFilter = ctx.createBiquadFilter();
                noiseFilter.type = 'bandpass';
                noiseFilter.frequency.setValueAtTime(800, startTime);
                noiseFilter.frequency.exponentialRampToValueAtTime(350, startTime + duration * 0.6);
                noiseFilter.Q.setValueAtTime(1.5, startTime);
                
                // Connect signals
                osc1.connect(throatFilter);
                osc2.connect(throatFilter);
                throatFilter.connect(voiceGain);
                
                noise.connect(noiseFilter);
                noiseFilter.connect(noiseGain);
                
                // Mix voice and noise
                voiceGain.connect(ctx.destination);
                noiseGain.connect(ctx.destination);
                
                osc1.start(startTime);
                osc2.start(startTime);
                noise.start(startTime);
                
                osc1.stop(startTime + duration);
                osc2.stop(startTime + duration);
                noise.stop(startTime + duration);
            };
            
            // Play double bark (woof-woof) barking sequence
            playSingleBark(t, 220, 0.18);
            playSingleBark(t + 0.28, 190, 0.15);
            
        } else if (petType === 'bird') {
            // Bird Chirp: High frequency sinewave sweeping up and down very fast three times
            const playSingleChirp = (startTime, startFreq, endFreq, dur) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                
                osc.frequency.setValueAtTime(startFreq, startTime);
                osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + dur);
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(startTime);
                osc.stop(startTime + dur);
            };
            
            playSingleChirp(t, 2200, 3200, 0.08);
            playSingleChirp(t + 0.1, 2300, 3400, 0.08);
            playSingleChirp(t + 0.2, 2400, 3600, 0.09);
            
        } else {
            // "Other" (rabbit/bubble/sparkle): a clean bell or bubble drop chime
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, t);
            osc.frequency.exponentialRampToValueAtTime(1320, t + 0.12);
            osc.frequency.exponentialRampToValueAtTime(1760, t + 0.24);
            
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.15, t + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(t);
            osc.stop(t + 0.35);
        }
    } catch (e) {
        console.error("Failed to play synthesized sound:", e);
    }
}

// Corner floating pet avatar controller
function updateFloatingPet(pet) {
    const widget = document.getElementById('floatingPetWidget');
    const img = document.getElementById('floatingPetImage');
    if (!widget || !img) return;
    
    if (!pet) {
        widget.style.display = 'none';
        return;
    }
    
    let avatarSrc = '';
    if (pet.type === 'cat') {
        avatarSrc = 'cat_avatar.jpg';
    } else if (pet.type === 'dog') {
        avatarSrc = 'dog_avatar.png';
    } else if (pet.type === 'bird') {
        avatarSrc = 'bird_avatar.png';
    } else if (pet.type === 'other') {
        avatarSrc = 'other_avatar.jpg';
    }
    
    if (avatarSrc) {
        img.src = avatarSrc;
        img.alt = pet.name;
        widget.style.display = 'block';
    } else {
        widget.style.display = 'none';
    }
}

// Dynamic 3D tilt tracking effect & audio playback
function initFloatingPetTilt() {
    const el = document.getElementById('floatingPetWidget');
    if (!el) return;
    
    el.addEventListener('click', () => {
        const pet = getCurrentPet();
        if (pet) playPetSound(pet.type);
    });
    
    el.addEventListener('mousemove', (e) => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate position relative to center (-0.5 to 0.5)
        const px = (x / rect.width) - 0.5;
        const py = (y / rect.height) - 0.5;
        
        // Tilt limits (up to 30 degrees)
        const tiltX = -py * 30;
        const tiltY = px * 30;
        
        const img = el.querySelector('img');
        if (img) {
            img.style.animationPlayState = 'paused'; // pause float animation on hover
        }
        el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.12)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        const img = el.querySelector('img');
        if (img) {
            img.style.animationPlayState = 'running'; // resume float animation
        }
    });
}

// Hamburger Menu Toggle Handlers for Mobile View
function initMobileMenuToggles() {
    // Sidebar menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navItemsContainer = document.getElementById('navItemsContainer');
    if (menuToggle && navItemsContainer) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navItemsContainer.classList.toggle('show');
            menuToggle.classList.toggle('open');
        });
    }

    // Close sidebar menu when clicking a nav-item in mobile
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navItemsContainer) {
                navItemsContainer.classList.remove('show');
                if (menuToggle) menuToggle.classList.remove('open');
            }
        });
    });

    // Care Tracker tab menu toggle
    const tabMenuToggle = document.getElementById('tabMenuToggle');
    const tabItemsContainer = document.getElementById('tabItemsContainer');
    if (tabMenuToggle && tabItemsContainer) {
        tabMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = tabItemsContainer.classList.toggle('show');
            tabMenuToggle.classList.toggle('open', isOpen);
        });
    }

    // Close tab menu when selecting a tab in mobile
    document.querySelectorAll('.tab-items-container button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.innerWidth <= 768 && tabItemsContainer) {
                tabItemsContainer.classList.remove('show');
                if (tabMenuToggle) tabMenuToggle.classList.remove('open');
            }
        });
    });

    // Close dropdowns if clicked anywhere else
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (navItemsContainer && menuToggle && !menuToggle.contains(e.target) && !navItemsContainer.contains(e.target)) {
                navItemsContainer.classList.remove('show');
                menuToggle.classList.remove('open');
            }
            if (tabItemsContainer && tabMenuToggle && !tabMenuToggle.contains(e.target) && !tabItemsContainer.contains(e.target)) {
                tabItemsContainer.classList.remove('show');
                tabMenuToggle.classList.remove('open');
            }
        }
    });
}

function updateAiConnectionStatus() {
    const s = data.settings || {};
    const key = s.geminiApiKey || '';
    const badge = document.getElementById('aiConnectionStatus');
    if (badge) {
        if (key.trim()) {
            badge.textContent = '🤖 Gemini Live AI';
            badge.className = 'tag tag-success';
            badge.style.background = 'var(--success)';
            badge.style.color = '#fff';
        } else {
            badge.textContent = '🤖 Offline Simulator';
            badge.className = 'tag tag-secondary';
            badge.style.background = 'var(--border)';
            badge.style.color = 'var(--text)';
        }
    }
}

// ========================================================================
//  SETTINGS PAGE CORE MODULE
// ========================================================================
function updateSettingsUI(pet) {
    const s = data.settings;
    if (!s) return;

    // App Settings
    document.getElementById('settingsLanguage').value = s.language || 'en';
    document.getElementById('settingsCurrency').value = s.currency || 'USD';
    document.getElementById('settingsNotifications').checked = !!s.notifications;
    document.getElementById('settingsPetSounds').checked = !!s.petSounds;
    document.getElementById('settingsDefaultPetView').value = s.defaultPetView || 'cards';
    document.getElementById('settingsGeminiKey').value = s.geminiApiKey || '';
    updateAiConnectionStatus();

    // Theme (sync active class on Settings page theme picker)
    document.querySelectorAll('#page-settings .theme-picker button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === (s.theme || data.theme));
    });

    // Appearance
    document.getElementById('settingsFontSize').value = s.fontSize || 'medium';
    document.getElementById('settingsCardStyle').value = s.cardStyle || 'flat';

    // Data Management
    document.getElementById('settingsBackupReminder').checked = !!s.backupReminder;

    // Privacy
    document.getElementById('settingsDataSharing').checked = !!s.dataSharing;
    document.getElementById('settingsUsageAnalytics').checked = !!s.usageAnalytics;

    // Populate History
    populateHistoryTimeline(pet);
}

function populateHistoryTimeline(pet) {
    const timelineEl = document.getElementById('settingsHistoryTimeline');
    if (!timelineEl) return;
    if (!pet) {
        timelineEl.innerHTML = '<div class="text-secondary text-sm text-center">No active pet. Please add a pet first.</div>';
        return;
    }

    const filterDate = document.getElementById('historyFilterDate').value;
    const history = getCombinedHistory(pet);
    
    // Filter by date if specified
    const filtered = filterDate 
        ? history.filter(item => item.date === filterDate)
        : history;

    if (filtered.length === 0) {
        timelineEl.innerHTML = `<div class="text-secondary text-sm text-center">No activity history logs found${filterDate ? ' for ' + formatDate(filterDate) : ''}.</div>`;
        return;
    }

    timelineEl.innerHTML = filtered.map(item => `
        <div class="timeline-item">
            <span class="icon-badge">${item.type.split(' ')[0]}</span>
            <div style="flex:1;">
                <div class="fw-bold">${item.type.substring(item.type.indexOf(' ') + 1)} - ${item.description}</div>
                ${item.note ? `<div class="note">${item.note}</div>` : ''}
            </div>
            <span class="time" style="font-size:0.75rem; text-align:right;">
                ${formatDate(item.date)}<br>${item.time ? formatTime(item.time) : ''}
            </span>
        </div>
    `).join('');
}

function getCombinedHistory(pet) {
    if (!pet) return [];
    const history = [];

    // 1. Feeding history
    if (pet.feeding && Array.isArray(pet.feeding.history)) {
        pet.feeding.history.forEach(item => {
            history.push({
                type: '🍽️ Feeding',
                description: `Meal: ${item.meal.charAt(0).toUpperCase() + item.meal.slice(1)}`,
                date: item.date || (item.time ? item.time.split('T')[0] : getTodayStr()),
                time: item.time,
                note: item.note || ''
            });
        });
    }

    // 2. Medications history
    if (Array.isArray(pet.medications)) {
        pet.medications.forEach(med => {
            if (Array.isArray(med.history)) {
                med.history.forEach(time => {
                    history.push({
                        type: '💊 Medication',
                        description: `Given medication: ${med.name}`,
                        date: time.split('T')[0],
                        time: time,
                        note: med.notes || ''
                    });
                });
            }
        });
    }

    // 3. Poop/Pee history
    if (pet.poopPee && Array.isArray(pet.poopPee.logs)) {
        pet.poopPee.logs.forEach(item => {
            history.push({
                type: item.type === 'poop' ? '💩 Poop' : '💦 Pee',
                description: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} logged`,
                date: item.date || (item.time ? item.time.split('T')[0] : getTodayStr()),
                time: item.time,
                note: item.location ? `Location: ${item.location}` : ''
            });
        });
    }

    // 4. Walks history
    if (Array.isArray(pet.walks)) {
        pet.walks.forEach(item => {
            history.push({
                type: '🚶 Walk',
                description: `Walked: ${formatDuration(item.duration)} (${item.distance || 0} km)`,
                date: item.date.split('T')[0],
                time: item.date,
                note: item.note || ''
            });
        });
    }

    // 5. Bath/Trim history
    if (pet.bath) {
        if (Array.isArray(pet.bath.baths)) {
            pet.bath.baths.forEach(item => {
                history.push({
                    type: '🛁 Bath',
                    description: 'Bathing logged',
                    date: item.date || (item.time ? item.time.split('T')[0] : getTodayStr()),
                    time: item.time,
                    note: item.note || ''
                });
            });
        }
        if (Array.isArray(pet.bath.trims)) {
            pet.bath.trims.forEach(item => {
                history.push({
                    type: '✂️ Grooming',
                    description: 'Trimming logged',
                    date: item.date || (item.time ? item.time.split('T')[0] : getTodayStr()),
                    time: item.time,
                    note: item.note || ''
                });
            });
        }
    }

    // 6. Weight logs
    if (Array.isArray(data.weightLogs)) {
        data.weightLogs.filter(w => w.petId === pet.id).forEach(w => {
            history.push({
                type: '⚖️ Weight',
                description: `Weight logged: ${w.weight} kg`,
                date: w.date,
                time: `${w.date}T12:00:00.000Z`,
                note: w.notes || ''
            });
        });
    }

    // 7. Completed tasks
    if (Array.isArray(data.tasks)) {
        data.tasks.filter(t => t.petId === pet.id && t.completed).forEach(t => {
            history.push({
                type: '📋 Task',
                description: `Completed task: ${t.title}`,
                date: t.completedAt ? t.completedAt.split('T')[0] : (t.dueDate || ''),
                time: t.completedAt || '',
                note: t.description || ''
            });
        });
    }

    // 8. Expenses
    if (Array.isArray(data.expenses)) {
        data.expenses.filter(e => e.petId === pet.id).forEach(e => {
            history.push({
                type: '💰 Expense',
                description: `Recorded expense: ${getCurrencySymbol()}${parseFloat(e.amount).toFixed(2)} (${e.category})`,
                date: e.date,
                time: `${e.date}T12:00:00.000Z`,
                note: e.description || ''
            });
        });
    }

    // 9. Vet appointments
    if (Array.isArray(data.vetAppointments)) {
        data.vetAppointments.filter(v => v.petId === pet.id).forEach(v => {
            history.push({
                type: '🏥 Vet Visit',
                description: `Vet appointment: ${v.vetName} (${v.reason})`,
                date: v.date,
                time: `${v.date}T${v.time || '12:00'}:00.000Z`,
                note: v.notes || ''
            });
        });
    }

    return history.sort((a, b) => {
        const timeA = new Date(a.time || a.date);
        const timeB = new Date(b.time || b.date);
        return timeB - timeA;
    });
}

function setFontSize(size) {
    let px = '16px';
    if (size === 'small') px = '14px';
    else if (size === 'large') px = '18px';
    
    document.documentElement.style.fontSize = px;
    data.settings.fontSize = size;
    saveData();
}

function setCardStyle(style) {
    document.body.classList.remove('card-style-flat', 'card-style-shadow', 'card-style-3d');
    document.body.classList.add(`card-style-${style}`);
    
    data.settings.cardStyle = style;
    saveData();
}

function initSettingsEvents() {
    // Collapsible Sections Toggles
    document.querySelectorAll('#page-settings .collapsible-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const section = this.parentElement;
            const isOpen = section.classList.contains('open');
            section.classList.toggle('open', !isOpen);
        });
    });

    // App Settings change handlers
    document.getElementById('settingsLanguage').addEventListener('change', function() {
        data.settings.language = this.value;
        saveData();
    });

    document.getElementById('settingsCurrency').addEventListener('change', function() {
        data.settings.currency = this.value;
        saveData();
        applySettings();
        const pet = getCurrentPet();
        if (pet) {
            updateNewPagesUI(pet);
        }
    });

    document.getElementById('settingsNotifications').addEventListener('change', function() {
        data.settings.notifications = this.checked;
        saveData();
        if (this.checked && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    });

    document.getElementById('settingsPetSounds').addEventListener('change', function() {
        data.settings.petSounds = this.checked;
        saveData();
    });

    document.getElementById('settingsDefaultPetView').addEventListener('change', function() {
        data.settings.defaultPetView = this.value;
        saveData();
        applySettings();
    });

    document.getElementById('settingsGeminiKey').addEventListener('input', function() {
        data.settings.geminiApiKey = this.value;
        saveData();
        updateAiConnectionStatus();
    });

    const toggleKeyBtn = document.getElementById('toggleGeminiKeyVisibility');
    if (toggleKeyBtn) {
        toggleKeyBtn.addEventListener('click', function() {
            const keyInput = document.getElementById('settingsGeminiKey');
            if (keyInput.type === 'password') {
                keyInput.type = 'text';
                this.textContent = '🔒';
            } else {
                keyInput.type = 'password';
                this.textContent = '👁️';
            }
        });
    }

    // Settings theme picker
    document.querySelectorAll('#page-settings .theme-picker button').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            setTheme(theme);
        });
    });

    // Appearance settings change handlers
    document.getElementById('settingsFontSize').addEventListener('change', function() {
        setFontSize(this.value);
    });

    document.getElementById('settingsCardStyle').addEventListener('change', function() {
        setCardStyle(this.value);
    });

    // Export Backup
    document.getElementById('settingsExportBtn').addEventListener('click', function() {
        data.lastBackupDate = new Date().toISOString();
        saveData();
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `pawtrack_backup_${getTodayStr()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        
        alert("🎉 Backup exported successfully! Last backup date updated.");
        
        const pet = getCurrentPet();
        if (pet) {
            updateNewPagesUI(pet);
        }
    });

    // Import Backup
    const importFileEl = document.getElementById('settingsImportFile');
    document.getElementById('settingsImportBtn').addEventListener('click', function() {
        importFileEl.click();
    });

    importFileEl.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const imported = JSON.parse(evt.target.result);
                if (imported && (imported.pets || imported.currentPetId)) {
                    if (confirm("⚠️ Importing this file will overwrite all existing data. Are you sure you want to proceed?")) {
                        data = imported;
                        // Migrate
                        data.settings = data.settings || {
                            language: 'en',
                            currency: 'USD',
                            notifications: false,
                            defaultPetView: 'cards',
                            theme: data.theme || 'warm',
                            fontSize: 'medium',
                            cardStyle: 'flat',
                            backupReminder: true,
                            dataSharing: false,
                            usageAnalytics: false
                        };
                        saveData();
                        applySettings();
                        
                        // Refresh UI
                        const pet = getCurrentPet();
                        if (pet) {
                            updateNewPagesUI(pet);
                            hideSetupModal();
                        } else {
                            showSetupModal();
                        }
                        populatePetSelector();
                        
                        alert("🎉 Data imported successfully!");
                    }
                } else {
                    alert("❌ Invalid backup file format.");
                }
            } catch (err) {
                alert("❌ Failed to parse JSON file.");
            }
        };
        reader.readAsText(file);
    });

    // Clear All Data
    document.getElementById('settingsResetBtn').addEventListener('click', function() {
        if (confirm('⚠️ Are you sure you want to delete ALL data for ALL pets? This cannot be undone.')) {
            if (confirm('This will remove all pets and their data. Continue?')) {
                try {
                    localStorage.removeItem('pawtrack_data');
                } catch (e) {
                    console.error("localStorage clear failed:", e);
                }
                data = {
                    pets: [],
                    currentPetId: '',
                    theme: 'warm',
                    weightLogs: [],
                    tasks: [],
                    expenses: [],
                    vetAppointments: [],
                    documents: []
                };
                data.settings = {
                    language: 'en',
                    notifications: false,
                    defaultPetView: 'cards',
                    theme: 'warm',
                    fontSize: 'medium',
                    cardStyle: 'flat',
                    backupReminder: true,
                    dataSharing: false,
                    usageAnalytics: false
                };
                saveData();
                applySettings();
                
                // Reset walk timer
                walkRunning = false;
                walkSeconds = 0;
                if (walkTimerInterval) clearInterval(walkTimerInterval);
                walkTimerInterval = null;
                
                const walkStartBtn = document.getElementById('walkStartBtn');
                const walkStopBtn = document.getElementById('walkStopBtn');
                const walkTimerDisplay = document.getElementById('walkTimerDisplay');
                if (walkStartBtn) walkStartBtn.disabled = false;
                if (walkStopBtn) walkStopBtn.disabled = true;
                if (walkTimerDisplay) walkTimerDisplay.textContent = '00:00:00';
                
                showSetupModal();
                populatePetSelector();
                updateNewPagesUI(null);
                
                alert("🗑️ All data has been cleared.");
            }
        }
    });

    // Backup Frequency Toggle
    document.getElementById('settingsBackupReminder').addEventListener('change', function() {
        data.settings.backupReminder = this.checked;
        saveData();
        const pet = getCurrentPet();
        if (pet) {
            updateDashboardUI(pet);
        }
    });

    // Privacy toggles
    document.getElementById('settingsDataSharing').addEventListener('change', function() {
        data.settings.dataSharing = this.checked;
        saveData();
    });
    document.getElementById('settingsUsageAnalytics').addEventListener('change', function() {
        data.settings.usageAnalytics = this.checked;
        saveData();
    });

    // History Filters & Clean
    document.getElementById('historyFilterDate').addEventListener('change', function() {
        const pet = getCurrentPet();
        populateHistoryTimeline(pet);
    });

    document.getElementById('historyClearFilterBtn').addEventListener('click', function() {
        document.getElementById('historyFilterDate').value = '';
        const pet = getCurrentPet();
        populateHistoryTimeline(pet);
    });

    document.getElementById('settingsClearHistoryBtn').addEventListener('click', function() {
        const pet = getCurrentPet();
        if (!pet) return;
        if (confirm(`⚠️ Are you sure you want to clear all history logs for ${pet.name}?`)) {
            if (pet.feeding) pet.feeding.history = [];
            if (Array.isArray(pet.medications)) {
                pet.medications.forEach(m => {
                    m.history = [];
                    m.lastGiven = null;
                });
            }
            if (pet.poopPee) pet.poopPee.logs = [];
            if (pet.walks) pet.walks = [];
            if (pet.bath) pet.bath = { baths: [], trims: [] };

            data.weightLogs = data.weightLogs.filter(w => w.petId !== pet.id);
            data.expenses = data.expenses.filter(e => e.petId !== pet.id);
            data.vetAppointments = data.vetAppointments.filter(v => v.petId !== pet.id);
            data.tasks = data.tasks.filter(t => t.petId !== pet.id);

            saveData();
            updateNewPagesUI(pet);
            alert("🗑️ Active pet history cleared successfully!");
        }
    });

    // Bug report form
    document.getElementById('bugReportForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const desc = document.getElementById('bugDescription').value.trim();
        if (!desc) return;
        const email = 'dongshancai642@gmail.com';
        const subject = encodeURIComponent('PawTrack Bug Report / Feature Request');
        const body = encodeURIComponent(desc);
        window.open(`mailto:${email}?subject=${subject}&body=${body}`);
        document.getElementById('bugDescription').value = '';
        alert('📨 Opening email client to send the bug report.');
    });

    // Footer modal handlers
    const tosModal = document.getElementById('tosModal');
    const aboutModal = document.getElementById('aboutModal');
    const contactModal = document.getElementById('contactModal');

    document.getElementById('footerTosLink').addEventListener('click', function(e) {
        e.preventDefault();
        tosModal.classList.remove('hidden');
    });
    document.getElementById('tosModalCloseBtn').addEventListener('click', function() {
        tosModal.classList.add('hidden');
    });

    document.getElementById('footerAboutLink').addEventListener('click', function(e) {
        e.preventDefault();
        aboutModal.classList.remove('hidden');
    });
    document.getElementById('aboutModalCloseBtn').addEventListener('click', function() {
        aboutModal.classList.add('hidden');
    });

    document.getElementById('footerContactLink').addEventListener('click', function(e) {
        e.preventDefault();
        contactModal.classList.remove('hidden');
    });
    document.getElementById('contactModalCancelBtn').addEventListener('click', function() {
        contactModal.classList.add('hidden');
    });

    document.getElementById('sendContactBtn').addEventListener('click', function() {
        const msg = document.getElementById('contactMessage').value.trim();
        if (!msg) {
            alert("Please write a message first.");
            return;
        }
        const email = 'dongshancai642@gmail.com';
        const subject = encodeURIComponent('PawTrack Feedback');
        const body = encodeURIComponent(msg);
        window.open(`mailto:${email}?subject=${subject}&body=${body}`);
        contactModal.classList.add('hidden');
        document.getElementById('contactMessage').value = '';
    });

    // Close modal when clicking overlay background
    window.addEventListener('click', function(e) {
        if (e.target === tosModal) tosModal.classList.add('hidden');
        if (e.target === aboutModal) aboutModal.classList.add('hidden');
        if (e.target === contactModal) contactModal.classList.add('hidden');
    });
}

initStaticBackground();
initFloatingPetTilt();
initMobileMenuToggles();
initSettingsEvents();

/* --- START: Disease Prevention --- */
function updatePreventionUI(pet) {
    const listEl = document.getElementById('preventionList');
    if (!listEl) return;
    
    const notes = pet.diseasePrevention || [];
    if (notes.length === 0) {
        listEl.innerHTML = '<div class="text-secondary text-sm text-center" style="padding: 20px 0;">No prevention notes added yet.</div>';
        return;
    }

    const sorted = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));
    listEl.innerHTML = sorted.map(note => `
        <div class="timeline-item">
            <span class="icon-badge">🛡️</span>
            <div style="flex:1;">
                <div class="fw-bold">${note.title} <span class="tag ${note.priority === 'high' ? 'tag-danger' : note.priority === 'medium' ? 'tag-warning' : 'tag-success'}">${note.priority.toUpperCase()}</span></div>
                <div style="font-size:0.85rem; margin-top:2px;">${note.description}</div>
                <div class="text-xs text-secondary mt-8">📅 Date: ${formatDate(note.date)} ${note.reminder ? '· 🔔 Reminder active' : ''}</div>
            </div>
            <div class="flex-center gap-sm">
                <button class="btn btn-sm btn-outline" onclick="editPreventionNote('${note.id}')">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deletePreventionNote('${note.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function savePreventionNote() {
    const pet = getCurrentPet();
    if (!pet) return;

    const noteIdEl = document.getElementById('preventionNoteId');
    const titleEl = document.getElementById('preventionTitle');
    const descEl = document.getElementById('preventionDesc');
    const dateEl = document.getElementById('preventionDate');
    const priorityEl = document.getElementById('preventionPriority');
    const reminderEl = document.getElementById('preventionReminder');

    const title = titleEl.value.trim();
    const description = descEl.value.trim();
    const date = dateEl.value;
    const priority = priorityEl.value;
    const reminder = reminderEl.checked;

    if (!title || !date) {
        alert('Please provide at least a title and date for the prevention note.');
        return;
    }

    if (!pet.diseasePrevention) pet.diseasePrevention = [];

    const existingId = noteIdEl.value;
    if (existingId) {
        // Edit mode
        const note = pet.diseasePrevention.find(n => n.id === existingId);
        if (note) {
            note.title = title;
            note.description = description;
            note.date = date;
            note.priority = priority;
            note.reminder = reminder;
        }
    } else {
        // Add mode
        const note = {
            id: 'prev_' + Date.now(),
            title,
            description,
            date,
            priority,
            reminder
        };
        pet.diseasePrevention.push(note);
    }

    updatePet(pet);
    
    // Reset form
    noteIdEl.value = '';
    titleEl.value = '';
    descEl.value = '';
    dateEl.value = '';
    priorityEl.value = 'medium';
    reminderEl.checked = false;
    document.getElementById('preventionCancelBtn').style.display = 'none';
    document.getElementById('preventionSaveBtn').textContent = 'Save Note';

    updatePreventionUI(pet);
    alert('Prevention note saved successfully.');
}

window.editPreventionNote = function(id) {
    const pet = getCurrentPet();
    if (!pet || !pet.diseasePrevention) return;

    const note = pet.diseasePrevention.find(n => n.id === id);
    if (!note) return;

    document.getElementById('preventionNoteId').value = note.id;
    document.getElementById('preventionTitle').value = note.title;
    document.getElementById('preventionDesc').value = note.description || '';
    document.getElementById('preventionDate').value = note.date;
    document.getElementById('preventionPriority').value = note.priority || 'medium';
    document.getElementById('preventionReminder').checked = !!note.reminder;

    document.getElementById('preventionCancelBtn').style.display = 'inline-flex';
    document.getElementById('preventionSaveBtn').textContent = 'Update Note';
    
    // Scroll to form
    document.getElementById('page-prevention').querySelector('.card').scrollIntoView({ behavior: 'smooth' });
};

window.deletePreventionNote = function(id) {
    const pet = getCurrentPet();
    if (!pet || !pet.diseasePrevention) return;

    if (confirm('Are you sure you want to delete this prevention note?')) {
        pet.diseasePrevention = pet.diseasePrevention.filter(n => n.id !== id);
        updatePet(pet);
        updatePreventionUI(pet);
    }
};

document.getElementById('preventionSaveBtn').addEventListener('click', savePreventionNote);
document.getElementById('preventionCancelBtn').addEventListener('click', function() {
    document.getElementById('preventionNoteId').value = '';
    document.getElementById('preventionTitle').value = '';
    document.getElementById('preventionDesc').value = '';
    document.getElementById('preventionDate').value = '';
    document.getElementById('preventionPriority').value = 'medium';
    document.getElementById('preventionReminder').checked = false;
    this.style.display = 'none';
    document.getElementById('preventionSaveBtn').textContent = 'Save Note';
});
/* --- END: Disease Prevention --- */

/* --- START: AI Disease Tracker --- */
function updateAiHealthUI(pet) {
    const logsListEl = document.getElementById('aiHealthLogsList');
    if (!logsListEl) return;

    const logs = pet.aiHealthLogs || [];
    if (logs.length === 0) {
        logsListEl.innerHTML = '<div class="text-secondary text-sm text-center" style="padding: 20px 0;">No diagnostic logs saved yet.</div>';
        return;
    }

    const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    logsListEl.innerHTML = sorted.map(log => `
        <div class="timeline-item">
            <span class="icon-badge">🩺</span>
            <div style="flex:1;">
                <div class="fw-bold">${log.symptoms.join(', ')}</div>
                <div class="text-sm mt-4">
                    <strong>AI Assessment:</strong> ${log.assessment}
                </div>
                ${log.photoName ? `<div class="text-xs text-secondary mt-4">📷 Photo: ${log.photoName}</div>` : ''}
                <div class="text-xs text-secondary mt-4">📅 Dated: ${formatDate(log.date)}</div>
            </div>
            <button class="btn btn-sm btn-danger" onclick="deleteAiHealthLog('${log.id}')">🗑️</button>
        </div>
    `).join('');
}

function runRealTimeAiAnalysis() {
    const selectedSymptoms = [];
    document.querySelectorAll('.symptom-checkbox:checked').forEach(cb => {
        selectedSymptoms.push(cb.value);
    });

    const liveAssessmentEl = document.getElementById('aiLiveAssessment');
    if (liveAssessmentEl) {
        liveAssessmentEl.innerHTML = getLiveDiagnosis(selectedSymptoms);
    }
}

function getLiveDiagnosis(symptoms) {
    if (symptoms.length === 0) {
        return `<p class="text-secondary">Please select one or more symptoms to start the real-time AI disease tracker analysis.</p>`;
    }

    let possibleConditions = [];
    let severity = "Low";
    let severityClass = "tag-success";

    const has = (s) => symptoms.includes(s);

    if (has("Vomiting") && has("Diarrhea")) {
        possibleConditions.push("Gastroenteritis (Stomach Flu)", "Dietary Indiscretion");
        severity = "Moderate to High";
        severityClass = "tag-warning";
    }
    if (has("Lethargy") && has("Loss of Appetite")) {
        possibleConditions.push("Mild Infection / Malaise", "Dehydration");
        if (severity === "Low") {
            severity = "Moderate";
            severityClass = "tag-warning";
        }
    }
    if (has("Coughing") && has("Lethargy")) {
        possibleConditions.push("Kennel Cough (Respiratory Infection)");
        if (severity === "Low") {
            severity = "Moderate";
            severityClass = "tag-warning";
        }
    }
    if (has("Fever")) {
        possibleConditions.push("Systemic Viral/Bacterial Infection", "Pyrexia");
        severity = "High";
        severityClass = "tag-danger";
    }
    if (has("Vomiting") && has("Lethargy")) {
        possibleConditions.push("Potential Ingestion of Toxins", "Gastrointestinal Blockage");
        severity = "High";
        severityClass = "tag-danger";
    }
    if (has("Vomiting") && has("Fever")) {
        possibleConditions.push("Pancreatitis flare-up", "Acute infection");
        severity = "High";
        severityClass = "tag-danger";
    }

    if (possibleConditions.length === 0) {
        // Fallback for single symptoms
        if (has("Lethargy")) {
            possibleConditions.push("Fatigue / Stress / Early stage infection");
            severity = "Low to Moderate";
            severityClass = "tag-warning";
        } else if (has("Vomiting")) {
            possibleConditions.push("Stomach irritation / Dietary indiscretion");
            severity = "Moderate";
            severityClass = "tag-warning";
        } else if (has("Diarrhea")) {
            possibleConditions.push("Parasites / Bacterial imbalance / Stress");
            severity = "Moderate";
            severityClass = "tag-warning";
        } else if (has("Coughing")) {
            possibleConditions.push("Kennel cough exposure / Inhaled irritants");
            severity = "Low to Moderate";
            severityClass = "tag-warning";
        } else if (has("Loss of Appetite")) {
            possibleConditions.push("Nausea / Environmental stress / Dental pain");
            severity = "Low to Moderate";
            severityClass = "tag-warning";
        }
    }

    let html = `
        <div class="mb-12">
            <strong>Detected Severity: </strong>
            <span class="tag ${severityClass}">${severity.toUpperCase()}</span>
        </div>
        <div class="mb-8"><strong>Possible Conditions Analysed:</strong></div>
        <ul style="padding-left: 20px; margin-bottom: 12px; font-size: 0.9rem;">
            ${possibleConditions.map(c => `<li>${c}</li>`).join('')}
        </ul>
        <div class="text-sm text-secondary">
            <strong>Suggested Action:</strong> ${severity === "High" ? "Contact your primary care veterinarian or an emergency animal clinic immediately." : "Monitor your pet closely. Ensure they stay hydrated. If symptoms persist for more than 24 hours, schedule a vet visit."}
        </div>
    `;

    return html;
}

// Event listeners for symptom checkbox changes
document.querySelectorAll('.symptom-checkbox').forEach(cb => {
    cb.addEventListener('change', runRealTimeAiAnalysis);
});

// Photo Observation analysis
document.getElementById('aiPhotoUpload').addEventListener('change', function(e) {
    const photoFile = e.target.files[0];
    const resultEl = document.getElementById('aiPhotoAnalysisResult');
    if (!resultEl) return;

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            resultEl.style.display = 'block';
            resultEl.innerHTML = `
                <strong>📸 Photo Observation Analysis:</strong>
                <div class="text-xs text-secondary mt-4">File: ${photoFile.name}</div>
                <div class="text-sm mt-4">AI analysis of the image completed: No obvious severe lesions or parasite infestations visible. However, visual scans are limited. If you observe redness, swelling, or discharge, seek veterinary attention.</div>
            `;
        };
        reader.readAsDataURL(photoFile);
    } else {
        resultEl.style.display = 'none';
    }
});

// Save Diagnostic Log
document.getElementById('aiLogSymptomBtn').addEventListener('click', function() {
    const pet = getCurrentPet();
    if (!pet) return;

    const selectedSymptoms = [];
    document.querySelectorAll('.symptom-checkbox:checked').forEach(cb => {
        selectedSymptoms.push(cb.value);
    });

    if (selectedSymptoms.length === 0) {
        alert('Please check at least one symptom before saving a diagnostic log.');
        return;
    }

    const photoInput = document.getElementById('aiPhotoUpload');
    const photoName = photoInput.files[0] ? photoInput.files[0].name : null;

    const liveAssessmentEl = document.getElementById('aiLiveAssessment');
    const assessmentText = liveAssessmentEl ? liveAssessmentEl.textContent.trim().replace(/\s+/g, ' ') : '';

    if (!pet.aiHealthLogs) pet.aiHealthLogs = [];

    const log = {
        id: 'ailog_' + Date.now(),
        date: new Date().toISOString(),
        symptoms: selectedSymptoms,
        assessment: assessmentText,
        photoName: photoName
    };

    pet.aiHealthLogs.push(log);
    updatePet(pet);

    // Reset symptoms
    document.querySelectorAll('.symptom-checkbox:checked').forEach(cb => {
        cb.checked = false;
    });
    photoInput.value = '';
    document.getElementById('aiPhotoAnalysisResult').style.display = 'none';
    
    runRealTimeAiAnalysis();
    updateAiHealthUI(pet);
    alert('AI Diagnostic log saved successfully.');
});

window.deleteAiHealthLog = function(id) {
    const pet = getCurrentPet();
    if (!pet || !pet.aiHealthLogs) return;

    if (confirm('Are you sure you want to delete this AI diagnostic log?')) {
        pet.aiHealthLogs = pet.aiHealthLogs.filter(l => l.id !== id);
        updatePet(pet);
        updateAiHealthUI(pet);
    }
};

/* --- START: Interactive Pet AI Consult Chatbot --- */
let aiChatHistory = [];

window.resetAiChatWindow = function() {
    aiChatHistory = [];
    const win = document.getElementById('aiChatWindow');
    if (win) {
        win.innerHTML = `
            <div class="chat-bubble bot">
                🐾 Hello! I am your real-time Pet AI assistant. Ask me anything about your pet's wellness, nutrition, behavior, or health.
            </div>
        `;
    }
};

// updateAiConnectionStatus is defined globally above updateSettingsUI

const PET_KEYWORDS = [
    'pet', 'dog', 'cat', 'bird', 'vet', 'vaccin', 'puppy', 'kitten', 'animal', 
    'flea', 'tick', 'food', 'eat', 'feed', 'symptom', 'fever', 'letharg', 
    'vomit', 'diarrhea', 'cough', 'sitter', 'bath', 'weight', 'poop', 'pee', 
    'groom', 'health', 'ill', 'disease', 'toxic', 'poison', 'medicine', 
    'dose', 'appointment', 'breed', 'rabies', 'paw', 'scratch', 'wound', 
    'bite', 'bark', 'meow', 'chirp', 'ears', 'eyes', 'skin', 'fur', 'diet'
];

function isQueryPetRelated(query) {
    const q = query.toLowerCase();
    return PET_KEYWORDS.some(kw => q.includes(kw));
}

function parseMarkdown(text) {
    if (!text) return '';
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const content = trimmed.substring(2);
            let prefix = '';
            if (!inList) {
                inList = true;
                prefix = '<ul style="padding-left: 20px; margin-bottom: 8px;">';
            }
            return `${prefix}<li>${content}</li>`;
        } else {
            let suffix = '';
            if (inList) {
                inList = false;
                suffix = '</ul>';
            }
            return `${suffix}${line}`;
        }
    });
    if (inList) {
        processedLines.push('</ul>');
    }
    
    return processedLines.join('<br>');
}

function extractTextFromRegex(line) {
    const regex = /"text"\s*:\s*"((?:[^"\\]|\\.)*)"/;
    const match = regex.exec(line);
    if (match) {
        let val = match[1];
        try {
            val = JSON.parse(`"${val}"`);
        } catch(e) {}
        return val;
    }
    return '';
}

const SIMULATED_RESPONSES = {
    chocolate: "🍫 <strong>Chocolate Toxicity:</strong> Chocolate contains theobromine, which is toxic to dogs and cats. Dark and baking chocolate are the most dangerous. Signs include vomiting, diarrhea, rapid breathing, and seizures. If ingested, call your vet immediately or an animal poison control center.",
    vaccin: "💉 <strong>Pet Vaccine Guidelines:</strong><br>- <strong>Puppies/Kittens (6-16 weeks):</strong> Series of core vaccines (DHPP for dogs, FVRCP for cats) every 3-4 weeks. Rabies vaccine is typically given at 14-16 weeks.<br>- <strong>Adult Pets:</strong> Boosters annually or every 3 years depending on lifestyle, risk assessment, and vaccine type.",
    fever: "🔥 <strong>Fever Signs in Pets:</strong> Normal dog/cat temperature is 38°C to 39.2°C (101°F to 102.5°F). Signs of fever include lethargy, warm ears/nose, shivering, loss of appetite, and coughing. Do not give human medicines (like Tylenol/Advil - they are highly toxic!). Call a vet if temp exceeds 39.5°C.",
    tick: "🕷️ <strong>Tick Removal Guide:</strong><br>1. Use fine-tipped tweezers or a tick hook.<br>2. Grasp the tick as close to the skin's surface as possible.<br>3. Pull upward with steady, even pressure. Do not twist or jerk.<br>4. Clean the bite area and your hands with alcohol or soap.<br>5. Monitor for signs of Lyme disease (lethargy, limping).",
    cat_food: "🐈 <strong>Dog eating Cat Food:</strong> Cat food is higher in protein and fat than dog food. If eaten occasionally, it might cause mild stomach upset but is not toxic. However, a continuous diet of cat food can lead to obesity, pancreatitis, and nutritional imbalances in dogs.",
    stomach: "🤢 <strong>Stomach Upset & Diarrhea:</strong> This can be caused by dietary indiscretion, parasites, sudden food changes, or infections. Ensure your pet has access to fresh water to prevent dehydration. Feed a bland diet (boiled chicken breast and white rice, no seasoning) in small portions. If vomiting/diarrhea persists for more than 24 hours, or is accompanied by lethargy, consult a vet.",
    vomit: "🤢 <strong>Stomach Upset & Diarrhea:</strong> This can be caused by dietary indiscretion, parasites, sudden food changes, or infections. Ensure your pet has access to fresh water to prevent dehydration. Feed a bland diet (boiled chicken breast and white rice, no seasoning) in small portions. If vomiting/diarrhea persists for more than 24 hours, or is accompanied by lethargy, consult a vet.",
    diarrhea: "🤢 <strong>Stomach Upset & Diarrhea:</strong> This can be caused by dietary indiscretion, parasites, sudden food changes, or infections. Ensure your pet has access to fresh water to prevent dehydration. Feed a bland diet (boiled chicken breast and white rice, no seasoning) in small portions. If vomiting/diarrhea persists for more than 24 hours, or is accompanied by lethargy, consult a vet.",
    letharg: "🥱 <strong>Lethargy in Pets:</strong> Lethargy is a common sign of illness. It may indicate an infection, pain, dehydration, or a chronic condition. If your pet is unusually tired, refuses to interact, or sleeps excessively, monitor for other symptoms. Seek veterinary help if it lasts more than 24 hours.",
    eat: "🍽️ <strong>Pet Nutrition Advice:</strong> A balanced diet is critical. Ensure you feed high-quality commercially prepared food formulated for your pet's life stage (puppy/kitten, adult, senior). Avoid feeding toxic foods like grapes, raisins, onions, garlic, chocolate, macadamia nuts, and xylitol.",
    food: "🍽️ <strong>Pet Nutrition Advice:</strong> A balanced diet is critical. Ensure you feed high-quality commercially prepared food formulated for your pet's life stage (puppy/kitten, adult, senior). Avoid feeding toxic foods like grapes, raisins, onions, garlic, chocolate, macadamia nuts, and xylitol.",
    sitter: "📋 <strong>Sitter Checklist:</strong> When leaving your pet with a sitter, provide clear instructions regarding feeding schedules, medication dosages, emergency contact numbers, your vet's address, and your pet's favorite routines or quirks.",
    cough: "🗣️ <strong>Coughing in Pets:</strong> Coughing can be caused by respiratory infections (like Kennel Cough in dogs), asthma (common in cats), heart disease, or inhaled foreign bodies. Ensure your pet is in a well-ventilated space and consult your vet for an accurate diagnosis.",
    bath: "🧼 <strong>Grooming Tips:</strong> Regular grooming keeps your skin and coat healthy. Use only pet-safe shampoos, as human shampoos can disrupt their skin's natural pH level. Brush their coat frequently to prevent matting and check for fleas or ticks.",
    groom: "🧼 <strong>Grooming Tips:</strong> Regular grooming keeps your skin and coat healthy. Use only pet-safe shampoos, as human shampoos can disrupt their skin's natural pH level. Brush their coat frequently to prevent matting and check for fleas or ticks.",
    app: "🐾 <strong>About PawTrack:</strong> PawTrack is your ultimate pet companion dashboard. Use the tabs to log feeding times, vaccine schedules, weight changes, tasks, vet appointments, and disease prevention notes, or upload key documents.",
    pawtrack: "🐾 <strong>About PawTrack:</strong> PawTrack is your ultimate pet companion dashboard. Use the tabs to log feeding times, vaccine schedules, weight changes, tasks, vet appointments, and disease prevention notes, or upload key documents.",
    default: "🐾 <strong>Pet Care Advice:</strong> I detected your question is related to pets! To give you the best advice: ensure your pet gets fresh water, a balanced diet, daily exercise, and regular checkups at the vet. If they show signs of pain or distress, please consult a veterinary medical professional."
};

function getOfflineSimulatedResponse(query) {
    const q = query.toLowerCase();
    for (const key in SIMULATED_RESPONSES) {
        if (q.includes(key)) {
            return SIMULATED_RESPONSES[key];
        }
    }
    return SIMULATED_RESPONSES.default;
}

function appendAiChatMessage(sender, text) {
    const win = document.getElementById('aiChatWindow');
    if (!win) return null;
    
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    win.appendChild(bubble);
    win.scrollTop = win.scrollHeight;
    return bubble;
}

function appendStreamingBubble() {
    const win = document.getElementById('aiChatWindow');
    if (!win) return null;
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    win.appendChild(bubble);
    win.scrollTop = win.scrollHeight;
    return bubble;
}

async function handleAiConsultQuery(query) {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    // Append user message
    appendAiChatMessage('user', cleanQuery);

    // Filter pet keyword
    if (!isQueryPetRelated(cleanQuery)) {
        const bubble = appendStreamingBubble();
        setTimeout(() => {
            bubble.innerHTML = "🐾 I am trained to assist you only with pet health, care, behavior, nutrition, and wellness topics. Please ask a question related to pets.";
        }, 600);
        return;
    }

    const bubble = appendStreamingBubble();

    // Use the server-side /api/gemini proxy (key stored in .env.local, never exposed to browser)
    aiChatHistory.push({
        role: 'user',
        parts: [{ text: cleanQuery }]
    });

    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: aiChatHistory,
                systemInstruction: {
                    parts: [{ text: "You are a helpful assistant for PawTrack, a pet tracking application. You must ONLY answer questions that are related to pets (dogs, cats, birds, and other domestic pets), including their health, care, behavior, grooming, training, and nutrition. If the user asks a question about any other topic (e.g. general knowledge, programming, non-pet recipes, math, etc.), you must politely decline to answer, stating that you can only answer pet‑related questions." }]
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        bubble.innerHTML = '';
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';
        let chunkBuffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            chunkBuffer += decoder.decode(value, { stream: true });
            
            const lines = chunkBuffer.split('\n');
            chunkBuffer = lines.pop() || '';
            
            for (const line of lines) {
                let cleanLine = line.trim();
                if (cleanLine.startsWith(',')) cleanLine = cleanLine.substring(1).trim();
                if (cleanLine.startsWith('[')) cleanLine = cleanLine.substring(1).trim();
                if (cleanLine.endsWith(']')) cleanLine = cleanLine.substring(0, cleanLine.length - 1).trim();
                if (!cleanLine) continue;
                
                try {
                    const obj = JSON.parse(cleanLine);
                    const text = obj.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        fullText += text;
                        bubble.innerHTML = parseMarkdown(fullText);
                        const win = document.getElementById('aiChatWindow');
                        if (win) win.scrollTop = win.scrollHeight;
                    }
                } catch (e) {
                    const text = extractTextFromRegex(cleanLine);
                    if (text) {
                        fullText += text;
                        bubble.innerHTML = parseMarkdown(fullText);
                        const win = document.getElementById('aiChatWindow');
                        if (win) win.scrollTop = win.scrollHeight;
                    }
                }
            }
        }

        if (chunkBuffer.trim()) {
            let cleanLine = chunkBuffer.trim();
            if (cleanLine.startsWith(',')) cleanLine = cleanLine.substring(1).trim();
            if (cleanLine.startsWith('[')) cleanLine = cleanLine.substring(1).trim();
            if (cleanLine.endsWith(']')) cleanLine = cleanLine.substring(0, cleanLine.length - 1).trim();
            try {
                const obj = JSON.parse(cleanLine);
                const text = obj.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    fullText += text;
                    bubble.innerHTML = parseMarkdown(fullText);
                }
            } catch(e) {
                const text = extractTextFromRegex(cleanLine);
                if (text) {
                    fullText += text;
                    bubble.innerHTML = parseMarkdown(fullText);
                }
            }
        }

        aiChatHistory.push({
            role: 'model',
            parts: [{ text: fullText }]
        });

    } catch (err) {
        console.error(err);
        bubble.innerHTML = `⚠️ <strong>Error:</strong> ${err.message}. Please ensure GEMINI_API_KEY is set in .env.local and restart the server.`;
        aiChatHistory.pop();
    }
}

// Bind Chat UI Event Listeners
function initAiChatbotEvents() {
    const sendBtn = document.getElementById('aiChatSendBtn');
    const chatInput = document.getElementById('aiChatInput');
    const tabTrackerBtn = document.getElementById('aiTabTrackerBtn');
    const tabConsultBtn = document.getElementById('aiTabConsultBtn');
    const secTracker = document.getElementById('aiSectionTracker');
    const secConsult = document.getElementById('aiSectionConsult');

    // Inner Tab Switching
    if (tabTrackerBtn && tabConsultBtn && secTracker && secConsult) {
        tabTrackerBtn.addEventListener('click', function() {
            tabTrackerBtn.className = 'btn btn-primary btn-sm';
            tabConsultBtn.className = 'btn btn-outline btn-sm';
            tabConsultBtn.style.background = 'transparent';
            tabConsultBtn.style.borderColor = 'transparent';
            tabTrackerBtn.style.background = '';
            tabTrackerBtn.style.borderColor = '';
            
            secTracker.style.display = 'block';
            secConsult.style.display = 'none';
        });

        tabConsultBtn.addEventListener('click', function() {
            tabConsultBtn.className = 'btn btn-primary btn-sm';
            tabTrackerBtn.className = 'btn btn-outline btn-sm';
            tabTrackerBtn.style.background = 'transparent';
            tabTrackerBtn.style.borderColor = 'transparent';
            tabConsultBtn.style.background = '';
            tabConsultBtn.style.borderColor = '';
            
            secTracker.style.display = 'none';
            secConsult.style.display = 'flex';
        });
    }

    // Send click
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', function() {
            const val = chatInput.value;
            if (val.trim()) {
                handleAiConsultQuery(val);
                chatInput.value = '';
            }
        });

        // Press Enter
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });
    }

    // Suggestion chips
    document.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            const prompt = this.dataset.prompt;
            if (prompt) {
                handleAiConsultQuery(prompt);
            }
        });
    });
}

// Auto-run initialization of AI chatbot
setTimeout(() => {
    initAiChatbotEvents();
    updateAiConnectionStatus();
}, 200);

/* --- END: AI Disease Tracker --- */

/* --- START: Pet Owner Profile Feature --- */
window.updateOwnerProfileUI = function() {
    const profile = data.ownerProfile || {
        name: 'Pet Owner',
        email: 'owner@example.com',
        phone: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        avatar: ''
    };

    // 1. Populate form inputs (if elements exist)
    const nameInput = document.getElementById('ownerNameInput');
    const emailInput = document.getElementById('ownerEmailInput');
    const phoneInput = document.getElementById('ownerPhoneInput');
    const emergencyNameInput = document.getElementById('ownerEmergencyNameInput');
    const emergencyPhoneInput = document.getElementById('ownerEmergencyPhoneInput');

    if (nameInput) nameInput.value = profile.name || '';
    if (emailInput) emailInput.value = profile.email || '';
    if (phoneInput) phoneInput.value = profile.phone || '';
    if (emergencyNameInput) emergencyNameInput.value = profile.emergencyContactName || '';
    if (emergencyPhoneInput) emergencyPhoneInput.value = profile.emergencyContactPhone || '';

    // 2. Populate Overview Card Display Values
    const nameDisplay = document.getElementById('ownerNameDisplayVal');
    const emailDisplay = document.getElementById('ownerEmailDisplayVal');
    const phoneDisplay = document.getElementById('ownerPhoneDisplayVal');
    const emergencyNameDisplay = document.getElementById('ownerEmergencyNameDisplayVal');
    const emergencyPhoneDisplay = document.getElementById('ownerEmergencyPhoneDisplayVal');

    if (nameDisplay) nameDisplay.textContent = profile.name || 'Pet Owner';
    if (emailDisplay) emailDisplay.textContent = profile.email || 'owner@example.com';
    if (phoneDisplay) phoneDisplay.textContent = profile.phone || '—';
    if (emergencyNameDisplay) emergencyNameDisplay.textContent = profile.emergencyContactName || '—';
    if (emergencyPhoneDisplay) emergencyPhoneDisplay.textContent = profile.emergencyContactPhone || '—';

    // 3. Render Avatars (Form Preview, Summary Display, and Header Button)
    const previewEl = document.getElementById('ownerAvatarPreview');
    const displayEl = document.getElementById('ownerAvatarDisplay');
    const headerBtnEl = document.getElementById('ownerProfileBtn');

    const avatarHtml = profile.avatar 
        ? `<img src="${profile.avatar}" alt="Avatar" />` 
        : '👤';

    if (previewEl) previewEl.innerHTML = avatarHtml;
    if (displayEl) displayEl.innerHTML = avatarHtml;
    if (headerBtnEl) headerBtnEl.innerHTML = avatarHtml;

    // 4. Populate Registered Pets Summary
    const petsListEl = document.getElementById('ownerPetsListSummary');
    if (petsListEl) {
        const pets = data.pets || [];
        if (pets.length === 0) {
            petsListEl.innerHTML = '<div class="text-secondary text-sm">No pets registered yet.</div>';
        } else {
            petsListEl.innerHTML = pets.map(pet => {
                const avatarSource = pet.avatar || (pet.type === 'cat' ? 'cat_avatar.jpg' : pet.type === 'dog' ? 'dog_avatar.png' : pet.type === 'bird' ? 'bird_avatar.png' : 'other_avatar.jpg');
                return `
                    <div style="display:flex; align-items:center; gap:10px; background:var(--card-bg); border:1px solid var(--border); border-radius:8px; padding:8px;">
                        <img src="${avatarSource}" style="width:36px; height:36px; border-radius:50%; border:1px solid var(--border); object-fit:cover;" alt="${pet.name}" />
                        <div style="flex:1;">
                            <div class="fw-bold text-sm">${pet.name}</div>
                            <div class="text-xs text-secondary">${pet.breed || pet.type} &bull; ${pet.age || '0'} yrs</div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
};

function saveOwnerProfile() {
    const profile = data.ownerProfile || {};

    const nameInput = document.getElementById('ownerNameInput');
    const emailInput = document.getElementById('ownerEmailInput');
    const phoneInput = document.getElementById('ownerPhoneInput');
    const emergencyNameInput = document.getElementById('ownerEmergencyNameInput');
    const emergencyPhoneInput = document.getElementById('ownerEmergencyPhoneInput');

    profile.name = nameInput ? nameInput.value.trim() : 'Pet Owner';
    profile.email = emailInput ? emailInput.value.trim() : 'owner@example.com';
    profile.phone = phoneInput ? phoneInput.value.trim() : '';
    profile.emergencyContactName = emergencyNameInput ? emergencyNameInput.value.trim() : '';
    profile.emergencyContactPhone = emergencyPhoneInput ? emergencyPhoneInput.value.trim() : '';

    data.ownerProfile = profile;
    saveData();
    window.updateOwnerProfileUI();
    alert('Owner profile details updated successfully.');
}

function initOwnerProfileEvents() {
    const saveBtn = document.getElementById('saveOwnerProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveOwnerProfile);
    }

    const uploadInput = document.getElementById('ownerAvatarUpload');
    if (uploadInput) {
        uploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 200 * 1024) {
                    alert('Avatar image is too large! Maximum allowed limit is 200KB.');
                    uploadInput.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    data.ownerProfile.avatar = evt.target.result;
                    saveData();
                    window.updateOwnerProfileUI();
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Auto-run profile initialization
setTimeout(() => {
    initOwnerProfileEvents();
    window.updateOwnerProfileUI();
}, 300);
/* --- END: Pet Owner Profile Feature --- */

// === END FLAT UI & CORNER FLOATING PETS ===

// === AUTH INTEGRATION: Account Details, Profile Auto-fill, Logout ===
(function initAuthIntegration() {
    // Fetch the authenticated user's data from the session
    async function fetchAuthUser() {
        try {
            const res = await fetch('/api/auth/me');
            if (!res.ok) return null;
            const data = await res.json();
            return data.user || null;
        } catch {
            return null;
        }
    }

    // Populate account details in Privacy Settings section
    function populateAccountDetails(user) {
        const nameEl = document.getElementById('authAccountName');
        const emailEl = document.getElementById('authAccountEmail');
        const statusEl = document.getElementById('authAccountStatus');

        if (nameEl) nameEl.textContent = user.name || 'Unknown';
        if (emailEl) emailEl.textContent = user.email || 'Unknown';
        if (statusEl) {
            statusEl.textContent = '● Active';
            statusEl.style.color = 'var(--success)';
        }
    }

    // Auto-fill profile email and name from auth session
    function autoFillProfile(user) {
        // Only auto-fill if the owner profile is still at default values
        const ownerProfile = (window.data || {}).ownerProfile || {};
        const isDefaultEmail = !ownerProfile.email || ownerProfile.email === 'owner@example.com';
        const isDefaultName = !ownerProfile.name || ownerProfile.name === 'Pet Owner';

        // Auto-fill the email input and display
        if (isDefaultEmail && user.email) {
            const emailInput = document.getElementById('ownerEmailInput');
            const emailDisplay = document.getElementById('ownerEmailDisplayVal');
            if (emailInput) emailInput.value = user.email;
            if (emailDisplay) emailDisplay.textContent = user.email;

            // Also persist to data
            if (window.data) {
                if (!window.data.ownerProfile) window.data.ownerProfile = {};
                window.data.ownerProfile.email = user.email;
            }
        }

        // Auto-fill the name input and display
        if (isDefaultName && user.name) {
            const nameInput = document.getElementById('ownerNameInput');
            const nameDisplay = document.getElementById('ownerNameDisplayVal');
            if (nameInput) nameInput.value = user.name;
            if (nameDisplay) nameDisplay.textContent = user.name;

            // Also persist to data
            if (window.data) {
                if (!window.data.ownerProfile) window.data.ownerProfile = {};
                window.data.ownerProfile.name = user.name;
            }
        }

        // Save to localStorage if we updated anything
        if ((isDefaultEmail || isDefaultName) && typeof saveData === 'function') {
            saveData();
        }
    }

    // Handle logout button
    function initLogoutButton() {
        const logoutBtn = document.getElementById('authLogoutBtn');
        if (!logoutBtn) return;

        logoutBtn.addEventListener('click', async function() {
            logoutBtn.disabled = true;
            logoutBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span style="width:16px;height:16px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;display:inline-block;"></span> Logging out...</span>';

            try {
                await fetch('/api/auth/logout', { method: 'POST' });
                // Redirect to login page
                window.location.href = '/login';
            } catch {
                logoutBtn.disabled = false;
                logoutBtn.textContent = '🚪 Logout';
                alert('Failed to logout. Please try again.');
            }
        });
    }

    // Run after DOM is ready (with small delay to let other init code run first)
    setTimeout(async () => {
        const user = await fetchAuthUser();
        if (user) {
            populateAccountDetails(user);
            autoFillProfile(user);
        } else {
            // Not authenticated — show placeholder
            const nameEl = document.getElementById('authAccountName');
            const emailEl = document.getElementById('authAccountEmail');
            const statusEl = document.getElementById('authAccountStatus');
            if (nameEl) nameEl.textContent = 'Not signed in';
            if (emailEl) emailEl.textContent = '—';
            if (statusEl) {
                statusEl.textContent = '● Offline';
                statusEl.style.color = 'var(--text-secondary)';
            }
        }
        initLogoutButton();
    }, 500);
})();
// === END AUTH INTEGRATION ===
