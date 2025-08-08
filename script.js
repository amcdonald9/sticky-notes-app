const notesContainer = document.getElementById('notes-container');
const addNoteBtn = document.getElementById('add-note-btn'); // was 'add-note'
const colorSelector = document.getElementById('color-picker'); // was 'color-theme'

let notes = JSON.parse(localStorage.getItem('sticky-notes')) || [];

const themes = {
  yellow: '#fffacd',
  blue: '#e0f7fa',
  green: '#e6ffe6',
  pink: '#ffe6f0',
  lavender: '#f3e6ff'
};

function createNoteElement(note, index) {
  const noteDiv = document.createElement('div');
  noteDiv.classList.add('note');
  noteDiv.style.backgroundColor = themes[note.color] || themes.yellow;
  noteDiv.style.left = note.x + 'px';
  noteDiv.style.top = note.y + 'px';
  noteDiv.setAttribute('data-index', index);
  noteDiv.setAttribute('draggable', 'true');

  const textarea = document.createElement('textarea');
  textarea.value = note.content;

  const rendered = document.createElement('div');
  rendered.classList.add('rendered-markdown');
  rendered.innerHTML = marked.parse(note.content);

  const footer = document.createElement('div');
  footer.classList.add('note-footer');

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.classList.add('save-btn');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');

  footer.appendChild(saveBtn);
  footer.appendChild(deleteBtn);

  noteDiv.appendChild(textarea);
  noteDiv.appendChild(rendered);
  noteDiv.appendChild(footer);
  notesContainer.appendChild(noteDiv);

  // Event Listeners
  saveBtn.addEventListener('click', () => {
    note.content = textarea.value;
    rendered.innerHTML = marked.parse(note.content);
    saveNotes();
  });

  deleteBtn.addEventListener('click', () => {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
  });

  let offsetX, offsetY;

  noteDiv.addEventListener('mousedown', e => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    const onMouseMove = (e) => {
      noteDiv.style.left = (e.pageX - offsetX) + 'px';
      noteDiv.style.top = (e.pageY - offsetY) + 'px';
    };

    const onMouseUp = () => {
      note.x = parseInt(noteDiv.style.left);
      note.y = parseInt(noteDiv.style.top);
      saveNotes();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Touch support
  noteDiv.addEventListener('touchstart', e => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    const touch = e.touches[0];
    const rect = noteDiv.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      noteDiv.style.left = (touch.pageX - offsetX) + 'px';
      noteDiv.style.top = (touch.pageY - offsetY) + 'px';
    };

    const onTouchEnd = () => {
      note.x = parseInt(noteDiv.style.left);
      note.y = parseInt(noteDiv.style.top);
      saveNotes();
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  });
}

function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => createNoteElement(note, index));
}

function saveNotes() {
  localStorage.setItem('sticky-notes', JSON.stringify(notes));
}

addNoteBtn.addEventListener('click', () => {
  const newNote = {
    content: '',
    color: colorSelector.value,
    x: 50 + Math.random() * 100,
    y: 50 + Math.random() * 100
  };
  notes.push(newNote);
  saveNotes();
  renderNotes();
});

colorSelector.addEventListener('change', () => {
  document.documentElement.style.setProperty('--note-color', themes[colorSelector.value]);
});

// Load default notes if empty
if (notes.length === 0) {
  notes = [
    { content: '📝 Welcome to Sticky Notes App!', color: 'yellow', x: 50, y: 60 },
    { content: '**Markdown** is *supported*!', color: 'lavender', x: 300, y: 60 },
    { content: 'Drag me around!', color: 'green', x: 150, y: 200 },
    { content: '🗑️ Click Delete to remove a note.', color: 'pink', x: 350, y: 300 },
    { content: '✅ Notes are saved automatically.', color: 'blue', x: 80, y: 400 }
  ];
  saveNotes();
}

renderNotes();
