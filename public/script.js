document.addEventListener('DOMContentLoaded', function() {
    var STORAGE_KEY = 'cotor-issue-board';

    var newIssueBtn = document.getElementById('new-issue-btn');
    var issueForm = document.getElementById('issue-form');
    var cancelIssueBtn = document.getElementById('cancel-issue-btn');
    var issueCreateForm = document.getElementById('issue-create-form');
    var issuesList = document.getElementById('issues-list');
    var emptyState = document.getElementById('empty-state');
    var issueCountEl = document.getElementById('issue-count');
    var notificationArea = document.getElementById('notification-area');
    var titleInput = document.getElementById('issue-title');
    var descriptionInput = document.getElementById('issue-description');
    var titleError = document.getElementById('title-error');
    var descriptionError = document.getElementById('description-error');

    function loadIssues() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveIssues(issues) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
        } catch (e) {}
    }

    function updateCount() {
        var count = issuesList.querySelectorAll('.issue-item').length;
        if (issueCountEl) {
            issueCountEl.textContent = count + ' issue' + (count !== 1 ? 's' : '');
        }
    }

    function toggleEmptyState() {
        var hasIssues = issuesList.querySelectorAll('.issue-item').length > 0;
        if (emptyState) {
            emptyState.style.display = hasIssues ? 'none' : 'block';
        }
        updateCount();
    }

    function announce(message) {
        notificationArea.textContent = '';
        requestAnimationFrame(function() {
            notificationArea.textContent = message;
        });
    }

    function showForm() {
        issueForm.style.display = 'block';
        newIssueBtn.setAttribute('aria-expanded', 'true');
        titleInput.focus();
    }

    function hideForm() {
        issueForm.style.display = 'none';
        newIssueBtn.setAttribute('aria-expanded', 'false');
        issueCreateForm.reset();
        titleError.textContent = '';
        descriptionError.textContent = '';
        titleInput.removeAttribute('aria-invalid');
        descriptionInput.removeAttribute('aria-invalid');
        newIssueBtn.focus();
    }

    function validateField(input, errorEl, message) {
        if (!input.value.trim()) {
            errorEl.textContent = message;
            input.setAttribute('aria-invalid', 'true');
            return false;
        }
        errorEl.textContent = '';
        input.removeAttribute('aria-invalid');
        return true;
    }

    function makeIssueItem(id, title, description, priority, createdAt) {
        var item = document.createElement('div');
        item.className = 'issue-item';
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Issue: ' + title + ', Priority: ' + priority);
        item.dataset.issueId = id;

        item.innerHTML = '\n                <div class="issue-item-header">\n                    <h4>' + escapeHtml(title) + '</h4>\n                    <button type="button" class="delete-issue-btn" aria-label="Delete issue: ' + escapeHtml(title) + '">\n                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">\n                            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\n                        </svg>\n                    </button>\n                </div>\n                <div class="issue-meta">\n                    <span>Priority: ' + priority + '</span>\n                    <span>Created: ' + createdAt + '</span>\n                </div>\n                <p class="issue-description">' + escapeHtml(description) + '</p>\n            ';

        function selectIssue() {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
                item.removeAttribute('aria-current');
            } else {
                document.querySelectorAll('.issue-item').forEach(function(el) {
                    el.classList.remove('selected');
                    el.removeAttribute('aria-current');
                });
                item.classList.add('selected');
                item.setAttribute('aria-current', 'true');
            }
        }

        item.addEventListener('click', function(e) {
            if (e.target.closest('.delete-issue-btn')) return;
            selectIssue();
        });

        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectIssue();
            }
        });

        var deleteBtn = item.querySelector('.delete-issue-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteIssue(id, item);
            });
        }

        return item;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function deleteIssue(id, item) {
        var issues = loadIssues();
        var idx = issues.findIndex(function(i) { return i.id === id; });
        if (idx !== -1) {
            var title = issues[idx].title;
            issues.splice(idx, 1);
            saveIssues(issues);
            item.remove();
            toggleEmptyState();
            announce('Issue deleted: ' + title);
        }
    }

    function renderIssues() {
        issuesList.innerHTML = '';
        var issues = loadIssues();
        issues.forEach(function(issue) {
            var item = makeIssueItem(issue.id, issue.title, issue.description, issue.priority, issue.createdAt);
            issuesList.appendChild(item);
        });
        toggleEmptyState();
    }

    renderIssues();

    if (newIssueBtn) {
        newIssueBtn.addEventListener('click', function() {
            if (issueForm.style.display === 'none' || issueForm.style.display === '') {
                showForm();
            } else {
                hideForm();
            }
        });
    }

    if (cancelIssueBtn) {
        cancelIssueBtn.addEventListener('click', hideForm);
    }

    if (issueCreateForm) {
        issueCreateForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var titleValid = validateField(titleInput, titleError, 'Title is required.');
            var descValid = validateField(descriptionInput, descriptionError, 'Description is required.');

            if (!titleValid || !descValid) {
                if (!titleValid) titleInput.focus();
                return;
            }

            var title = titleInput.value.trim();
            var description = descriptionInput.value.trim();
            var priority = document.getElementById('issue-priority').value;
            var createdAt = new Date().toLocaleString();
            var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

            var issues = loadIssues();
            issues.unshift({ id: id, title: title, description: description, priority: priority, createdAt: createdAt });
            saveIssues(issues);

            var issueItem = makeIssueItem(id, title, description, priority, createdAt);
            issuesList.insertBefore(issueItem, issuesList.firstChild);

            hideForm();
            toggleEmptyState();
            announce('Issue created successfully: ' + title);
        });
    }

    titleInput.addEventListener('blur', function() {
        validateField(titleInput, titleError, 'Title is required.');
    });

    descriptionInput.addEventListener('blur', function() {
        validateField(descriptionInput, descriptionError, 'Description is required.');
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });
});
