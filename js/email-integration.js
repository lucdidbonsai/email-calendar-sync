  // ── Calendar/Email connection flow ──
  var calendarConnected = false;

  function openCalendarSettingsModal(provider) {
    document.getElementById('modal-calendar-settings').classList.remove('hidden');
  }

  function closeCalendarSettingsModal() {
    document.getElementById('modal-calendar-settings').classList.add('hidden');
    if (!calendarConnected) {
      // If not yet connected, show setup-required in emails tab
      var disconnected = document.getElementById('email-disconnected-state');
      var connected = document.getElementById('email-connected-state');
      if (disconnected && (disconnected.style.display !== 'none') || (connected && connected.style.display === 'none')) {
        if (disconnected) disconnected.style.display = 'none';
        var setupRequired = document.getElementById('email-setup-required-state');
        if (setupRequired) setupRequired.style.display = '';
      }
    }
  }

  function selectCalVisOption(el) {
    var options = document.querySelectorAll('#modal-calendar-settings .vis-option');
    options.forEach(function(o) { o.classList.remove('vis-option--selected'); });
    el.classList.add('vis-option--selected');
  }

  function saveCalendarSettings() {
    document.getElementById('modal-calendar-settings').classList.add('hidden');
    calendarConnected = true;

    // Dismiss the sync banner
    var banner = document.getElementById('sync-calendar-banner');
    if (banner) banner.style.display = 'none';

    // Show upcoming events section in activity tab
    var upcoming = document.getElementById('upcoming-events-section');
    if (upcoming) upcoming.style.display = '';

    // Switch activity feed to connected state
    var feedDisconnected = document.getElementById('activity-feed-disconnected');
    var feedConnected = document.getElementById('activity-feed-connected');
    if (feedDisconnected) feedDisconnected.style.display = 'none';
    if (feedConnected) feedConnected.style.display = '';

    // Activate emails tab connected state
    showEmailConnected(true);

    // Show success toast
    showToast('Successfully connected Google account.');
  }

  function dismissSyncBanner() {
    var banner = document.getElementById('sync-calendar-banner');
    if (banner) banner.style.display = 'none';
  }

  function toggleUpcomingSection() {
    var list = document.getElementById('upcoming-events-list');
    var chevron = document.getElementById('upcoming-chevron');
    if (list.style.display === 'none') {
      list.style.display = '';
      chevron.classList.remove('collapsed');
    } else {
      list.style.display = 'none';
      chevron.classList.add('collapsed');
    }
  }

  function showEmailConnected(withThreads) {
    var disconnected = document.getElementById('email-disconnected-state');
    var setupRequired = document.getElementById('email-setup-required-state');
    var connected = document.getElementById('email-connected-state');
    var emptyState = document.getElementById('email-empty-state');
    var threadList = document.getElementById('email-thread-list');
    if (disconnected) disconnected.style.display = 'none';
    if (setupRequired) setupRequired.style.display = 'none';
    if (connected) connected.style.display = 'block';
    if (emptyState) emptyState.style.display = withThreads ? 'none' : '';
    if (threadList) threadList.style.display = withThreads ? '' : 'none';
  }

  function disconnectEmail() {
    calendarConnected = false;
    var emailDotsMenu = document.getElementById('email-dots-menu');
    if (emailDotsMenu) emailDotsMenu.style.display = 'none';
    var disconnected = document.getElementById('email-disconnected-state');
    var setupRequired = document.getElementById('email-setup-required-state');
    var connected = document.getElementById('email-connected-state');
    if (disconnected) disconnected.style.display = '';
    if (setupRequired) setupRequired.style.display = 'none';
    if (connected) connected.style.display = 'none';
  }

  // ── Calendar event detail modal ──
  function openCalEventModal(title, time, participants) {
    var titleEl = document.getElementById('cal-event-modal-title');
    var timeEl = document.getElementById('cal-event-modal-time');
    if (titleEl) titleEl.textContent = title;
    if (timeEl) timeEl.innerHTML = time;
    document.getElementById('modal-cal-event').classList.remove('hidden');
  }

  function closeCalEventModal() {
    document.getElementById('modal-cal-event').classList.add('hidden');
  }

  // ── Email three-dot menu ──
  var emailDotsMenuOpen = false;

  function toggleEmailDotsMenu(e) {
    e.stopPropagation();
    emailDotsMenuOpen = !emailDotsMenuOpen;
    document.getElementById('email-dots-menu').style.display = emailDotsMenuOpen ? 'block' : 'none';
  }

  function openEmailSyncSettings() {
    document.getElementById('email-dots-menu').style.display = 'none';
    emailDotsMenuOpen = false;
    openCalendarSettingsModal('google');
  }

  function openComposePanel() {
    var panel = document.getElementById('email-detail-panel');
    if (!panel) return;
    panel.classList.add('compose-mode');
    panel.classList.add('open');
    document.querySelector('.edp-top-bar-label').textContent = 'Compose Email';
    document.getElementById('edp-compose-to').value = '';
    document.getElementById('edp-compose-subject').value = '';
    document.getElementById('edp-compose-body').innerHTML = '';
    setTimeout(function() { document.getElementById('edp-compose-to').focus(); }, 50);
    emailPanelJustOpened = true;
  }

  // Close modals on overlay click
  document.getElementById('modal-integration').addEventListener('click', function(e) {
    if (e.target === this) closeIntegModal();
  });
  document.getElementById('modal-calendar-settings').addEventListener('click', function(e) {
    if (e.target === this) closeCalendarSettingsModal();
  });

  // Legacy stubs
  function closeIntegModal() { document.getElementById('modal-integration').classList.add('hidden'); }
  function closeIntegTab() {}
  function switchIntegTab() {}
  function selectSharingOption() {}
  function saveIntegrationSettings() {}
  function connectEmail() { openCalendarSettingsModal('google'); }
  function openConnectGmailModal() { openCalendarSettingsModal('google'); }
  function closeConnectGmailModal() {}
  function proceedToOAuth() { saveCalendarSettings(); }
  function openVisibilitySettingsModal() { openCalendarSettingsModal('google'); }
  function closeVisibilitySettingsModal() { closeCalendarSettingsModal(); }
  function saveVisibilitySettings() { saveCalendarSettings(); }
  function selectVisOption(el) { selectCalVisOption(el); }

  // Escape key closes open modals
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    var sendModal = document.getElementById('modal-send-email');
    var calModal = document.getElementById('modal-calendar-settings');
    var calEventModal = document.getElementById('modal-cal-event');
    if (sendModal && !sendModal.classList.contains('hidden')) { closeSendEmailModal(); return; }
    if (calModal && !calModal.classList.contains('hidden')) { closeCalendarSettingsModal(); return; }
    if (calEventModal && !calEventModal.classList.contains('hidden')) { closeCalEventModal(); return; }
  });
