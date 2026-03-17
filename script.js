// Define Seed Data Structure for Alpine Component
const defaultData = {
    readings: [
        { id: 1, title: 'Artificial Knowing', author: 'Alison Adam', type: 'Book', link: '#', tags: 'authorship, AI ethics', status: 'In Progress', notes: 'Explores the implications of AI on subjective knowledge.' },
        { id: 2, title: 'The Designer As Author', author: 'Michael Rock', type: 'Article', link: '#', tags: 'design theory, authorship, research', status: 'Completed', notes: 'Crucial reading to understand traditional concepts of authorship before applying it to AI.' }
    ],
    plan: [
        { id: 'w5', week: 'Week 5', focus: 'Research', tasks: 'Literature review, core themes definition', state: 'completed', notes: 'Found good sources on authorship.' },
        { id: 'w6', week: 'Week 6', focus: 'Experiments', tasks: 'Initial prompt testing, vectorizing tests', state: 'completed', notes: 'Shifted focus based on initial generations lacking intentionality.' },
        { id: 'w7', week: 'Week 7', focus: 'Synthesis', tasks: 'Refining constraints, creating a standardized process', state: 'active', notes: 'Currently defining the manual vector constraint framework.' },
        { id: 'w8', week: 'Week 8', focus: 'Production', tasks: 'Iterative generation and vector translation', state: 'pending', notes: '' },
        { id: 'w9', week: 'Week 9', focus: 'Documentation', tasks: 'Writing logs, finalizing dashboard', state: 'pending', notes: '' },
        { id: 'w10', week: 'Week 10', focus: 'Critique Prep', tasks: 'Formatting prints and presentation', state: 'pending', notes: '' },
        { id: 'w11', week: 'Week 11', focus: 'Final Build', tasks: 'Final project deliverables', state: 'pending', notes: '' }
    ],
    prompts: [
        { id: 1, prompt: 'A sweeping minimalist vector landscape with rolling hills, bright calm colors, clear sky', model: 'Midjourney v6', output: 'Generated highly detailed 3D style, too much texture.', next: 'Add "flat, vector art style, limited palette" to force constraint.' },
        { id: 2, prompt: 'Flat vector art style, minimalist landscape, rolling hills, calm blue and green palette, no texture, sharp edges --style raw', model: 'Midjourney v6', output: 'Closer to reference intent, but still made autonomous color choices.', next: 'Use output as structural reference only; ignore the generated colors and apply my own predefined palette.' }
    ],
    experiments: [
        { id: 1, title: 'Experiment 1 — Direct AI Generation', what: 'Generated landscape images using AI prompts and considered using them directly in design.', outcome: 'Visually interesting but lacked intentional authorship. The compositions felt arbitrary.', next: 'Test using AI imagery as structural reference while manually vectorizing to regain control.', notes: 'Saved 10 variations, none felt "mine".', tags: 'experiments, AI ethics, prompts', status: 'Done' },
        { id: 2, title: 'Experiment 2 — AI as Reference', what: 'Used AI generated landscapes as reference images and recreated them as vector illustrations.', outcome: 'Preserved more creative control and intentional design decisions. The constraints worked well.', next: 'Introduce strict design constraints (color restrictions, shape simplicity).', notes: 'Vectorizing took 2 hours, but result is highly intentional.', tags: 'experiments, vector design, authorship', status: 'Done' }
    ],
    links: [
        { id: 1, title: 'Milanote Board', desc: 'Visual references and early ideation maps.', url: 'https://milanote.com' },
        { id: 2, title: 'GitHub Repository', desc: 'Source code for this research dashboard.', url: 'https://github.com' },
        { id: 3, title: 'Midjourney Alpha', desc: 'Primary tool for generating structural references.', url: 'https://alpha.midjourney.com' }
    ]
};


// Alpine.js Dashboard Component
document.addEventListener('alpine:init', () => {

    Alpine.data('dashboard', () => ({
        // Bind to existing localStorage key without destroying data
        appData: {},
        activeSection: 'overview',
        modalActive: false,
        modalType: '',
        modalTitle: '',
        
        theme: 'light',
        
        // Form states
        newPrompt: { prompt: '', model: 'Midjourney v6', output: '', next: '' },
        newExperiment: { title: '', what: '', outcome: '', next: '', notes: '', tags: '', status: 'Planned' },
        newLink: { title: '', desc: '', url: '' },
        
        // Search & Filter state
        readingSearch: '',
        promptSearch: '',
        readingFilter: '',
        experimentFilter: '',
        
        // Allowed Tags
        availableTags: ['authorship', 'AI ethics', 'research', 'prompts', 'experiments', 'vector design'],

        init() {
            // Load existing data from legacy localStorage or fallback to default
            const saved = localStorage.getItem('researchDasboardData');
            this.appData = saved ? JSON.parse(saved) : defaultData;
            
            // Load theme
            const savedTheme = localStorage.getItem('dashboardTheme');
            if (savedTheme) {
                this.theme = savedTheme;
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.theme = 'dark';
            }
            // Ensure Alpine state syncs cleanly with what the <head> blocking script just did
            document.documentElement.setAttribute('data-theme', this.theme);
            
            // Migrate legacy statuses seamlessly
            if (this.appData.readings) {
                this.appData.readings.forEach(r => {
                    if (r.status === 'to read') r.status = 'Not Started';
                    if (r.status === 'reading') r.status = 'In Progress';
                    if (r.status === 'annotated' || r.status === 'completed') r.status = 'Completed';
                });
            }
            if (this.appData.experiments) {
                this.appData.experiments.forEach(e => {
                    if (!e.status) e.status = 'Done';
                    if (!e.tags) e.tags = 'experiments';
                });
            }
            
            this.updateActiveSection();
        },

        save() {
            // Save state manually exactly as before
            localStorage.setItem('researchDasboardData', JSON.stringify(this.appData));
        },
        
        // Computed Properties for filtering
        get filteredReadings() {
            if(!this.appData.readings) return [];
            return this.appData.readings.filter(item => {
                const searchTxt = this.readingSearch.toLowerCase();
                const matchesSearch = !searchTxt || (item.title && item.title.toLowerCase().includes(searchTxt)) || (item.notes && item.notes.toLowerCase().includes(searchTxt)) || (item.tags && item.tags.toLowerCase().includes(searchTxt));
                const matchesTag = !this.readingFilter || (item.tags && item.tags.includes(this.readingFilter));
                return matchesSearch && matchesTag;
            });
        },
        
        get filteredPrompts() {
            if(!this.appData.prompts) return [];
            return this.appData.prompts.filter(item => {
                const searchTxt = this.promptSearch.toLowerCase();
                return !searchTxt || (item.prompt && item.prompt.toLowerCase().includes(searchTxt)) || (item.output && item.output.toLowerCase().includes(searchTxt)) || (item.next && item.next.toLowerCase().includes(searchTxt));
            });
        },
        
        get filteredExperiments() {
            if(!this.appData.experiments) return [];
            return this.appData.experiments.filter(item => {
                const matchesTag = !this.experimentFilter || (item.tags && item.tags.includes(this.experimentFilter));
                return matchesTag;
            });
        },

        // Scrollspy Nav Logic
        updateActiveSection() {
            const sections = document.querySelectorAll('section');
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });
            this.activeSection = current;
        },

        // Theme Toggle
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('dashboardTheme', this.theme);
            document.documentElement.setAttribute('data-theme', this.theme);
        },

        // Modal Logic
        openModal(type) {
            this.modalType = type;
            this.modalActive = true;
            if (type === 'prompt') this.modalTitle = 'Add Prompt Entry';
            if (type === 'experiment') this.modalTitle = 'Add Experiment';
            if (type === 'link') this.modalTitle = 'Add Link';
        },
        closeModal() {
            this.modalActive = false;
        },

        // Submission Logic
        submitPrompt() {
            this.appData.prompts.unshift({ id: Date.now(), ...this.newPrompt });
            this.save();
            this.newPrompt = { prompt: '', model: 'Midjourney v6', output: '', next: '' };
            this.closeModal();
        },
        submitExperiment() {
            this.appData.experiments.push({ id: Date.now(), ...this.newExperiment });
            this.save();
            this.newExperiment = { title: '', what: '', outcome: '', next: '', notes: '', tags: '', status: 'Planned' };
            this.closeModal();
        },
        submitLink() {
            this.appData.links.push({ id: Date.now(), ...this.newLink });
            this.save();
            this.newLink = { title: '', desc: '', url: '' };
            this.closeModal();
        }
    }));

});
