import { NavigatorSelector } from './navigator.js';

var navigator = new NavigatorSelector();

var assignmentModal = new bootstrap.Modal(
    document.getElementById('assignmentModal')
);

var assignments = [];
var currentAssignment = null;
var currentGoals = [];

var typeStyles = {
    title: { label: 'Titel', pillClass: 'pill-title', borderColor: '#4f46e5' },
    'concept-title': { label: 'Concept titel', pillClass: 'pill-concept-title', borderColor: '#0284c7' },
    'example-title': { label: 'Voorbeeld titel', pillClass: 'pill-example-title', borderColor: '#d97706' },
    'mia-title': { label: 'MIA titel', pillClass: 'pill-mia-title', borderColor: '#0f766e' },
    concept_goal: { label: 'Concept doel', pillClass: 'pill-concept-goal', borderColor: '#0891b2' },
    default_goal: { label: 'Doel', pillClass: 'pill-default-goal', borderColor: '#22c55e' },
    minimum_goal: { label: 'Minimum doel', pillClass: 'pill-minimum-goal', borderColor: '#f97316' },
    mia_goal: { label: 'MIA doel', pillClass: 'pill-mia-goal', borderColor: '#ef4444' },
    knowledge_processing: { label: 'Kennisverw.', pillClass: 'pill-knowledge', borderColor: '#8b5cf6' },
    learning_path: { label: 'Leerlijn', pillClass: 'pill-learning-path', borderColor: '#06b6d4' },
    example: { label: 'Voorbeeld', pillClass: 'pill-example', borderColor: '#f59e0b' },
    related: { label: 'Gerelateerd', pillClass: 'pill-related', borderColor: '#a855f7' },
    sequential: { label: 'Volgorde', pillClass: 'pill-sequential', borderColor: '#ec4899' },
    minimum: { label: 'Minimum', pillClass: 'pill-minimum', borderColor: '#f59e0b' },
    asterisk: { label: 'Opmerking', pillClass: 'pill-asterisk', borderColor: '#94a3b8' },
    mia_information: { label: 'MIA info', pillClass: 'pill-mia-info', borderColor: '#14b8a6' },
    unknown: { label: 'Onbekend', pillClass: 'pill-default', borderColor: '#6b7280' }
};


// -------------------------
// Event handlers
// -------------------------

document
    .getElementById('newAssignment')
    .addEventListener('click', newAssignment);

document
    .getElementById('selectGoals')
    .addEventListener('click', openNavigator);

document
    .getElementById('saveAssignment')
    .addEventListener('click', saveAssignment);


// -------------------------
// Navigator events
// -------------------------

navigator.onReady = function () {
    console.log('Navigator ready');

    if (currentGoals.length === 0) {
        return;
    }

    var selection = [];

    for (var i = 0; i < currentGoals.length; i++) {
        var goal = currentGoals[i];

        selection.push({
            curriculumIdentifier: goal.curriculumIdentifier,
            curriculumItemIdentifier: goal.curriculumItemIdentifier
        });
    }

    navigator.setSelection(selection);
};


navigator.onSave = function (selection) {
    console.log('Selection received from Navigator:', selection);

    var jsonString = JSON.stringify(selection, null, 2);

    console.log('Selection as JSON:', jsonString);

    currentGoals = mapNavigatorSelection(selection);

    renderGoals();
};


navigator.onClose = function () {
    console.log('Navigator closed');
};


// -------------------------
// Open Navigator
// -------------------------

function openNavigator() {
    navigator.open();
}


// -------------------------
// Create a new assignment
// -------------------------

function newAssignment() {
    currentAssignment = null;
    currentGoals = [];

    document
        .getElementById('assignmentModalTitle')
        .textContent = 'Nieuwe opdracht';

    document
        .getElementById('assignmentTitle')
        .value = '';

    renderGoals();

    assignmentModal.show();
}


// -------------------------
// Save assignment
// -------------------------

function saveAssignment() {
    var title = document
        .getElementById('assignmentTitle')
        .value
        .trim();

    if (!title) {
        alert('Geef de opdracht een titel.');
        return;
    }

    if (currentAssignment !== null) {
        currentAssignment.title = title;
        currentAssignment.goals = structuredClone(currentGoals);
    }
    else {
        var assignment = {
            id: crypto.randomUUID(),
            title: title,
            goals: structuredClone(currentGoals)
        };

        assignments.push(assignment);
    }

    renderAssignments();

    assignmentModal.hide();
}


// -------------------------
// Edit an existing assignment
// -------------------------

function editAssignment(id) {
    var assignment = null;

    for (var i = 0; i < assignments.length; i++) {
        if (assignments[i].id === id) {
            assignment = assignments[i];
            break;
        }
    }

    if (assignment === null) {
        return;
    }

    currentAssignment = assignment;
    currentGoals = structuredClone(assignment.goals);

    document
        .getElementById('assignmentModalTitle')
        .textContent = 'Opdracht wijzigen';

    document
        .getElementById('assignmentTitle')
        .value = assignment.title;

    renderGoals();

    assignmentModal.show();
}


// -------------------------
// Convert Navigator response
// -------------------------

function mapNavigatorSelection(selection) {
    var goals = [];

    if (selection === null || selection === undefined) {
        return goals;
    }

    for (var i = 0; i < selection.length; i++) {
        var entry = selection[i];

        var structureItem = entry[1];
        var item = structureItem.curriculumItem;

        var breadcrumbs = [];

        if (item.breadcrumbs !== undefined && item.breadcrumbs !== null) {
            breadcrumbs = item.breadcrumbs;
        }

        var level = 0;

        if (item.metadata !== undefined &&
            item.metadata !== null &&
            item.metadata.level !== undefined &&
            item.metadata.level !== null) {

            level = Number(item.metadata.level) || 0;
        }

        var goal = {
            curriculumIdentifier: item.curriculumIdentifier,
            curriculumItemIdentifier: item.identifier,
            text: item.text,
            category: item.category,
            type: item.type,
            breadcrumbs: breadcrumbs,
            level: level
        };

        goals.push(goal);
    }

    return goals;
}


function getTypeStyle(type) {
    var normalizedType = (type || 'unknown').toString().trim().toLowerCase();

    if (typeStyles[normalizedType] !== undefined) {
        return typeStyles[normalizedType];
    }

    return typeStyles.unknown;
}


// -------------------------
// Render selected goals
// -------------------------

function renderGoals() {
    var list = document.getElementById('goalList');
    var noGoals = document.getElementById('noGoals');

    list.innerHTML = '';

    if (currentGoals.length === 0) {
        noGoals.hidden = false;
        return;
    }

    noGoals.hidden = true;

    for (var i = 0; i < currentGoals.length; i++) {
        var goal = currentGoals[i];

        var listItem = document.createElement('li');
        listItem.className = 'list-group-item goal-item';

        var level = Number(goal.level) || 0;
        var indent = Math.max(level - 1, 0) * 18;

        listItem.style.marginLeft = indent + 'px';

        var typeStyle = getTypeStyle(goal.type);
        listItem.style.borderLeft = '4px solid ' + typeStyle.borderColor;

        var metaRow = document.createElement('div');
        metaRow.className = 'd-flex align-items-center gap-2 mb-2';

        var typePill = document.createElement('span');
        typePill.className = 'goal-type-pill ' + typeStyle.pillClass;
        typePill.textContent = typeStyle.label;

        metaRow.appendChild(typePill);

        if (level > 0) {
            var levelBadge = document.createElement('span');
            levelBadge.className = 'goal-level-badge';
            levelBadge.textContent = 'Niveau ' + level;
            metaRow.appendChild(levelBadge);
        }

        listItem.appendChild(metaRow);

        var breadcrumbText = '';

        if (goal.breadcrumbs !== null &&
            goal.breadcrumbs !== undefined &&
            goal.breadcrumbs.length > 0) {

            for (var j = 0; j < goal.breadcrumbs.length; j++) {
                if (j > 0) {
                    breadcrumbText += ' > ';
                }

                breadcrumbText += goal.breadcrumbs[j].text;
            }
        }

        if (breadcrumbText !== '') {
            var breadcrumbElement = document.createElement('div');

            breadcrumbElement.className = 'small text-muted mb-1';
            breadcrumbElement.textContent = breadcrumbText;

            listItem.appendChild(breadcrumbElement);
        }

        var goalText = document.createElement('div');

        if (goal.text !== null && goal.text !== undefined) {
            goalText.textContent = goal.text;
        }
        else {
            goalText.textContent = '';
        }

        listItem.appendChild(goalText);

        list.appendChild(listItem);
    }
}


// -------------------------
// Render assignments
// -------------------------

function renderAssignments() {
    var tbody = document.getElementById('assignments');

    tbody.innerHTML = '';

    if (assignments.length === 0) {
        var emptyRow = document.createElement('tr');
        var emptyCell = document.createElement('td');

        emptyCell.colSpan = 3;
        emptyCell.className = 'text-center text-muted py-4';
        emptyCell.textContent = 'Nog geen opdrachten.';

        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);

        return;
    }

    for (var i = 0; i < assignments.length; i++) {
        var assignment = assignments[i];

        var row = document.createElement('tr');

        var titleCell = document.createElement('td');
        titleCell.textContent = assignment.title;

        var goalsCell = document.createElement('td');

        var badge = document.createElement('span');
        badge.className = 'badge text-bg-secondary';
        badge.textContent = assignment.goals.length;

        goalsCell.appendChild(badge);

        var actionCell = document.createElement('td');
        actionCell.className = 'text-end';

        var editButton = document.createElement('button');

        editButton.type = 'button';
        editButton.className = 'btn btn-sm btn-outline-primary';
        editButton.textContent = 'Wijzigen';
        editButton.setAttribute('data-id', assignment.id);

        editButton.addEventListener('click', function (event) {
            var assignmentId = event.currentTarget.getAttribute('data-id');

            editAssignment(assignmentId);
        });

        actionCell.appendChild(editButton);

        row.appendChild(titleCell);
        row.appendChild(goalsCell);
        row.appendChild(actionCell);

        tbody.appendChild(row);
    }
}


// -------------------------
// Initial render
// -------------------------

renderAssignments();