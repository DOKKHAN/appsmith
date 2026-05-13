export default {
  async loadEvaluationData() {
    try {
      await Promise.all([
        get_pending_students_lookup.run(),
        get_pending_initial_evaluations.run()
      ]);

      const pendingRows = get_pending_initial_evaluations.data || [];
      const pendingLookupRows = get_pending_students_lookup.data || [];
      const studentRows = pendingRows.length ? pendingRows : pendingLookupRows;

      await storeValue('evaluaciones_student_options', studentRows);

      let exerciseRows = [];
      try {
        await get_exercises_lookup.run();
        exerciseRows = get_exercises_lookup.data || [];
      } catch (exerciseError) {
        showAlert('Alumnos cargados, pero hubo un error cargando ejercicios: ' + exerciseError.message, 'warning');
      }

      await storeValue('evaluaciones_exercise_options', exerciseRows);

      return {
        loadedStudents: studentRows.length,
        pendingRows: pendingRows.length,
        pendingLookupRows: pendingLookupRows.length,
        loadedExercises: exerciseRows.length,
        studentRows,
        exerciseRows
      };
    } catch (error) {
      showAlert('Error cargando evaluaciones: ' + error.message, 'error');
      return { loadedStudents: 0, loadedExercises: 0, error: error.message };
    }
  },

  async init() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return await this.loadEvaluationData();
  }
}
