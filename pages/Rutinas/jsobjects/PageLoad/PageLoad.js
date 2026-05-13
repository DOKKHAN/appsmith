export default {
  async init() {
    try {
      await get_students_lookup.run();
      if (sel_routine_student.selectedOptionValue && sel_routine_student.selectedOptionValue !== '__empty__') {
        await get_student_routine.run();
      }
    } catch (error) {
      showAlert('Error cargando datos: ' + error.message, 'error');
    }
  }
}
