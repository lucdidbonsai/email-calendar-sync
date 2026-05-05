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

    // Show past calendar event items in activity feed
    document.querySelectorAll('.cal-event-activity-item').forEach(function(el) { el.style.display = 'flex'; });

    // Activate emails tab connected state
    showEmailConnected(true);

    // Show success toast
    showToast('Successfully connected Google account.');
  }

  function dismissSyncBanner() {
    var banner = document.getElementById('sync-calendar-banner');
    if (banner) banner.style.display = 'none';
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

  // ── Meeting overlay modal ──
  var pastMeetingData = {
    1: {
      day: 'Mon', date: '20', month: 'Jan',
      title: 'Strategic Planning Offsite',
      time: 'Jan 20 · 9:00 AM → 10:00 AM',
      duration: '1h',
      description: 'Q1 strategic planning session to review competitive landscape, align on TAM estimates for the enterprise segment, and set delivery priorities for the TechStart Labs engagement.',
      link: 'https://meet.google.com/spo-nfst-jan',
      recording: 'https://zoom.us/rec/share/strategic-planning-offsite-jan20',
      noteTitle: 'Zoom AI: Strategic Planning Offsite',
      participants: [
        { name: 'Chris Taylor', email: 'chris.taylor@hellobonsai.com', img: 'https://ui-avatars.com/api/?name=CT&size=250&background=4c525a&color=ffffff&format=png', role: 'Host' },
        { name: 'Michael Fawler', email: 'michael.fawler@techstart.co', img: 'https://ui-avatars.com/api/?name=MF&size=250&background=4c525a&color=ffffff&format=png', role: '' }
      ]
    },
    2: {
      day: 'Tue', date: '13', month: 'Jan',
      title: 'Product Demo – Enterprise Plan',
      time: 'Jan 13 · 4:00 PM → 5:00 PM',
      duration: '1h',
      description: 'Live demonstration of Bonsai\'s enterprise plan features — automation workflows, CRM integrations, and reporting — for Michael Fawler ahead of contract sign-off.',
      link: 'https://meet.google.com/pde-ent-jan13',
      recording: 'https://zoom.us/rec/share/product-demo-enterprise-jan13',
      noteTitle: 'Zoom AI: Product Demo – Enterprise Plan',
      participants: [
        { name: 'Chris Taylor', email: 'chris.taylor@hellobonsai.com', img: 'https://ui-avatars.com/api/?name=CT&size=250&background=4c525a&color=ffffff&format=png', role: 'Host' },
        { name: 'Michael Fawler', email: 'michael.fawler@techstart.co', img: 'https://ui-avatars.com/api/?name=MF&size=250&background=4c525a&color=ffffff&format=png', role: '' }
      ]
    },
    10: {
      day: 'Mon', date: '14', month: 'Apr',
      title: 'Q1 Strategy Review – TechStart Labs',
      time: 'Today · 2:00 PM → 3:00 PM',
      duration: '1h',
      description: 'Quarterly strategy review with TechStart Labs to align on Q1 deliverables, progress against OKRs, and roadmap priorities for the upcoming quarter.',
      link: 'https://zoom.us/j/92345678901',
      recording: null,
      upcoming: true,
      participants: [
        { name: 'Tom Bradley', email: 'tom.bradley@catalystconsulting.io', img: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Host' },
        { name: 'Michael Fawler', email: 'michael.fawler@techstart.co', img: 'https://ui-avatars.com/api/?name=MF&size=250&background=4c525a&color=ffffff&format=png', role: '' },
        { name: 'Lucas Did', email: 'lucas.did@hellobonsai.com', img: 'https://ui-avatars.com/api/?name=LD&size=250&background=4c525a&color=ffffff&format=png', role: '' }
      ]
    },
    11: {
      day: 'Thu', date: '17', month: 'Apr',
      title: 'Brand Refresh – Mood Board Review',
      time: 'Thu Apr 17 · 10:00 AM → 11:30 AM',
      duration: '1h 30m',
      description: 'Review of initial mood board concepts and visual direction for the brand refresh project, focusing on color palette, typography, and imagery style.',
      link: 'https://zoom.us/j/83456789012',
      recording: null,
      upcoming: true,
      participants: [
        { name: 'Amanda Chen', email: 'amanda.chen@catalystconsulting.io', img: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'Host' },
        { name: 'Michael Fawler', email: 'michael.fawler@techstart.co', img: 'https://ui-avatars.com/api/?name=MF&size=250&background=4c525a&color=ffffff&format=png', role: '' }
      ]
    },
    12: {
      day: 'Fri', date: '18', month: 'Apr',
      title: 'Market Entry Strategy – Final Review',
      time: 'Fri Apr 18 · 3:30 PM → 4:00 PM',
      duration: '30m',
      description: 'Final review of the market entry strategy deliverable before submission. Sign-off on enterprise segment recommendations and go-to-market plan.',
      link: 'https://zoom.us/j/74567890123',
      recording: null,
      upcoming: true,
      participants: [
        { name: 'Tom Bradley', email: 'tom.bradley@catalystconsulting.io', img: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Host' },
        { name: 'Chris Taylor', email: 'chris.taylor@hellobonsai.com', img: 'https://ui-avatars.com/api/?name=CT&size=250&background=4c525a&color=ffffff&format=png', role: '' },
        { name: 'Michael Fawler', email: 'michael.fawler@techstart.co', img: 'https://ui-avatars.com/api/?name=MF&size=250&background=4c525a&color=ffffff&format=png', role: '' }
      ]
    }
  };

  function openMeetingOverlay(id) {
    var m = pastMeetingData[id];
    if (!m) return;

    var participantsHTML = m.participants.map(function(p) {
      return '<div class="mom-participant-row">' +
        '<div class="mom-participant-avatar" style="background-image:url(\'' + p.img + '\');"></div>' +
        '<span class="mom-participant-name">' + p.name + '</span>' +
        '<span class="mom-participant-email">' + p.email + '</span>' +
        (p.role ? '<span class="mom-participant-role">' + p.role + '</span>' : '') +
        (!m.upcoming ? '<span class="mom-participant-status"><span class="mom-participant-status-dot"></span>Attended</span>' : '') +
        '</div>';
    }).join('');

    var badgeHTML = m.upcoming
      ? '<div class="mom-attended-badge">Upcoming</div>'
      : '<div class="mom-attended-badge"><span class="mom-attended-dot"></span>Attended</div>';

    var metaSectionHTML = '<div class="mom-section">' +
        '<div class="mom-meta-row">' +
          '<span class="mom-meta-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>' +
          '<span>' + m.time + '</span>' +
          '<span class="mom-duration">(' + m.duration + ')</span>' +
        '</div>' +
        '<div class="mom-meta-row">' +
          '<span class="mom-meta-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>' +
          '<span class="mom-description">' + m.description + '</span>' +
        '</div>' +
        (m.link && !m.upcoming ? '<div class="mom-meta-row">' +
          '<span class="mom-meta-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>' +
          '<a class="mom-link" href="' + m.link + '" target="_blank">' + m.link + '</a>' +
        '</div>' : '') +
      '</div>';

    var recordingSectionHTML = (m.recording || m.noteTitle)
      ? '<div class="mom-section">' +
          '<div class="mom-section-label">Assets</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
          (m.recording
            ? '<a class="mom-recording-chip" href="' + m.recording + '" target="_blank">' +
                '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>' +
                'Recording' +
                '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
              '</a>'
            : '') +
          (m.noteTitle
            ? '<button class="mom-note-chip">' +
                '<svg width="12" height="12" viewBox="0 0 20 22" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 0C1.34315 0 0 1.34315 0 3V19C0 20.6569 1.34315 22 3 22H17C18.6569 22 20 20.6569 20 19V7.82843C20 7.03278 19.6839 6.26972 19.1213 5.70711L14.2929 0.878679C13.7303 0.316071 12.9672 0 12.1716 0H3ZM2 3C2 2.44772 2.44772 2 3 2H11V7C11 8.10457 11.8954 9 13 9H18V19C18 19.5523 17.5523 20 17 20H3C2.44772 20 2 19.5523 2 19V3ZM17.5858 7H13V2.41421L17.5858 7ZM5 12C5 11.4477 5.44772 11 6 11H14C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13H6C5.44772 13 5 12.5523 5 12ZM6 15C5.44772 15 5 15.4477 5 16C5 16.5523 5.44772 17 6 17H10C10.5523 17 11 16.5523 11 16C11 15.4477 10.5523 15 10 15H6Z" fill="currentColor"/></svg>' +
                'Note' +
              '</button>'
            : '') +
          '</div>' +
        '</div>'
      : '';

    document.getElementById('meeting-overlay-dialog').innerHTML =
      '<div class="mom-header">' +
        '<div class="mom-date-block">' +
          '<span class="mom-date-day">' + m.day + '</span>' +
          '<span class="mom-date-num">' + m.date + '</span>' +
        '</div>' +
        '<div class="mom-header-main">' +
          '<div class="mom-title">' + m.title + '</div>' +
          badgeHTML +
        '</div>' +
      '</div>' +
      metaSectionHTML +
      recordingSectionHTML +
      (m.upcoming && m.link
        ? '<div class="mom-section" style="border-bottom:none;">' +
            '<a class="mom-join-btn" href="' + m.link + '" target="_blank" onclick="event.stopPropagation();">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>' +
              'Join Meeting' +
            '</a>' +
          '</div>'
        : '') +
      '<div class="mom-section">' +
        '<div class="mom-section-label">Participants ' + m.participants.length + '</div>' +
        participantsHTML +
      '</div>';

    document.getElementById('meeting-overlay-modal').classList.remove('hidden');
  }

  function closeMeetingOverlay() {
    document.getElementById('meeting-overlay-modal').classList.add('hidden');
  }

  function openCalendarEventDrawer(id) {
    var m = pastMeetingData[id];
    if (!m) return;

    document.getElementById('ced-kind-label').textContent = m.upcoming ? 'Upcoming meeting' : 'Past meeting';

    var badgeClass = m.upcoming ? 'ced-status-badge--upcoming' : 'ced-status-badge--past';
    var badgeDotColor = m.upcoming ? '#5db6f8' : '#22AD01';
    var badgeLabel = m.upcoming ? 'Upcoming' : 'Attended';

    var videoSVG = '<svg width="13" height="13" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="1" width="9" height="10" rx="1.5"/><path d="M10 5l5-3v8l-5-3"/></svg>';
    var clockSVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    var alignSVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="21" y1="18" x2="9" y2="18"/></svg>';
    var linkSVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';

    var joinHTML = (m.upcoming && m.link)
      ? '<a class="ced-join-btn" href="' + m.link + '" target="_blank" onclick="event.stopPropagation();">' +
          videoSVG + 'Join meeting' +
        '</a>'
      : '';

    var linkHTML = m.link
      ? '<div class="ced-field">' +
          '<span class="ced-field-icon">' + linkSVG + '</span>' +
          '<div><div class="ced-field-label">Meeting link</div>' +
          '<div class="ced-field-value ced-field-value--link">' + m.link + '</div></div>' +
        '</div>'
      : '';

    var participantsHTML = m.participants.map(function(p) {
      return '<div class="ced-participant-row">' +
        '<div class="ced-participant-avatar" style="background-image:url(\'' + p.img + '\');"></div>' +
        '<div class="ced-participant-info">' +
          '<div class="ced-participant-name">' + p.name + '</div>' +
          '<div class="ced-participant-email">' + p.email + '</div>' +
        '</div>' +
        (p.role ? '<span class="ced-participant-role">' + p.role + '</span>' : '') +
        (!m.upcoming ? '<span class="ced-participant-attended"><span class="ced-participant-attended-dot"></span> Attended</span>' : '') +
      '</div>';
    }).join('');

    document.getElementById('ced-body').innerHTML =
      '<div class="ced-title-block">' +
        '<div class="ced-date-widget">' +
          '<div class="ced-date-widget-day">' + (m.day || '') + '</div>' +
          '<div class="ced-date-widget-num">' + m.date + '</div>' +
          '<div class="ced-date-widget-month">' + (m.month || '') + '</div>' +
        '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div class="ced-event-title">' + m.title + '</div>' +
          '<div class="ced-event-time">' + m.time + ' &middot; ' + m.duration + '</div>' +
          '<div class="ced-status-badge ' + badgeClass + '">' +
            '<span class="ced-status-dot" style="background:' + badgeDotColor + ';"></span>' +
            badgeLabel +
          '</div>' +
        '</div>' +
      '</div>' +
      joinHTML +
      '<div class="ced-field">' +
        '<span class="ced-field-icon">' + alignSVG + '</span>' +
        '<div><div class="ced-field-label">Description</div>' +
        '<div class="ced-field-value">' + m.description + '</div></div>' +
      '</div>' +
      linkHTML +
      '<div class="ced-section-label">Participants <span style="color:#c0c4c6;font-weight:400;">' + m.participants.length + '</span></div>' +
      participantsHTML;

    document.getElementById('outer-wrapper').classList.add('cal-drawer-open');
    document.getElementById('cal-event-drawer').classList.add('open');
  }

  function closeCalendarEventDrawer() {
    document.getElementById('outer-wrapper').classList.remove('cal-drawer-open');
    document.getElementById('cal-event-drawer').classList.remove('open');
  }

  function handleMeetingOverlayClick(e) {
    if (e.target === document.getElementById('meeting-overlay-modal')) {
      closeMeetingOverlay();
    }
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
    var meetingModal = document.getElementById('meeting-overlay-modal');
    if (sendModal && !sendModal.classList.contains('hidden')) { closeSendEmailModal(); return; }
    if (calModal && !calModal.classList.contains('hidden')) { closeCalendarSettingsModal(); return; }
    if (meetingModal && !meetingModal.classList.contains('hidden')) { closeMeetingOverlay(); return; }
  });
