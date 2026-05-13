export default {
  async loadStudents() {
    try {
      const rows = await get_students_lookup.run();
      await storeValue('rutinas_student_options', rows || []);
      if (sel_routine_student.selectedOptionValue && sel_routine_student.selectedOptionValue !== '__empty__') {
        await get_student_routine.run();
      }
    } catch (error) {
      showAlert('Error cargando rutinas: ' + error.message, 'error');
    }
  },

  async init() {
    await this.loadStudents();
  }
}
