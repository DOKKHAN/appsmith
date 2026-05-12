export default {
  async init() {
    if (!appsmith.store.homeV2View) {
      await storeValue('homeV2View', 'admin');
    }
    await this.refreshCurrentView();
  },

  async switchView(view) {
    await storeValue('homeV2View', view);
    await this.refreshCurrentView(view);
  },

  async refreshCurrentView(view = appsmith.store.homeV2View || 'admin') {
    try {
      if (view === 'admin') {
        await Promise.all([
          get_students_lookup.run(),
          get_active_students.run()
        ]);
      }

      if (view === 'nueva_evaluacion') {
        await Promise.all([
          get_students_lookup.run(),
          get_evaluation_sessions.run()
        ]);
      }

      if (view === 'evaluaciones') {
        await Promise.all([
          get_pending_students_lookup.run(),
          get_pending_initial_evaluations.run()
        ]);
      }

      if (view === 'rutinas') {
        await get_students_lookup.run();
        if (sel_routine_student.selectedOptionValue) {
          await get_student_routine.run();
        }
      }
    } catch (error) {
      showAlert('Error cargando datos: ' + error.message, 'error');
    }
  }
}
