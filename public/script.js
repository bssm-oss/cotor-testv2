// Simple script for landing page interactivity and issue creation
document.addEventListener('DOMContentLoaded', function() {
    // Add any interactive behavior here
    console.log('Landing page loaded');
    
    // Issue creation functionality
    const newIssueBtn = document.getElementById('new-issue-btn');
    const issueForm = document.getElementById('issue-form');
    const cancelIssueBtn = document.getElementById('cancel-issue-btn');
    const issueCreateForm = document.getElementById('issue-create-form');
    const issuesList = document.getElementById('issues-list');
    const formStatus = document.getElementById('form-status');
    
    // Show/hide issue form with proper ARIA attributes
    if (newIssueBtn) {
        newIssueBtn.addEventListener('click', function() {
            const isOpen = issueForm.style.display === 'block';
            issueForm.style.display = isOpen ? 'none' : 'block';
            issueForm.setAttribute('aria-hidden', String(isOpen));
            
            if (!isOpen) {
                document.getElementById('issue-title').focus();
            }
        });
        
        // Handle keyboard shortcut (Escape) to close form
        newIssueBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && issueForm.style.display === 'block') {
                issueForm.style.display = 'none';
                issueForm.setAttribute('aria-hidden', 'true');
                newIssueBtn.focus();
            }
        });
    }
    
    // Cancel issue creation
    if (cancelIssueBtn) {
        cancelIssueBtn.addEventListener('click', function() {
            issueForm.style.display = 'none';
            issueForm.setAttribute('aria-hidden', 'true');
            issueCreateForm.reset();
            newIssueBtn.focus();
        });
        
        // Handle Enter key on cancel button
        cancelIssueBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                issueForm.style.display = 'none';
                issueForm.setAttribute('aria-hidden', 'true');
                issueCreateForm.reset();
                newIssueBtn.focus();
            }
        });
    }
    
    // Handle issue form submission with validation
    if (issueCreateForm) {
        issueCreateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error messages
            const errorMessages = ['title-error', 'description-error', 'priority-error'];
            errorMessages.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '';
            });
            
            // Validate form
            let isValid = true;
            const title = document.getElementById('issue-title');
            const description = document.getElementById('issue-description');
            const priority = document.getElementById('issue-priority');
            
            if (!title.value.trim()) {
                document.getElementById('title-error').textContent = 'Title is required';
                isValid = false;
                title.focus();
            } else if (!description.value.trim()) {
                document.getElementById('description-error').textContent = 'Description is required';
                isValid = false;
                description.focus();
            } else if (!priority.value) {
                document.getElementById('priority-error').textContent = 'Priority is required';
                isValid = false;
                priority.focus();
            }
            
            if (!isValid) {
                formStatus.textContent = 'Please correct the errors above';
                formStatus.setAttribute('role', 'alert');
                return;
            }
            
            // Create issue element
            const issueItem = document.createElement('div');
            issueItem.className = 'issue-item';
            issueItem.setAttribute('tabindex', '0'); // Make it focusable
            issueItem.setAttribute('role', 'article'); // Semantic role
            issueItem.innerHTML = `
                <h4>${title.value}</h4>
                <div class="issue-meta">
                    <span>Priority: ${priority.value}</span>
                    <span>Created: ${new Date().toLocaleString()}</span>
                </div>
                <p class="issue-description">${description.value}</p>
            `;
            
            // Add keyboard and click functionality for issue selection
            issueItem.addEventListener('click', function() {
                selectIssue(this);
            });
            
            issueItem.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectIssue(this);
                }
            });
            
            // Add to issues list
            issuesList.insertBefore(issueItem, issuesList.firstChild);
            
            // Reset form and hide
            issueCreateForm.reset();
            issueForm.style.display = 'none';
            issueForm.setAttribute('aria-hidden', 'true');
            
            // Show success message
            formStatus.textContent = 'Issue created successfully!';
            formStatus.setAttribute('role', 'status');
            
            // Focus on newly created issue
            setTimeout(() => {
                issueItem.focus();
                formStatus.textContent = '';
            }, 500);
        });
        
        // Handle form reset on escape key
        issueCreateForm.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                issueForm.style.display = 'none';
                issueForm.setAttribute('aria-hidden', 'true');
                issueCreateForm.reset();
                newIssueBtn.focus();
            }
        });
    }
    
    // Function to handle issue selection
    function selectIssue(issueElement) {
        // Remove selected class from all issues
        document.querySelectorAll('.issue-item').forEach(item => {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        });
        // Add selected class to clicked issue
        issueElement.classList.add('selected');
        issueElement.setAttribute('aria-selected', 'true');
    }
    
    // Example: smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add focus indicators for better keyboard navigation
    const focusableElements = document.querySelectorAll('button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            if (el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                el.style.outline = '2px solid var(--accent-color)';
                el.style.outlineOffset = '2px';
            }
        });
        
        el.addEventListener('blur', function() {
            el.style.outline = '';
        });
    });
});