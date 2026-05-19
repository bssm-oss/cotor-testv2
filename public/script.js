document.addEventListener('DOMContentLoaded', function() {
    const newIssueBtn = document.getElementById('new-issue-btn');
    const issueForm = document.getElementById('issue-form');
    const cancelIssueBtn = document.getElementById('cancel-issue-btn');
    const issueCreateForm = document.getElementById('issue-create-form');
    const issuesList = document.getElementById('issues-list');
    const notificationArea = document.getElementById('notification-area');
    const titleInput = document.getElementById('issue-title');
    const descriptionInput = document.getElementById('issue-description');
    const titleError = document.getElementById('title-error');
    const descriptionError = document.getElementById('description-error');

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

    function makeIssueItem(title, description, priority) {
        const item = document.createElement('div');
        item.className = 'issue-item';
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Issue: ' + title + ', Priority: ' + priority);

        item.innerHTML = '\n                <h4>' + title + '</h4>\n                <div class="issue-meta">\n                    <span>Priority: ' + priority + '</span>\n                    <span>Created: ' + new Date().toLocaleString() + '</span>\n                </div>\n                <p class="issue-description">' + description + '</p>\n            ';

        function selectIssue() {
            document.querySelectorAll('.issue-item').forEach(function(el) {
                el.classList.remove('selected');
                el.removeAttribute('aria-current');
            });
            item.classList.add('selected');
            item.setAttribute('aria-current', 'true');
        }

        item.addEventListener('click', selectIssue);

        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectIssue();
            }
        });

        return item;
    }

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

            var title = titleInput.value;
            var description = descriptionInput.value;
            var priority = document.getElementById('issue-priority').value;

            var issueItem = makeIssueItem(title, description, priority);
            issuesList.insertBefore(issueItem, issuesList.firstChild);

            hideForm();
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
