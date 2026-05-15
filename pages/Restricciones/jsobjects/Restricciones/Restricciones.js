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
  },

  selectedStudent() {
    const idAlumno = Number(sel_restr_student.selectedOptionValue);
    const sources = [
      get_restr_students.data || [],
      appsmith.store.restr_students_options || []
    ];
    return sources.flat().find((student) => Number(student.id_alumno || student.value) === idAlumno) || {};
  },

  noneToNull(value) {
    return ['ninguno', 'ninguna', '', null, undefined].includes(value) ? null : value;
  },

  routineAutomationPayload() {
    const student = this.selectedStudent();
    return [
      {
        id_alumno: Number(sel_restr_student.selectedOptionValue),
        objetivo: student.objetivo || null,
        prioridad_recomposicion: student.prioridad_recomposicion || null,
        enfoque_principal: student.enfoque_principal || null,
        enfoque_especifico: this.noneToNull(student.enfoque_especifico),
        debilidad: this.noneToNull(student.debilidad)
      }
    ];
  },

  async savePendingAssignmentIfNeeded() {
    if (sel_problem_to_assign.selectedOptionValue && sel_problem_to_assign.selectedOptionValue !== '__empty__') {
      await assign_student_problem.run();
    }
    await get_student_restrictions.run();
  },

  async recreateRoutine() {
    if (!this.hasStudent()) {
      showAlert('Selecciona un alumno antes de recrear la rutina.', 'warning');
      return;
    }
    try {
      await this.savePendingAssignmentIfNeeded();
      await get_restr_students.run();
      await storeValue('restr_students_options', get_restr_students.data || []);
      await recreate_routine_automation.run();
      showAlert('Rutina enviada a re-creación con las restricciones actualizadas', 'success');
    } catch (error) {
      showAlert('Error re-creando rutina: ' + error.message, 'error');
    }
  }
}
