export default {
  async init() {
    return await this.loadAll();
  },

  async loadAll() {
    try {
      await Promise.all([get_restr_students.run(), get_problem_catalog.run()]);
      await storeValue('restr_students_options', get_restr_students.data || []);
      await storeValue('problem_catalog_options', get_problem_catalog.data || []);
      if (sel_restr_student.selectedOptionValue && sel_restr_student.selectedOptionValue !== '__empty__') {
        await get_student_restrictions.run();
      }
      return { students: (get_restr_students.data || []).length, problems: (get_problem_catalog.data || []).length };
    } catch (error) {
      showAlert('Error cargando restricciones: ' + error.message, 'error');
      return { error: error.message };
    }
  },

  hasStudent() {
    return !!sel_restr_student.selectedOptionValue && sel_restr_student.selectedOptionValue !== '__empty__';
  },

  hasSelectedRelation() {
    return !!tbl_student_restrictions.selectedRow && !!tbl_student_restrictions.selectedRow.id_relacion;
  },

  async saveAssignment() {
    if (!this.hasStudent() || !sel_problem_to_assign.selectedOptionValue || sel_problem_to_assign.selectedOptionValue === '__empty__') {
      showAlert('Selecciona un alumno y un problema/restricción.', 'warning');
      return;
    }
    try {
      await assign_student_problem.run();
      showAlert('Problema asignado al alumno', 'success');
      await get_student_restrictions.run();
    } catch (error) {
      showAlert('Error asignando problema: ' + error.message, 'error');
    }
  },

  async setSelectedActive(isActive) {
    if (!this.hasSelectedRelation()) {
      showAlert('Selecciona una restricción de la tabla.', 'warning');
      return;
    }
    try {
      await update_student_problem_status.run({ esta_activo: isActive });
      showAlert(isActive ? 'Restricción activada' : 'Restricción desactivada', 'success');
      await get_student_restrictions.run();
    } catch (error) {
      showAlert('Error actualizando restricción: ' + error.message, 'error');
    }
  },

  async deleteSelected() {
    if (!this.hasSelectedRelation()) {
      showAlert('Selecciona una restricción de la tabla.', 'warning');
      return;
    }
    try {
      await delete_student_problem.run();
      showAlert('Restricción eliminada del alumno', 'success');
      await get_student_restrictions.run();
    } catch (error) {
      showAlert('Error eliminando restricción: ' + error.message, 'error');
    }
  }
}
