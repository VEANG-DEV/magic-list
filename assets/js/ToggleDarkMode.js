export class ToggleTheme {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.toggleButton = document.getElementById('toggleDarkMode');
        this.init();
    }
    
    init() {
        this.setTheme();
        this.toggleButton.addEventListener('click', () => this.toggle());
    }
    
    setTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
    
    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        if(this.theme === 'dark') {
            document.body.style.backgroundColor = 'white !important';
            document.body.style.color = 'black !important';
        }
        this.setTheme();
    }
}