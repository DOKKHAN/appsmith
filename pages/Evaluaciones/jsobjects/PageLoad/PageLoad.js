export default {
  async loadEvaluationData() {
    await HomeV2.init();
    await storeValue('evaluaciones_student_options', (get_pending_initial_evaluations.data && get_pending_initial_evaluations.data.length ? get_pending_initial_evaluations.data : get_pending_students_lookup.data) || []);
    await storeValue('evaluaciones_exercise_options', get_exercises_lookup.data || []);
  },

  async init() {
    await this.loadEvaluationData();
  }
}
