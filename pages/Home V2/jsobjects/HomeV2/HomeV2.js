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
        await Promise.all([get_students_lookup.run(), get_active_students.run()]);
      }
      if (view === 'evaluaciones') {
        await Promise.all([get_pending_students_lookup.run(), get_pending_initial_evaluations.run(), get_exercises_lookup.run()]);
      }
      if (view === 'rutinas') {
        await get_students_lookup.run();
        if (sel_routine_student.selectedOptionValue && sel_routine_student.selectedOptionValue !== '__empty__') {
          await get_student_routine.run();
        }
      }
    } catch (error) {
      showAlert('Error cargando datos: ' + error.message, 'error');
    }
  },

  escapeSql(value) {
    return String(value ?? '').replace(/'/g, "''");
  },

  rawEvaluationRows() {
    return [
      {
        id_ejercicio: sel_eval_exercise_1.selectedOptionValue,
        label: sel_eval_exercise_1.selectedOptionLabel,
        peso: inp_eval_peso_1.text,
        reps: inp_eval_reps_1.text,
        rpe: inp_eval_rpe_1.text,
        tecnica: sel_eval_tecnica_1.selectedOptionValue
      },
      {
        id_ejercicio: sel_eval_exercise_2.selectedOptionValue,
        label: sel_eval_exercise_2.selectedOptionLabel,
        peso: inp_eval_peso_2.text,
        reps: inp_eval_reps_2.text,
        rpe: inp_eval_rpe_2.text,
        tecnica: sel_eval_tecnica_2.selectedOptionValue
      },
      {
        id_ejercicio: sel_eval_exercise_3.selectedOptionValue,
        label: sel_eval_exercise_3.selectedOptionLabel,
        peso: inp_eval_peso_3.text,
        reps: inp_eval_reps_3.text,
        rpe: inp_eval_rpe_3.text,
        tecnica: sel_eval_tecnica_3.selectedOptionValue
      },
      {
        id_ejercicio: sel_eval_exercise_4.selectedOptionValue,
        label: sel_eval_exercise_4.selectedOptionLabel,
        peso: inp_eval_peso_4.text,
        reps: inp_eval_reps_4.text,
        rpe: inp_eval_rpe_4.text,
        tecnica: sel_eval_tecnica_4.selectedOptionValue
      },
      {
        id_ejercicio: sel_eval_exercise_5.selectedOptionValue,
        label: sel_eval_exercise_5.selectedOptionLabel,
        peso: inp_eval_peso_5.text,
        reps: inp_eval_reps_5.text,
        rpe: inp_eval_rpe_5.text,
        tecnica: sel_eval_tecnica_5.selectedOptionValue
      },
      {
        id_ejercicio: sel_eval_exercise_6.selectedOptionValue,
        label: sel_eval_exercise_6.selectedOptionLabel,
        peso: inp_eval_peso_6.text,
        reps: inp_eval_reps_6.text,
        rpe: inp_eval_rpe_6.text,
        tecnica: sel_eval_tecnica_6.selectedOptionValue
      }
    ].filter((row) => row.id_ejercicio && row.id_ejercicio !== '__empty__');
  },

  validEvaluationRows() {
    return this.rawEvaluationRows().filter((row) => row.peso !== '' && row.reps !== '' && row.rpe !== '' && row.tecnica);
  },

  canSaveEvaluation() {
    return !!sel_eval_student.selectedOptionValue &&
      sel_eval_student.selectedOptionValue !== '__empty__' &&
      !!inp_eval_enfoque.text &&
      !!inp_eval_frecuencia.text &&
      !!sel_eval_nivel.selectedOptionValue &&
      this.validEvaluationRows().length > 0 &&
      this.validEvaluationRows().length === this.rawEvaluationRows().length;
  },

  evaluationRows(idSesion) {
    return this.validEvaluationRows().map((row) => ({
      id_sesion: Number(idSesion),
      id_ejercicio: Number(row.id_ejercicio),
      punto_evaluado: row.label ? ''' + this.escapeSql(row.label) + ''' : 'NULL',
      peso_manejado: Number(row.peso || 0),
      reps_logradas: Number(row.reps || 0),
      rpe_observado: Number(row.rpe || 0),
      tecnica_calificacion: Number(row.tecnica || 0)
    }));
  },

  async saveEvaluation() {
    if (!this.canSaveEvaluation()) {
      showAlert('Completa alumno, enfoque, frecuencia, nivel y al menos un ejercicio con peso/reps/RPE/técnica.', 'warning');
      return;
    }
    try {
      const sesion = await create_eval_session_v2.run();
      const idSesion = sesion?.[0]?.id_sesion;
      if (!idSesion) throw new Error('No se pudo crear la sesión de evaluación.');
      await insert_eval_movements_v2.run({ id_sesion: idSesion });
      await complete_initial_evaluation.run();
      showAlert('Evaluación guardada y alumno actualizado', 'success');
      await Promise.all([get_pending_students_lookup.run(), get_pending_initial_evaluations.run(), get_students_lookup.run(), get_active_students.run()]);
      resetWidget('sel_eval_student');
    } catch (error) {
      showAlert('Error guardando evaluación: ' + error.message, 'error');
    }
  }
}
