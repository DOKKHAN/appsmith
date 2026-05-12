export default {
	// Función para verificar si hay sesión al cargar cualquier página protegida
	verificarSesion() {
		const tenant = appsmith.store.tenant_schema;
		const userId = appsmith.store.user_id;

		// Si falta alguno de los datos críticos, lo mandamos al Login
		if (!tenant || !userId) {
			showAlert("Sesión expirada o no válida. Por favor inicia sesión.", "warning");
			navigateTo("Login"); // Asegúrate de que este sea el nombre de tu página de login
			return false;
		}
		return true;
	},

	// Función de Logout
	async logout() {
		// 1. Limpiamos TODA la tienda de Appsmith (user_id, tenant_schema, etc.)
		await clearStore();
		
		// 2. Mensaje de confirmación
		showAlert("Has cerrado sesión correctamente", "success");
		
		// 3. Redirigir al Login inmediatamente
		navigateTo("Login");
	}
}