const storedTheme = localStorage.getItem('theme') || 'light';
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

let effectiveTheme = storedTheme;
if (storedTheme === 'system') {
  effectiveTheme = systemDark ? 'dark' : 'light';
}

document.documentElement.setAttribute('data-theme', effectiveTheme);
console.log(document.documentElement.getAttribute('data-theme')); 
// log for debuugging

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem('theme') === 'system') {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});