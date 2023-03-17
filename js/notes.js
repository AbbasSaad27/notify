const newNoteForm = document.getElementById('new-note-form');
const newNoteInput = document.getElementById('note-content');
const noteList = document.getElementById('note-list');

let fetchedNotes;

noteList.addEventListener("click", function(e) {
  if(e.target.classList.contains("btn-fav")) {
    const li = e.target.parentElement;
    const img = e.target.children[0]
    console.log(li)
    
    const noteId = li.dataset.id;

    fetchedNotes.forEach(note => {
      if(noteId == note.id) {
        console.log("henlo", note.favourite)
        note.favourite = !note.favourite
        if(note.favourite) {
          img.src = "images/bookmark-active.svg"
        } else {
          img.src = "images/bookmark-solid.svg"
        }
        fetch(`https://notifly-api-pzft.onrender.com/api/notes/${noteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify(note)
        })
        .then(res => res.json())
        .then(data => console.log(data, note))
      }
    })
  }
})

function createNoteElement(note, id) {
  const li = document.createElement('li');
  li.setAttribute('data-id', note.id);

  const favBtn = document.createElement("button");
  favBtn.classList.add("btn");
  favBtn.classList.add("btn-fav")
  const favBtnImg = document.createElement("img");
  favBtnImg.src = "images/bookmark-"+ (note.favourite ? "active" : "solid") + ".svg"

  favBtn.appendChild(favBtnImg);

  li.appendChild(favBtn);
  const noteText = document.createElement('span');
  noteText.textContent = note.description;
  li.appendChild(noteText);

  const buttonContainer = document.createElement('div');

  const editButton = document.createElement('button');
  editButton.classList.add("mr-1")
  editButton.textContent = 'Edit'; //editButton.setAttribute('data-lang', 'edit-button'); Find a way to implement this one without bugs..
  editButton.addEventListener('click', () => {
    editNoteElement(li);
  });
  buttonContainer.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    deleteNoteElement(li);
  });
  buttonContainer.appendChild(deleteButton);

  li.appendChild(buttonContainer);

  return li;
}

// Function to add a new note to the list and the server
function addNote() {
  const note = newNoteInput.value;
  console.log(note)
  if (note !== '') {
    fetch('https://notifly-api-pzft.onrender.com/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({ description: note, image: "image.png", favourite: false })
    })
      .then(res => res.text())
      .then(() => {
        newNoteInput.value = '';
        fetchNotes();
      })
      .catch(err => console.error(err));
  } else {
    const errorMsg = document.querySelector('.errorMsg');
    if (errorMsg) {
      errorMsg.remove();
    }
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorMsg');
    errorContainer.textContent = 'You have to write a note before you can add it.';
    noteList.appendChild(errorContainer);
  }
}

// Function to delete a note from the list and the server
function deleteNoteElement(noteElement) {
  const id = noteElement.getAttribute('data-id');
  fetch(`https://notifly-api-pzft.onrender.com/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "Application/json",
      "Authorization": `Bearer ${userToken}`
    }
  })
    .then(res => res.text())
    .then(() => {
      noteElement.remove();
    })
    .catch(err => console.error(err));
}

function editNoteElement(noteElement) {
  const id = noteElement.getAttribute('data-id');
  const noteText = noteElement.textContent.replace("EditDelete", "");

  // Create an input field with the current note as the default value
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('value', noteText);

  // Replace the text with the input field
  noteElement.textContent = '';
  noteElement.appendChild(input);

  const buttonContainer = document.createElement('div');

  // Add a 'Save' button to save the edited note
  const saveButton = document.createElement('button');
  saveButton.classList.add("mr-1")
  saveButton.textContent = 'Save';

  saveButton.addEventListener('click', () => {
    const note = input.value;
    console.log(noteElement)
    noteElement.textContent = ""
    const favBtn = document.createElement("button");
    favBtn.classList.add("btn");
    favBtn.classList.add("btn-fav")
    const favBtnImg = document.createElement("img");

    favBtnImg.src = "images/bookmark-"+ note.favourite ? "active" : "solid" + ".svg";
    favBtn.appendChild(favBtnImg);

    noteElement.appendChild(favBtn);

    // Update the note element with the original note text
    const span = document.createElement("span");
    span.textContent = note;
    noteElement.appendChild(span);
    fetch(`https://notifly-api-pzft.onrender.com/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ description: note })
    })
      .then(res => res.text())
      .then(() => {
        // Add back the 'Edit' and 'Delete' buttons
        const buttonContainer = document.createElement('div');
        const editButton = document.createElement('button');
        editButton.classList.add("mr-1")
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
          editNoteElement(noteElement);
        });
        buttonContainer.appendChild(editButton);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          deleteNoteElement(noteElement);
        });
        buttonContainer.appendChild(deleteButton);
        noteElement.appendChild(buttonContainer);
      })
      .catch(err => console.error(err));
  });

  // Add a 'Cancel' button to cancel the edit
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';

  cancelButton.addEventListener('click', () => {
    console.log(noteElement)
    noteElement.textContent = ""
    const favBtn = document.createElement("button");
    favBtn.classList.add("btn");
    favBtn.classList.add("btn-fav")
    const favBtnImg = document.createElement("img");
  
    favBtnImg.src = "images/bookmark-"+ note.favourite ? "active" : "solid" + ".svg";

    favBtn.appendChild(favBtnImg);

    noteElement.appendChild(favBtn);

    // Update the note element with the original note text
    const span = document.createElement("span");
    span.textContent = noteText;
    noteElement.appendChild(span);
    // Add back the 'Edit' and 'Delete' buttons
    const buttonContainer = document.createElement('div');
    const editButton = document.createElement('button');
    editButton.classList.add("mr-1")

    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      editNoteElement(noteElement);
    });
    buttonContainer.appendChild(editButton);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteNoteElement(noteElement);
    });
    buttonContainer.appendChild(deleteButton);
    noteElement.appendChild(buttonContainer);
  });

  const editButton = document.createElement('button');
  editButton.classList.add("mr-1")

  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    editNoteElement(noteElement);
  });
  buttonContainer.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    deleteNoteElement(noteElement);
  });
  buttonContainer.appendChild(deleteButton);

  // Remove the 'Edit' and 'Delete' buttons
  noteElement.querySelectorAll('button').forEach(button => button.remove());

  // Add the save and cancel buttons to the note element
  noteElement.appendChild(saveButton);
  noteElement.appendChild(cancelButton);
}

// Function to fetch all notes from the server and display them in the UI
function fetchNotes() {
  fetch('https://notifly-api-pzft.onrender.com/api/notes', {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${userToken}`
    }
  })
    .then(res => res.json())
    .then(notes => {
      console.log(notes)
      noteList.innerHTML = '';
      fetchedNotes = notes.data;
      notes.data.forEach((note) => {
        const noteElement = createNoteElement(note);
        noteList.appendChild(noteElement);
      });
    })
    .catch(err => console.error(err));
}

// Add event listener for new note form submission
newNoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const errorMsg = document.querySelector('.errorMsg');
  if (errorMsg) {
    errorMsg.remove();
  }
  if(!userToken) {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorMsg');
    errorContainer.textContent = 'You have to Login or Register first';
    noteList.appendChild(errorContainer);
    return;
  }
  addNote();
});

// Fetch all notes on page load
fetchNotes();