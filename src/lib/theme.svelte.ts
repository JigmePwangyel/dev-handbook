type Theme = 'light' | 'dark';

class ThemeState {
  current = $state<Theme>('light');

  /** Read the theme the inline script in app.html already applied. */
  init() {
    this.current = document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';
  }

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset['theme'] = this.current;
    try {
      localStorage.setItem('theme', this.current);
    } catch {}
  }
}

export const theme = new ThemeState();
