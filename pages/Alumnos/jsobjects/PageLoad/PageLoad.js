export default {
  async init() {
    try {
      await get_students_lookup.run();
      await get_active_students.run();
    } catch (error) {
      showAlert('Error cargando datos: ' + error.message, 'error');
    }
  }
}
