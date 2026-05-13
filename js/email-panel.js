  // ── Email detail panel ──
  var currentEmailIdx = 0;
  var emailPanelJustOpened = false;
  var emailAccessPopoverOpen = false;
  var edpSharePopoverOpen = false;

  var WORKSPACE_SENDERS = ['Tom Bradley', 'Amanda Chen'];

  function isWorkspaceSender(name) {
    return WORKSPACE_SENDERS.indexOf(name) !== -1;
  }

  function renderEmailThread(idx) {
    var d = emailData[idx];
    var html = '';
    var lastIdx = d.threads.length - 1;

    for (var i = 0; i < d.threads.length; i++) {
      var msg = d.threads[i];
      var isLast = i === lastIdx;
      var isSent = isWorkspaceSender(msg.senderName);
      var stateClass = isLast ? 'edp-thread-msg--expanded' : 'edp-thread-msg--collapsed';

      html += '<div class="edp-thread-msg ' + stateClass + '" onclick="toggleThreadMsg(this)">';

      // Header row
      html += '<div class="edp-thread-msg-header">';
      html += '<div class="user-avatar avatar-xs" style="background-image:url(\'' + msg.senderAvatar + '\');flex-shrink:0;"></div>';
      html += '<div class="edp-thread-msg-meta">';

      // Sender name + SENT badge
      html += '<div class="edp-thread-msg-name-row">';
      html += '<span class="edp-thread-msg-sender">' + msg.senderName + '</span>';
      if (isSent) html += '<span class="edp-thread-msg-sent-badge">SENT</span>';
      html += '</div>';

      // "to …" row — only in last (expanded) message
      if (isLast && msg.to) {
        var primaryTo = msg.to.split(',')[0].trim();
        html += '<div class="edp-thread-msg-to-row">';
        html += '<span class="edp-thread-msg-to">to ' + primaryTo + '</span>';
        html += '</div>';
      }

      html += '</div>'; // end meta
      html += '<span class="edp-thread-msg-date">' + msg.date + '</span>';

      // Per-message action buttons
      html += '<div class="edp-thread-msg-actions" onclick="event.stopPropagation()">';
      html += '<button class="edp-thread-msg-action-btn" data-tooltip="Reply" onclick="openInlineComposer(\'reply\')">' + SVG_REPLY + '</button>';
      html += '<button class="edp-thread-msg-action-btn" data-tooltip="Reply all" onclick="openInlineComposer(\'replyall\')">' + SVG_REPLY_ALL + '</button>';
      html += '<button class="edp-thread-msg-action-btn" data-tooltip="Forward" onclick="openInlineComposer(\'forward\')">' + SVG_FORWARD + '</button>';
      html += '</div>';

      // Chevron
      html += '<svg class="edp-thread-msg-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 1l4 4 4-4"/></svg>';
      html += '</div>'; // end header

      // Snippet (hidden via CSS when expanded)
      html += '<div class="edp-thread-msg-snip-row">' + (msg.snip || '') + '</div>';

      // Body (hidden via CSS when collapsed)
      html += '<div class="edp-thread-msg-body" onclick="event.stopPropagation()">' + (msg.body || '') + '</div>';

      html += '</div>'; // end thread-msg
    }

    document.getElementById('edp-body').innerHTML = html;
  }

  function toggleThreadMsg(el) {
    var isExpanded = el.classList.contains('edp-thread-msg--expanded');
    if (isExpanded) {
      el.classList.remove('edp-thread-msg--expanded');
      el.classList.add('edp-thread-msg--collapsed');
    } else {
      el.classList.remove('edp-thread-msg--collapsed');
      el.classList.add('edp-thread-msg--expanded');
    }
  }

  function renderEmailComments(idx) {
    var d = emailData[idx];
    var comments = d.comments || [];
    var displayEl = document.getElementById('edp-comments-display');
    if (!displayEl) return;
    var html = '';
    for (var i = 0; i < comments.length; i++) {
      var c = comments[i];
      html += '<div class="edp-comment-item">';
      html += '<div class="user-avatar avatar-xs" style="background-image:url(\'' + c.avatar + '\');flex-shrink:0;margin-top:2px;"></div>';
      html += '<div class="edp-comment-bubble">';
      html += '<div class="edp-comment-author">' + c.author + '</div>';
      html += '<div class="edp-comment-text">' + c.text + '</div>';
      html += '<div class="edp-comment-time">' + c.time + '</div>';
      html += '</div></div>';
    }
    displayEl.innerHTML = html;
  }

  function openEmailPanel(idx) {
    var d = emailData[idx];
    currentEmailIdx = idx;
    var panel = document.getElementById('email-detail-panel');
    panel.classList.remove('compose-mode');

    document.getElementById('edp-subject').textContent = d.subject;
    renderEmailThread(idx);
    renderEmailComments(idx);

    if (typeof hideInlineComposer === 'function') hideInlineComposer();

    panel.classList.add('open');
    emailPanelJustOpened = true;
  }

  function closeEmailPanel() {
    var icBody = document.getElementById('edp-ic-body');
    var composer = document.getElementById('edp-inline-composer');
    if (composer && composer.style.display !== 'none' && icBody && icBody.innerText.trim().length > 0) {
      if (!confirm('Discard this draft?')) return;
    }
    var panel = document.getElementById('email-detail-panel');
    panel.classList.remove('open');
    panel.classList.remove('compose-mode');
    if (typeof hideInlineComposer === 'function') hideInlineComposer();
  }

  // Legacy stubs
  function openReply() { if (typeof openInlineComposer === 'function') openInlineComposer('reply'); }
  function clearReply() {}
  function discardDraft() { closeEmailPanel(); }
  function submitNoteFromTab() {}
  function switchComposeTab() {}
  function generateWithAI() {}
  function cancelAI() {}
  function toggleSharePopover() {}
  function toggleShareAccessLevel() {}

  // Toggle recipients popover (kept for backwards compat — not used in new threading)
  function toggleRecipients(msgIdx) {}

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.add-btn-wrap')) {
      document.getElementById('add-activity-menu').classList.remove('open');
    }
    if (!e.target.closest('.email-dots-wrap')) {
      if (typeof emailDotsMenuOpen !== 'undefined' && emailDotsMenuOpen) {
        emailDotsMenuOpen = false;
        var dotsMenu = document.getElementById('email-dots-menu');
        if (dotsMenu) dotsMenu.style.display = 'none';
      }
      if (emailAccessPopoverOpen) {
        emailAccessPopoverOpen = false;
        var accessPopover = document.getElementById('email-access-popover');
        if (accessPopover) accessPopover.style.display = 'none';
      }
    }
    // Close email detail panel when clicking outside it
    if (emailPanelJustOpened) {
      emailPanelJustOpened = false;
    } else {
      var panel = document.getElementById('email-detail-panel');
      if (panel && panel.classList.contains('open') && !e.target.closest('#email-detail-panel')) {
        closeEmailPanel();
      }
    }
  });
