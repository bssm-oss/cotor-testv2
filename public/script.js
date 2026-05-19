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
    
    // Show/hide issue form
    if (newIssueBtn) {
        newIssueBtn.addEventListener('click', function() {
            issueForm.style.display = issueForm.style.display === 'none' ? 'block' : 'none';
            if (issueForm.style.display === 'block') {
                document.getElementById('issue-title').focus();
            }
        });
    }
    
    // Cancel issue creation
    if (cancelIssueBtn) {
        cancelIssueBtn.addEventListener('click', function() {
            issueForm.style.display = 'none';
            issueCreateForm.reset();
        });
    }
    
    // Handle issue form submission
    if (issueCreateForm) {
        issueCreateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('issue-title').value;
            const description = document.getElementById('issue-description').value;
            const priority = document.getElementById('issue-priority').value;
            
            // Create issue element
            const issueItem = document.createElement('div');
            issueItem.className = 'issue-item';
            issueItem.innerHTML = `
                <h4>${title}</h4>
                <div class="issue-meta">
                    <span>Priority: ${priority}</span>
                    <span>Created: ${new Date().toLocaleString()}</span>
                </div>
                <p class="issue-description">${description}</p>
            `;
            
            // Add to issues list
            issuesList.insertBefore(issueItem, issuesList.firstChild);
            
            // Reset form and hide
            issueCreateForm.reset();
            issueForm.style.display = 'none';
            
            // Show success message (optional)
            alert('Issue created successfully!');
        });
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
});