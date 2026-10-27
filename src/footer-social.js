const social = document.createElement('div')
social.className = 'wrap footer-social'
social.innerHTML = `
  <h2>Follow RESILIACT</h2>
  <div class="footer-social-icons">
    <a class="footer-social-link" href="https://www.linkedin.com/company/137164535" target="_blank" rel="noopener noreferrer" aria-label="RESILIACT on LinkedIn (opens in a new tab)">
      <span class="footer-social-icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.99 0 3.58 1.97 3.58 4.53v5.24Z"/></svg></span>
      <span>LinkedIn</span>
    </a>
    <span class="footer-social-placeholder" aria-label="YouTube — coming soon">
      <span class="footer-social-icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.55 3.6 12 3.6 12 3.6s-7.55 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.06 0 12 0 12s0 3.94.5 5.8a3 3 0 0 0 2.1 2.1c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.94 24 12 24 12s0-3.94-.5-5.8ZM9.6 15.6V8.4l6.23 3.6-6.23 3.6Z"/></svg></span>
      <span>YouTube <small>Coming soon</small></span>
    </span>
  </div>`
document.querySelector('.footer-bottom').before(social)
