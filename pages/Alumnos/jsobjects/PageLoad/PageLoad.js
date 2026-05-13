export default {
  async loadStudents() {
    try {
      const [lookupRows, activeRows] = await Promise.all([
        get_students_lookup.run(),
        get_active_students.run()
      ]);
      await storeValue('alumnos_student_options', activeRows && activeRows.length ? activeRows : lookupRows || []);
    } catch (error) {
      showAlert('Error cargando alumnos: ' + error.message, 'error');
    }
  },

  async init() {
    await this.loadStudents();
  }
}
