$(document).ready(function() {
  const userType = localStorage.getItem('userType');

  const table = $('#productTable').DataTable({
    "paging": true,
    "searching": true,
    "info": true,
    "lengthChange": true
  });

  if (userType === 'admin') {
    // Crear el botón de editar
    const editButton = $('<button id="edit-button"><i class="fas fa-pencil-alt"></i> Editar</button>'); 

    // Agregar el botón al contenedor
    $('#edit-button-container').append(editButton); 
  }
});