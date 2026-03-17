// Define Seed Data Structure for Alpine Component
const defaultData = {
    readings: [
        { id: 1, title: 'Artificial Knowing', author: 'Alison Adam', type: 'Book', link: '#', tags: 'authorship, AI ethics', status: 'reading', notes: 'Explores the implications of AI on subjective knowledge.' },
        { id: 2, title: 'The Designer As Author', author: 'Michael Rock', type: 'Article', link: '#', tags: 'design theory, authorship', status: 'annotated', notes: 'Crucial reading to understand traditional concepts of authorship before applying it to AI.' }
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
        { id: 1, title: 'Experiment 1 — Direct AI Generation', what: 'Generated landscape images using AI prompts and considered using them directly in design.', outcome: 'Visually interesting but lacked intentional authorship. The compositions felt arbitrary.', next: 'Test using AI imagery as structural reference while manually vectorizing to regain control.', notes: 'Saved 10 variations, none felt "mine".' },
        { id: 2, title: 'Experiment 2 — AI as Reference', what: 'Used AI generated landscapes as reference images and recreated them as vector illustrations.', outcome: 'Preserved more creative control and intentional design decisions. The constraints worked well.', next: 'Introduce strict design constraints (color restrictions, shape simplicity).', notes: 'Vectorizing took 2 hours, but result is highly intentional.' }
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
        
        // Form states
        newPrompt: { prompt: '', model: 'Midjourney v6', output: '', next: '' },
        newExperiment: { title: '', what: '', outcome: '', next: '', notes: '' },
        newLink: { title: '', desc: '', url: '' },

        init() {
            // Load existing data from legacy localStorage or fallback to default
            const saved = localStorage.getItem('researchDasboardData');
            this.appData = saved ? JSON.parse(saved) : defaultData;
            this.updateActiveSection();
        },

        save() {
            // Save state manually exactly as before
            localStorage.setItem('researchDasboardData', JSON.stringify(this.appData));
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
            this.newExperiment = { title: '', what: '', outcome: '', next: '', notes: '' };
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
