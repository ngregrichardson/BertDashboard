// Create an alias for theme-related DOM objects
ui.theme = {
    select: document.getElementById('theme-select'),
    link: document.getElementById('theme-link')
};

// When theme selection is made, turn on that theme
ui.theme.select.onchange = function() {
  ui.theme.select.value = this.value;
  ui.theme.link.href = 'css/' + this.value + '.css';
};
