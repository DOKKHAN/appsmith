export default {
  async loadEvaluationData() {
    try {
      await HomeV2.init();

      const pendingRows = get_pending_initial_evaluations.data || [];
      const pendingLookupRows = get_pending_students_lookup.data || [];
      const exerciseRows = get_exercises_lookup.data || [];
      const studentRows = pendingRows.length ? pendingRows : pendingLookupRows;

      await storeValue('evaluaciones_student_options', studentRows);
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
