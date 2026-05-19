const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for goals (for demonstration purposes)
let goals = [];

// Validation function for goal data
function validateGoal(goal) {
  const errors = [];

  // Validate title
  if (!goal.title || typeof goal.title !== 'string') {
    errors.push('Title is required and must be a string');
  } else if (goal.title.trim().length === 0) {
    errors.push('Title cannot be empty');
  } else if (goal.title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  // Validate description (optional but must be string if provided)
  if (goal.description !== undefined && typeof goal.description !== 'string') {
    errors.push('Description must be a string');
  } else if (goal.description && goal.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  // Validate priority
  const validPriorities = ['low', 'medium', 'high'];
  if (goal.priority === undefined) {
    errors.push('Priority is required');
  } else if (typeof goal.priority !== 'string' || !validPriorities.includes(goal.priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }

  // Validate targetDate (optional but must be valid date if provided)
  if (goal.targetDate !== undefined) {
    if (typeof goal.targetDate !== 'string' || isNaN(Date.parse(goal.targetDate))) {
      errors.push('Target date must be a valid date string');
    }
  }

  return errors;
}

// GET all goals
app.get('/api/goals', (req, res) => {
  res.json(goals);
});

// GET a specific goal by ID
app.get('/api/goals/:id', (req, res) => {
  const goal = goals.find(g => g.id === parseInt(req.params.id));
  if (!goal) {
    return res.status(404).json({ error: 'Goal not found' });
  }
  res.json(goal);
});

// POST create a new goal with validation
app.post('/api/goals', (req, res) => {
  const validationErrors = validateGoal(req.body);
  
  if (validationErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: validationErrors 
    });
  }

  const newGoal = {
    id: goals.length + 1,
    title: req.body.title.trim(),
    description: req.body.description ? req.body.description.trim() : undefined,
    priority: req.body.priority,
    targetDate: req.body.targetDate,
    createdAt: new Date().toISOString()
  };

  goals.push(newGoal);
  res.status(201).json(newGoal);
});

// PUT update a goal with validation
app.put('/api/goals/:id', (req, res) => {
  const goalIndex = goals.findIndex(g => g.id === parseInt(req.params.id));
  if (goalIndex === -1) {
    return res.status(404).json({ error: 'Goal not found' });
  }

  const validationErrors = validateGoal(req.body);
  
  if (validationErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: validationErrors 
    });
  }

  const updatedGoal = {
    ...goals[goalIndex],
    title: req.body.title.trim(),
    description: req.body.description ? req.body.description.trim() : undefined,
    priority: req.body.priority,
    targetDate: req.body.targetDate,
    updatedAt: new Date().toISOString()
  };

  goals[goalIndex] = updatedGoal;
  res.json(updatedGoal);
});

// DELETE a goal
app.delete('/api/goals/:id', (req, res) => {
  const goalIndex = goals.findIndex(g => g.id === parseInt(req.params.id));
  if (goalIndex === -1) {
    return res.status(404).json({ error: 'Goal not found' });
  }

  goals.splice(goalIndex, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Goal API server running at http://localhost:${port}`);
});

module.exports = app;